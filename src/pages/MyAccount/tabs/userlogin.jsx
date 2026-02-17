import React, { useState } from "react";
import { userLoginData } from "../../../data/data";

const UserLogin = () => {
  const [activeView, setActiveView] = useState("access");
  const { clientInfo, loginAccess, userLogs, ipRequests } = userLoginData;

  return (
    <div
      style={{
        display: "flex",
        gap: "32px",
        minHeight: "70vh",
      }}
    >
      {/* LEFT COLUMN */}
      <div style={{ width: "35%", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* COMPANY NAME */}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--primary-color)",
            letterSpacing: "0.4px",
          }}
        >
          {clientInfo.name}
        </h2>

        {/* CURRENT PLAN CARD */}
        <div
          style={{
            padding: "22px",
            paddingBottom: "22px",
            marginBottom: "50px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #f1efff 0%, #ffffff 55%)",
            border: "1px solid rgba(115,103,240,0.45)",
            boxShadow: "0 14px 36px rgba(115,103,240,0.25)",
            position: "relative",
          }}
        >
          {/* BADGE */}
          <span
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              padding: "6px 12px",
              borderRadius: "14px",
              fontSize: "12px",
              fontWeight: 600,
              background: "var(--primary-gradient)",
              color: "#fff",
            }}
          >
            Current Plan
          </span>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            {clientInfo.currentPlan} Plan
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              marginBottom: "6px",
            }}
          >
            Valid till {clientInfo.validTill}
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Users Allowed: {clientInfo.users}
          </div>
        </div>


        {/* MENU */}
        <MenuItem
          label="Login Access"
          active={activeView === "access"}
          onClick={() => setActiveView("access")}
        />
        <MenuItem
          label="User Log"
          active={activeView === "log"}
          onClick={() => setActiveView("log")}
        />
        <MenuItem
          label="IP Request"
          active={activeView === "ip"}
          onClick={() => setActiveView("ip")}
        />
      </div>

      {/* VERTICAL DIVIDER */}
      <div
        style={{
          width: "1px",
          background: "var(--border-light)",
        }}
      />

      {/* RIGHT COLUMN */}
      <div style={{ width: "65%" }}>
        {activeView === "access" && <LoginAccess data={loginAccess} />}
        {activeView === "log" && <UserLog data={userLogs} />}
        {activeView === "ip" && <IPRequest data={ipRequests} />}
      </div>
    </div>
  );
};

/* ================= MENU ================= */

const MenuItem = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: "14px 16px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: 600,
      background: active ? "var(--primary-gradient)" : "#fff",
      color: active ? "#fff" : "var(--text-secondary)",
      border: "1px solid var(--border-light)",
    }}
  >
    {label}
  </div>
);

/* ================= LOGIN ACCESS ================= */

const LoginAccess = ({ data }) => (
  <div>
    <h3 style={{ marginBottom: "16px" }}>Login Access</h3>

    {data.map((user) => (
      <SimpleCard key={user.userId}>
        <strong>{user.name}</strong>
        <div>{user.userId}</div>

        <StatusLine label="Active" value={user.isActive} />
        <StatusLine label="Roaming" value={user.isRoaming} />
        <StatusLine label="Logged In" value={user.isLoggedIn} />
      </SimpleCard>
    ))}
  </div>
);

/* ================= USER LOG ================= */

const UserLog = ({ data }) => (
  <div>
    <h3 style={{ marginBottom: "16px" }}>User Log</h3>

    {data.map((log, i) => (
      <SimpleCard key={i}>
        <strong>{log.name}</strong>
        <div>Login: {log.login}</div>
        <div>Logout: {log.logout}</div>
        <div>Action: {log.event}</div>
      </SimpleCard>
    ))}
  </div>
);

/* ================= IP REQUEST ================= */

const IPRequest = ({ data }) => (
  <div>
    <h3 style={{ marginBottom: "12px" }}>IP Request</h3>

    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px" }}>
      When a user tries to access the system from a new location, an IP request is generated.
      Admin approval is required to allow roaming access.
    </p>

    <ol style={{ fontSize: "14px", marginBottom: "20px" }}>
      <li>User logs in from a new IP</li>
      <li>Request is sent to admin</li>
      <li>Admin approves or rejects</li>
    </ol>

    {data.map((req, i) => (
      <SimpleCard key={i}>
        <strong>{req.requestedBy}</strong>
        <div>IP: {req.ip}</div>
        <div>Date: {req.requestDate}</div>
        <div>Status: {req.approved ? "Approved" : "Pending"}</div>
      </SimpleCard>
    ))}
  </div>
);

/* ================= SHARED ================= */

const SimpleCard = ({ children }) => (
  <div
    style={{
      padding: "16px",
      borderRadius: "14px",
      border: "1px solid var(--border-light)",
      background: "#fff",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      marginBottom: "14px",
    }}
  >
    {children}
  </div>
);

const StatusLine = ({ label, value }) => (
  <div style={{ fontSize: "14px" }}>
    {label}:{" "}
    <strong style={{ color: value ? "green" : "gray" }}>
      {value ? "Yes" : "No"}
    </strong>
  </div>
);

export default UserLogin;
