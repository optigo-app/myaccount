import React from "react";
import "../../../styles/theme.css";
import "./YourPlan.scss";
import planOptigoIcon from "../../../assets/newMyaccountImg/extraordinary factory.png";
import profactoryPl from "../../../assets/newMyaccountImg/profactoryPl.png";
import profactory from "../../../assets/newMyaccountImg/profactory.png";
import IntegratedE from "../../../assets/newMyaccountImg/Integrated E-commerce.png";
import icloudUpgradeImg from "../../../assets/newMyaccountImg/upgrade plan.png";
import branches from "../../../assets/branches.svg";
import scavu from "../../../assets/scavu.svg";
import card1 from "../../../assets/card1.png";
import card3 from "../../../assets/newMyaccountImg/branches.png";


const YourPlan = () => {
  return (
    <>
      <div className="yourplan-wrapper-first">
        <div className="yourplan-wrapper">
          <div className="yourplan-top">
            <h1>Your Optigo Plan</h1>
            <div className="yourplan-storage">
              <span className="storage-size">Pro Factory</span>
              <span className="storage-type">Active Plan</span>
            </div>

            <div className="yourplan-top-grid">
              {/* INCLUDES */}
              <div className="yourplan-includes">
                <p className="includes-title">Includes</p>
                <ul>
                  <li>1 GB File storage</li>
                  <li>100 MB Data storage</li>
                  <li>Books Keeping</li>
                  <li>Manufacturing</li>
                  <li>Sales CRM</li>
                  <li>Accounts</li>
                  <li>Inventory Management</li>
                  {/* <li>iCloud Passwords and Keychain</li> */}
                </ul>

                {/* <a href="#" className="learn-more">
                  See all apps and features that use iCloud
                </a> */}
              </div>

              {/* DIVIDER */}
              <div className="yourplan-divider" />

              {/* UPGRADE CARD */}
              <div className="yourplan-upgrade-card">
                <img
                  src={icloudUpgradeImg}
                  alt="Upgrade to iCloud+"
                  className="upgrade-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="icloudplus-wrapper">

        {/* TOP GREY CONTENT */}
        <div className="icloudplus-section">
          <div className="icloudplus-subtitle-wrapper">
            <h2>Upgrade Your Plans</h2>
            <p className="icloudplus-subtitle">Upgrading your package unlocks advanced features that streamline operations and support scalable growth.</p>
            <p className="icloudplus-subtitle">Enhanced functionalities empower teams to work smarter, improve efficiency, and drive better business outcomes.</p>
            <p className="icloudplus-subtitle">A feature-rich upgrade helps your company adapt faster, stay competitive, and grow with confidence.</p>
          </div>
          <div className="icloudplus-grid">
            {/* LEFT LARGE */}
            <div className="icloudplus-card large" style={{ height: "fit-content" }}>
              <img src={profactoryPl} alt="" style={{ width: "6%", height: "8%" }} />
              <h3>Pro+ Factory</h3>
              <p>Access automation, in-depth reporting, and a wide range of enhanced features.</p>
              <p>PRO+ equips your business with the tools needed to scale efficiently.</p>
              {/* <a href="#">Learn more about iCloud+ Plans and Pricing</a> */}

              <img
                src={card1}
                alt=""
                className="icloudplus-image"
              />
            </div>

            {/* RIGHT TOP */}
            <div className="icloudplus-card">
              <img src={profactory} alt="" style={{ width: "6%", height: "18%" }} />
              <h3>Pro Factory</h3>
              <p>Smarter features, smoother operations, stronger results.</p>
              <p>Upgrade to PRO and power your next stage of growth.</p>
              {/* <a href="#">Learn more about Private Relay</a> */}
            </div>

            {/* RIGHT BOTTOM */}
            <div className="icloudplus-card">
              <img src={planOptigoIcon} alt="" style={{ width: "6%", height: "18%" }} />
              <h3>Extra Ordinary Factory</h3>
              <p>Experience fully automated solutions with expert consulting. The Extraordinary Plan for businesses ready to scale without limits.</p>
              {/* <a href="#">Learn more about HomeKit Secure Video</a> */}
            </div>
          </div>
        </div>

        {/* LOWER GREY GRID */}
        <div className="icloudplus-grid bottom">
          <div className="icloudplus-card full-width" style={{ paddingBottom: "0" }}>
            <div style={{ display: "flex" }}>
              <div style={{ width: "50%", paddingRight: "6%" }}>
                <img src={branches} alt="" style={{ width: "6%", height: "10%", borderRadius: "8px" }} />
                <h3>Branches</h3>
                <p style={{ marginBottom: "3%" }}>Expand your business effortlessly—launch new branches with streamlined operations, full support, and smart automation. Grow your reach, manage seamlessly, and scale with confidence</p>
                <a href="https://www.optigoapps.com/jewellery-wholesale/solutions/multi-branch-cloud-sync/" target="_blank" rel="noreferrer">Learn more about Branches</a>
              </div>
              <div style={{ width: "40%", display: "flex", justifyContent: "end", padding: "3%" }}>
                <img
                  src={card3}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>

          <div className="icloudplus-card">
            <img src={scavu} alt="" style={{ width: "6%", height: "18%", borderRadius: "8px" }} />
            <h3>SCAVU</h3>
            <p style={{ marginBottom: "3%" }}>Seamlessly connect vendors and customers with SCAVU. When both use Optigo, enjoy instant Optigo-to-Optigo communication for faster collaboration, smoother transactions, and stronger business relationships.</p>
            <a href="https://www.optigoapps.com/apps-and-ecommerce/apps/vendor-customer-integrations/" target="_blank" rel="noreferrer">Learn more about SCAVU</a>
          </div>

          <div className="icloudplus-card">
          <img src={IntegratedE} alt="" style={{ width: "6%", height: "18%" }} />

            <h3>Integrated E-commerce</h3>
            <p style={{ marginBottom: "3%" }}>Supercharge your online sales by connecting your store with Optigo. Automate operations, reach more customers, and turn every visit into revenue in today’s fast-moving market.</p>
            <a href="https://www.optigoapps.com/apps-and-ecommerce/E-commerce/real-time-connected-b2b-ecommerce/" target="_blank" rel="noreferrer">Learn more about Integrated E-commerce</a>
          </div>
        </div>

      </div>
    </>
  );
};

export default YourPlan;
