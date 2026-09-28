import React, { useState } from "react";

export function ReorderModal({ product, onClose, onConfirm }) {
  if (!product) return null;

  const [qty, setQty] = useState(product.reorderQty || 100);
  const price = product.cost || product.price || 40;
  const supplier = product.supplier || "Primary Direct Supplier";
  const leadTime = product.leadTimeDays || 2;

  const handleMinus = () => {
    if (qty > 10) setQty(qty - 10);
  };

  const handlePlus = () => {
    setQty(qty + 10);
  };

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Purchase order reorder</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div>
            <label className="meta">Product</label>
            <div style={{ fontWeight: 600, fontSize: "1rem", marginTop: 2 }}>{product.name}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div>
              <label className="meta">Supplier</label>
              <div style={{ fontWeight: 500, marginTop: 2 }}>{supplier}</div>
            </div>
            <div>
              <label className="meta">Lead time</label>
              <div style={{ fontWeight: 500, marginTop: 2 }}>{leadTime} days</div>
            </div>
          </div>
          <div>
            <label className="meta">Order quantity (units)</label>
            <div className="stepper" style={{ marginTop: 6, width: "100%", justifyContent: "space-between" }}>
              <button className="stepper-btn" onClick={handleMinus}>−</button>
              <span className="stepper-val">{qty}</span>
              <button className="stepper-btn" onClick={handlePlus}>+</button>
            </div>
          </div>
          <div className="kv">
            <div>
              <span className="meta">Estimated cost</span>
              <strong>₹{(qty * price).toLocaleString("en-IN")}</strong>
            </div>
            <div>
              <span className="meta">Expected arrival</span>
              <strong>{leadTime} days</strong>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => onConfirm(product, qty)}
          >
            Submit purchase order
          </button>
        </div>
      </div>
    </div>
  );
}
