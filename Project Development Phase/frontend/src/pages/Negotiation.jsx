import React, { useEffect, useState } from "react";
import { Copy, Check, Sparkles, Mail } from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { TableSkeleton } from "../components/Skeleton";
import styles from "./Negotiation.module.css";

export default function Negotiation() {
  const toast = useToast();
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [strategyData, setStrategyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const loadLoans = async () => {
    try {
      const response = await api.get("/settlement/predict");
      if (response.data.success) {
        const activeLoans = response.data.settlement_prediction || [];
        setLoans(activeLoans);
        if (activeLoans.length > 0) {
          setSelectedLoanId(activeLoans[0].loan_id.toString());
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load loan accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleGenerate = async () => {
    if (!selectedLoanId) {
      toast.warning("Please select a loan account first.");
      return;
    }

    setIsGenerating(true);
    setStrategyData(null);
    try {
      // Fetch strategy from backend
      const response = await api.get(`/ai/strategy?loan_id=${selectedLoanId}`);
      setStrategyData(response.data);

      // Parse and sync to AI history in database
      const parsed = parseAIResponse(response.data.response);
      await api.post("/history", {
        negotiation_strategy: parsed.strategy,
        settlement_letter: parsed.letter,
        ai_response: response.data.response,
      });

      toast.success("Negotiation letter drafted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Error generating settlement letter.");
    } finally {
      setIsGenerating(false);
    }
  };

  const parseAIResponse = (text) => {
    if (!text) return { strategy: "", letter: "" };

    const letterKeywords = [
      "Professional Letter",
      "Dear ",
      "Professional negotiation letter",
      "Dear [Lender]",
      "Sincerely,",
    ];
    let letterIndex = -1;

    for (const keyword of letterKeywords) {
      letterIndex = text.indexOf(keyword);
      if (letterIndex !== -1) {
        if (keyword === "Dear ") {
          const prevLineIndex = text.lastIndexOf("\n", letterIndex);
          if (prevLineIndex !== -1) {
            letterIndex = prevLineIndex;
          }
        }
        break;
      }
    }

    if (letterIndex !== -1) {
      return {
        strategy: text.slice(0, letterIndex).trim(),
        letter: text.slice(letterIndex).trim(),
      };
    }

    return {
      strategy: text,
      letter: `Subject: Request for One-Time Settlement - Loan Account\n\nDear Lender,\n\nI am writing to formally request a review of my outstanding loan balance for a potential settlement program.\n\nSincerely,\nRahul Sharma`,
    };
  };

  const handleCopy = () => {
    if (!strategyData) return;
    const parsed = parseAIResponse(strategyData.response);
    navigator.clipboard.writeText(parsed.letter);
    setIsCopied(true);
    toast.info("Proposal letter copied.");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  const selectedLoan = loans.find(l => l.loan_id.toString() === selectedLoanId);
  const parsed = strategyData ? parseAIResponse(strategyData.response) : { strategy: "", letter: "" };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Negotiation Email Generator</h1>
        <p className={styles.subtitle}>AI-assisted professional letters to send to your lenders</p>
      </div>

      <div className={styles.generatorCard}>
        <h2 className={styles.cardTitle}>Generate a Negotiation Letter</h2>
        <p className={styles.cardSubtitle}>Select a loan and we'll write a professional settlement request</p>

        <div className={styles.formGroup}>
          <label>Select Loan</label>
          <div className={styles.formRow}>
            <select
              className={styles.select}
              value={selectedLoanId}
              onChange={(e) => setSelectedLoanId(e.target.value)}
            >
              {loans.length === 0 ? (
                <option value="">No Active Loans Registered</option>
              ) : (
                loans.map((loan) => (
                  <option key={loan.loan_id} value={loan.loan_id}>
                    {loan.lender_name} - ₹{loan.outstanding_amount.toLocaleString("en-IN")}
                  </option>
                ))
              )}
            </select>
            <button 
              className={styles.submitBtn} 
              onClick={handleGenerate}
              disabled={isGenerating || loans.length === 0}
            >
              <Mail size={16} /> Generate Letter
            </button>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className={styles.loadingText}>
          <div className={styles.spinner} />
          <span>Drafting professional settlement response...</span>
        </div>
      )}

      {!isGenerating && strategyData && (
        <div className={styles.letterCard}>
          <div className={styles.letterHeader}>
            <span className={styles.cardTitle}>Generated Letter</span>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className={styles.letterBlock}>
            {parsed.letter}
          </div>
        </div>
      )}
    </div>
  );
}