import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import styles from "./Login.module.css";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/users/login", { email, password });
      
      if (response.data.success) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        
        login(response.data.access_token, response.data.user, rememberMe);
        toast.success("Welcome back! Login successful.");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.detail || "Network error. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.warning("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      toast.warning("Invalid email format.");
      return;
    }

    setIsForgotLoading(true);
    // Simulate reset link dispatch
    setTimeout(() => {
      setIsForgotLoading(false);
      setShowForgotModal(false);
      setForgotEmail("");
      toast.success("Password reset instructions sent to your email.");
    }, 1500);
  };

  return (
    <div className={styles.container}>
      {/* Left Pane - Branding & Stats */}
      <div className={styles.leftPane}>
        <div className={styles.logoRow}>
          <div className={styles.logoIconSquare}>
            <div className={styles.logoBlock} />
            <div className={styles.logoBlock} />
            <div className={styles.logoBlock} />
            <div className={styles.logoBlock} />
          </div>
          <span className={styles.logoText}>FinRelief AI</span>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Take Control of Your <span className={styles.accentBlue}>Financial</span> <span className={styles.accentGreen}>Future</span>
          </h1>
          <p className={styles.heroSubtitle}>
            AI-powered debt management that helps you negotiate smarter, settle faster, and live debt-free sooner.
          </p>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>40-75%</div>
            <div className={styles.statLabel}>Settlement Range</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>AI</div>
            <div className={styles.statLabel}>Powered Strategy</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>Free</div>
            <div className={styles.statLabel}>To Get Started</div>
          </div>
        </div>
      </div>

      {/* Right Pane - Sleek Login Form */}
      <div className={styles.rightPane}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to your dashboard</p>
          </div>

          <div className={styles.tabToggle}>
            <Link to="/" className={`${styles.tabBtn} ${styles.activeTab}`}>
              Sign In
            </Link>
            <Link to="/register" className={styles.tabBtn}>
              Register
            </Link>
          </div>

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email address</label>
              <input
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                placeholder="kumarakash02401@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.optionsRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <button
                type="button"
                className={styles.forgotLink}
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? <div className={styles.spinner} /> : "Sign In →"}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Reset Password</h3>
            <p className={styles.modalText}>
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            <form onSubmit={handleForgotPassword}>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="e.g. rahul@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotEmail("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  style={{ width: "auto" }}
                  disabled={isForgotLoading}
                >
                  {isForgotLoading ? <div className={styles.spinner} /> : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}