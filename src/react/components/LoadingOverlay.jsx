import React from "react";

const LoadingOverlay = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div id="loading">
      <div className="loading-indicator">
        <div className="progress progress-striped active">
          <div className="progress-bar progress-bar-info progress-bar-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
