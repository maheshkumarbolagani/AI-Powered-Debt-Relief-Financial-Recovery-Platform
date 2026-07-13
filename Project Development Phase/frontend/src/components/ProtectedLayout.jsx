import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import styles from "./ProtectedLayout.module.css";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContainer}>
        <main className={styles.contentWrapper}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
