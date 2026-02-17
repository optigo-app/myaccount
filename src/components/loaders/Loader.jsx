import React from "react";
import "./Loader.css";

const AppLoader = ({ text = "Preparing your workspace…" }) => {
  return (
    <div className="app-loader">
      <div className="spinner" />
      <div className="loader-text">{text}</div>
    </div>
  );
};

export default AppLoader;
