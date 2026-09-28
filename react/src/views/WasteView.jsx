import React, { useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";

export function WasteView({ store, showToast }) {
  const [items, setItems] = useState(store.wasteItems || []);
  const [executedIds, setExecutedIds] = useState([]);

  const totalLoss = items.reduce((s, i) => s + i.totalLoss, 0);
  const criticalUnits = items.filter((i) => i.expiryDays <= 3).reduce((s, i) => s + i.units, 0);

  const handleAction = (item) => {
    setExecutedIds([...executedIds, item.id]);
    showToast(`Clearance action executed for ${item.product}. Markdown synced with POS.`);
  };

  const handleApplyAll = () => {
    setExecutedIds(items.map((i) => i.id));
    showToast("All clearance markdowns and store transfers triggered!");
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="title-group">
          <h1>Waste control & expiry prevention</h1>
          <p className="meta" style={{ fontSize: "var(--fs-body)", marginTop: 2 }}>
            Proactive markdown recommendations and stock transfers for {store.name}
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="btn" onClick={() => showToast("Expiry audit completed. Zero additional risks found.")}>
            Run expiry audit
          </button>
          <button className="btn btn-primary" onClick={handleApplyAll}>
            Apply all markdowns
          </button>
        </div>
      </div>

      <section className="grid-4">
        <MetricCard
          label="At-risk inventory value"
          value={`₹${totalLoss.toLocaleString("en-IN")}`}
          delta="4 batches within 5 days"
          dir="down"
          valueStyle={{ color: "var(--danger)" }}
        />
        <MetricCard
          label="Critical expiries (≤ 3 days)"
          value={`${criticalUnits} units`}
          delta="Immediate action required"
          dir="down"
        />
        <MetricCard
          label="Waste prevention rate"
          value="84.6%"
          delta="+5.2% vs last month"
          dir="up"
          valueStyle={{ color: "var(--success)" }}
        />
        <MetricCard
          label="Salvage protected this month"
          value="₹42,600"
          delta="Via proactive markdowns"
          dir="up"
        />
      </section>

      <Card
        title="Expiring inventory queue"
        subtitle="Prioritized by days remaining and financial loss exposure"
        extra={<span className="meta">{items.length} batches pending</span>}
      >
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product & Batch</th>
                <th className="num">Units at risk</th>
                <th className="num">Expiry window</th>
                <th className="num">Unit cost</th>
                <th className="num">Potential loss</th>
                <th>AI Suggested action</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const dayBadge = item.expiryDays <= 2 ? "high" : item.expiryDays <= 4 ? "medium" : "low";
                const isExecuted = executedIds.includes(item.id);

                return (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.product}</strong>
                      <br />
                      <span className="meta">{item.batch}</span>
                    </td>
                    <td className="num">{item.units} units</td>
                    <td className="num"><Badge level={dayBadge}>{item.expiryDays} days left</Badge></td>
                    <td className="num">₹{item.unitCost}</td>
                    <td className="num" style={{ color: "var(--danger)", fontWeight: 600 }}>
                      ₹{item.totalLoss.toLocaleString("en-IN")}
                    </td>
                    <td>{item.suggestedAction}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className={`btn btn-sm ${isExecuted ? "" : "btn-primary"}`}
                        disabled={isExecuted}
                        onClick={() => handleAction(item)}
                      >
                        {isExecuted ? "Done ✓" : "Execute action"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid-main">
        <Card title="Waste breakdown by category" subtitle="Last 30 days loss distribution">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--fs-body)", marginBottom: 4 }}>
                <span>Dairy (Milk, Yogurt, Paneer)</span>
                <strong>52% (₹22,150)</strong>
              </div>
              <div style={{ height: 8, background: "var(--surface-3)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "52%", height: "100%", background: "var(--danger)" }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--fs-body)", marginBottom: 4 }}>
                <span>Bakery (Bread, Buns, Cakes)</span>
                <strong>28% (₹11,920)</strong>
              </div>
              <div style={{ height: 8, background: "var(--surface-3)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "28%", height: "100%", background: "var(--warning)" }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--fs-body)", marginBottom: 4 }}>
                <span>Packaged Beverages</span>
                <strong>12% (₹5,110)</strong>
              </div>
              <div style={{ height: 8, background: "var(--surface-3)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "12%", height: "100%", background: "var(--info)" }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Prevention protocols">
          <ul className="list" style={{ border: "none" }}>
            <li style={{ padding: "var(--space-2) 0" }}>
              <span className="dot low"></span>
              <div>
                <strong>FEFO Shelf Rotation</strong>
                <p className="muted">First-Expiring First-Out compliance tracked during morning restock.</p>
              </div>
            </li>
            <li style={{ padding: "var(--space-2) 0" }}>
              <span className="dot info"></span>
              <div>
                <strong>Inter-Store Rebalancing</strong>
                <p className="muted">Auto-route slow movers to higher footfall branches (e.g. T. Nagar).</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
