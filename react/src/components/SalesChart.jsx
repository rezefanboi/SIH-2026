import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export function SalesChart({ data, height = 240 }) {
  const formatYAxis = (tick) => {
    if (tick >= 1000) return `${Math.round(tick / 1000)}k`;
    return tick;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tip" style={{ opacity: 1, position: "relative" }}>
          <div style={{ fontWeight: 600, borderBottom: "1px solid var(--border)", paddingBottom: 2, marginBottom: 4 }}>
            {label}
          </div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} style={{ fontSize: "var(--fs-meta)", lineHeight: 1.4 }}>
              <span style={{ color: entry.color }}>■ </span>
              {entry.name}: <strong>{entry.value != null ? `₹${Number(entry.value).toLocaleString("en-IN")}` : "–"}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="var(--text-3)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            stroke="var(--text-3)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="sales"
            name="Actual sales"
            stroke="var(--chart-1)"
            strokeWidth={2.4}
            dot={{ r: 3, fill: "var(--chart-1)" }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            stroke="var(--chart-2)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ r: 2.5, fill: "var(--chart-2)" }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
