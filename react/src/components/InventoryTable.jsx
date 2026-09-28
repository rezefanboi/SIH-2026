import React, { useState } from "react";
import { Badge } from "./Badge";

export function InventoryTable({ products = [], onReorder, limit = null }) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [sortField, setSortField] = useState("daysLeft");
  const [sortAsc, setSortAsc] = useState(true);

  let filtered = products.filter((p) => {
    if (riskFilter !== "all" && p.risk !== riskFilter) return false;
    if (catFilter !== "all" && p.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchBatch = (p.batchId || "").toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchBatch) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === "value") {
      valA = a.stock * a.price;
      valB = b.stock * b.price;
    }
    if (typeof valA === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const riskLabel = { high: "High Risk", medium: "Medium", low: "Adequate" };

  return (
    <div>
      {!limit && (
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center", marginBottom: "var(--space-4)" }}>
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input
              type="text"
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, SKU or batch..."
            />
          </div>

          <div className="chips-group">
            <span className={`chip ${riskFilter === "all" ? "active" : ""}`} onClick={() => setRiskFilter("all")}>All SKUs</span>
            <span className={`chip ${riskFilter === "high" ? "active" : ""}`} onClick={() => setRiskFilter("high")}>High Risk</span>
            <span className={`chip ${riskFilter === "medium" ? "active" : ""}`} onClick={() => setRiskFilter("medium")}>Medium Risk</span>
            <span className={`chip ${riskFilter === "low" ? "active" : ""}`} onClick={() => setRiskFilter("low")}>Adequate</span>
          </div>

          <select
            className="select"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Staples">Staples</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
          </select>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort("name")}>Product ↕</th>
              <th className="sortable num" onClick={() => handleSort("stock")}>Stock ↕</th>
              <th className="sortable num" onClick={() => handleSort("daily")}>Daily sales ↕</th>
              <th className="sortable num" onClick={() => handleSort("daysLeft")}>Days left ↕</th>
              {!limit && <th className="sortable num" onClick={() => handleSort("price")}>Unit price ↕</th>}
              {!limit && <th className="sortable num" onClick={() => handleSort("value")}>Stock value ↕</th>}
              <th className="sortable" onClick={() => handleSort("trend")}>Velocity ↕</th>
              <th className="sortable" onClick={() => handleSort("risk")}>Risk ↕</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={limit ? 7 : 9} style={{ textAlign: "center", padding: "var(--space-5)", color: "var(--text-2)" }}>
                  No matching inventory records found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const t = p.trend > 0 ? `↑${p.trend}%` : p.trend < 0 ? `↓${Math.abs(p.trend)}%` : `→ 0%`;
                const isHigh = p.risk === "high";
                const isMed = p.risk === "medium";
                const rowClass = isHigh ? "risk-high" : isMed ? "risk-medium" : "";
                const imgPath = p.image || (p.category === "Bakery" ? "/images/bakery.jpg" : "/images/dairy.jpg");

                return (
                  <tr key={p.id} className={rowClass}>
                    <td>
                      <div className="prod-cell">
                        <img className="prod-thumb" src={imgPath} alt={p.name} />
                        <div>
                          <strong>{p.name}</strong>
                          <br />
                          <span className="meta">{p.category} {p.batchId && `· ${p.batchId}`}</span>
                        </div>
                      </div>
                    </td>
                    <td className="num">{p.stock}</td>
                    <td className="num">{p.daily} /d</td>
                    <td className="num" style={{ color: p.daysLeft < 3 ? "var(--danger)" : undefined, fontWeight: p.daysLeft < 3 ? 600 : undefined }}>
                      {p.daysLeft} d
                    </td>
                    {!limit && <td className="num">₹{p.price}</td>}
                    {!limit && <td className="num"><strong>₹{(p.stock * p.price).toLocaleString("en-IN")}</strong></td>}
                    <td>{t}</td>
                    <td><Badge level={p.risk}>{riskLabel[p.risk]}</Badge></td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => onReorder(p)}
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
