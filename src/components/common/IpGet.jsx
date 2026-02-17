export const getClientIpAddress = async () => {
    try {
      const cachedIp = sessionStorage.getItem("clientIpAddress");
      if (cachedIp) return cachedIp;
  
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      const ip = data?.ip || "";
  
      sessionStorage.setItem("clientIpAddress", ip);
      return ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return "";
    }
  };

/******************** Code From Jenis Sir ***********************/
import Cookies from "js-cookie";

export async function readAndDecodeCookie(cookieName) {
  const rawCookie = Cookies.get(cookieName);
  if (!rawCookie) return null;

  try {
    const decodedURI = decodeURIComponent(rawCookie);
    const parsedObj = JSON.parse(decodedURI);
    const safeBase64Decode = (val) => {
      if (typeof val !== "string") return val;
      try {
        const decoded = atob(val);
        return /^[\x09\x0A\x0D\x20-\x7E]*$/.test(decoded) ? decoded : val;
      } catch {
        return val;
      }
    };
    const result = Object.fromEntries(
      Object.entries(parsedObj).map(([key, value]) => {
        const decodedValue = safeBase64Decode(value);
        if (key === "YearCode" && typeof decodedValue === "string") {
          return [key, btoa(decodedValue)];
        }
        return [key, decodedValue];
      })
    );

    return result;
  } catch (err) {
    console.error("Failed to decode cookie:", err);
    return null;
  }
}

// http://localhost:3000/?CN=UkRTRF8yMDI1MTAwNzA0MDgyNF9kZGFmNzIwOGQ4MzY0ODE0YmZiNDE3MDkyNzg0YTdiMQ==&pid=18333

import { Route, Routes, useSearchParams } from "react-router-dom";
import "./App.scss";
import { useEffect, useState } from "react";
import ScanJob from "./component/Pages/ScanJob/ScanJob";
import DetailSection from "./component/Pages/DetailSection/DetailSection";
import { Box, Paper, Typography } from "@mui/material";
import { getClientIpAddress, readAndDecodeCookie } from "./Utils/globalFunc";
import { CallApi } from "./API/CallApi/CallApi";
import LoadingBackdrop from "./Utils/LoadingBackdrop";
import { AlertTriangle } from "lucide-react";

