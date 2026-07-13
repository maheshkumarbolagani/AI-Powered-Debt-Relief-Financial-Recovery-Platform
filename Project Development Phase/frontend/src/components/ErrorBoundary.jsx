import React from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#080c14",
            color: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <div
            style={{
              backgroundColor: "#0f1524",
              borderRadius: "16px",
              padding: "40px",
              maxWidth: "500px",
              width: "100%",
              textAlign: "center",
              border: "1px solid rgba(255, 23, 68, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
            }}
          >
            <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", backgroundColor: "rgba(255, 23, 68, 0.1)", marginBottom: "20px" }}>
              <AlertOctagon size={48} color="#ff1744" />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "12px" }}>Something went wrong</h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              An unexpected error occurred in the application. We've logged the details and you can try reloading the portal.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#00b0ff",
                color: "#f8fafc",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0091ea"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#00b0ff"}
            >
              <RotateCcw size={16} />
              Reset Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
