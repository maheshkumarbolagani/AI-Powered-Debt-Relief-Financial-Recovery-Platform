import React from "react";
import styles from "./Skeleton.module.css";

export function CardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.title} ${styles.shimmer}`} />
      <div className={`${styles.value} ${styles.shimmer}`} />
      <div className={`${styles.footer} ${styles.shimmer}`} />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className={styles.chartContainer}>
      <div className={`${styles.chartHeader} ${styles.shimmer}`} />
      <div className={`${styles.chartBody} ${styles.shimmer}`} />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className={styles.row}>
      <div className={`${styles.cell} ${styles.shimmer}`} style={{ width: "20%" }} />
      <div className={`${styles.cell} ${styles.shimmer}`} style={{ width: "25%" }} />
      <div className={`${styles.cell} ${styles.shimmer}`} style={{ width: "15%" }} />
      <div className={`${styles.cell} ${styles.shimmer}`} style={{ width: "20%" }} />
      <div className={`${styles.cell} ${styles.shimmer}`} style={{ width: "20%" }} />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", padding: "16px" }}>
      <div className={`${styles.shimmer}`} style={{ height: "30px", width: "15%", borderRadius: "4px", marginBottom: "16px" }} />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
    </div>
  );
}
