import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { TableSkeleton } from "../components/Skeleton";
import styles from "./Settlement.module.css";

function LoanSettlementCard({ loan }) {
  const percent = Math.round(loan.suggested_settlement_percentage) || 60;
  const outstanding = loan.outstanding_amount;
  const costToSettle = (outstanding * percent) / 100;
  const savings = outstanding - costToSettle;

  const getRiskBadge = (category) => {
    switch (category) {
      case "High":
        return <span className={`${styles.badge} ${styles.badgeHigh}`}>High Risk</span>;
      case "Medium":
        return <span className={`${styles.badge} ${styles.badgeMedium}`}>Medium Risk</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgeLow}`}>Low Risk</span>;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.lenderTitle}>{loan.lender_name}</h2>
          <span className={styles.loanType}>{loan.loan_type}</span>
        </div>
        {getRiskBadge(loan.risk_category)}
      </div>

      <div className={styles.settlementValue}>
        <span>{percent}%</span>
        <span className={styles.settlementLabel}>Suggested Settlement</span>
      </div>

      <div className={styles.outstandingValue}>
        <span>₹{costToSettle.toLocaleString("en-IN")}</span>
        <span className={styles.settlementLabel}>Suggested settlement cost</span>
      </div>

      <div className={styles.savingBadge}>
        <span>💚</span> Potential saving ₹{savings.toLocaleString("en-IN")}
      </div>
    </div>
  );
}

export default function Settlement() {
  const toast = useToast();
  const [loans, setLoans] = useState([]);
  const [strategyData, setStrategyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);

  const loadData = async (isRegen = false) => {
    if (isRegen) {
      setIsStrategyLoading(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Load predictions
      const response = await api.get("/settlement/predict");
      if (response.data.success) {
        setLoans(response.data.settlement_prediction || []);
      } else {
        toast.error("Failed to load predictions.");
      }

      // Load AI Strategy
      const aiResponse = await api.get("/ai/strategy");
      setStrategyData(aiResponse.data);

      if (isRegen) {
        toast.success("AI Strategy regenerated.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error retrieving settlement risk data.");
    } finally {
      setIsLoading(false);
      setIsStrategyLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settlement Predictor</h1>
        <p className={styles.subtitle}>AI-powered settlement estimates for each of your loans</p>
      </div>

      {loans.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <AlertCircle size={40} color="var(--text-muted)" style={{ marginBottom: "12px" }} />
          <h3 style={{ fontSize: "16px", fontWeight: "600" }}>No Loans Registered</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Add loan profiles inside the database system to calculate settlement options.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.cardsGrid}>
            {loans.map((loan) => (
              <LoanSettlementCard key={loan.loan_id} loan={loan} />
            ))}
          </div>

          {/* AI Strategy section */}
          <div className={styles.strategyCard}>
            <div className={styles.strategyHeader}>
              <div>
                <h3 className={styles.lenderTitle}>AI Negotiation Strategy</h3>
                <p className={styles.loanType}>Personalized advice based on your financial profile</p>
              </div>
              <button 
                onClick={() => loadData(true)} 
                className={styles.regenerateBtn}
                disabled={isStrategyLoading}
              >
                {isStrategyLoading ? "Regenerating..." : "Regenerate"}
              </button>
            </div>

            {isStrategyLoading ? (
              <div className={styles.loadingText}>
                <div className={styles.spinner} />
                <span>Running risk simulations...</span>
              </div>
            ) : (
              strategyData && (
                <pre className={styles.strategyText}>
                  {strategyData.response}
                </pre>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}