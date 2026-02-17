// http://localhost:3001/#/CreateUser?newuser=true
// account.optigoapps.com
//sample1@eg.com pass:- pasta
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import MyAccount from "./pages/MyAccount/MyAccount";
import OtpVerify from "./pages/OtpVerify";
import { bootstrapCNFromURL } from "./utils/cnBootstrap";
import { getIpAddress } from "./utils/getIpAddress";
import { devBootstrap } from "./utils/devBootstrap";
import { Toaster } from "react-hot-toast";
import { useMinDelay } from "./hooks/useMinDelay";
import AppLoader from "./components/loaders/Loader";
import { getRegisteredMobile } from "./api/myAccountApi";
import OTPPage from "./pages/MyAccount/OTPPage/OTPPage";
import CreateUser from "./pages/CreateUser/CreateUser";


// jdbwd

const AppRoutes = ({ isOtpVerified, setIsOtpVerified, clientIp, registeredMobile }) => {
  return (
    <Routes>
      <Route
        path="/CreateUser"
        element={<CreateUser clientIp={clientIp} />}
      />

      <Route
        index
        element={
          isOtpVerified
            ? <MyAccount clientIp={clientIp} />
            : <Navigate to="/otp-verify" replace />
        }
      />

      <Route
        path="otp-verify"
        element={
          <OtpVerify
            onOtpSuccess={() => setIsOtpVerified(true)}
            mobileNo={registeredMobile}
          />
        }
      />

      <Route path="/OTPPage" element={<OTPPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


const App = () => {
  const [bootstrapped, setBootstrapped] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [clientIp, setClientIp] = useState("");
  const minDelayDone = useMinDelay(500);
  const [registeredMobile, setRegisteredMobile] = useState("");

  useEffect(() => {
    devBootstrap();
    bootstrapCNFromURL();
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      bootstrapCNFromURL();
      const ip = await getIpAddress();
      setClientIp(ip || "");
      const otp = sessionStorage.getItem("otp_verified") === "true";
      setIsOtpVerified(otp);
      try {
        const res = await getRegisteredMobile(ip, sessionStorage.getItem("LUId"));
        const mobile = res?.Data?.rd?.[0]?.mobileno || "";
        sessionStorage.setItem("ufcc", res?.Data?.rd?.[0]?.UFCC);
        setRegisteredMobile(mobile);
      } catch (err) {
        console.error("Failed to fetch registered mobile", err);
      }
      setBootstrapped(true);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const clearOtp = () => {
      sessionStorage.removeItem("otp_verified");
    };
    window.addEventListener("blur", clearOtp);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        clearOtp();
      }
    });

    return () => {
      window.removeEventListener("blur", clearOtp);
      document.removeEventListener("visibilitychange", clearOtp);
    };
  }, []);

  if (!bootstrapped || !minDelayDone) {
    return <AppLoader text="Loading..." />;
  }

  function getBaseName() {
    const path = window.location.pathname;
    const match = path.match(/^\/([^/]+\/[^/]+)/);
    return match ? `/${match[1]}` : "/";
  }

  return (
    <>
      {/* <BrowserRouter> */}
      <BrowserRouter >
        <AppRoutes
          isOtpVerified={isOtpVerified}
          setIsOtpVerified={setIsOtpVerified}
          clientIp={clientIp}
          registeredMobile={registeredMobile}
        />
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
};

export default App;

  // "homepage": "/myaccount",
// basename="/myaccount"