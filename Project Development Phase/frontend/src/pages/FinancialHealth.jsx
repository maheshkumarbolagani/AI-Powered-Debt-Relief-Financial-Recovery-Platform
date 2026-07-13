import React, { useEffect, useState } from "react";
import { 
  Heart, 
  TrendingDown, 
  Home, 
  AlertCircle, 
  Activity,
  Sparkles,
  RefreshCw
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { CardSkeleton } from "../components/Skeleton";
import styles from "./FinancialHealth.module.css";

export default function FinancialHealth() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [summary, setSummary] = useState(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await api.get("/dashboard/summary");
      if (response.data.success) {
        setSummary(response.data);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error(error);
      setHasError(true);
      toast.error("Failed to load financial health analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (hasError || !summary) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "60px 20px" }}>
        <AlertCircle size={48} color="var(--risk-high)" style={{ margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Analysis Failed</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
          We could not calculate your financial stress indices at this time.
        </p>
        <button onClick={fetchSummary} className={styles.emptyButton} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <RefreshCw size={16} />
          Retry Calculation
        </button>
      </div>
    );
  }

  // Calculations
  const monthlyIncome = summary.monthly_income || 0;
  const monthlyExpenses = summary.monthly_expenses || 0;
  const monthlyEMI = summary.monthly_emi || 0;
  const surplus = monthlyIncome - monthlyExpenses - monthlyEMI;

  // Stress Level (DTI + expenses weight)
  const stressLevel = monthlyIncome > 0 
    ? Math.min(100, Math.max(0, ((monthlyEMI + monthlyExpenses) / monthlyIncome) * 100))
    : 100;

  // EMI to Income ratio
  const emiRatio = monthlyIncome > 0 ? (monthlyEMI / monthlyIncome) * 100 : 0;

  // Debt to Income ratio (outstanding debt / (monthly income * 12))
  const dtiRatio = monthlyIncome > 0 ? (summary.outstanding_debt / (monthlyIncome * 12)) * 100 : 0;

  const getStressCategory = (pct) => {
    if (pct >= 75) return { text: "High", badgeClass: styles.badgeHigh, desc: "High stress. Immediate debt intervention required." };
    if (pct >= 45) return { text: "Medium", badgeClass: styles.badgeMedium, desc: "Moderate stress. Consider budgeting or settlement options." };
    return { text: "Low", badgeClass: styles.badgeLow, desc: "Low stress. You're managing debt well." };
  };

  const stressStatus = getStressCategory(stressLevel);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Heart size={24} color="#00e676" fill="#00e676" style={{ marginRight: "2px" }} />
          Financial Health
        </h1>
        <p className={styles.subtitle}>Detailed analysis of your debt stress and repayment capacity</p>
      </div>

      {/* Stress Card */}
      <div className={styles.stressCard}>
        <div>
          <div className={styles.stressTitle}>Overall Financial Stress</div>
          <div className={styles.stressDesc}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: stressLevel >= 75 ? "#ef4444" : stressLevel >= 45 ? "#f59e0b" : "#10b981" }} />
            {stressStatus.desc}
          </div>
        </div>
        <span className={`${styles.badge} ${stressStatus.badgeClass}`}>
          {stressStatus.text}
        </span>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>MONTHLY INCOME</div>
          <div className={styles.metricValue}>₹{monthlyIncome.toLocaleString("en-IN")}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>MONTHLY EXPENSES</div>
          <div className={styles.metricValue}>₹{monthlyExpenses.toLocaleString("en-IN")}</div>
        </div>
        <div className={styles.metricCard} style={{ borderLeft: surplus < 0 ? "2px solid #ef4444" : "1px solid rgba(255,255,255,0.05)" }}>
          <div className={styles.metricLabel}>MONTHLY SURPLUS</div>
          <div className={styles.metricValue} style={{ color: surplus >= 0 ? "#10b981" : "#ef4444" }}>
            ₹{surplus.toLocaleString("en-IN")}
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>LUMP SUM AVAILABLE</div>
          <div className={styles.metricValue}>₹0</div>
        </div>
      </div>

      {/* Ratios Grid */}
      <div className={styles.ratiosGrid}>
        <div className={styles.ratioCard}>
          <div className={styles.ratioHeader}>
            <span className={styles.ratioTitle}>EMI-to-Income Ratio</span>
            <span className={styles.ratioValue}>{emiRatio.toFixed(1)}%</span>
          </div>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ 
                width: `${Math.min(100, emiRatio)}%`, 
                backgroundColor: emiRatio >= 45 ? "#ef4444" : emiRatio >= 30 ? "#f59e0b" : "#10b981" 
              }} 
            />
          </div>
          <div className={styles.ratioSubtext}>
            Ideal: Below 30% | Yours: {emiRatio.toFixed(1)}% - {emiRatio <= 30 ? "Healthy range" : emiRatio <= 45 ? "Moderate range" : "Critical range"}
          </div>
        </div>

        <div className={styles.ratioCard}>
          <div className={styles.ratioHeader}>
            <span className={styles.ratioTitle}>Debt-to-Income Ratio</span>
            <span className={styles.ratioValue}>{dtiRatio.toFixed(1)}%</span>
          </div>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ 
                width: `${Math.min(100, dtiRatio)}%`, 
                backgroundColor: dtiRatio >= 50 ? "#ef4444" : dtiRatio >= 35 ? "#f59e0b" : "#10b981" 
              }} 
            />
          </div>
          <div className={styles.ratioSubtext}>
            Ideal: Below 50% | Yours: {dtiRatio.toFixed(1)}% - {dtiRatio <= 50 ? "Manageable range" : "High leverage"}
          </div>
        </div>
      </div>

      {/* Improvement Tips */}
      <div className={styles.tipsCard}>
        <div className={styles.tipsTitle}>
          <Sparkles size={16} color="#3b82f6" />
          Improvement Tips
        </div>
        <div className={styles.tipsSubtitle}>Based on your financial profile</div>
        
        <div className={styles.tipsGrid}>
          <div className={styles.tipItem}>
            <div className={styles.tipIcon}>
              <TrendingDown size={18} />
            </div>
            <span className={styles.tipText}>Reduce discretionary spending to increase surplus</span>
          </div>

          <div className={styles.tipItem}>
            <div className={styles.tipIcon}>
              <Home size={18} />
            </div>
            <span className={styles.tipText}>Contact lenders for EMI restructuring options</span>
          </div>

          <div className={styles.tipItem}>
            <div className={styles.tipIcon}>
              <AlertCircle size={18} />
            </div>
            <span className={styles.tipText}>Use lump sum for highest-interest loan first</span>
          </div>

          <div className={styles.tipItem}>
            <div className={styles.tipIcon}>
              <Activity size={18} />
            </div>
            <span className={styles.tipText}>Track all expenses to find savings opportunities</span>
          </div>
        </div>
      </div>
    </div>
  );
}
