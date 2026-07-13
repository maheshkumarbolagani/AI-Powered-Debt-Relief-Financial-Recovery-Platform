import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import styles from "./Toast.module.css";

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Automatically remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((msg) => addToast(msg, "success"), [addToast]);
  const error = useCallback((msg) => addToast(msg, "error"), [addToast]);
  const warning = useCallback((msg) => addToast(msg, "warning"), [addToast]);
  const info = useCallback((msg) => addToast(msg, "info"), [addToast]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} color="var(--accent-primary)" />;
      case "error":
        return <XCircle size={18} color="var(--risk-high)" />;
      case "warning":
        return <AlertTriangle size={18} color="var(--risk-medium)" />;
      default:
        return <Info size={18} color="var(--accent-secondary)" />;
    }
  };

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <div className={styles.container}>
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
            <span className={styles.icon}>{getIcon(t.type)}</span>
            <span className={styles.message}>{t.message}</span>
            <button className={styles.closeButton} onClick={() => removeToast(t.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
