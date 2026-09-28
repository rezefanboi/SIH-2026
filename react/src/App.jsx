import React, { useState, useEffect } from "react";
import { CS_STORES } from "./data/storeData";
import { TopBar } from "./components/TopBar";
import { ReorderModal } from "./components/ReorderModal";
import { DashboardView } from "./views/DashboardView";
import { WhatIfView } from "./views/WhatIfView";
import { InventoryView } from "./views/InventoryView";
import { ForecastView } from "./views/ForecastView";
import { WasteView } from "./views/WasteView";
import { SalesView } from "./views/SalesView";
import { AssistantView } from "./views/AssistantView";

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [activeStoreId, setActiveStoreId] = useState("anna");
  const [dateRange, setDateRange] = useState("7d");
  const [theme, setTheme] = useState("light");
  const [toastMsg, setToastMsg] = useState("");
  const [modalProduct, setModalProduct] = useState(null);

  // Initialize theme from localStorage or system
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cartsence-theme") || "light";
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("cartsence-theme", next);
    } catch (e) {}
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 2800);
  };

  const handleOpenReorder = (product) => {
    setModalProduct(product);
  };

  const handleConfirmReorder = (product, qty) => {
    setModalProduct(null);
    showToast(`Purchase order submitted: ${qty} units of ${product.name}`);
  };

  const currentStore = CS_STORES[activeStoreId] || CS_STORES.anna;

  return (
    <div className="app-root">
      <TopBar
        activeView={activeView}
        setActiveView={setActiveView}
        activeStore={currentStore}
        setActiveStore={setActiveStoreId}
        stores={CS_STORES}
        dateRange={dateRange}
        setDateRange={setDateRange}
        theme={theme}
        toggleTheme={toggleTheme}
        showToast={showToast}
      />

      <main>
        {activeView === "dashboard" && (
          <DashboardView
            store={currentStore}
            setActiveView={setActiveView}
            onReorder={handleOpenReorder}
            showToast={showToast}
          />
        )}

        {activeView === "what-if" && (
          <WhatIfView
            store={currentStore}
            onReorder={handleOpenReorder}
            showToast={showToast}
          />
        )}

        {activeView === "inventory" && (
          <InventoryView
            store={currentStore}
            onReorder={handleOpenReorder}
            showToast={showToast}
          />
        )}

        {activeView === "forecast" && (
          <ForecastView
            store={currentStore}
            setActiveView={setActiveView}
          />
        )}

        {activeView === "waste" && (
          <WasteView
            store={currentStore}
            showToast={showToast}
          />
        )}

        {activeView === "sales" && (
          <SalesView
            store={currentStore}
            setActiveView={setActiveView}
          />
        )}

        {activeView === "assistant" && (
          <AssistantView
            store={currentStore}
            setActiveView={setActiveView}
            onReorder={handleOpenReorder}
          />
        )}
      </main>

      {/* Toast feedback */}
      <div className={`toast ${toastMsg ? "active" : ""}`} id="appToast">
        {toastMsg}
      </div>

      {/* Reorder Modal */}
      {modalProduct && (
        <ReorderModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onConfirm={handleConfirmReorder}
        />
      )}
    </div>
  );
}
