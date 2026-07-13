import React from "react";
import {
  PhoneOff,
  FileText,
  Heart,
  Bell,
  Mail,
  Key,
  Shield,
  EyeOff,
} from "lucide-react";
import styles from "./Rights.module.css";

export default function Rights() {
  const rightsCards = [
    {
      icon: PhoneOff,
      iconClass: styles.iconRed,
      title: "No Harassment",
      desc: "Recovery agents CANNOT call you before 7 AM or after 7 PM. Physical abuse or filing a false criminal case against you is illegal under RBI guidelines.",
    },
    {
      icon: FileText,
      iconClass: styles.iconBlue,
      title: "Right to Statement",
      desc: "You have the right to receive a full and detailed loan account statement from your lender at any time, free of charge.",
    },
    {
      icon: Heart,
      iconClass: styles.iconGreen,
      title: "Settlement Negotiation",
      desc: "You can negotiate a one-time settlement with your lender. Most lenders offer settlements at 60–80% for loans overdue more than 90 days, particularly to close an NPA account.",
    },
    {
      icon: Bell,
      iconClass: styles.iconYellow,
      title: "Advance Notice Required",
      desc: "Lenders must give you 60-day advance notice before classifying your account as NPA. They can't take direct coercive action without this mandatory waiting period.",
    },
    {
      icon: Mail,
      iconClass: styles.iconCyan,
      title: "Grievance Redressal",
      desc: "Every bank must have a Grievance Redressal Officer. If you face issues, file a complaint with the Banking Ombudsman if not resolved in 30 days.",
    },
    {
      icon: Key,
      iconClass: styles.iconPurple,
      title: "NOC After Settlement",
      desc: "After full payment or settlement, you are legally entitled to a No-Objection Certificate (NOC) from the lender within 30 days.",
    },
    {
      icon: Shield,
      iconClass: styles.iconBlue,
      title: "Property Protection",
      desc: "Lenders cannot seize property without following SARFAESI Act procedures. You have the right to all selling auction notices.",
    },
    {
      icon: EyeOff,
      iconClass: styles.iconPurple,
      title: "Privacy Rights",
      desc: "Recovery agents cannot contact your family, employer, or neighbors to pressure you. It is a violation of your right to privacy as per RBI norms.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Document Everything",
      desc: "Keep records of all calls, letters, and communications from lenders and recovery agents.",
    },
    {
      number: "02",
      title: "Request Written Settlement",
      desc: "Ask for any settlement offer in writing before making any payment.",
    },
    {
      number: "03",
      title: "File a Complaint",
      desc: "If harassed, file a complaint with RBI Ombudsman at cms.rbi.org.in or call 14448.",
    },
    {
      number: "04",
      title: "Get Legal Help",
      desc: "Consult a debt settlement lawyer for large amounts. Many offer free initial consultations.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>⚖️ Know Your Rights</h1>
        <p className={styles.subtitle}>
          RBI guidelines and legal protections for Indian borrowers
        </p>
      </div>

      {/* Banner */}
      <div className={styles.bannerCard}>
        <h2 className={styles.bannerTitle}>You Have Rights as a Borrower 🛡️</h2>
        <p className={styles.bannerText}>
          Under RBI's Fair Practices Code and the SARFAESI Act, lenders and
          recovery agents must follow strict rules. Knowing these rights protects
          you from illegal harassment and helps you negotiate from a position of
          strength.
        </p>
      </div>

      {/* 8 Rights Cards */}
      <div className={styles.cardsGrid}>
        {rightsCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={styles.rightCard}>
              <div className={`${styles.cardIcon} ${card.iconClass}`}>
                <Icon size={16} />
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Steps Section */}
      <div className={styles.stepsSection}>
        <div>
          <div className={styles.stepsHeader}>
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <h3 className={styles.stepsTitle}>What To Do If Harassed</h3>
          </div>
          <p className={styles.stepsSubtitle}>Step-by-step protection guide</p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, i) => (
            <div key={i} className={styles.stepCard}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h4 className={styles.stepTitle}>{step.title}</h4>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ombudsman Banner */}
      <div className={styles.ombudsmanBanner}>
        <div className={styles.ombudsmanInfo}>
          <span className={styles.ombudsmanIcon}>📞</span>
          <div>
            <h4 className={styles.ombudsmanTitle}>RBI Banking Ombudsman</h4>
            <p className={styles.ombudsmanText}>
              Toll-free: 14448 · Website: cms.rbi.org.in
            </p>
          </div>
        </div>
        <a
          href="https://cms.rbi.org.in"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.complaintBtn}
        >
          File Complaint →
        </a>
      </div>
    </div>
  );
}