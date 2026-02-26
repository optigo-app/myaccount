import React, { useState, useEffect } from "react";
import "./Settings.scss";
import ResetAccount from "./settings-navbar/ResetAccount";
import Profile from "./settings-navbar/Profile";
import IPSecurity from "./settings-navbar/IPSecurity";
import { getCloudStorageData, getMyAccountInfo } from "../../../api/myAccountApi";
import { updateProfile } from "../../../api/myAccountApi";
import toast from "react-hot-toast";
import { useMinDelay } from "../../../hooks/useMinDelay";
import AppLoader from "../../../components/loaders/Loader";

const DrawerInput = React.memo(function DrawerInput({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="drawer-input">
      <label>{label}</label>
      <input
        value={value}
        onChange={(e) =>
          onChange(prev => ({ ...prev, [name]: e.target.value }))
        }
      />
    </div>
  );
});

const Settings = ({ clientIp, LUId }) => {
  const [active, setActive] = useState("profile");
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [settingsResponse, setSettingsResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerForm, setDrawerForm] = useState({
    cmpname: "",
    firstname: "",
    lastname: "",
    email1: "",
    mobileno: "",
    officeno: "",
    addresslin1: "",
    addresslin2: "",
    cmpinfo_state: "",
    cmpinfo_city: "",
    cmpinfo_postalcode: "",
    curid: 1,
    curname: "INR",
  });
  const minDelayDone = useMinDelay(500);
  const [storageData, setStorageData] = useState(null);
  const StorageTotals = storageData?.rd1?.[0];

  useEffect(() => {
    if (!clientIp || !LUId) return;
    setLoading(true);
    getMyAccountInfo(clientIp, LUId)
      .then(res => {
        setSettingsResponse(res.Data);
      })
      .catch(err => {
        console.error("Settings API error:", err.message);
      })
      .finally(() => setLoading(false));
  }, [clientIp, LUId]);

  useEffect(() => {
    if (!clientIp || !LUId) return;
    setLoading(true);

    getCloudStorageData(clientIp, LUId)
      .then(res => {
        setStorageData(res.Data);
      })
      .catch(err => {
        console.error("CloudStorage API error:", err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clientIp, LUId]);

  const profileData = settingsResponse?.rd?.[0];
  useEffect(() => {
    if (!profileData) return;
    setDrawerForm({
      cmpname: profileData?.cmpinfo_companyname || "",
      firstname: profileData?.basicinfo_firstname || "",
      lastname: profileData?.basicinfo_lastname || "",
      email1: profileData?.basicinfo_email || "",
      mobileno: profileData?.basicinfo_mobileno || "",
      officeno: profileData?.cmpinfo_officeph || "",
      addresslin1: profileData?.cmpinfo_addressline1 || "",
      addresslin2: profileData?.cmpinfo_addressline2 || "",
      cmpinfo_state: profileData?.cmpinfo_state || "",
      cmpinfo_city: profileData?.cmpinfo_city || "",
      cmpinfo_postalcode: profileData?.cmpinfo_postalcode || "",
      curid: profileData?.Country_CurrencyCodeID || 1,
      curname: profileData?.Country_CurrencyCode || "INR",
    });
  }, [profileData, openEditProfile]);

  const handleSaveProfile = async () => {
    const body = {
      con: JSON.stringify({
        mode: "updateProfileInfo",
        appuserid: LUId,
        IPAddress: clientIp,
      }),
      p: JSON.stringify(drawerForm),
      f: "MyAccount ( gettoken )",
    };

    try {
      await updateProfile(body);
      toast.success("Profile updated successfully");
      await fetchSettingsData();
      setOpenEditProfile(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };


  const settingData = settingsResponse?.rd1?.[0];
  const ipSecurityData = settingsResponse?.rd2;
  const fetchSettingsData = () => {
    if (!clientIp || !LUId) return;

    getMyAccountInfo(clientIp, LUId)
      .then(res => {
        setSettingsResponse(res.Data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchSettingsData();
  }, [clientIp, LUId]);

  const NavItem = ({ label, active, onClick, variant }) => (
    <div
      className={`settings-nav-item 
          ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </div>
  );

  if (loading || !minDelayDone) {
    return <AppLoader text="Loading..." />;
  }
  if (!settingsResponse) return null;


  return (
    <div className="settings-wrapper-first">
      <div className="settings-head">
        <h1 style={{ marginBottom: "6px", fontSize: "38px" }}>
          User & Security
        </h1>
      </div>

      <div className="settings-main">
        <div className="settings-nav">
          <div className="icloud-card">
            <div className="icloud-card-content">
              <div className="icloud-logo">{settingData?.UFCC}</div>

              <div className="icloud-links">
                <span>Pro Factory</span>
                <span>Storage</span>
              </div>
              <div className="icloud-badge">
                {(Number(StorageTotals?.TotalDataStorage || 0) +
                  Number(StorageTotals?.TotalFilStorage || 0))?.toFixed(2)} GB
              </div>
            </div>
          </div>
          <NavItem label="Profile" active={active === "profile"} onClick={() => setActive("profile")} />
          <NavItem label="IP Security" active={active === "ip"} onClick={() => setActive("ip")} />
          <NavItem label="Reset Account" active={active === "reset"} onClick={() => setActive("reset")} variant="danger" />
        </div>

        <div className="settings-divider" />

        {/* RIGHT CONTENT */}
        <div className="settings-content">
          {active === "profile" && (
            <Profile
              setOpenEditProfile={setOpenEditProfile}
              profileData={profileData}
              clientIp={clientIp}
              LUId={LUId}
            />
          )}
          {active === "ip" && (
            <IPSecurity
              ipData={ipSecurityData}
              onRefresh={fetchSettingsData}
              clientIp={clientIp}
              LUId={LUId}
              refresh={fetchSettingsData}
            />
          )}
          {active === "reset" && <ResetAccount />}
        </div>

        {openEditProfile && (
          <>
            {/* OVERLAY */}
            <div
              className="drawer-overlay"
              onClick={() => setOpenEditProfile(false)}
            />

            {/* DRAWER */}
            <div className="drawer drawer-open">
              <div className="drawer-header">
                <h3>Update Profile</h3>
                <button
                  className="drawer-close"
                  onClick={() => setOpenEditProfile(false)}
                >
                  ✕
                </button>
              </div>

              <div className="drawer-body">
                <DrawerInput
                  label="First Name"
                  name="firstname"
                  value={drawerForm.firstname}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="Last Name"
                  name="lastname"
                  value={drawerForm.lastname}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="Company"
                  name="cmpname"
                  value={drawerForm.cmpname}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="Email"
                  name="email1"
                  value={drawerForm.email1}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="Mobile No"
                  name="mobileno"
                  value={drawerForm.mobileno}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="Office No"
                  name="officeno"
                  value={drawerForm.officeno}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="Address1"
                  name="addresslin1"
                  value={drawerForm.addresslin1}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="Address2"
                  name="addresslin2"
                  value={drawerForm.addresslin2}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="State"
                  name="cmpinfo_state"
                  value={drawerForm.cmpinfo_state}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="Zip"
                  name="cmpinfo_postalcode"
                  value={drawerForm.cmpinfo_postalcode}
                  onChange={setDrawerForm}
                />
                <DrawerInput
                  label="Default Currency"
                  name="curname"
                  value={drawerForm.curname}
                  onChange={setDrawerForm}
                />

                <button
                  className="drawer-save-btn"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

};

export default Settings;