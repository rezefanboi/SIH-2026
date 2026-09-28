import React, { useState } from "react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";

export function AssistantView({ store, setActiveView, onReorder }) {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      content: (
        <div>
          <p>Hello Lakshmi. I am actively monitoring telemetry for <strong>{store.name}</strong>:</p>
          <ul>
            <li><strong>Milk 500ml</strong> is at high stockout risk (2.3 days of inventory remaining).</li>
            <li><strong>4 perishable batches</strong> (₹12,840 value) require clearance markdowns.</li>
            <li>Beverage demand is tracking <strong>+27%</strong> above average due to weather advisory.</li>
          </ul>
          <p style={{ marginTop: 6 }}>How can I assist you with replenishment or scenario testing today?</p>
        </div>
      )
    }
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMsg = { sender: "user", content: text };
    const q = text.toLowerCase();

    let botResponse = null;

    if (q.includes("milk") || q.includes("stockout")) {
      const milk = store.products.find((p) => p.name.includes("Milk")) || store.products[0];
      botResponse = (
        <div>
          <p><strong>Stockout Assessment: {milk.name}</strong></p>
          <ul>
            <li><strong>Current Stock:</strong> {milk.stock} units</li>
            <li><strong>Daily Velocity:</strong> {milk.daily} units/day (+{milk.trend}% trend)</li>
            <li><strong>Coverage:</strong> Only <strong>{milk.daysLeft} days</strong> remaining</li>
            <li><strong>Supplier Lead Time:</strong> {milk.leadTimeDays} days</li>
          </ul>
          <p style={{ margin: "6px 0" }}><strong>Recommendation:</strong> Reorder <strong>{milk.reorderQty} units</strong> immediately to prevent weekend stockout.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-sm btn-primary" onClick={() => onReorder(milk)}>
              Place purchase order ({milk.reorderQty} units)
            </button>
          </div>
        </div>
      );
    } else if (q.includes("what if") || q.includes("surge") || q.includes("25%")) {
      botResponse = (
        <div>
          <p><strong>Simulation Result (+25% surge over 7 days in {store.name}):</strong></p>
          <ul>
            <li><strong>Projected Revenue:</strong> ₹3.84L</li>
            <li><strong>Stockout Impact:</strong> 3 products will stock out before day 4.</li>
            <li><strong>Inventory Shortfall:</strong> 318 units across Dairy and Bakery.</li>
            <li><strong>Unmitigated Lost Sales:</strong> <span style={{ color: "var(--danger)", fontWeight: 600 }}>₹14,240</span></li>
          </ul>
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-sm" onClick={() => setActiveView("what-if")}>
              Open What-If Scenario Engine →
            </button>
          </div>
        </div>
      );
    } else if (q.includes("expiry") || q.includes("waste")) {
      botResponse = (
        <div>
          <p><strong>Perishable Expiry Audit ({store.name}):</strong></p>
          <p>There are <strong>4 batches</strong> expiring within 5 days totaling <strong style={{ color: "var(--danger)" }}>₹12,840</strong> in loss exposure.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-sm btn-primary" onClick={() => setActiveView("waste")}>
              Manage clearance markdowns →
            </button>
          </div>
        </div>
      );
    } else {
      botResponse = (
        <div>
          <p><strong>Analytical Summary for {store.name}:</strong></p>
          <p>Operational health score is <strong>{store.healthScore}%</strong> across {store.totalSkus} active SKUs.</p>
          <ul>
            <li><strong>Sales today:</strong> {store.kpis[0].value} ({store.kpis[0].delta})</li>
            <li><strong>Critical Reorder:</strong> {store.recommendation.title}</li>
            <li><strong>At-risk Batches:</strong> {store.kpis[2].value}</li>
          </ul>
        </div>
      );
    }

    setMessages([...messages, userMsg, { sender: "assistant", content: botResponse }]);
    setInputVal("");
  };

  const promptSuggestions = [
    "Why is Milk 500ml at risk of stocking out?",
    "What happens if demand increases by 25% this weekend?",
    "Which items are at expiry risk in Dairy?",
    "How much should I reorder for bread?",
    "Show me today's top reorder priority"
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div className="title-group">
          <h1>Retail intelligence assistant</h1>
          <p className="meta" style={{ fontSize: "var(--fs-body)", marginTop: 2 }}>
            Evidence-based analyst for replenishment queries and scenario tests
          </p>
        </div>
        <button
          className="btn"
          onClick={() => setMessages([{ sender: "assistant", content: "Conversation reset. How can I assist you with store telemetry?" }])}
        >
          Clear conversation
        </button>
      </div>

      <div className="grid-main">
        <div className="card" style={{ padding: 0 }}>
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((m, idx) => (
                <div key={idx} className={`chat-msg ${m.sender}`}>
                  <span className="meta">{m.sender === "user" ? "You" : "CartSence Analyst"}</span>
                  <div className={`bubble ${m.sender}`}>{m.content}</div>
                </div>
              ))}
            </div>

            <div className="chat-prompt-chips">
              {promptSuggestions.map((p, idx) => (
                <span key={idx} className="chip" onClick={() => handleSend(p)}>
                  {p}
                </span>
              ))}
            </div>

            <form
              className="chat-input-row"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
            >
              <input
                type="text"
                className="chat-input"
                placeholder="Ask about stock, demand shifts, reorder quantities, or scenarios..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Card title="Current store context" extra={<Badge level="low">{store.name}</Badge>}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", fontSize: "var(--fs-body)" }}>
              <div>
                <span className="meta">Operations Lead</span>
                <div style={{ fontWeight: 600 }}>{store.manager}</div>
              </div>
              <div>
                <span className="meta">Replenishment Health</span>
                <div style={{ fontWeight: 600, color: "var(--success)" }}>94% Adequate coverage</div>
              </div>
              <div>
                <span className="meta">Highest Priority Action</span>
                <div style={{ fontWeight: 600, color: "var(--danger)" }}>PO #892: Milk 500ml (120 units)</div>
              </div>
            </div>
          </Card>

          <Card title="Quick scenario triggers">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <button className="btn btn-sm" style={{ justifyContent: "flex-start" }} onClick={() => setActiveView("what-if")}>
                → Run +25% Demand Surge Scenario
              </button>
              <button className="btn btn-sm" style={{ justifyContent: "flex-start" }} onClick={() => setActiveView("waste")}>
                → Review 4 Expiring Batches
              </button>
              <button className="btn btn-sm" style={{ justifyContent: "flex-start" }} onClick={() => setActiveView("inventory")}>
                → View Complete Product Catalog
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
