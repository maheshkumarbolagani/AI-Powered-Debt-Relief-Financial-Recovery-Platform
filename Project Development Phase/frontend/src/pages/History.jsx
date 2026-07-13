import React, { useEffect, useState } from "react";
import { Search, Trash2, Download, AlertCircle, Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { TableSkeleton } from "../components/Skeleton";
import styles from "./History.module.css";

export default function History() {
  const toast = useToast();
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  
  // Track open/collapsed state of letter boxes by ID
  const [openLetters, setOpenLetters] = useState({});

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/history");
      if (response.data.success) {
        setHistoryList(response.data.history || []);
      } else {
        toast.error("Failed to load AI history.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch negotiation strategy records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this history item?")) return;

    try {
      const response = await api.delete(`/history/${id}`);
      if (response.data.success) {
        setHistoryList((prev) => prev.filter((item) => item.history_id !== id));
        toast.success("History item deleted.");
      } else {
        toast.error(response.data.message || "Failed to delete item.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error communicating with history backend.");
    }
  };

  const toggleLetter = (id) => {
    setOpenLetters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Extract source from AI strategy payload if stored
  const detectSource = (item) => {
    const responseText = item.ai_response || "";
    if (responseText.includes("Fallback Engine") || item.negotiation_strategy.includes("Fallback")) {
      return "Fallback Engine";
    }
    return "Gemini AI";
  };

  const filteredHistory = historyList.filter((item) => {
    const matchesSearch =
      item.negotiation_strategy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.settlement_letter.toLowerCase().includes(searchQuery.toLowerCase());
      
    const detected = detectSource(item);
    const matchesFilter =
      sourceFilter === "all" ||
      (sourceFilter === "gemini" && detected === "Gemini AI") ||
      (sourceFilter === "fallback" && detected === "Fallback Engine");

    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    if (filteredHistory.length === 0) {
      toast.warning("No records to export.");
      return;
    }
    const headers = ["History ID", "Source", "Negotiation Strategy", "Settlement Letter"];
    const rows = filteredHistory.map((h) => [
      h.history_id,
      `"${detectSource(h).replace(/"/g, '""')}"`,
      `"${h.negotiation_strategy.replace(/"/g, '""')}"`,
      `"${h.settlement_letter.replace(/"/g, '""')}"`,
    ]);
    
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `finrelief_negotiation_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("History exported to CSV.");
  };

  const handleExportJSON = () => {
    if (filteredHistory.length === 0) {
      toast.warning("No records to export.");
      return;
    }
    const dataToExport = filteredHistory.map((h) => ({
      history_id: h.history_id,
      source: detectSource(h),
      negotiation_strategy: h.negotiation_strategy,
      settlement_letter: h.settlement_letter,
    }));
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `finrelief_negotiation_history_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("History exported to JSON.");
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className={styles.container}>
      {/* Search and Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by keywords, lender name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="all">All AI Sources</option>
          <option value="gemini">Gemini AI</option>
          <option value="fallback">Fallback Engine</option>
        </select>

        <div className={styles.exportButtons}>
          <button onClick={handleExportCSV} className={styles.exportBtn} title="Export current list as CSV">
            <Download size={14} />
            CSV
          </button>
          <button onClick={handleExportJSON} className={styles.exportBtn} title="Export current list as JSON">
            <Download size={14} />
            JSON
          </button>
        </div>
      </div>

      {/* History Cards */}
      {filteredHistory.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertCircle size={40} color="var(--text-muted)" style={{ marginBottom: "12px" }} />
          <h3 className={styles.emptyTitle}>No History Found</h3>
          <p className={styles.emptyText}>
            {historyList.length === 0
              ? "Generate negotiation strategies to see them persisted here."
              : "No search matches. Try a different query."}
          </p>
        </div>
      ) : (
        <div className={styles.historyList}>
          {filteredHistory.map((item) => {
            const id = item.history_id;
            const isOpen = !!openLetters[id];
            const source = detectSource(item);

            return (
              <div key={id} className={styles.historyCard}>
                <div className={styles.cardHeader}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span className={styles.cardTitle}>Resolution Plan #{id}</span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: source === "Gemini AI" ? "rgba(0,230,118,0.06)" : "rgba(255,145,0,0.06)",
                        color: source === "Gemini AI" ? "var(--accent-primary)" : "var(--risk-medium)",
                        border: `1px solid ${source === "Gemini AI" ? "rgba(0,230,118,0.15)" : "rgba(255,145,0,0.15)"}`,
                      }}
                    >
                      {source}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(id)} className={styles.deleteButton} title="Delete record">
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>

                <div className={styles.strategyText}>{item.negotiation_strategy}</div>

                <button onClick={() => toggleLetter(id)} className={styles.letterToggle}>
                  {isOpen ? (
                    <>
                      <EyeOff size={14} /> Hide Letter Proposal
                    </>
                  ) : (
                    <>
                      <Eye size={14} /> View Letter Proposal
                    </>
                  )}
                </button>

                {isOpen && <div className={styles.letterBlock}>{item.settlement_letter}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}