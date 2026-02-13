import React from "react";
import { ProgressBar } from "react-bootstrap";
import "./LoadingOverlay.css";

const LoadingOverlay = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div id="loading">
      <div className="loading-indicator">
        <ProgressBar animated now={100} variant="info" className="progress-bar-full" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