const App = () => {
  const [tokenMissing, setTokenMissing] = useState(false);
  const [searchParams] = useSearchParams();
  const CN = searchParams.get("CN");
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  //   useEffect(() => {
  //   Cookies.set(
  //     "RDSD_20251007040824_ddaf7208d8364814bfb417092784a7b1",
  //     "%7b%22tkn%22%3a%22OTA2NTQ3MTcwMDUzNTY1MQ%3d%3d%22%2c%22pid%22%3a18333%2c%22IsEmpLogin%22%3a0%2c%22IsPower%22%3a0%2c%22SpNo%22%3a%22MA%3d%3d%22%2c%22SpVer%22%3a%22%22%2c%22SV%22%3a%22MA%3d%3d%22%2c%22LId%22%3a%22MTg1Mzg%3d%22%2c%22LUId%22%3a%22amVuaXNAZWcuY29t%22%2c%22DAU%22%3a%22aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvQ2VudHJhbEFwaQ%3d%3d%22%2c%22YearCode%22%3a%22e3tuemVufX17ezIwfX17e29yYWlsMjV9fXt7b3JhaWwyNX19%22%2c%22cuVer%22%3a%22UjUwQjM%3d%22%2c%22rptapiurl%22%3a%22aHR0cDovL25ld25leHRqcy53ZWIvYXBpL3JlcG9ydA%3d%3d%22%7d"
  //   );
  // }, []);

  const Local =
    window.location.hostname === "localhost" ||
    window.location.hostname === "bulkengage.web" ||
    window.location.hostname === "nzen"
      ? true
      : false;

  const decodeBase64 = (str) => {
    if (!str) return null;
    try {
      return atob(str);
    } catch (e) {
      console.error("Error decoding base64:", e);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      const ip = await getClientIpAddress();
      if (!ip) {
        setTokenMissing(true);
        return;
      }
      const decodedCN = decodeBase64(CN);
      const getData = decodedCN ? sessionStorage.getItem(decodedCN) : null;
      if (Local) {
        const data = {
          tkn: "9065471700535651",
          pid: 18333,
          IsEmpLogin: 0,
          IsPower: 0,
          SpNo: "0",
          SpVer: "",
          SV: "0",
          LId: "5",
          LUId: "admin@orail.co.in",
          DAU: "http://nzen/jo/api-lib/App/CentralApi",
          YearCode: "e3tuemVufX17ezIwfX17e29yYWlsMjV9fXt7b3JhaWwyNX19",
          cuVer: "R50B3",
          rptapiurl: "http://newnextjs.web/api/report",
        };

        sessionStorage.setItem("reportVarible", JSON.stringify(data));
        setIsInitialized(true);
        return;
      }

      if (!CN && !getData) {
        setTokenMissing(true);
        return;
      }

      try {
        const cookieData = await readAndDecodeCookie(decodedCN);

        if (!cookieData && !getData) {
          setTokenMissing(true);
          return;
        }

        if (!getData && cookieData) {
          sessionStorage.setItem(decodedCN, JSON.stringify(cookieData));
        }

        sessionStorage.setItem(
          "reportVarible",
          cookieData ? JSON.stringify(cookieData) : getData
        );

        setIsInitialized(true);
      } catch (err) {
        console.error("Session init failed", err);
        setTokenMissing(true);
      }
    };

    init();
  }, [CN, Local]);

  useEffect(() => {
    if (!Local) {
      if (!isInitialized) return;
    }
    const fetchMasterData = async () => {
      try {
        const AllData = JSON.parse(sessionStorage.getItem("reportVarible"));
        const clientIpAddress = JSON.parse(
          sessionStorage.getItem("clientIpAddress")
        );
        if (!AllData?.LUId && !Local) {
          setTokenMissing(true);
          return;
        }
        setLoading(true);
        const lockerReq = {
          con: JSON.stringify({
            id: "",
            mode: "getlocker",
            appuserid: AllData?.LUId,
            IPAddress: clientIpAddress,
          }),
          p: "",
          f: "egmaterial (get lockermaster)",
        };

        const employeeReq = {
          con: JSON.stringify({
            id: "",
            mode: "getemplist",
            appuserid: AllData?.LUId,
            IPAddress: clientIpAddress,
          }),
          p: "",
          f: "getemplist (get getemplist)",
        };

        const empLockerReq = {
          con: JSON.stringify({
            id: "",
            mode: "getemplocker",
            appuserid: AllData?.LUId,
            IPAddress: clientIpAddress,
          }),
          p: "",
          f: "getemplist (get getemplist)",
        };

        const [lockerRes, employeeRes, empLockerRes] = await Promise.all([
          CallApi(lockerReq),
          CallApi(employeeReq),
          CallApi(empLockerReq),
        ]);

        if (lockerRes?.rd) {
          sessionStorage.setItem("allLockerData", JSON.stringify(lockerRes.rd));
        }

        if (employeeRes?.rd) {
          sessionStorage.setItem(
            "allEmployeeData",
            JSON.stringify(employeeRes.rd)
          );
        }

        if (empLockerRes?.rd) {
          sessionStorage.setItem(
            "allEmployeeLockerData",
            JSON.stringify(empLockerRes.rd)
          );
        }
        setLoading(false);
      } catch (err) {
        console.error("Master data fetch failed", err);
      } finally {
      }
    };

    fetchMasterData();
  }, [isInitialized, Local]);
  
  if (tokenMissing && !Local) {
    return (
      <Box display="flex" justifyContent="center" minHeight="70vh" p={2}>
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            width: "100%",
            p: 4,
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <Box display="flex" justifyContent="center" mb={2}>
            <AlertTriangle size={48} color="#f44336" />
          </Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            You've been logged out
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your session has ended. Please log in again to continue.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <LoadingBackdrop isLoading={loading} />
      <Routes>
        <Route path="/" element={<ScanJob />} />
        <Route path="/DetailSection" element={<DetailSection />} />
      </Routes>
    </>
  );
};

