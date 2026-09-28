import React from "react";

export function Badge({ level = "info", children, className = "" }) {
  return (
    <span className={`badge ${level} ${className}`}>
      {children}
    </span>
  );
}
