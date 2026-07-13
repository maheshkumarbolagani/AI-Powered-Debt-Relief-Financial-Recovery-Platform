import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Heart, 
  Target, 
  FileText, 
  Scale, 
  History, 
  ChevronLeft, 
  ChevronRight, 
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/financial-health", label: "Financial Health", icon: Heart },
    { path: "/settlement", label: "Settlement Predictor", icon: Target },
    { path: "/negotiation", label: "Negotiation Email", icon: FileText },
    { path: "/rights", label: "Know Your Rights", icon: Scale },
    { path: "/history", label: "History", icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        {!isCollapsed ? (
          <div className={styles.logoRow}>
            <div className={styles.logoIconSquare}>
              <div className={styles.logoBlock} />
              <div className={styles.logoBlock} />
              <div className={styles.logoBlock} />
              <div className={styles.logoBlock} />
            </div>
            <span className={styles.logoText}>FinRelief AI</span>
          </div>
        ) : (
          <div className={styles.logoIconSquare} style={{ margin: "0 auto" }}>
            <div className={styles.logoBlock} />
            <div className={styles.logoBlock} />
            <div className={styles.logoBlock} />
            <div className={styles.logoBlock} />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className={styles.collapseButton}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className={styles.navigation}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={18} className={isActive ? styles.activeIcon : ""} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button 
          onClick={handleLogout} 
          className={`${styles.logoutButton} ${isCollapsed ? styles.logoutCollapsed : ""}`}
          title={isCollapsed ? "Sign Out" : ""}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}