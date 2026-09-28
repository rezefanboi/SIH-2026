import React, { useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function SalesView({ store, setActiveView }) {
  const [viewMode, setViewMode] = useState("top"); // "top" or "slow"

  const actuals = store.chartData.filter((d) => d.sales != null);
  const totalActual = actuals.reduce((a, b) => a + b.sales, 0);
  const avgDaily = Math.round(totalActual / actuals.length);

  const trendData = store.chartData.map((d) => ({
    day: d.day,
    sales: d.sales,
    target: Math.round(d.forecast * 0.96)
  }));

  const products = [...store.products];
  if (viewMode === "top") {
    products.sort((a, b) => b.daily * b.price - a.daily * a.price);
  } else {
    products.sort((a, b) => a.daily * a.price - b.daily * b.price);
  }

  const displayed = products.slice(0, 6);

  return (
    <div className="page">
      <div className="page-head">
        <div className="title-group">
          <h1>Sales performance & velocity</h1>
          <p className="meta" style={{ fontSize: "var(--fs-body)", marginTop: 2 }}>
            Revenue trajectory, velocity ranking, and category gross margins for {store.name}
          </p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => setActiveView("what-if")}>
            Simulate demand surge
          </button>
        </div>
      </div>

      <section className="grid-4">
        <MetricCard
          label="Week-to-date revenue"
          value={`₹${(totalActual / 100000).toFixed(2)}L`}
          delta="+8.4% vs prior week"
          dir="up"
        />
        <MetricCard
          label="Average daily revenue"
          value={`₹${avgDaily.toLocaleString("en-IN")}`}
          delta="Pacing above target"
          dir="up"
        />
        <MetricCard
          label="Average basket size"
          value="₹482"
          delta="+₹34 vs last month"
          dir="up"
        />
        <MetricCard
          label="Average gross margin"
          value="23.8%"
          delta="Target: 22.0%"
        />
      </section>

      <Card
        title="Daily sales trend vs Budget target"
        subtitle="Actual daily revenue tracked against store target"
        extra={
          <div className="legend">
            <span><i style={{ background: "var(--chart-1)" }}></i>Actual sales</span>
            <span><i style={{ background: "var(--chart-2)" }}></i>Budget target</span>
          </div>
        }
      >
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-3)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} />
              <Line type="monotone" dataKey="sales" name="Actual sales" stroke="var(--chart-1)" strokeWidth={2.4} dot={{ r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="target" name="Target" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 2.5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid-main">
        <Card
          extra={
            <div className="tabs" style={{ marginBottom: 0, borderBottom: "none" }}>
              <button className={`tab-btn ${viewMode === "top" ? "active" : ""}`} onClick={() => setViewMode("top")}>
                Fastest velocity products
              </button>
              <button className={`tab-btn ${viewMode === "slow" ? "active" : ""}`} onClick={() => setViewMode("slow")}>
                Slow-moving items
              </button>
            </div>
          }
        >
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="num">Daily velocity</th>
                  <th className="num">Unit price</th>
                  <th className="num">Est. weekly revenue</th>
                  <th>Velocity</th>
                  <th>Cover</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((p) => {
                  const weeklyRev = p.daily * 7 * p.price;
                  const t = p.trend > 0 ? `↑${p.trend}%` : p.trend < 0 ? `↓${Math.abs(p.trend)}%` : `→ 0%`;
                  const coverLevel = p.daysLeft < 3 ? "high" : p.daysLeft < 6 ? "medium" : "low";

                  return (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong><br /><span className="meta">{p.category}</span></td>
                      <td className="num">{p.daily} units/day</td>
                      <td className="num">₹{p.price}</td>
                      <td className="num"><strong>₹{weeklyRev.toLocaleString("en-IN")}</strong></td>
                      <td>{t}</td>
                      <td><Badge level={coverLevel}>{p.daysLeft} days</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Department revenue share" subtitle="7-day contribution breakdown">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--fs-body)", marginBottom: 4 }}>
                <span>Dairy</span><strong>₹1.14L (35.6%)</strong>
              </div>
              <div style={{ height: 8, background: "var(--surface-3)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "35.6%", height: "100%", background: "var(--accent)" }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--fs-body)", marginBottom: 4 }}>
                <span>Staples</span><strong>₹98.6K (30.7%)</strong>
              </div>
              <div style={{ height: 8, background: "var(--surface-3)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "30.7%", height: "100%", background: "var(--info)" }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--fs-body)", marginBottom: 4 }}>
                <span>Bakery</span><strong>₹52.4K (16.3%)</strong>
              </div>
              <div style={{ height: 8, background: "var(--surface-3)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "16.3%", height: "100%", background: "var(--warning)" }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