export default App;

//From Rajan OTP Related 13/01/26
import { useEffect, useState } from "react"
import { Button } from "@mui/material"
import { OTPVerificationModal } from "./OTPModal"
import { WebSignUpOTPVerify } from "../../API/Auth/WebSignUpOTPVerify"


const App = ({ isLoading=false , onResend =()=>{} , btncolor, iconcolor, bgcolor, iconbgcolor, isOpen, setIsOpen = false, type = "email", mobileNo = '', emailId = '', onClose = () => { }, navigation, location }) => {
  const otpLength = 4;
  const [otp, setOtp] = useState(new Array(otpLength).fill(""));
  const [message, setmessage] = useState("");
  const [loading, setloading] = useState(false);

  const handleVerify = async (otp) => {
    setloading(true)
    setmessage("")
    const userid = type === "email" ? emailId : '';
    const mobileno = type === "mobile" ? mobileNo : '';
    const mobilenoCode = sessionStorage.getItem('Countrycodestate');
    const search = location?.search;
    const redirectSignUpUrl = `/register/${search}`;

    try {
      const response = await WebSignUpOTPVerify(userid, mobileno, otp);
      if (response?.Data?.rd[0]?.stat == 1 || response?.Data?.rd[0]?.stat == "success") {
        setmessage("Verification Successfull")
        if(type === "email"){
          navigation(redirectSignUpUrl, { state: { email: emailId } });
        }else{
          navigation(redirectSignUpUrl, { state: { mobileNo: mobileNo , code :mobilenoCode } });
        }
        onClose();
      } else {
        setmessage("Invalid OTP");
        setloading(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setmessage("something went wrong")
      setloading(false)
    }
  };

  const handleResend = async () => {
    const contact = type === "email" ? emailId : mobileNo;
    onResend()
  }
  useEffect(()=>{
    setmessage("")
  },[isOpen])

  return (
    <div style={{ padding: "20px" }}>
      <OTPVerificationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type={type}
        contactInfo={type === "email" ? emailId : mobileNo}
        buttonBgColor={btncolor}
        onVerify={handleVerify}
        onResend={handleResend}
        iconcolor={iconcolor}
        bgcolor={bgcolor}
        iconbgcolor={iconbgcolor}
        otp={otp}
        setOtp={setOtp}
        message={message}
        loading={loading}
        setmessage={setmessage}
        isLoading={isLoading}
        />
    </div>
  )
}

export default App





import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Footer from '../../Home/Footer/Footer';
import { ContimueWithMobileAPI } from '../../../../../../utils/API/Auth/ContimueWithMobileAPI';
import './ContimueWithMobile.modul.scss'
import OTPContainer from '../../../../../../utils/Glob_Functions/Otpflow/App';
import ContinueMobile from '../../../../../../utils/Glob_Functions/CountryDropDown/ContinueMobile';

export default function ContimueWithMobile() {
    const [mobileNo, setMobileNo] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [buttonFocused, setButtonFocused] = useState(false);
    const [storeInit, setStoreInit] = useState({});
    const navigation = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false)
    const [Countrycodestate, setCountrycodestate] = useState();

    useEffect(() => {
        setStoreInit(JSON.parse(sessionStorage.getItem('storeInit')));
    }, [])

    const search = location?.search
    const redirectMobileUrl = `/LoginWithMobileCode/${search}`;
    const redirectSignUpUrl = `/register/${search}`;
    const cancelRedireactUrl = `/LoginOption/${search}`;

    const handleInputChange = (e, setter, fieldName) => {
        const { value } = e.target;
        const trimmedValue = value.trim();
        const formattedValue = trimmedValue.replace(/\s/g, '');

        setter(formattedValue);

        // if (fieldName === 'mobileNo') {
        //     if (!formattedValue) {
        //         setErrors(prevErrors => ({ ...prevErrors, mobileNo: 'Mobile No. is required' }));
        //     } else if (!/^\d{10}$/.test(formattedValue)) {
        //         setErrors(prevErrors => ({ ...prevErrors, mobileNo: 'Enter Valid mobile number' }));
        //     } else {
        //         setErrors(prevErrors => ({ ...prevErrors, mobileNo: '' }));
        //     }
        // }
    };
    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        if (!mobileNo.trim()) {
            setErrors({ mobileNo: 'Mobile No. is required' });
            return;
        }
        const encodedKeyFromStorage = JSON.parse(sessionStorage.getItem("keylogs"));
        const getSecKey = encodedKeyFromStorage ? decodeURIComponent(atob(encodedKeyFromStorage)) : "";
        const SecurityKey = location?.state?.SecurityKey ?? getSecKey;
        const AllCode = JSON?.parse(sessionStorage?.getItem('CountryCodeListApi')) ?? [];
        const phonecode = AllCode?.find((val) => val?.mobileprefix == Countrycodestate);
        const requiredLength = phonecode?.PhoneLength;
        const isValid = new RegExp(`^\\d{${requiredLength}}$`).test(mobileNo.trim());
        if (!isValid) {
            setErrors({ mobileNo: `Mobile number must be  ${requiredLength} digits.` });
            return { mobileNo: `Enter a valid ${requiredLength}-digit mobile number` };
        }
        // else if (!/^\d{10}$/.test(mobileNo.trim())) {
        //     setErrors({ mobileNo: 'Enter Valid mobile number' });
        //     return;
        // }

        // try {
        //     const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        //     const { FrontEnd_RegNo } = storeInit;
        //     const combinedValue = JSON.stringify({
        //         country_code: '91', mobile: `${mobileNo}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`
        //     });
        //     const encodedCombinedValue = btoa(combinedValue);
        //     const body = {
        //         "con": "{\"id\":\"\",\"mode\":\"WEBVALDNMOBILE\"}",
        //         "f": "continueWithMobile (handleSubmit)",
        //         p: encodedCombinedValue
        //     };

        //     const response = await CommonAPI(body);
        setIsSubmitting(true);
        setIsLoading(true);
        ContimueWithMobileAPI(mobileNo, Countrycodestate).then((response) => {
            setIsLoading(false);
            if (response?.Status == 400) {
                toast.error(response?.Message)
                setIsSubmitting(false);
                return
            }
            if (response?.Data?.Table1[0]?.stat === '1' && response?.Data?.Table1[0]?.islead === '1') {
                toast.error('You are not a customer, contact to admin')
                setIsSubmitting(false);
            } else if (response?.Data?.Table1[0]?.stat === '1' && response?.Data?.Table1[0]?.islead === '0') {
                toast.success('OTP send Sucssessfully');
                navigation(redirectMobileUrl, { state: { mobileNo: mobileNo, code: Countrycodestate, SecurityKey: SecurityKey } });
                sessionStorage.setItem('registerMobile', mobileNo)
                setIsSubmitting(false);
            } else {
                // navigation(redirectSignUpUrl, { state: { mobileNo: mobileNo } });
                if (Countrycodestate != "91") {
                    navigation(redirectSignUpUrl, { state: { mobileNo: mobileNo, code: Countrycodestate, SecurityKey: SecurityKey } });
                } else if (Countrycodestate == "91" && storeInit?.IsEcomOtpVerification == 0) {
                    navigation(redirectSignUpUrl, { state: { mobileNo: mobileNo, code: Countrycodestate, SecurityKey: SecurityKey } });
                } else {
                    sessionStorage.setItem('Countrycodestate', Countrycodestate)
                    sessionStorage.setItem('registerMobile', mobileNo)
                    setIsOpen(true)
                    setIsSubmitting(false);
                }
            }
        }).catch((err) => {
            console.log(err)
            setIsSubmitting(false);
        })



        // } catch (error) {
        //     console.error('Error:', error);
        // } finally {
        //     setIsSubmitting(false);
        //     setIsLoading(false);
        // }
    };

    useEffect(() => {
        sessionStorage.removeItem("Countrycodestate")
    }, [])

    return (
        <div className='proCat_continuMobile'>
            <ToastContainer limit={5} hideProgressBar={true} pauseOnHover={false} />
            {isLoading && (
                <div className="loader-overlay" style={{ zIndex: 99999999 }}>
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div>
                {((storeInit?.IsEcomOtpVerification && storeInit?.IsEcomOtpVerification === 1) && Countrycodestate == "91") ? (
                    <OTPContainer mobileNo={mobileNo.trim()} isOpen={isOpen} type='mobile' setIsOpen={() => setIsOpen(!isOpen)} onClose={() => setIsOpen(false)}
                        navigation={navigation}
                        location={location}
                        onResend={handleSubmit}
                        isLoading={isLoading}
                    />
                ) : null}
                <div className='smling-forgot-main'>
                    <p style={{
                        textAlign: 'center',
                        paddingBlock: '60px',
                        marginTop: '0px',
                        fontSize: '40px',
                        color: '#7d7f85',
                        fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif'
                    }}
                        className='AuthScreenMainTitle'
                    >Continue With Mobile</p>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '-60px',
                        fontSize: '15px',
                        color: '#7d7f85',
                        fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif'
                    }}
                        className='AuthScreenSubTitle'
                    >We'll check if you have an account, and help create one if you don't.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* <TextField
                            autoFocus
                            id="outlined-basic"
                            label="Enter Mobile No"
                            variant="outlined"
                            className='smr_loginmobileBox'
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                            style={{ margin: '15px' }}
                            value={mobileNo}
                            onChange={(e) => handleInputChange(e, setMobileNo, 'mobileNo')}
                            error={!!errors.mobileNo}
                            helperText={errors.mobileNo}
                        /> */}
                        <ContinueMobile
                            Errors={errors}
                            mobileNo={mobileNo}
                            setErrors={setErrors}
                            handleInputChange={handleInputChange}
                            setMobileNo={setMobileNo}
                            Countrycodestate={Countrycodestate}
                            setCountrycodestate={setCountrycodestate}
                            onSubmit={handleSubmit}
                        />

                        <button className='submitBtnForgot btnColorProCat' onClick={handleSubmit}>
                            SUBMIT
                        </button>
                        <Button className='pro_cancleForgot' style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}



