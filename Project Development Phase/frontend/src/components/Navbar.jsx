import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/dashboard":
        return "Financial Dashboard";
      case "/settlement":
        return "Settlement Prediction";
      case "/negotiation":
        return "AI Negotiation Strategy";
      case "/rights":
        return "Know Your Rights";
      case "/history":
        return "AI Settlement History";
      case "/profile":
        return "User Profile";
      default:
        return "FinRelief AI";
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.pageTitle}>
        <span>{getPageTitle(location.pathname)}</span>
      </div>

      <div className={styles.metaInfo}>
        <div className={styles.statusIndicator}>
          <div className={styles.statusDot} />
          <span>System Secure</span>
        </div>

        {user && (
          <div className={styles.profileSummary} onClick={() => navigate("/profile")}>
            <div className={styles.avatar}>{getInitials(user.name)}</div>
            <span className={styles.name}>{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
