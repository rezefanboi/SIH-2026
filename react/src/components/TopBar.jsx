import React, { useState } from "react";

export function TopBar({
  activeView,
  setActiveView,
  activeStore,
  setActiveStore,
  stores,
  dateRange,
  setDateRange,
  theme,
  toggleTheme,
  showToast
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const notifications = activeStore.attention || [];

  const navLinks = [
    { id: "dashboard", label: "Command Center" },
    { id: "inventory", label: "Inventory" },
    { id: "forecast", label: "Forecast" },
    { id: "waste", label: "Waste Control" },
    { id: "sales", label: "Sales" },
    { id: "what-if", label: "What-If Scenarios" },
    { id: "assistant", label: "Assistant" }
  ];

  return (
    <header className="topbar">
      <button
        className="icon-btn mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>

      <a
        className="brand"
        href="#"
        onClick={(e) => { e.preventDefault(); setActiveView("dashboard"); }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        CartSence
      </a>

      <nav className={`nav ${mobileOpen ? "mobile-active" : ""}`} aria-label="Primary">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            aria-current={activeView === link.id ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              setActiveView(link.id);
              setMobileOpen(false);
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="tools">
        <select
          className="select"
          value={activeStore.id}
          onChange={(e) => {
            setActiveStore(e.target.value);
            showToast(`Switched to ${stores[e.target.value].name}`);
          }}
          aria-label="Store"
        >
          <option value="anna">Anna Nagar Store</option>
          <option value="tnagar">T. Nagar Store</option>
        </select>

        <select
          className="select"
          value={dateRange}
          onChange={(e) => {
            setDateRange(e.target.value);
            showToast(`Date range set to ${e.target.value === "7d" ? "Last 7 days" : "Last 30 days"}`);
          }}
          aria-label="Date range"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>

        {/* Notifications */}
        <div className="dropdown-wrap">
          <button
            className="icon-btn"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {notifications.length > 0 && (
              <span className="badge-count">{notifications.length}</span>
            )}
          </button>
          {notifOpen && (
            <div className="dropdown-menu active">
              <div className="dropdown-head">
                <h3>Notifications</h3>
                <span className="meta">{notifications.length} unread</span>
              </div>
              <ul className="dropdown-list">
                {notifications.map((item) => (
                  <li key={item.id} className="dropdown-item">
                    <span className={`dot ${item.level}`}></span>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                    <div className="meta" style={{ marginTop: 4 }}>{item.time || "Recent"}</div>
                  </li>
                ))}
              </ul>
              <div className="dropdown-foot">
                <button onClick={() => {
                  showToast("All notifications marked as read");
                  setNotifOpen(false);
                }}>
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle light and dark theme"
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" className="moon" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="sun" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          )}
        </button>

        {/* Profile */}
        <div className="dropdown-wrap">
          <div
            className="avatar"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            tabIndex={0}
            role="button"
            title="Profile"
          >
            L
          </div>
          {profileOpen && (
            <div className="dropdown-menu active">
              <div className="profile-card">
                <div className="p-name">{activeStore.manager}</div>
                <div className="p-role">{activeStore.role}</div>
                <div className="p-store">● {activeStore.name} ({activeStore.city})</div>
              </div>
              <div className="profile-actions">
                <div className="profile-link" onClick={() => { setActiveView("dashboard"); setProfileOpen(false); }}>Command Center</div>
                <div className="profile-link" onClick={() => { setActiveView("what-if"); setProfileOpen(false); }}>What-If Scenarios</div>
                <div className="profile-link" onClick={() => { setActiveView("assistant"); setProfileOpen(false); }}>Retail Assistant</div>
                <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }}></div>
                <div
                  className="profile-link"
                  onClick={() => {
                    showToast("Switched role to Regional Operations Lead");
                    setProfileOpen(false);
                  }}
                >
                  Switch to Regional Lead
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
