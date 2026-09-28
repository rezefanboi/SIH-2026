import React, { useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function WhatIfView({ store, onReorder, showToast }) {
  const [demandShift, setDemandShift] = useState(25);
  const [periodDays, setPeriodDays] = useState(7);
  const [category, setCategory] = useState("All");

  const factor = 1 + demandShift / 100;

  const products = store.products.filter(
    (p) => category === "All" || p.category === category
  );

  let baselineRevenue = 0;
  let projectedRevenue = 0;
  let totalShortfallUnits = 0;
  let totalLostSales = 0;
  const stockoutProducts = [];

  const sensitivityRows = products.map((p) => {
    const baselineDemand = Math.round(p.daily * periodDays);
    const scenarioDemand = Math.round(p.daily * factor * periodDays);
    const shortfall = Math.max(0, scenarioDemand - p.stock);
    const fulfilled = Math.min(scenarioDemand, p.stock);

    const rev = fulfilled * p.price;
    const lost = shortfall * p.price;

    baselineRevenue += Math.min(baselineDemand, p.stock) * p.price;
    projectedRevenue += rev;

    if (shortfall > 0) {
      totalShortfallUnits += shortfall;
      totalLostSales += lost;
      stockoutProducts.push({ product: p, shortfall, lost });
    }

    const daysUntilStockout = (p.stock / Math.max(0.1, p.daily * factor)).toFixed(1);

    return {
      product: p,
      scenarioDemand,
      shortfall,
      lost,
      daysUntilStockout,
      status: shortfall > 0 ? "high" : p.stock < scenarioDemand * 1.3 ? "medium" : "low"
    };
  });

  const revDelta = projectedRevenue - baselineRevenue;

  // Chart data
  const chartData = [];
  const baseAvg = store.forecast.reduce((a, b) => a + b, 0) / store.forecast.length;
  for (let d = 1; d <= Math.min(14, periodDays); d++) {
    const dayFactor = 1 + Math.sin(d) * 0.08;
    const baseVal = Math.round(baseAvg * dayFactor);
    chartData.push({
      day: `Day ${d}`,
      baseline: baseVal,
      simulated: Math.round(baseVal * factor)
    });
  }

  const formatLakh = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="title-group">
          <h1>What-If: Scenario Analysis</h1>
          <p className="meta" style={{ fontSize: "var(--fs-body)", marginTop: 2 }}>
            Stress-test your store inventory against surges, festive rushes, or supply chain bottlenecks.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            className="btn"
            onClick={() => {
              setDemandShift(0);
              setPeriodDays(7);
              setCategory("All");
              showToast("Reset scenario to baseline (0%)");
            }}
          >
            Reset to baseline
          </button>
          <button
            className="btn btn-primary"
            onClick={() => showToast(`Scenario saved: ${demandShift >= 0 ? "+" : ""}${demandShift}% over ${periodDays} days`)}
          >
            Save scenario
          </button>
        </div>
      </div>

      <div className="grid-whatif">
        {/* Left Inputs Card */}
        <Card
          title="Simulation parameters"
          extra={<Badge level="info">{store.name}</Badge>}
          style={{ position: "sticky", top: 72 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {/* Presets */}
            <div>
              <label className="meta" style={{ display: "block", marginBottom: 6 }}>Scenario presets</label>
              <div className="chips-group">
                {[
                  { label: "Baseline (0%)", val: 0 },
                  { label: "Promo (+15%)", val: 15 },
                  { label: "Weekend (+25%)", val: 25 },
                  { label: "Monsoon (+35%)", val: 35 },
                  { label: "Festival (+50%)", val: 50 }
                ].map((item) => (
                  <span
                    key={item.val}
                    className={`chip ${demandShift === item.val ? "active" : ""}`}
                    onClick={() => setDemandShift(item.val)}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Stepper & Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="meta">Demand shift</label>
                <div className="stepper">
                  <button className="stepper-btn" onClick={() => setDemandShift(Math.max(-20, demandShift - 5))}>−</button>
                  <span className="stepper-val">{demandShift >= 0 ? `+${demandShift}` : demandShift}%</span>
                  <button className="stepper-btn" onClick={() => setDemandShift(Math.min(100, demandShift + 5))}>+</button>
                </div>
              </div>
              <input
                type="range"
                className="range-slider"
                min="-20"
                max="100"
                step="5"
                value={demandShift}
                onChange={(e) => setDemandShift(Number(e.target.value))}
              />
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-3)", fontSize: 11, marginTop: 4 }}>
                <span>-20%</span><span>0%</span><span>+50%</span><span>+100%</span>
              </div>
            </div>

            {/* Horizon Period */}
            <div>
              <label className="meta" style={{ display: "block", marginBottom: 6 }}>Forecast horizon</label>
              <div className="chips-group">
                {[3, 7, 14, 30].map((d) => (
                  <span
                    key={d}
                    className={`chip ${periodDays === d ? "active" : ""}`}
                    onClick={() => setPeriodDays(d)}
                  >
                    {d} days
                  </span>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="meta" style={{ display: "block", marginBottom: 6 }}>Category focus</label>
              <select
                className="select"
                style={{ width: "100%" }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Staples">Staples</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>

            {/* Calculation Model */}
            <div style={{ padding: "var(--space-3)", background: "var(--surface-2)", borderRadius: "var(--radius-sm)", fontSize: "var(--fs-meta)", color: "var(--text-2)" }}>
              <strong>Deterministic engine:</strong>
              <div style={{ marginTop: 4, lineHeight: 1.4 }}>
                <code>Demand = daily × (1 + Δ%) × days</code><br />
                <code>Shortfall = max(0, Demand − stock)</code><br />
                <code>Lost sales = shortfall × price</code>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Results Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div className="grid-4">
            <MetricCard
              label="Projected revenue"
              value={formatLakh(projectedRevenue)}
              delta={revDelta >= 0 ? `+${formatLakh(revDelta)} vs baseline` : `-${formatLakh(Math.abs(revDelta))} vs baseline`}
              dir={revDelta >= 0 ? "up" : "down"}
            />
            <MetricCard
              label="Projected stockouts"
              value={`${stockoutProducts.length} ${stockoutProducts.length === 1 ? "product" : "products"}`}
              delta={stockoutProducts.length > 0 ? `Runs out in < ${Math.min(periodDays, 5)} days` : "Zero stockouts"}
              dir={stockoutProducts.length > 0 ? "down" : "up"}
              valueStyle={{ color: stockoutProducts.length > 0 ? "var(--danger)" : undefined }}
            />
            <MetricCard
              label="Additional inventory needed"
              value={`${totalShortfallUnits} units`}
              delta={stockoutProducts.length > 0 ? `Across ${stockoutProducts.length} SKUs` : "Adequate stock"}
            />
            <MetricCard
              label="Potential lost sales"
              value={`₹${Math.round(totalLostSales).toLocaleString("en-IN")}`}
              delta={totalLostSales > 0 ? "Revenue risk if unmitigated" : "No unmet demand"}
              dir={totalLostSales > 0 ? "down" : "up"}
              valueStyle={{ color: totalLostSales > 0 ? "var(--danger)" : undefined }}
            />
          </div>

          {/* Dynamic Action Banner */}
          <div className="card" style={{ borderLeft: "4px solid var(--warning)", padding: "var(--space-3) var(--space-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)" }}>
              <div>
                <strong>
                  {stockoutProducts.length > 0
                    ? `Recommended action for +${demandShift}% surge over ${periodDays} days:`
                    : "Inventory adequate for this scenario:"}
                </strong>
                <p className="muted" style={{ marginTop: 2 }}>
                  {stockoutProducts.length > 0
                    ? `Place expedited purchase orders for ${totalShortfallUnits} units to protect ₹${Math.round(totalLostSales).toLocaleString("en-IN")} in at-risk revenue.`
                    : `Current inventory covers +${demandShift}% demand across ${periodDays} days without any stockout shortfalls.`}
                </p>
              </div>
              {stockoutProducts.length > 0 && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => showToast(`Created draft POs for ${stockoutProducts.length} at-risk products (${totalShortfallUnits} units)`)}
                >
                  Create draft POs for shortfalls
                </button>
              )}
            </div>
          </div>

          {/* Recharts Simulation Chart */}
          <Card
            title="Demand trajectory vs Baseline"
            subtitle="Daily store demand projection under current scenario parameters"
            extra={
              <div className="legend">
                <span><i style={{ background: "var(--chart-1)" }}></i>Baseline</span>
                <span><i style={{ background: "var(--chart-3)" }}></i>Simulated (+{demandShift}%)</span>
              </div>
            }
          >
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
                  <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--text-3)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip
                    formatter={(val) => `₹${Number(val).toLocaleString("en-IN")}`}
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}
                  />
                  <Line type="monotone" dataKey="baseline" name="Baseline" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 2.5 }} />
                  <Line type="monotone" dataKey="simulated" name="Simulated" stroke="var(--chart-3)" strokeWidth={2.4} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Product Sensitivity Table */}
          <Card
            title="Product sensitivity breakdown"
            subtitle="Shows stockout risk and required inventory buffer per SKU"
            extra={<span className="meta">{products.length} products analyzed</span>}
          >
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="num">Current stock</th>
                    <th className="num">Scenario demand</th>
                    <th className="num">Shortfall</th>
                    <th className="num">Lost revenue</th>
                    <th>Scenario status</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sensitivityRows.map(({ product: p, scenarioDemand, shortfall, lost, daysUntilStockout, status }) => {
                    const rowClass = status === "high" ? "risk-high" : status === "medium" ? "risk-medium" : "";
                    const badgeText = status === "high" ? `Stockout in ${daysUntilStockout}d` : status === "medium" ? `Tight buffer (${daysUntilStockout}d)` : `Adequate (${daysUntilStockout}d)`;

                    return (
                      <tr key={p.id} className={rowClass}>
                        <td>
                          <strong>{p.name}</strong>
                          <br />
                          <span className="meta">{p.category} · ₹{p.price}/unit</span>
                        </td>
                        <td className="num">{p.stock}</td>
                        <td className="num"><strong>{scenarioDemand}</strong></td>
                        <td className="num" style={{ color: shortfall > 0 ? "var(--danger)" : undefined, fontWeight: shortfall > 0 ? 600 : undefined }}>
                          {shortfall > 0 ? shortfall : "–"}
                        </td>
                        <td className="num" style={{ color: lost > 0 ? "var(--danger)" : undefined, fontWeight: lost > 0 ? 600 : undefined }}>
                          {lost > 0 ? `₹${Math.round(lost).toLocaleString("en-IN")}` : "–"}
                        </td>
                        <td><Badge level={status}>{badgeText}</Badge></td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className={`btn btn-sm ${shortfall > 0 ? "btn-primary" : ""}`}
                            onClick={() => onReorder(Object.assign({}, p, { reorderQty: shortfall > 0 ? shortfall : p.reorderQty }))}
                          >
                            {shortfall > 0 ? `Reorder +${shortfall}` : "Reorder"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
