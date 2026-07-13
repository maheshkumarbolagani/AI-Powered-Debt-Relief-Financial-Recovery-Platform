import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import styles from "./Register.module.css";

export default function Register() {
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: "", color: "transparent" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 0:
      case 1:
      case 2:
        return { score, text: "Weak", color: "var(--risk-high)", width: "33%" };
      case 3:
      case 4:
        return { score, text: "Medium", color: "var(--risk-medium)", width: "66%" };
      default:
        return { score, text: "Strong", color: "var(--risk-low)", width: "100%" };
    }
  };

  const strength = calculatePasswordStrength(password);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (income === "") {
      newErrors.income = "Monthly Income is required";
    } else if (parseFloat(income) < 0 || isNaN(income)) {
      newErrors.income = "Monthly Income must be a positive number";
    }
    if (expenses === "") {
      newErrors.expenses = "Monthly Expenses is required";
    } else if (parseFloat(expenses) < 0 || isNaN(expenses)) {
      newErrors.expenses = "Monthly Expenses must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/users/register", {
        name,
        email,
        password,
        monthly_income: parseFloat(income),
        monthly_expenses: parseFloat(expenses),
      });

      if (response.data.success) {
        toast.success("Account created successfully! Please log in.");
        navigate("/");
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.detail || "Registration failed. Please check your inputs."
      );
    } finally {
      setIsLoading(false);
    }
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

      {/* Right Pane - Form details */}
      <div className={styles.rightPane}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Create Account</h2>
            <p className={styles.formSubtitle}>Set up your profile to begin recovery</p>
          </div>

          <div className={styles.tabToggle}>
            <Link to="/" className={styles.tabBtn}>
              Sign In
            </Link>
            <Link to="/register" className={`${styles.tabBtn} ${styles.activeTab}`}>
              Register
            </Link>
          </div>

          <form onSubmit={handleRegister}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                placeholder="e.g. rahul@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Monthly Income (₹)</label>
                <input
                  type="number"
                  min="0"
                  className={`${styles.input} ${errors.income ? styles.inputError : ""}`}
                  placeholder="e.g. 50000"
                  value={income}
                  onChange={(e) => {
                    setIncome(e.target.value);
                    if (errors.income) setErrors({ ...errors, income: "" });
                  }}
                />
                {errors.income && <span className={styles.errorText}>{errors.income}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Monthly Expenses (₹)</label>
                <input
                  type="number"
                  min="0"
                  className={`${styles.input} ${errors.expenses ? styles.inputError : ""}`}
                  placeholder="e.g. 20000"
                  value={expenses}
                  onChange={(e) => {
                    setExpenses(e.target.value);
                    if (errors.expenses) setErrors({ ...errors, expenses: "" });
                  }}
                />
                {errors.expenses && <span className={styles.errorText}>{errors.expenses}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                  placeholder="Min 6 characters"
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
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && (
                <>
                  <div className={styles.passwordMeter}>
                    <div
                      className={styles.passwordMeterBar}
                      style={{
                        width: strength.width,
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                  <span className={styles.passwordStrengthText} style={{ color: strength.color }}>
                    Password Strength: {strength.text}
                  </span>
                </>
              )}
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                  placeholder="Match password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? <div className={styles.spinner} /> : "Create Account →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
