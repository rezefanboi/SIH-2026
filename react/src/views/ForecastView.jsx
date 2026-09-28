import React, { useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function ForecastView({ store, setActiveView }) {
  const [horizon, setHorizon] = useState(7);

  const catData = store.categoryForecast || [];
  const totalForecast = catData.reduce((s, c) => s + c.forecastDemand * (horizon / 7), 0);

  // Generate Recharts multi-horizon data
  const chartData = [];
  if (horizon === 7) {
    store.days.forEach((d, idx) => {
      chartData.push({
        day: d,
        actual: store.chartData[idx]?.sales || null,
        forecast: store.chartData[idx]?.forecast || null,
        upper: Math.round((store.chartData[idx]?.forecast || 50000) * 1.12)
      });
    });
  } else {
    for (let d = 1; d <= horizon; d++) {
      const seasonal = 1 + Math.sin(d) * 0.12;
      const f = Math.round(52000 * seasonal * (1 + d * 0.005));
      chartData.push({
        day: `D${d}`,
        actual: d <= 5 ? store.chartData[d - 1]?.sales || null : null,
        forecast: f,
        upper: Math.round(f * 1.12)
      });
    }
  }

  const formatLakh = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="title-group">
          <h1>Demand forecasting</h1>
          <p className="meta" style={{ fontSize: "var(--fs-body)", marginTop: 2 }}>
            Holt-Winters predictive modeling and category seasonality for {store.name}
          </p>
        </div>
        <div className="chips-group">
          {[7, 14, 30].map((d) => (
            <span
              key={d}
              className={`chip ${horizon === d ? "active" : ""}`}
              onClick={() => setHorizon(d)}
            >
              {d}-Day outlook
            </span>
          ))}
        </div>
      </div>

      <section className="grid-4">
        <MetricCard
          label="Projected store demand"
          value={formatLakh(totalForecast)}
          delta="+11.4% vs past 7 days"
          dir="up"
        />
        <MetricCard
          label="Holt-Winters model confidence"
          value="91.4%"
          delta="High confidence rating"
          dir="up"
        />
        <MetricCard
          label="Forecast bias tracking error"
          value="-0.8%"
          delta="Mean absolute error: 3.2%"
        />
        <MetricCard
          label="Projected peak day"
          value="Saturday"
          delta="Est. ₹56,800 footfall surge"
          dir="up"
        />
      </section>

      <Card
        title="Sales vs Demand projection"
        subtitle="Daily historical sales tracked against forecasted demand and 95% confidence band"
        extra={
          <div className="legend">
            <span><i style={{ background: "var(--chart-1)" }}></i>Actual sales</span>
            <span><i style={{ background: "var(--chart-2)" }}></i>Forecast</span>
            <span><i style={{ background: "var(--chart-3)" }}></i>Upper bound (+12%)</span>
          </div>
        }
      >
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-3)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} />
              <Line type="monotone" dataKey="actual" name="Actual sales" stroke="var(--chart-1)" strokeWidth={2.4} dot={{ r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="forecast" name="Forecast demand" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 2.5 }} />
              <Line type="monotone" dataKey="upper" name="Upper bound" stroke="var(--chart-3)" strokeWidth={1.8} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid-main">
        <Card title="Category demand breakdown" subtitle="Forecasted demand and accuracy per department">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="num">Past 7d sales</th>
                  <th className="num">Forecasted demand</th>
                  <th className="num">Growth rate</th>
                  <th className="num">Accuracy</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {catData.map((c) => (
                  <tr key={c.category}>
                    <td><strong>{c.category}</strong></td>
                    <td className="num">₹{c.pastSales.toLocaleString("en-IN")}</td>
                    <td className="num"><strong>₹{Math.round(c.forecastDemand * (horizon / 7)).toLocaleString("en-IN")}</strong></td>
                    <td className="num" style={{ color: "var(--success)", fontWeight: 600 }}>{c.growth}</td>
                    <td className="num">{c.accuracy}</td>
                    <td><Badge level={c.confidence >= 90 ? "low" : "medium"}>{c.confidence}%</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Card title="Active demand drivers">
            <ul className="list" style={{ border: "none" }}>
              <li style={{ padding: "var(--space-2) 0" }}>
                <span className="dot medium"></span>
                <div>
                  <strong>Weekend footfall lift (+22%)</strong>
                  <p className="muted">Higher residential shopping volume on Saturday and Sunday.</p>
                </div>
              </li>
              <li style={{ padding: "var(--space-2) 0" }}>
                <span className="dot info"></span>
                <div>
                  <strong>Heatwave advisory (+27% beverages)</strong>
                  <p className="muted">Temperatures &gt; 35°C accelerating cold beverage depletion.</p>
                </div>
              </li>
              <li style={{ padding: "var(--space-2) 0" }}>
                <span className="dot info"></span>
                <div>
                  <strong>Monthly grocery cycle (+14% staples)</strong>
                  <p className="muted">Month-end and salary week restocking across Rice and Atta.</p>
                </div>
              </li>
            </ul>
          </Card>

          <Card title="Model transparency">
            <p className="muted" style={{ fontSize: "var(--fs-meta)", lineHeight: 1.5 }}>
              Triple Exponential Smoothing (Holt-Winters) with weekly additive seasonality factor (L=7). Trained on 52 weeks of store POS logs.
            </p>
            <div style={{ marginTop: "var(--space-3)" }}>
              <button className="btn btn-sm" onClick={() => setActiveView("what-if")}>
                Run scenario on this forecast →
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