import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const WebSignUpOTPVerify = async (userid, mobileno, OTP) => {

    let response;
    const domainname = wesbiteDomainName;
    try {
        const dp = {
            userid: userid || '',
            mobileno: mobileno || '',
            OTP: OTP || '',
            domainname: domainname
        };
        const body = {
            "con": "{\"id\":\"\",\"mode\":\"WebSignUpOTPVerify\"}",
            "f": "zen (cartcount)",
            dp: JSON.stringify(dp)
        };
        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }
    return response;
} 



import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";



export const ContimueWithMobileAPI = async (mobileNo, code) => {

    let response;
    const domainname = wesbiteDomainName;
    try {
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        const { FrontEnd_RegNo } = storeInit;
        const combinedValue = JSON.stringify({
            country_code: code ?? '', mobileno: `${mobileNo}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, domainname: domainname
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": "{\"id\":\"\",\"mode\":\"WEBVALDNMOBILE\"}",
            "f": "continueWithMobile (handleSubmit)",
            p: encodedCombinedValue,
            "dp": combinedValue,


        };

        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }

    return response;

}



export const CommonAPI = async (body) => {
    if (!APIURL) {
        await setApiUrl();
    }

    const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));

    if (!storeInit) {
        throw new Error('StoreInit data not found in sessionStorage');
    }
    try {
        const YearCode = storeInit?.YearCode ?? '';
        const version = storeInit?.version ?? '';
        const token = storeInit?.token ?? '';
        const sv = storeInit?.sv ?? '';

        const header = {
            Authorization: `Bearer ${token}`,
            Yearcode: YearCode,
            Version: version,
            sp: "1",
            sv: sv,
        };
        const response = await axios.post(APIURL, body, { headers: header });
        return response?.data;

    } catch (error) {
        console.error('error is..', error);
    }
};

