import React from "react";

export function MetricCard({ label, value, delta, dir = "", valueStyle = {} }) {
  return (
    <div className="card metric">
      <div className="muted">{label}</div>
      <div className="value" style={valueStyle}>{value}</div>
      {delta && <div className={`delta ${dir}`}>{delta}</div>}
    </div>
  );
}
