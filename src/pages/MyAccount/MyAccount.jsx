import React, { useState, useEffect } from "react";
import YourPlan from "./tabs/yourPlan";
import CloudStorage from "./tabs/cloudStorage";
import Addons from "./tabs/Addons";
import ChangeHistory from "./tabs/changeHistory";
import Settings from "./tabs/Settings";
import UserLogin from "./tabs/userlogin";
import "./MyAccount.scss";
import { decodeCookieValue } from "../../utils/decodeCookieValue";

const tabs = [
  { id: "your-plan", label: "Your Plan" },
  { id: "your-storage", label: "Cloud Storage" },
  { id: "data-recovery", label: "Add Ons" },
  // { id: "change-history", label: "Change History" },
  { id: "settings", label: "User & Security" },
];

const MyAccount = ({ clientIp }) => {
  const [activeTab, setActiveTab] = useState("your-plan");
  const [LUId, setLUId] = useState(null);
  
  useEffect(() => {
    const sessionKeys = Object.keys(sessionStorage);
    const cookieKey = sessionKeys.find(k => k.startsWith("RDSD_"));
    if (!cookieKey) return;

    const decoded = decodeCookieValue(sessionStorage.getItem(cookieKey));
    if (decoded?.LUId) {
      setLUId(decoded.LUId);
    }
  }, []);
  
  const renderContent = () => {
    switch (activeTab) {
      case "your-plan":
        return <YourPlan />;
      case "your-storage":
        return <CloudStorage clientIp={clientIp} LUId={LUId} />;
      case "data-recovery":
        return <Addons clientIp={clientIp} LUId={LUId} />;
      // case "change-history":
      //   return <ChangeHistory />;
      case "settings":
        return <Settings clientIp={clientIp} LUId={LUId} />;
      default:
        return null;
    }
  };
  

  return (
    <div className="page-wrapper">
      <div className="myaccount-wrapper">
        {/* TOP TABS */}
        {/* <div style={{ width: "100%" }}> */}
          <div className="myaccount-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`myaccount-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && <span className="tab-underline" />}
              </button>
            ))}
          </div>
        {/* </div> */}

        {/* TAB CONTENT */}
        <div className="account-container">
          <div className="myaccount-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;