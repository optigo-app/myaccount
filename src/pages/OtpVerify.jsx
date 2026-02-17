import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import "./OtpVerify.scss";
import slide1 from "../assets/otp-slider/slide1.png";
import slide2 from "../assets/otp-slider/slide2.png";
import slide3 from "../assets/otp-slider/slide3.png";
import { generateOtp, verifyOtp } from "../api/myAccountApi";
import toast from "react-hot-toast"


const OtpVerify = ({ onOtpSuccess, clientIp, LUId, mobileNo }) => {
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();
  const [step, setStep] = useState("send");
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(["A", "-", "", "", "", ""]);
  const [sendingOtp, setSendingOtp] = useState(false);
  const inputsRef = useRef([]);
  const RESEND_TIME = 60;
  const [resendTimer, setResendTimer] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(true);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const captions = [
    {
      image: slide1,
      title: "Secure Cloud Access",
      desc: "Your account is protected with multi-layer security.",
    },
    {
      image: slide2,
      title: "Data You Can Trust",
      desc: "Your information is encrypted and always protected.",
    },
    {
      image: slide3,
      title: "Access Anywhere",
      desc: "Stay connected across all your devices seamlessly.",
    },
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % captions?.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step !== "verify") return;
    if (canResend) return;

    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer, step, canResend]);

  useEffect(() => {
    if (step === "verify") {
      setTimeout(() => {
        inputsRef.current[2]?.focus();
      }, 0);
    }
  }, [step]);

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
    setError("");

    digits.forEach((digit, i) => {
      if (inputsRef.current[i + 2]) {
        inputsRef.current[i + 2].value = digit;
      }
    });

    const focusIndex = Math.min(digits.length + 1, 5);
    inputsRef.current[focusIndex]?.focus();
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
      const minDelay = new Promise((res) => setTimeout(res, 300));
      const apiCall = verifyOtp(body);

      const [res] = await Promise.all([apiCall, minDelay]);

      const msg = res?.Data?.rd?.[0]?.msg;

      if (msg === "Successfully Verified OTP") {
        toast.success("OTP verified successfully");

        sessionStorage.setItem("otp_verified", "true");
        onOtpSuccess();
        navigate("/", { replace: true });
        return;
      }

      setError("Invalid OTP. Please try again.");
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
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
    // const otp = otpData.new_otp.split("-")[1];
    // await sendOtpOnWhatsapp({
    //   phoneNo: mobileNo,
    //   otp,
    //   appuserid: LUId,
    //   customerId: 1048,
    // });
  };

  const handleSendOtp = async () => {
    if (sendingOtp) return;
    try {
      setSendingOtp(true);
      await sendOtpFlow();
      toast.success("OTP sent successfully");
      setStep("verify");
      setCanResend(false);
      setResendTimer(RESEND_TIME);
      setError("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
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
    if (!canResend || sendingOtp) return;

    try {
      resetOtpInputs();
      setSendingOtp(true);

      await sendOtpFlow();

      toast.success("OTP resent");

      setCanResend(false);
      setResendTimer(RESEND_TIME);
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const maskedMobile = mobileNo
    ? `+91 ${mobileNo.slice(0, 2)}XXX XXXXX`
    : "";

  return (
    <div className="otp-page">

      {/* LEFT */}
      <div className="otp-left">
        <div className="otp-card">

          <div className="otpHead">
            <div className="otp-brand">OPTIGO</div>
            <h1>Verify your identity</h1>
          </div>

          {step === "send" && (
            <>
              <p className="otp-subtitle">
                We will send a verification code to your registered mobile number.
              </p>

              <div className="otp-mobile">
                {maskedMobile}
              </div>

              <button
                className={sendingOtp ? "otp-btn-loading" : "otp-btn"}
                onClick={handleSendOtp}
                disabled={sendingOtp}
              >
                {sendingOtp ? <span className="btn-spinner" /> : "Send OTP"}
              </button>

              <div className="otp-footer"></div>
            </>
          )}

          {step === "verify" && (
            <form
              className="otp-handle"
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
            >
              <p className="otp-subtitle">
                Enter the 4-digit code sent to your mobile number.
              </p>

              <div className="otp-box-wrapper" onPaste={handlePaste}>
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

              {error && <div className="otp-error">{error}</div>}

              <button type="submit" className={verifyingOtp ? "otp-continue-btn-loading" : "otp-continue-btn"} disabled={verifyingOtp}>
                {verifyingOtp ? <span className="btn-spinner" /> : "Continue"}
              </button>

              <div className="otp-footer">
                {!canResend ? (
                  <span style={{ color: "#6e6e73" }}>
                    Resend OTP in <span>{resendTimer}s</span>
                  </span>
                ) : (
                  <span>
                    <span style={{ color: "#6e6e73" }}>
                      Didn’t receive the code?{" "}
                    </span>
                    {sendingOtp ? (
                      <span className="resend-loader">
                        <span className="resend-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                      </span>
                    ) : (
                      <span onClick={handleResend} className="resend-active" style={{ cursor: "pointer" }}>
                        Resend
                      </span>
                    )}
                  </span>
                )}
              </div>
            </form>
          )}

        </div>

      </div>

      <div className="otp-right">
        <div className="slider-card">
          <img
            src={captions[activeImage].image}
            alt="Security slide"
          />
          <div className="slide-text">
            <h3>{captions[activeImage].title}</h3>
            <p>{captions[activeImage].desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;