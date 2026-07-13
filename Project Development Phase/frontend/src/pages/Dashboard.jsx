import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  Activity, 
  RefreshCw,
  Coins
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { CardSkeleton } from "../components/Skeleton";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loans, setLoans] = useState([]);

  // Add Loan Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lenderName, setLenderName] = useState("");
  const [loanType, setLoanType] = useState("Personal Loan");
  const [loanAmount, setLoanAmount] = useState("");
  const [outstandingAmount, setOutstandingAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [emi, setEmi] = useState("");
  const [overdueMonths, setOverdueMonths] = useState("0");
  const [dueDate, setDueDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      // Fetch summary and predictions in parallel
      const [summaryRes, settlementRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/settlement/predict")
      ]);

      if (summaryRes.data.success) {
        setSummary(summaryRes.data);
      } else {
        setHasError(true);
      }

      if (settlementRes.data.success) {
        setLoans(settlementRes.data.settlement_prediction || []);
      } else {
        setLoans([]);
      }
    } catch (error) {
      console.error(error);
      setHasError(true);
      toast.error("Failed to sync financial dashboard metrics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAddLoan = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      toast.error("User session not found.");
      return;
    }

    // Comprehensive inline validation
    const errors = {};
    if (!lenderName || !lenderName.trim()) {
      errors.lenderName = "Lender name cannot be empty.";
    }
    const amt = parseFloat(loanAmount);
    if (!loanAmount || isNaN(amt) || amt <= 0) {
      errors.loanAmount = "Loan amount must be greater than 0.";
    }
    const outAmt = parseFloat(outstandingAmount);
    if (!outstandingAmount || isNaN(outAmt) || outAmt <= 0) {
      errors.outstandingAmount = "Outstanding amount must be greater than 0.";
    }
    const rate = parseFloat(interestRate);
    if (!interestRate || isNaN(rate) || rate < 0 || rate > 100) {
      errors.interestRate = "Interest rate must be between 0 and 100.";
    }
    const emiVal = parseFloat(emi);
    if (!emi || isNaN(emiVal) || emiVal <= 0) {
      errors.emi = "EMI must be greater than 0.";
    }
    const overdue = parseInt(overdueMonths);
    if (overdueMonths !== "" && (isNaN(overdue) || overdue < 0)) {
      errors.overdueMonths = "Overdue months cannot be negative.";
    }
    const todayStr = new Date().toISOString().split("T")[0];
    if (!dueDate) {
      errors.dueDate = "Due date is required.";
    } else if (dueDate < todayStr) {
      errors.dueDate = "Due date cannot be in the past.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.warning("Please fix the validation errors in the form.");
      return;
    }

    setValidationErrors({});
    setIsSaving(true);
    try {
      const payload = {
        lender_name: lenderName.trim(),
        loan_type: loanType,
        loan_amount: amt,
        outstanding_amount: outAmt,
        interest_rate: rate,
        emi: emiVal,
        overdue_months: parseInt(overdueMonths) || 0,
        due_date: dueDate
      };

      const response = await api.post(`/loans/add?user_id=${user.id}`, payload);
      if (response.data.success) {
        toast.success("New loan profile registered.");
        setIsModalOpen(false);
        // Reset form
        setLenderName("");
        setLoanType("Personal Loan");
        setLoanAmount("");
        setOutstandingAmount("");
        setInterestRate("");
        setEmi("");
        setOverdueMonths("0");
        setDueDate("");
        setValidationErrors({});
        // Refresh data
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to add loan.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not register loan portfolio details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (!window.confirm("Are you sure you want to remove this loan from your portfolio?")) return;

    try {
      const response = await api.delete(`/loans/${loanId}`);
      if (response.data.success) {
        toast.success("Loan profile removed.");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete loan.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error communicating with loan backend.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.grid}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (hasError || !summary) {
    return (
      <div className={styles.emptyState}>
        <AlertCircle size={48} color="var(--risk-high)" />
        <h3 className={styles.emptyTitle}>Dashboard Sync Failed</h3>
        <p className={styles.emptyText}>
          We couldn't connect to the core billing systems. Please make sure the backend is active.
        </p>
        <button onClick={fetchData} className={styles.emptyButton} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <RefreshCw size={16} />
          Retry Connection
        </button>
      </div>
    );
  }

  // Derived financial parameters
  const surplus = summary.monthly_income - summary.monthly_expenses - summary.monthly_emi;
  
  // Stress level: Ratio of EMI + Expenses to income
  const stressLevel = summary.monthly_income > 0 
    ? Math.min(100, Math.max(0, ((summary.monthly_emi + summary.monthly_expenses) / summary.monthly_income) * 100))
    : 100;

  const emiRatio = summary.monthly_income > 0 ? (summary.monthly_emi / summary.monthly_income) * 100 : 0;

  const getStressDetails = (pct) => {
    if (pct >= 75) return <span className={`${styles.stressBadge} ${styles.stressBadgeHigh}`}>● HIGH</span>;
    if (pct >= 45) return <span className={`${styles.stressBadge} ${styles.stressBadgeMedium}`}>● MEDIUM</span>;
    return <span className={`${styles.stressBadge} ${styles.stressBadgeLow}`}>● LOW</span>;
  };

  const getPriorityBadge = (category) => {
    switch (category) {
      case "High":
        return <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>HIGH</span>;
      case "Medium":
        return <span className={`${styles.priorityBadge} ${styles.priorityMedium}`}>MEDIUM</span>;
      default:
        return <span className={`${styles.priorityBadge} ${styles.priorityLow}`}>LOW</span>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Block */}
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome, {user?.name || "User"}</h1>
        <p className={styles.subtitle}>Your financial snapshot at a glance</p>
      </div>

      {/* Metrics Row (5 Cards) */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.cardHeader}>Monthly Surplus</span>
          <span className={`${styles.cardValue} ${surplus >= 0 ? styles.cardValuePositive : styles.cardValueNegative}`}>
            {surplus < 0 ? "-" : ""}₹{Math.abs(surplus).toLocaleString("en-IN")}
          </span>
          <span className={styles.cardFooter}>After all expenses</span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardHeader}>Total Outstanding</span>
          <span className={styles.cardValue} style={{ color: "#00b0ff" }}>
            ₹{summary.outstanding_debt.toLocaleString("en-IN")}
          </span>
          <span className={styles.cardFooter}>{summary.total_loans} active loans</span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardHeader}>Total EMI</span>
          <span className={styles.cardValue} style={{ color: "#a855f7" }}>
            ₹{summary.monthly_emi.toLocaleString("en-IN")}
          </span>
          <span className={styles.cardFooter}>{emiRatio.toFixed(1)}% of Income</span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardHeader}>Debt-to-Income</span>
          <span className={styles.cardValue}>
            {summary.monthly_income > 0 
              ? ((summary.outstanding_debt / (summary.monthly_income * 12)) * 100).toFixed(1) 
              : "0.0"}%
          </span>
          <span className={styles.cardFooter}>Ratio</span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardHeader}>Stress Level</span>
          <div className={styles.cardValue} style={{ margin: "6px 0 10px" }}>
            {getStressDetails(stressLevel)}
          </div>
          <span className={styles.cardFooter}>Financial stress index</span>
        </div>
      </div>

      {/* Financial Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileCardHeader}>
          <div>
            <h2 className={styles.profileTitle}>Financial Profile</h2>
            <p className={styles.profileSubtitle}>Your income and expense baseline</p>
          </div>
          <button className={styles.editBtn} onClick={() => navigate("/profile")}>
            <span style={{ fontSize: "14px", marginRight: "2px" }}>✏️</span> Edit Profile
          </button>
        </div>

        <div className={styles.profileGrid}>
          <div className={styles.profileCol}>
            <div className={styles.profileItem}>
              <div className={styles.profileItemIcon} style={{ color: "#00e676" }}>
                <Wallet size={16} />
              </div>
              <div className={styles.profileItemDetails}>
                <span className={styles.profileItemLabel}>Monthly Income</span>
                <span className={styles.profileItemValue}>₹{(summary.monthly_income || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className={styles.profileItem}>
              <div className={styles.profileItemIcon} style={{ color: "#a855f7" }}>
                <Coins size={16} />
              </div>
              <div className={styles.profileItemDetails}>
                <span className={styles.profileItemLabel}>Lump Sum Available</span>
                <span className={styles.profileItemValue}>₹0</span>
              </div>
            </div>
          </div>

          <div className={styles.profileCol}>
            <div className={styles.profileItem}>
              <div className={styles.profileItemIcon} style={{ color: "#ff9100" }}>
                <DollarSign size={16} />
              </div>
              <div className={styles.profileItemDetails}>
                <span className={styles.profileItemLabel}>Monthly Expenses</span>
                <span className={styles.profileItemValue}>₹{(summary.monthly_expenses || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loans Section */}
      <div className={styles.loansSection}>
        <div className={styles.loansHeader}>
          <div className={styles.loansTitleBlock}>
            <h2 className={styles.profileTitle}>Active Loans</h2>
            <p className={styles.profileSubtitle}>Manage your debt portfolio</p>
          </div>
          <button className={styles.addLoanBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Loan
          </button>
        </div>

        <div className={styles.tableContainer}>
          {loans.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={32} color="var(--text-muted)" style={{ marginBottom: "10px" }} />
              <h3 className={styles.emptyTitle}>No loans added yet</h3>
              <p className={styles.emptyText}>Add your overdue liabilities to evaluate strategies.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Lender</th>
                  <th>Type</th>
                  <th>Outstanding</th>
                  <th>Interest</th>
                  <th>EMI</th>
                  <th>Overdue</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td style={{ fontWeight: "600" }}>{loan.lender_name}</td>
                    <td>
                      <span className={styles.loanTypeBadge}>{loan.loan_type}</span>
                    </td>
                    <td>₹{loan.outstanding_amount.toLocaleString("en-IN")}</td>
                    <td>{loan.interest_rate}%</td>
                    <td>₹{loan.emi.toLocaleString("en-IN")}</td>
                    <td style={{ color: loan.overdue_months > 0 ? "var(--risk-high)" : "inherit" }}>
                      {loan.overdue_months} mo.
                    </td>
                    <td>{getPriorityBadge(loan.risk_category)}</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteLoan(loan.loan_id)} 
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Loan Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Add Loan Details</h3>
            <form onSubmit={handleAddLoan} className={styles.modalForm}>
              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>Lender Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. KISHT"
                    className={validationErrors.lenderName ? styles.inputError : ""}
                    value={lenderName}
                    onChange={(e) => {
                      setLenderName(e.target.value);
                      if (validationErrors.lenderName) setValidationErrors(prev => ({ ...prev, lenderName: "" }));
                    }}
                  />
                  {validationErrors.lenderName && <span className={styles.errorText}>{validationErrors.lenderName}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Loan Type *</label>
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="NBFC">NBFC</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>Loan Amount *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="e.g. 200000"
                    className={validationErrors.loanAmount ? styles.inputError : ""}
                    value={loanAmount}
                    onChange={(e) => {
                      setLoanAmount(e.target.value);
                      if (validationErrors.loanAmount) setValidationErrors(prev => ({ ...prev, loanAmount: "" }));
                    }}
                  />
                  {validationErrors.loanAmount && <span className={styles.errorText}>{validationErrors.loanAmount}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Outstanding Amount *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="e.g. 188888"
                    className={validationErrors.outstandingAmount ? styles.inputError : ""}
                    value={outstandingAmount}
                    onChange={(e) => {
                      setOutstandingAmount(e.target.value);
                      if (validationErrors.outstandingAmount) setValidationErrors(prev => ({ ...prev, outstandingAmount: "" }));
                    }}
                  />
                  {validationErrors.outstandingAmount && <span className={styles.errorText}>{validationErrors.outstandingAmount}</span>}
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>Interest Rate (% annual) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="e.g. 14.5"
                    className={validationErrors.interestRate ? styles.inputError : ""}
                    value={interestRate}
                    onChange={(e) => {
                      setInterestRate(e.target.value);
                      if (validationErrors.interestRate) setValidationErrors(prev => ({ ...prev, interestRate: "" }));
                    }}
                  />
                  {validationErrors.interestRate && <span className={styles.errorText}>{validationErrors.interestRate}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Monthly EMI *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="e.g. 18988"
                    className={validationErrors.emi ? styles.inputError : ""}
                    value={emi}
                    onChange={(e) => {
                      setEmi(e.target.value);
                      if (validationErrors.emi) setValidationErrors(prev => ({ ...prev, emi: "" }));
                    }}
                  />
                  {validationErrors.emi && <span className={styles.errorText}>{validationErrors.emi}</span>}
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>Overdue Months</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    className={validationErrors.overdueMonths ? styles.inputError : ""}
                    value={overdueMonths}
                    onChange={(e) => {
                      setOverdueMonths(e.target.value);
                      if (validationErrors.overdueMonths) setValidationErrors(prev => ({ ...prev, overdueMonths: "" }));
                    }}
                  />
                  {validationErrors.overdueMonths && <span className={styles.errorText}>{validationErrors.overdueMonths}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Due Date *</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className={validationErrors.dueDate ? styles.inputError : ""}
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      if (validationErrors.dueDate) setValidationErrors(prev => ({ ...prev, dueDate: "" }));
                    }}
                  />
                  {validationErrors.dueDate && <span className={styles.errorText}>{validationErrors.dueDate}</span>}
                </div>
              </div>

              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => { setIsModalOpen(false); setValidationErrors({}); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Add Loan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}