import React from "react";
import { Alert } from "react-bootstrap";

import { logClientError } from "@/utils/errorLogging";

class ModalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error, info) {
    logClientError(`modal.render.${this.props.name || "unknown"}`, error, {
      componentStack: info?.componentStack
    });
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && this.props.resetKey !== prevProps.resetKey) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      const label = this.props.label || "dialog";
      return (
        <Alert className="fishfry-error" variant="danger">
          Unable to render the {label}. Please close and reopen it.
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ModalErrorBoundary;
