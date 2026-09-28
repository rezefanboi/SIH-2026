# CartSence · Everyday Retail Intelligence

**CartSence** is an evidence-based retail operations and intelligence platform designed for supermarket store managers and regional operations leads. It provides real-time stockout risk alerts, Holt-Winters predictive demand forecasting, perishable waste reduction, what-if scenario simulations, and a conversational retail analyst.

![CartSence Hero](images/hero.jpg)

---

## 🌟 Key Features

### 1. Command Center (`dashboard.html` / React `DashboardView`)
- Real-time stock telemetry synced with store POS.
- Key operational KPIs: Daily sales, Inventory on hand, At-risk perishable inventory, Open purchase orders.
- Daily sales vs. model forecast line chart.
- Prioritized attention feed (stockouts, expiry windows, demand anomalies).
- Fastest-moving products table with stock photography thumbnails.
- Evidence-based AI reorder recommendations with 1-click purchase order modal.

### 2. What-If Scenario Analysis Engine (`what-if.html` / React `WhatIfView`)
- **Interactive Stress-Testing:** Simulate demand shifts from -20% to +100% across 3, 7, 14, or 30 days.
- **Scenario Presets:** Weekend Surge (+25%), Promotion (+15%), Monsoon Advisory (+35%), Festival Rush (+50%), Baseline (0%).
- **Instant Mathematical Recalculations:**
  - $\text{Projected Demand} = \text{Daily Velocity} \times (1 + \Delta\%) \times \text{Days}$
  - $\text{Shortfall} = \max(0, \text{Projected Demand} - \text{Stock})$
  - $\text{Potential Lost Revenue} = \text{Shortfall} \times \text{Unit Price}$
- Interactive comparison trajectory chart and SKU-level sensitivity matrix with direct reorder triggers.

### 3. Inventory Intelligence (`inventory.html` / React `InventoryView`)
- Full product catalog with real-time live search by SKU, product name, or batch.
- Filter by risk level (*High Risk*, *Medium Risk*, *Adequate Stock*) and category (*Dairy*, *Bakery*, *Staples*, *Beverages*, *Snacks*).
- Sortable column headers (Name, Current Stock, Daily Sales, Days of Cover, Unit Price, Total Stock Value, Trend).
- 1-click CSV catalog export.

### 4. Demand Forecasting (`forecast.html` / React `ForecastView`)
- Triple exponential smoothing (Holt-Winters) with weekly additive seasonality ($L = 7$).
- Multi-series chart: actual sales, forecasted demand, and 95% confidence upper bound.
- Department-level demand table showing growth rates, historical accuracy %, and model confidence scores.
- Active demand drivers tracking (weekend footfall lift, heatwaves, grocery cycles).

### 5. Waste Control & Expiry Prevention (`waste.html` / React `WasteView`)
- First-Expiring First-Out (FEFO) audit queue with days-to-expiry countdown and financial loss exposure.
- Proactive AI interventions: clearance markdowns (25%–30%), inter-store branch transfers (e.g. to T. Nagar), and purchase order batch trimming.

### 6. Sales Performance & Product Velocity (`sales.html` / React `SalesView`)
- Daily sales revenue trajectory tracked against budget targets.
- Switchable view: **Fastest Velocity Movers** vs. **Slow-Moving Items**.
- Department revenue share breakdown and peak shopping hour distributions.

### 7. Conversational Retail Assistant (`assistant.html` / React `AssistantView`)
- Concise, evidence-backed AI retail analyst citing live store metrics.
- Suggested prompt chips and 1-click reorder modal triggers.

---

## 🚀 Quick Start

CartSence is provided in two implementations:

### Option A: Zero-Build Plain HTML, CSS & Vanilla JS
Runs directly in any web browser without any build tools or dependencies:
```bash
# Using Python
python -m http.server 5500

# Or using npx
npx serve .
```
Then visit `http://localhost:5500`.

### Option B: Modern React + Vite Application
Located in the `react/` directory:
```bash
cd react
npm install
npm run dev
```
Then visit `http://localhost:5173`.

---

## 📁 Repository Structure

```
├── index.html                   Landing page with split hero & live telemetry preview
├── dashboard.html               Command Center
├── what-if.html                 What-If Scenario Analysis
├── inventory.html               Inventory Intelligence catalog
├── forecast.html                Demand Forecasting
├── waste.html                   Waste Control & Expiry queue
├── sales.html                   Sales Performance & Velocity
├── assistant.html               Retail Intelligence Assistant
├── css/
│   ├── tokens.css               Design tokens (colors, gradients, typography, shadows)
│   ├── base.css                 Reset, typography, accessibility focus rings
│   ├── components.css           Navigation, cards, metrics, tables, badges, steppers
│   └── layout.css               Responsive grids, breakpoints, and hero layout
├── js/
│   ├── theme.js                 Theme toggle & localStorage persistence
│   ├── data.js                  Multi-store dataset (Anna Nagar & T. Nagar)
│   ├── charts.js                SVG line chart component
│   ├── shell.js                 Shared shell (store switcher, date range, notifs, profile)
│   ├── dashboard.js             Command center logic
│   ├── what-if.js               Scenario calculation engine
│   ├── inventory.js             Search, filter, sort & CSV export
│   ├── forecast.js              Forecast trajectory and category tables
│   ├── waste.js                 Expiry audit and markdown triggers
│   ├── sales.js                 Velocity switcher and sales trends
│   └── assistant.js             Conversational retail analyst logic
├── images/                      High-resolution commercial photography assets
│   ├── hero.jpg                 Supermarket aisle & tablet telemetry
│   ├── dairy.jpg                Fresh milk, yogurt & paneer showcase
│   └── bakery.jpg               Artisanal baked bread showcase
└── react/                       React 19 + Vite + Recharts implementation
    ├── src/
    │   ├── components/          TopBar, MetricCard, Card, Badge, SalesChart, ReorderModal
    │   ├── views/               DashboardView, WhatIfView, InventoryView, etc.
    │   └── data/                Store dataset for React
    └── package.json
```

---

## 🎨 Design Principles
- **Clarity & Trust:** Built for decision-makers with clean hierarchy and tabular figures.
- **Accented Aesthetics:** Rich emerald brand gradient with warm ambient lighting, real stock imagery, and live telemetry indicators.
- **Accessible & Responsive:** Supports keyboard navigation, focus rings, reduced-motion preferences, and light/dark theme toggle.
