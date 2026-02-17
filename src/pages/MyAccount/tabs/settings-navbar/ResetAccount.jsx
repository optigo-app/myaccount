import React, { useState, useEffect, useRef } from "react";
import "./ResetAccount.scss";
import { fullResetAccount, clearTransactionAccount, generateOtp, verifyOtp } from "../../../../api/myAccountApi";
import toast from "react-hot-toast";
import axios from "axios";
import { decodeCookieValue } from "../../../../utils/decodeCookieValue";

const ResetAccount = ({ clientIp, LUId }) => {
    const [flowStep, setFlowStep] = useState("default");
    const [resetType, setResetType] = useState(null);
    const OTP_LENGTH = 6;
    const RESEND_TIME = 60;
    const [otp, setOtp] = useState(["A", "-", "", "", "", ""]);
    const [progress, setProgress] = useState(0);
    const inputsRef = useRef([]);
    const [error, setError] = useState("");
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [resendTimer, setResendTimer] = useState(RESEND_TIME);
    const sessionKeys = Object.keys(sessionStorage);
    const cookieKey = sessionKeys.find(k => k.startsWith("RDSD_"));
    if (!cookieKey) throw new Error("Session cookie not found");
    const decoded = decodeCookieValue(sessionStorage.getItem(cookieKey));

    useEffect(() => {
        if (canResend) return;
        if (resendTimer === 0) {
            setCanResend(true);
            return;
        }
        const timer = setTimeout(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [resendTimer, flowStep, canResend]);

    useEffect(() => {
        if (flowStep === "otp") {
            setTimeout(() => {
                inputsRef.current[2]?.focus();
            }, 0);
        }
    }, [flowStep]);

    useEffect(() => {
        if (flowStep !== "progress") return;
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setFlowStep("default");
                        setResetType(null);
                    }, 800);
                    return 100;
                }
                return prev + 5;
            });
        }, 250);

        return () => clearInterval(interval);
    }, [flowStep]);

    const handleFinalProceed = async () => {
        const isFullReset = resetType === "full-reset";
        toast.loading(
            isFullReset
                ? "Account reset started. All data will be permanently removed."
                : "Transaction clearing started. Transactional data will be removed.",
            { id: "reset-action" }
        );

        const body = {
            con: JSON.stringify({
                mode: isFullReset ? "fullReset" : "clearTransaction",
                appuserid: LUId,
                IPAddress: clientIp,
            }),
            p: "{}",
            f: "MyAccount ( gettoken )",
        };

        try {
            if (isFullReset) {
                await fullResetAccount(body);
            } else {
                await clearTransactionAccount(body);
            }

            toast.success(
                isFullReset
                    ? "Account reset initiated successfully."
                    : "Transaction clearing initiated successfully.",
                { id: "reset-action" }
            );
            setFlowStep("progress");
            setProgress(0);
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        toast.success(
                            resetType === "full-reset"
                                ? "Full Reset completed successfully."
                                : "Transaction clearing completed successfully."
                        );
                        setTimeout(() => {
                            performLogout();
                        }, 1500);
                        return 100;
                    }
                    return prev + 5;
                });
            }, 200);

        } catch (err) {
            toast.error(
                err.message || "Unable to perform this action. Please try again.",
                { id: "reset-action" }
            );
        }
    };


    const clearAllClientCookies = () => {
        const cookies = document.cookie.split(";");
        cookies.forEach((cookie) => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${window.location.pathname}`;
            const domainParts = window.location.hostname.split(".");
            while (domainParts.length > 1) {
                const domain = "." + domainParts.join(".");
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
                domainParts.shift();
            }
        });
    };



    const buildBase64Params = (decoded) => {
        const hostname = window.location.hostname;

        const isLocal =
            hostname === "localhost" ||
            hostname === "nzen";

        const payload = {
            YearCode: decoded.YearCode || "",
            SV: decoded.SV || "",
            Version: decoded.cuVer || "",
            rptapiurl: decoded.rptapiurl || "",
            local: isLocal // ✅ true or false
        };
        return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    };

    const performLogout = () => {
        const logoutUrls = [
        ];
        const loginIdEncoded = LUId;
        let redirectUrl;
        const h = window.location.hostname;
        if (resetType === "full-reset") {
            const encodedParams = buildBase64Params(decoded);
            if (h === "localhost" || h === "nzen") {
                redirectUrl = `http://nzen/accountlogin?data=${encodedParams}`;
            } else {
                redirectUrl = `https://account.optigoapps.com/?data=${encodedParams}`;
            }
        } else {
            if (h === "nzen" || h === "heli" || h === "localhost") {
                redirectUrl = `http://nzen/login/Default`;
            } else {
                redirectUrl = "https://mylogin.optigoapps.com/Default";
            }
        }
        const safeRedirect = (url) => {
            let targetWindow = window;
            for (let i = 0; i < 7; i++) {
                if (targetWindow.parent) targetWindow = targetWindow.parent;
            }
            targetWindow.location.href = url;
        };
        const logoutAllApps = async () => {
            for (let i = 0; i < logoutUrls.length; i++) {
                try {
                    await axios.post(
                        logoutUrls[i],
                        `logout=logout&l=${loginIdEncoded}`,
                        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                    );
                } catch (err) {
                    console.error("Logout failed for", logoutUrls[i]);
                }
            }
            safeRedirect(redirectUrl);
        };
        clearAllClientCookies();
        logoutAllApps();
    };


    const sendOtpFlow = async () => {
        const body = {
            con: JSON.stringify({
                mode: "Otp_Generate",
                appuserid: LUId,
                IPAddress: clientIp,
            }),
            p: "{}",
            f: "MyAccount ( gettoken )",
        };

        const res = await generateOtp(body);
        const otpData = res?.Data?.rd?.[0];
        if (!otpData) throw new Error("OTP generation failed");
    };

    const handleSendOtp = async () => {
        setError("");
        setResendTimer(RESEND_TIME);
        try {
            const freshOtp = ["A", "-", "", "", "", ""];
            setOtp(freshOtp);
            await sendOtpFlow();
            setCanResend(false);
            toast.success("OTP sent successfully");
            setFlowStep("otp")

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to send OTP");
        } finally {
        }
    };

    const handleVerify = async () => {
        if (verifyingOtp) return;
        const enteredOtp = otp.slice(2).join("");
        if (enteredOtp.length < 4) {
            setError("Please enter complete OTP");
            return;
        }

        setVerifyingOtp(true);
        setError("");

        const body = {
            con: JSON.stringify({
                mode: "Otp_Verify",
                appuserid: LUId,
                IPAddress: clientIp,
            }),
            p: JSON.stringify({
                otp_entered: `A-${enteredOtp}`,
            }),
            f: "MyAccount ( gettoken )",
        };

        try {
            const res = await verifyOtp(body);
            const msg = res?.Data?.rd?.[0]?.msg;

            if (msg === "Successfully Verified OTP") {
                toast.success("OTP verified successfully");
                setFlowStep("final-confirm");   // ✅ ONLY here
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch (err) {
            setError(err.message || "OTP verification failed");
        } finally {
            setVerifyingOtp(false);
        }
    };


    const resetOtpInputs = () => {
        const freshOtp = ["A", "-", "", "", "", ""];
        setOtp(freshOtp);
        setError("");

        inputsRef.current.forEach((input, index) => {
            if (input && index >= 2) {
                input.value = "";
            }
        });

        setTimeout(() => {
            inputsRef.current[2]?.focus();
        }, 0);
    };

    const handleResend = async () => {
        try {
            resetOtpInputs();
            await sendOtpFlow();
            toast.success("OTP resent");
            setCanResend(false);
            setResendTimer(RESEND_TIME);
        } catch (err) {
            toast.error("Failed to resend OTP");
        } finally {
        }
    };

    const handleKeyDown = (e, index) => {
        if (index < 2) {
            e.preventDefault();
            return;
        }

        if (e.key === "Backspace" && !otp[index] && index > 2) {
            inputsRef.current[index - 1]?.focus();
        }

        if (e.key === "Enter") {
            handleVerify();
        }
    };

    const handleChange = (value, index) => {
        if (index < 2) return;
        if (!/^\d?$/.test(value)) return;
        if (error) setError("");

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        let pasted = e.clipboardData.getData("text").trim();

        if (pasted.startsWith("A-")) {
            pasted = pasted.slice(2);
        }

        if (!/^\d{1,4}$/.test(pasted)) return;

        const digits = pasted.split("");

        const newOtp = ["A", "-", "", "", "", ""];

        digits.forEach((digit, i) => {
            newOtp[i + 2] = digit;
        });

        setOtp(newOtp);

        digits.forEach((digit, i) => {
            if (inputsRef.current[i + 2]) {
                inputsRef.current[i + 2].value = digit;
            }
        });

        const focusIndex = Math.min(digits.length + 1, 5);
        inputsRef.current[focusIndex]?.focus();
    };

    return (
        <>
            {flowStep === "default" && (
                <div className="reset-wrapper">
                    <div className="danger-alert">
                        <div className="danger-icon">⚠️</div>
                        <div className="danger-content">
                            <p>
                                Any action performed from this section is permanent and cannot be rolled back.
                                Please make sure you understand the impact before proceeding.
                            </p>
                        </div>
                    </div>

                    {/* ROW 1 → 50 / 50 */}
                    <div className="reset-row">
                        <ResetBox title="Full Reset">
                            <div className="reset-box-extra">
                                <div>
                                    <p><strong>What is Full Reset?</strong></p>
                                    <p>All data of your Optigo account will be deleted.</p>
                                </div>

                                <div>
                                    <button
                                        className="danger-btn-full"
                                        onClick={() => {
                                            setResetType("full-reset");
                                            setFlowStep("confirm");
                                        }}
                                    >
                                        Full Reset
                                    </button>
                                </div>
                            </div>
                        </ResetBox>

                        <ResetBox title="Clear Transaction">
                            <div className="reset-box-extra">
                                <div>
                                    <p><strong>What is Clear Transaction?</strong></p>
                                    <p>Following entries will <strong>NOT</strong> be deleted:</p>

                                    <ul style={{ fontSize: "16px", margin: "2% 0%" }}>
                                        <li>Master & Policy</li>
                                        <li>Design Master</li>
                                        <li>User Master</li>
                                    </ul>
                                </div>
                                <div>
                                    <button
                                        className="warning-btn"
                                        onClick={() => {
                                            setResetType("clear-transaction");
                                            setFlowStep("confirm");
                                        }}
                                    >
                                        Clear Transaction
                                    </button>
                                </div>
                            </div>
                        </ResetBox>
                    </div>

                    {/* ROW 2 → FULL WIDTH */}
                    {/* <div className="reset-row-full">
                        <ResetBox title="Reset Link">
                            <div className="reset-link-row">
                                <input
                                    value="https://optigo/reset/xyz123"
                                    readOnly
                                    className="reset-link-input"
                                    id="resetLinkInput"
                                />

                                <button
                                    className="copy-btn"
                                    onClick={() => {
                                        const input = document.getElementById("resetLinkInput");
                                        navigator.clipboard.writeText(input.value);
                                    }}
                                >
                                    Copy
                                </button>
                                <button
                                    className="copy-btn"
                                >Send Email</button>
                            </div>

                            <div className="reset-action-row">
                                <button className="primary-btn">Send OTP</button>
                            </div>

                            <p>
                                Step 1: <strong>Send OTP</strong> to registered mobile number.
                            </p>
                            <p>
                                Step 2: <strong>Send Mail</strong> with reset link to registered email ID.
                            </p>
                        </ResetBox>
                    </div> */}
                </div>
            )}

            {flowStep === "confirm" && (
                <div className="reset-confirm-wrapper">
                    <div className="reset-confirm-box">
                        <h3>
                            {resetType === "full-reset"
                                ? "Full Reset Confirmation"
                                : "Clear Transaction Confirmation"}
                        </h3>

                        <p className="reset-confirm-text">
                            {resetType === "full-reset" ? (
                                <>
                                    By continuing this action,<strong> all your account data will be permanently deleted</strong>.<br />
                                    The following modules’ data will be removed completely:
                                    <p style={{ padding: "2% 3%", margin: "0" }}>
                                        <p style={{ margin: "0" }}>User Master</p>
                                        <p style={{ margin: "0" }}>Masters & Policy</p>
                                        <p style={{ margin: "0" }}>Sales CRM</p>
                                        <p style={{ margin: "0" }}>Book Keeping</p>
                                        <p style={{ margin: "0" }}>Vendor</p>
                                        <p style={{ margin: "0" }}>Manufacturing</p>
                                        <p style={{ margin: "0" }}>PD Module</p>
                                        <p style={{ margin: "0" }}>Accounts Module</p>
                                        <p style={{ margin: "0" }}>Inventory Module</p>
                                        <p style={{ margin: "0" }}>E-Commerce Back Office</p>
                                        <p style={{ margin: "0" }}>System Admin</p>
                                    </p>
                                    This process cannot be rollback. Once data, cannot be recovered.
                                </>
                            ) : (
                                <>
                                    By performing this action, the following data will be deleted:
                                    <p style={{ padding: "2% 3%", margin: "0" }}>
                                        <p style={{ margin: "0" }}>All transactions</p>
                                        <p style={{ margin: "0" }}>All invoices</p>
                                        <p style={{ margin: "0" }}>All transaction history</p>
                                        <p style={{ margin: "0" }}>Masters & Policy, Design Master, User Master data will not be deleted.</p>
                                    </p>
                                    This process cannot be undone.
                                </>
                            )}
                        </p>

                        <p className="reset-confirm-question">
                            Do you still want to proceed?
                        </p>

                        <div className="reset-confirm-actions">
                            <button
                                className="handle-cancel"
                                onClick={() => setFlowStep("default")}
                                style={{ marginTop: "0px" }}
                            >
                                Cancel
                            </button>

                            <button
                                className="danger-btn"
                                onClick={handleSendOtp}
                                style={{ marginTop: "0px" }}
                            >
                                Proceed
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {flowStep === "otp" && (
                <div className="reset-confirm-wrapper">
                    <div className="reset-confirm-box">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleVerify();
                            }}
                        >
                            <h3>Verify your mobile number</h3>
                            <p className="reset-confirm-text"
                                style={{
                                    padding: '0px',

                                }}>
                                An OTP sent to the registered mobile number
                            </p>
                            <p className="reset-mobile"
                                style={{
                                    padding: '0px',

                                }}>
                                +91 XXXXX X3581
                            </p>
                            <div onPaste={handlePaste} style={{ display: 'flex', gap: '12px' }}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputsRef.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        disabled={index < 2}
                                        className={`otp-box ${index < 2 ? "otp-fixed" : ""}`}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                ))}
                            </div>
                            <div className="otp-footer" style={{ width: '50%' }}>
                                {!canResend ? (
                                    <span style={{ color: "#6e6e73" }}>
                                        Resend OTP in <span>{resendTimer}s</span>
                                    </span>
                                ) : (
                                    <span>
                                        <span style={{ color: "#6e6e73" }}>
                                            Didn’t receive the code?{" "}
                                        </span>
                                        <span onClick={handleResend} className="resend-active" style={{ cursor: "pointer" }}>
                                            Resend
                                        </span>
                                    </span>
                                )}
                            </div>
                            {error && <div className="otp-error"
                                style={{ width: '50%' }}>{error}</div>}

                            {/* <button type="submit" className={verifyingOtp ? "otp-continue-btn-loading" : "otp-continue-btn"} disabled={verifyingOtp}>
                                {verifyingOtp ? <span className="btn-spinner" /> : "Continue"}
                            </button> */}
                            <div className="reset-confirm-actions">
                                <button
                                    className="handle-cancel"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setFlowStep("default")
                                    }}
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="danger-btn" disabled={verifyingOtp} style={{
                                    width: '120px'
                                }}>

                                    {/* className="danger-btn"
                                onClick={() => {
                                    const enteredOtp = otp.join("");

                                    if (enteredOtp.length === 0) {
                                        setOtpError("Please enter OTP");
                                        return;
                                    }

                                    if (enteredOtp.length < OTP_LENGTH) {
                                        setOtpError("Please enter complete OTP");
                                        return;
                                    }

                                    if (!isOtpVerified) {
                                        setOtpError("Invalid OTP. Please enter valid OTP.");
                                        return;
                                    }

                                    resetOtpState();
                                    setFlowStep("final-confirm");
                                }} */}
                                    {verifyingOtp ? <span className="btn-spinner" /> : "Continue"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {flowStep === "final-confirm" && (
                <div className="reset-confirm-wrapper">
                    <div className="reset-confirm-box">
                        <h3>Final Confirmation</h3>
                        <p className="reset-confirm-text">
                            You have successfully verified your mobile number.
                        </p>
                        <p className="reset-confirm-question">
                            Are you sure you still want to proceed?
                        </p>
                        <div className="reset-confirm-actions">
                            <button
                                className="handle-cancel"
                                onClick={() => setFlowStep("default")}
                                style={{ marginTop: "0px" }}
                            >
                                Cancel
                            </button>
                            <button
                                className="danger-btn"
                                onClick={handleFinalProceed}
                                style={{ marginTop: "0px" }}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {flowStep === "progress" && (
                <div className="reset-confirm-wrapper" style={{ paddingBottom: "24px" }}>
                    <div className="reset-confirm-box">
                        <h3>
                            {resetType === "full-reset"
                                ? "Performing Full Reset"
                                : "Clearing Transactions"}
                        </h3>
                        <p className="reset-confirm-text">
                            Please wait while we complete the process.
                            Do not refresh or close the page.
                        </p>
                        <div className="progress-bar-wrapper">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="progress-percent">
                            {progress}%
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const ResetBox = ({ title, children }) => (
    <div className="reset-box">
        <h4>{title}</h4>
        {children}
    </div>
);

export default ResetAccount;