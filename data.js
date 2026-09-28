// CartSence Core Retail Intelligence Data with Rich Accents & Stock Imagery
window.CS_STORES = {
  anna: {
    id: "anna",
    name: "Anna Nagar Store",
    city: "Chennai",
    manager: "Lakshmi Narayanan",
    role: "Store Operations Lead",
    healthScore: 94,
    totalSkus: 198,
    kpis: [
      { label: "Sales today", value: "₹48,260", delta: "+6.2% vs last week", dir: "up", raw: 48260 },
      { label: "Inventory on hand", value: "1,842 units", delta: "₹4.18L total value", dir: "", raw: 1842 },
      { label: "At-risk inventory", value: "₹12,840", delta: "+₹2,100 since yesterday", dir: "down", raw: 12840 },
      { label: "Open purchase orders", value: "7", delta: "2 arriving tomorrow", dir: "", raw: 7 }
    ],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    sales:    [41200, 43800, 42100, 45600, 48260, null, null],
    forecast: [40500, 42900, 43300, 46200, 48000, 56800, 52400],
    attention: [
      { id: "att-1", level: "high", title: "Stockout risk: Milk 500ml", text: "Covers 2.3 days at current sales velocity. Supplier lead time is 2 days.", time: "18m ago" },
      { id: "att-2", level: "medium", title: "Expiry risk: Yogurt 400g", text: "38 units expire within 3 days. Recommend 25% markdown or store transfer.", time: "42m ago" },
      { id: "att-3", level: "medium", title: "Stockout risk: Whole Wheat Bread", text: "84 units left. Sales pace is +14% above weekly average.", time: "1h ago" },
      { id: "att-4", level: "info", title: "Demand anomaly: Beverages", text: "Beverage sales are 27% above the four-week average due to heat advisory.", time: "2h ago" },
      { id: "att-5", level: "info", title: "PO #8842 dispatched", text: "120 units Dairy & 60 units Bakery dispatched by Heritage Foods.", time: "3h ago" }
    ],
    products: [
      { id: "p1", name: "Milk 500ml", category: "Dairy", image: "images/dairy.jpg", stock: 72, daily: 31, daysLeft: 2.3, trend: 18, risk: "high", price: 32, cost: 26, minStock: 60, reorderQty: 120, leadTimeDays: 2, expiryDays: 4, batchId: "BAT-9021" },
      { id: "p2", name: "Whole Wheat Bread 400g", category: "Bakery", image: "images/bakery.jpg", stock: 84, daily: 22, daysLeft: 3.8, trend: 14, risk: "high", price: 48, cost: 36, minStock: 50, reorderQty: 80, leadTimeDays: 1, expiryDays: 3, batchId: "BAT-9044" },
      { id: "p3", name: "Greek Yogurt 400g", category: "Dairy", image: "images/dairy.jpg", stock: 96, daily: 14, daysLeft: 6.9, trend: -3, risk: "medium", price: 75, cost: 55, minStock: 40, reorderQty: 50, leadTimeDays: 2, expiryDays: 3, batchId: "BAT-8982" },
      { id: "p4", name: "Paneer Fresh 200g", category: "Dairy", image: "images/dairy.jpg", stock: 52, daily: 16, daysLeft: 3.2, trend: 8, risk: "medium", price: 110, cost: 88, minStock: 35, reorderQty: 60, leadTimeDays: 1, expiryDays: 5, batchId: "BAT-9102" },
      { id: "p5", name: "Sona Masoori Rice 5kg", category: "Staples", image: "images/hero.jpg", stock: 240, daily: 8, daysLeft: 30.0, trend: 1, risk: "low", price: 360, cost: 295, minStock: 80, reorderQty: 100, leadTimeDays: 4, expiryDays: 180, batchId: "BAT-7740" },
      { id: "p6", name: "Sunflower Oil 1L", category: "Staples", image: "images/hero.jpg", stock: 180, daily: 12, daysLeft: 15.0, trend: 5, risk: "low", price: 155, cost: 132, minStock: 60, reorderQty: 80, leadTimeDays: 3, expiryDays: 120, batchId: "BAT-8120" },
      { id: "p7", name: "Aashirvaad Atta 5kg", category: "Staples", image: "images/hero.jpg", stock: 115, daily: 9, daysLeft: 12.8, trend: 3, risk: "low", price: 295, cost: 245, minStock: 50, reorderQty: 70, leadTimeDays: 3, expiryDays: 90, batchId: "BAT-8231" },
      { id: "p8", name: "Filter Coffee Powder 200g", category: "Beverages", image: "images/hero.jpg", stock: 45, daily: 11, daysLeft: 4.1, trend: 12, risk: "medium", price: 140, cost: 110, minStock: 30, reorderQty: 50, leadTimeDays: 3, expiryDays: 60, batchId: "BAT-8512" },
      { id: "p9", name: "Green Tea 25 bags", category: "Beverages", image: "images/hero.jpg", stock: 130, daily: 5, daysLeft: 26.0, trend: -2, risk: "low", price: 180, cost: 135, minStock: 40, reorderQty: 40, leadTimeDays: 4, expiryDays: 150, batchId: "BAT-8422" },
      { id: "p10", name: "Alphonso Mango Pulp 850g", category: "Beverages", image: "images/hero.jpg", stock: 68, daily: 15, daysLeft: 4.5, trend: 27, risk: "medium", price: 165, cost: 128, minStock: 40, reorderQty: 60, leadTimeDays: 3, expiryDays: 90, batchId: "BAT-8711" },
      { id: "p11", name: "Farm Fresh Eggs 6pk", category: "Dairy", image: "images/dairy.jpg", stock: 64, daily: 24, daysLeft: 2.7, trend: 16, risk: "high", price: 54, cost: 42, minStock: 45, reorderQty: 90, leadTimeDays: 1, expiryDays: 6, batchId: "BAT-9150" },
      { id: "p12", name: "Butter Salted 100g", category: "Dairy", image: "images/dairy.jpg", stock: 110, daily: 10, daysLeft: 11.0, trend: 2, risk: "low", price: 62, cost: 50, minStock: 40, reorderQty: 50, leadTimeDays: 2, expiryDays: 45, batchId: "BAT-8890" },
      { id: "p13", name: "Toor Dal 1kg", category: "Staples", image: "images/hero.jpg", stock: 145, daily: 11, daysLeft: 13.2, trend: 4, risk: "low", price: 175, cost: 146, minStock: 50, reorderQty: 60, leadTimeDays: 4, expiryDays: 180, batchId: "BAT-8199" },
      { id: "p14", name: "Parle-G Gold Biscuits 1kg", category: "Snacks", image: "images/bakery.jpg", stock: 190, daily: 18, daysLeft: 10.6, trend: 6, risk: "low", price: 120, cost: 98, minStock: 60, reorderQty: 80, leadTimeDays: 2, expiryDays: 90, batchId: "BAT-8640" }
    ],
    recommendation: {
      title: "Reorder Milk 500ml",
      action: "Place purchase order for 120 units immediately",
      image: "images/dairy.jpg",
      why: [
        "Sales velocity surged +18% over the past 5 days",
        "Current stock of 72 units provides only 2.3 days of inventory coverage",
        "Weekend demand historically increases by 22% in Anna Nagar",
        "Supplier lead time is 2 days, putting Saturday stock at critical zero risk"
      ],
      quantity: "120 units",
      confidence: "91%",
      projectedCost: "₹3,120",
      supplier: "Heritage Foods Chennai Ltd."
    },
    wasteItems: [
      { id: "w1", product: "Greek Yogurt 400g", image: "images/dairy.jpg", batch: "BAT-8982", units: 38, expiryDays: 3, unitCost: 55, totalLoss: 2090, suggestedAction: "Apply 25% discount markdown today" },
      { id: "w2", product: "Whole Wheat Bread 400g", image: "images/bakery.jpg", batch: "BAT-9044", units: 24, expiryDays: 2, unitCost: 36, totalLoss: 864, suggestedAction: "Apply 30% bundle markdown" },
      { id: "w3", product: "Paneer Fresh 200g", image: "images/dairy.jpg", batch: "BAT-9102", units: 14, expiryDays: 4, unitCost: 88, totalLoss: 1232, suggestedAction: "Transfer 10 units to T. Nagar branch" },
      { id: "w4", product: "Farm Fresh Eggs 6pk", image: "images/dairy.jpg", batch: "BAT-9150", units: 18, expiryDays: 5, unitCost: 42, totalLoss: 756, suggestedAction: "Feature in evening flash discount" }
    ],
    categoryForecast: [
      { category: "Dairy", pastSales: 114500, forecastDemand: 132000, growth: "+15.3%", accuracy: "93.4%", confidence: 92 },
      { category: "Bakery", pastSales: 52400, forecastDemand: 58800, growth: "+12.2%", accuracy: "91.8%", confidence: 89 },
      { category: "Staples", pastSales: 98600, forecastDemand: 102400, growth: "+3.8%", accuracy: "95.1%", confidence: 94 },
      { category: "Beverages", pastSales: 48900, forecastDemand: 62100, growth: "+27.0%", accuracy: "89.2%", confidence: 88 },
      { category: "Snacks", pastSales: 34200, forecastDemand: 36800, growth: "+7.6%", accuracy: "92.5%", confidence: 91 }
    ]
  },
  tnagar: {
    id: "tnagar",
    name: "T. Nagar Store",
    city: "Chennai",
    manager: "Vignesh Rajan",
    role: "Store Operations Lead",
    healthScore: 91,
    totalSkus: 215,
    kpis: [
      { label: "Sales today", value: "₹56,420", delta: "+8.9% vs last week", dir: "up", raw: 56420 },
      { label: "Inventory on hand", value: "2,210 units", delta: "₹5.04L total value", dir: "", raw: 2210 },
      { label: "At-risk inventory", value: "₹16,400", delta: "+₹3,200 since yesterday", dir: "down", raw: 16400 },
      { label: "Open purchase orders", value: "9", delta: "3 arriving tomorrow", dir: "", raw: 9 }
    ],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    sales:    [48000, 51200, 49800, 53400, 56420, null, null],
    forecast: [47500, 50900, 51200, 54500, 57000, 68000, 62500],
    attention: [
      { id: "att-t1", level: "high", title: "Stockout risk: Filter Coffee 200g", text: "Covers only 1.8 days of demand. Foot traffic surge in Usman Road.", time: "12m ago" },
      { id: "att-t2", level: "high", title: "Stockout risk: Paneer Fresh 200g", text: "22 units remaining. Weekend wedding order pickup scheduled.", time: "35m ago" },
      { id: "att-t3", level: "medium", title: "Expiry risk: Curd 500g", text: "45 units expire in 3 days. Recommend 20% bundle discount.", time: "1h ago" },
      { id: "att-t4", level: "info", title: "Demand surge: Staples", text: "Rice and Atta purchases up 19% ahead of monthly restocking cycle.", time: "3h ago" }
    ],
    products: [
      { id: "p1", name: "Milk 500ml", category: "Dairy", image: "images/dairy.jpg", stock: 110, daily: 42, daysLeft: 2.6, trend: 15, risk: "high", price: 32, cost: 26, minStock: 80, reorderQty: 150, leadTimeDays: 2, expiryDays: 4, batchId: "BAT-9025" },
      { id: "p2", name: "Whole Wheat Bread 400g", category: "Bakery", image: "images/bakery.jpg", stock: 95, daily: 28, daysLeft: 3.4, trend: 10, risk: "medium", price: 48, cost: 36, minStock: 60, reorderQty: 100, leadTimeDays: 1, expiryDays: 3, batchId: "BAT-9048" },
      { id: "p3", name: "Greek Yogurt 400g", category: "Dairy", image: "images/dairy.jpg", stock: 130, daily: 18, daysLeft: 7.2, trend: 2, risk: "low", price: 75, cost: 55, minStock: 50, reorderQty: 60, leadTimeDays: 2, expiryDays: 4, batchId: "BAT-8988" },
      { id: "p4", name: "Paneer Fresh 200g", category: "Dairy", image: "images/dairy.jpg", stock: 22, daily: 24, daysLeft: 0.9, trend: 22, risk: "high", price: 110, cost: 88, minStock: 50, reorderQty: 80, leadTimeDays: 1, expiryDays: 4, batchId: "BAT-9108" },
      { id: "p5", name: "Sona Masoori Rice 5kg", category: "Staples", image: "images/hero.jpg", stock: 280, daily: 12, daysLeft: 23.3, trend: 7, risk: "low", price: 360, cost: 295, minStock: 90, reorderQty: 120, leadTimeDays: 4, expiryDays: 180, batchId: "BAT-7744" },
      { id: "p8", name: "Filter Coffee Powder 200g", category: "Beverages", image: "images/hero.jpg", stock: 28, daily: 16, daysLeft: 1.8, trend: 25, risk: "high", price: 140, cost: 110, minStock: 40, reorderQty: 80, leadTimeDays: 3, expiryDays: 60, batchId: "BAT-8515" },
      { id: "p11", name: "Farm Fresh Eggs 6pk", category: "Dairy", image: "images/dairy.jpg", stock: 80, daily: 30, daysLeft: 2.7, trend: 12, risk: "high", price: 54, cost: 42, minStock: 50, reorderQty: 100, leadTimeDays: 1, expiryDays: 6, batchId: "BAT-9154" },
      { id: "p13", name: "Toor Dal 1kg", category: "Staples", image: "images/hero.jpg", stock: 160, daily: 14, daysLeft: 11.4, trend: 8, risk: "low", price: 175, cost: 146, minStock: 60, reorderQty: 80, leadTimeDays: 4, expiryDays: 180, batchId: "BAT-8205" }
    ],
    recommendation: {
      title: "Reorder Filter Coffee Powder 200g",
      action: "Place expedited order for 80 units today",
      image: "images/hero.jpg",
      why: [
        "Usman Road shopping foot traffic drove demand up +25%",
        "Only 28 units left in stock (1.8 days of coverage)",
        "Lead time is 3 days, guaranteed stockout by Friday without action",
        "High gross margin item (21.4%) with high repeat customer affinity"
      ],
      quantity: "80 units",
      confidence: "94%",
      projectedCost: "₹8,800",
      supplier: "Narasu's Coffee Works Ltd."
    },
    wasteItems: [
      { id: "wt1", product: "Fresh Curd 500g", image: "images/dairy.jpg", batch: "BAT-8990", units: 45, expiryDays: 3, unitCost: 40, totalLoss: 1800, suggestedAction: "Markdown 20% with morning bread bundle" },
      { id: "wt2", product: "Brown Bread 400g", image: "images/bakery.jpg", batch: "BAT-9051", units: 20, expiryDays: 2, unitCost: 35, totalLoss: 700, suggestedAction: "Apply 25% quick clearance discount" }
    ],
    categoryForecast: [
      { category: "Dairy", pastSales: 138000, forecastDemand: 158000, growth: "+14.5%", accuracy: "94.1%", confidence: 93 },
      { category: "Bakery", pastSales: 64200, forecastDemand: 71000, growth: "+10.6%", accuracy: "92.4%", confidence: 90 },
      { category: "Staples", pastSales: 122000, forecastDemand: 135000, growth: "+10.7%", accuracy: "95.5%", confidence: 95 },
      { category: "Beverages", pastSales: 65400, forecastDemand: 82000, growth: "+25.4%", accuracy: "90.1%", confidence: 89 },
      { category: "Snacks", pastSales: 41200, forecastDemand: 44500, growth: "+8.0%", accuracy: "93.0%", confidence: 92 }
    ]
  }
};

window.getActiveStoreId = function () {
  var saved = "anna";
  try { saved = localStorage.getItem("cartsence-active-store") || "anna"; } catch (e) {}
  return saved in window.CS_STORES ? saved : "anna";
};

window.setActiveStoreId = function (storeId) {
  if (window.CS_STORES[storeId]) {
    try { localStorage.setItem("cartsence-active-store", storeId); } catch (e) {}
    window.CS = window.CS_STORES[storeId];
    window.dispatchEvent(new CustomEvent("cartsence:store-changed", { detail: { storeId: storeId } }));
  }
};

window.CS = window.CS_STORES[window.getActiveStoreId()];
