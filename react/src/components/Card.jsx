import React from "react";

export function Card({ title, subtitle, extra, children, className = "", style = {} }) {
  return (
    <div className={`card ${className}`} style={style}>
      {(title || extra) && (
        <div className="card-head">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p className="meta" style={{ marginTop: 2 }}>{subtitle}</p>}
          </div>
          {extra}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
