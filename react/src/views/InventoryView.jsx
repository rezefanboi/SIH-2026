import React from "react";
import { MetricCard } from "../components/MetricCard";
import { Card } from "../components/Card";
import { InventoryTable } from "../components/InventoryTable";

export function InventoryView({ store, onReorder, showToast }) {
  const totalUnits = store.products.reduce((sum, p) => sum + p.stock, 0);
  const totalVal = store.products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const highRiskCount = store.products.filter((p) => p.risk === "high").length;
  const avgDays = (store.products.reduce((sum, p) => sum + p.daysLeft, 0) / store.products.length).toFixed(1);

  const handleExportCsv = () => {
    const headers = ["Product,Category,Stock,Daily Sales,Days Left,Price,Value,Trend,Risk\n"];
    const rows = store.products.map(
      (p) => `"${p.name}","${p.category}",${p.stock},${p.daily},${p.daysLeft},${p.price},${p.stock * p.price},${p.trend}%,${p.risk}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cartsence_inventory_${store.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported CSV for ${store.name}`);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="title-group">
          <h1>Inventory intelligence</h1>
          <p className="meta" style={{ fontSize: "var(--fs-body)", marginTop: 2 }}>
            Real-time stock coverage, velocity tracking, and replenishment alerts for {store.name}
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="btn" onClick={handleExportCsv}>Export CSV</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const highRisk = store.products.find((p) => p.risk === "high") || store.products[0];
              onReorder(highRisk);
            }}
          >
            New purchase order
          </button>
        </div>
      </div>

      <section className="grid-4">
        <MetricCard
          label="Total inventory valuation"
          value={`₹${(totalVal / 100000).toFixed(2)}L`}
          delta={`${totalUnits.toLocaleString("en-IN")} units on hand`}
        />
        <MetricCard
          label="Critical stockout risks"
          value={`${highRiskCount} SKUs`}
          delta="Coverage < 3.0 days"
          dir="down"
          valueStyle={{ color: "var(--danger)" }}
        />
        <MetricCard
          label="Replenishment buffer health"
          value={`${store.healthScore}%`}
          delta="+1.8% vs last month"
          dir="up"
          valueStyle={{ color: "var(--success)" }}
        />
        <MetricCard
          label="Average days of cover"
          value={`${avgDays} days`}
          delta="Target: 7 – 21 days"
        />
      </section>

      <Card title="Product catalog & stock telemetry">
        <InventoryTable
          products={store.products}
          onReorder={onReorder}
        />
      </Card>
    </div>
  );
}
