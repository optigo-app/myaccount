import React from "react";

const BackToTop = ({ show, label = "Back to Overview" }) => {
  if (!show) return null;

  return (
    <div
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      style={{
        cursor: "pointer",
        marginBottom: "16px",
        fontSize: "14px",
        fontWeight: 600,
        color: "var(--primary-color)",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      ← {label}
    </div>
  );
};

export default BackToTop;
