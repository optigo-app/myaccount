import React from "react";
import { changeHistoryData } from "../../../data/data";

const ChangeHistory = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
    <div
      style={{
        width: "80%",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        // padding: "40px 6%",
      }}
    >
      {/* ================= HEADER ================= */}
      <div>
        <h1 style={{ marginBottom: "6px", fontSize: "38px" }}>
          Change History
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "18px",
          }}
        >
          Track important updates made to your account and subscription
        </p>
      </div>

      {/* ================= LIST ================= */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {changeHistoryData.map((item, index) => (
          <HistoryCard key={index} item={item} />
        ))}
      </div>
    </div>
    </div>
  );
};

/* ================= CARD ================= */

const HistoryCard = ({ item }) => {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "16px",
        padding: "22px 32px",
        border: "1px solid var(--border-light)",
        display: "flex",
        gap: "18px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
      }}
    >
      {/* LEFT COLOR BAR */}
      <div
        style={{
          width: "6px",
          borderRadius: "6px",
          background: "#0071e3",
        }}
      />

      {/* CONTENT */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            marginBottom: "6px",
          }}
        >
          {item.date}
        </div>

        <div
          style={{
            fontWeight: 600,
            fontSize: "18px",
            marginBottom: "6px",
          }}
        >
          {item.action}
        </div>

        <div
          style={{
            fontSize: "18px",
            color: "var(--text-secondary)",
            lineHeight: "1.6",
          }}
        >
          {item.details}
        </div>
      </div>
    </div>
  );
};

export default ChangeHistory;
