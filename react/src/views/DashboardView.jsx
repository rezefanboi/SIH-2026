import React from "react";
import { MetricCard } from "../components/MetricCard";
import { Card } from "../components/Card";
import { SalesChart } from "../components/SalesChart";
import { InventoryTable } from "../components/InventoryTable";
import { Badge } from "../components/Badge";

export function DashboardView({ store, setActiveView, onReorder, showToast }) {
  const hr = new Date().getHours();
  const greeting = (hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening") + ", " + store.manager.split(" ")[0];

  const rec = store.recommendation;

  return (
    <div className="page">
      <div className="page-head">
        <div className="title-group">
          <h1>{greeting}. Here's what needs attention.</h1>
          <p className="meta" style={{ fontSize: "var(--fs-body)", marginTop: 2 }}>
            Operational status for {store.name} · Real-time inventory sync
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="btn btn-primary" onClick={() => setActiveView("what-if")}>
            Run scenario
          </button>
          <button
            className="btn"
            onClick={() => showToast("Store telemetry synced with POS")}
          >
            Refresh data
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <section className="grid-4" aria-label="Key metrics">
        {store.kpis.map((k, idx) => (
          <MetricCard
            key={idx}
            label={k.label}
            value={k.value}
            delta={k.delta}
            dir={k.dir}
          />
        ))}
      </section>

      {/* Sales vs Forecast & Attention Items */}
      <section className="grid-main">
        <Card
          title="Sales and demand"
          subtitle="Daily store revenue vs model forecast (Rupees)"
          extra={
            <div className="legend">
              <span><i style={{ background: "var(--chart-1)" }}></i>Actual sales</span>
              <span><i style={{ background: "var(--chart-2)" }}></i>Forecast</span>
            </div>
          }
        >
          <SalesChart data={store.chartData} />
        </Card>

        <Card
          title="Attention items"
          extra={<span className="meta">{store.attention.length} pending</span>}
        >
          <ul className="list">
            {store.attention.map((a) => (
              <li key={a.id}>
                <span className={`dot ${a.level}`}></span>
                <div>
                  <strong>{a.title}</strong>
                  <p className="muted">{a.text}</p>
                  <span className="meta" style={{ marginTop: 2, display: "inline-block" }}>
                    {a.time || "Recent"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Inventory Health & AI Recommendation */}
      <section className="grid-main">
        <Card
          title="Inventory health"
          subtitle="Fastest movers & stockout risks"
          extra={
            <a
              href="#"
              className="meta"
              style={{ textDecoration: "underline" }}
              onClick={(e) => { e.preventDefault(); setActiveView("inventory"); }}
            >
              View all products →
            </a>
          }
        >
          <InventoryTable
            products={store.products}
            onReorder={onReorder}
            limit={5}
          />
        </Card>

        <Card
          title="AI Recommendation"
          extra={<Badge level="info">Holt-Winters Engine</Badge>}
        >
          {rec && (
            <div>
              <h3>{rec.title}</h3>
              <p className="meta" style={{ margin: "4px 0 8px" }}>{rec.action}</p>
              <p className="meta">Evidence:</p>
              <ul className="evidence">
                {rec.why.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="kv">
                <div>
                  <span className="meta">Quantity</span>
                  <strong>{rec.quantity}</strong>
                </div>
                <div>
                  <span className="meta">Est. cost</span>
                  <strong>{rec.projectedCost}</strong>
                </div>
                <div>
                  <span className="meta">Confidence</span>
                  <strong>{rec.confidence}</strong>
                </div>
              </div>
              <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)" }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const prod = store.products.find((p) => p.name.includes("Milk")) || store.products[0];
                    onReorder(prod);
                  }}
                >
                  Approve purchase order
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => setActiveView("what-if")}
                >
                  Simulate surge
                </button>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
