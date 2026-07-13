import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, updateProfileState } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with context values
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setIncome(user.monthly_income !== undefined ? user.monthly_income.toString() : "0");
      setExpenses(user.monthly_expenses !== undefined ? user.monthly_expenses.toString() : "0");
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (income === "") {
      newErrors.income = "Income is required";
    } else if (parseFloat(income) < 0 || isNaN(income)) {
      newErrors.income = "Income must be a positive number";
    }
    if (expenses === "") {
      newErrors.expenses = "Expenses is required";
    } else if (parseFloat(expenses) < 0 || isNaN(expenses)) {
      newErrors.expenses = "Expenses must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await api.put("/users/update-profile", {
        name,
        email,
        monthly_income: parseFloat(income),
        monthly_expenses: parseFloat(expenses),
      });

      if (response.data.success) {
        updateProfileState(response.data.user);
        toast.success("Profile updated successfully.");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.detail || "An error occurred while updating your profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Profile Management</h2>
          <p className={styles.subtitle}>Update your identity and financial capacity metrics</p>
        </div>

        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
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
                value={expenses}
                onChange={(e) => {
                  setExpenses(e.target.value);
                  if (errors.expenses) setErrors({ ...errors, expenses: "" });
                }}
              />
              {errors.expenses && <span className={styles.errorText}>{errors.expenses}</span>}
            </div>
          </div>

          <button type="submit" className={styles.saveButton} disabled={isLoading}>
            {isLoading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
