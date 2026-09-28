(function () {
  var $ = function (s) { return document.querySelector(s); };
  var inr = function (v) { return "₹" + Math.round(v).toLocaleString("en-IN"); };
  var inrLakh = function (v) {
    if (v >= 100000) return "₹" + (v / 100000).toFixed(2) + "L";
    return inr(v);
  };

  var state = {
    demandIncrease: 25, // percentage
    periodDays: 7,
    category: "All"
  };

  window.renderPage = function () {
    runScenario();
  };

  function runScenario() {
    var store = window.CS;
    if (!store) return;

    var storeBadge = $("#activeStoreBadge");
    if (storeBadge) storeBadge.textContent = store.name;

    var factor = 1 + (state.demandIncrease / 100);
    var days = state.periodDays;
    var products = store.products.filter(function (p) {
      return state.category === "All" || p.category === state.category;
    });

    var baselineRevenue = 0;
    var projectedRevenue = 0;
    var totalShortfallUnits = 0;
    var totalLostSales = 0;
    var stockoutProducts = [];

    var tableRows = products.map(function (p) {
      var baselineDemand = Math.round(p.daily * days);
      var scenarioDemand = Math.round(p.daily * factor * days);
      var shortfall = Math.max(0, scenarioDemand - p.stock);
      var fulfilledUnits = Math.min(scenarioDemand, p.stock);
      
      var productRev = fulfilledUnits * p.price;
      var productLost = shortfall * p.price;

      baselineRevenue += Math.min(baselineDemand, p.stock) * p.price;
      projectedRevenue += productRev;

      if (shortfall > 0) {
        totalShortfallUnits += shortfall;
        totalLostSales += productLost;
        stockoutProducts.push({ product: p, shortfall: shortfall, lost: productLost });
      }

      var daysUntilStockout = (p.stock / Math.max(0.1, p.daily * factor)).toFixed(1);
      var statusBadge = '';
      if (shortfall > 0) {
        statusBadge = '<span class="badge high">Stockout in ' + daysUntilStockout + 'd</span>';
      } else if (p.stock < scenarioDemand * 1.3) {
        statusBadge = '<span class="badge medium">Tight buffer (' + daysUntilStockout + 'd)</span>';
      } else {
        statusBadge = '<span class="badge low">Adequate (' + daysUntilStockout + 'd)</span>';
      }

      var rowClass = shortfall > 0 ? 'risk-high' : (p.stock < scenarioDemand * 1.3 ? 'risk-medium' : '');

      return '<tr class="' + rowClass + '">' +
        '<td><strong>' + p.name + '</strong><br><span class="meta">' + p.category + ' · ₹' + p.price + '/unit</span></td>' +
        '<td class="num">' + p.stock + '</td>' +
        '<td class="num"><strong>' + scenarioDemand + '</strong></td>' +
        '<td class="num" style="' + (shortfall > 0 ? 'color:var(--danger);font-weight:600' : '') + '">' + (shortfall > 0 ? shortfall : '–') + '</td>' +
        '<td class="num" style="' + (productLost > 0 ? 'color:var(--danger);font-weight:600' : '') + '">' + (productLost > 0 ? inr(productLost) : '–') + '</td>' +
        '<td>' + statusBadge + '</td>' +
        '<td style="text-align:right">' +
          (shortfall > 0 ? '<button class="btn btn-sm btn-primary order-btn" data-id="' + p.id + '" data-qty="' + shortfall + '">Reorder +' + shortfall + '</button>' : '<button class="btn btn-sm order-btn" data-id="' + p.id + '">Reorder</button>') +
        '</td>' +
        '</tr>';
    });

    // Update Output KPI Cards
    $("#kpiRevenue").textContent = inrLakh(projectedRevenue);
    var revDelta = projectedRevenue - baselineRevenue;
    var revDeltaEl = $("#kpiRevenueDelta");
    if (revDelta >= 0) {
      revDeltaEl.className = "delta up";
      revDeltaEl.textContent = "+" + inr(revDelta) + " vs baseline";
    } else {
      revDeltaEl.className = "delta down";
      revDeltaEl.textContent = "-" + inr(Math.abs(revDelta)) + " vs baseline";
    }

    $("#kpiStockouts").textContent = stockoutProducts.length + (stockoutProducts.length === 1 ? " product" : " products");
    $("#kpiStockoutDelta").textContent = stockoutProducts.length > 0 ? "Depletes before day " + Math.min(days, 5) : "Zero stockouts projected";

    $("#kpiShortfallUnits").textContent = totalShortfallUnits + " units";
    $("#kpiShortfallDelta").textContent = stockoutProducts.length > 0 ? "Across " + stockoutProducts.length + " SKUs" : "All demand satisfied";

    $("#kpiLostSales").textContent = inr(totalLostSales);
    $("#kpiLostSalesDelta").textContent = totalLostSales > 0 ? "Revenue loss without buffer" : "No unmet demand";

    // Dynamic Action Banner
    if (stockoutProducts.length > 0) {
      var topStockoutNames = stockoutProducts.slice(0, 2).map(function (s) { return s.product.name; }).join(" and ");
      $("#actionTitle").textContent = "Action recommended for +" + state.demandIncrease + "% surge over " + days + " days:";
      $("#actionText").textContent = "Place expedited purchase orders for " + totalShortfallUnits + " units (primarily " + topStockoutNames + ") to protect " + inr(totalLostSales) + " in at-risk revenue.";
    } else {
      $("#actionTitle").textContent = "Inventory adequate for this scenario:";
      $("#actionText").textContent = "Current warehouse and store stock covers +" + state.demandIncrease + "% demand over " + days + " days without any projected stockouts.";
    }

    // Render Table
    $("#simTableBody").innerHTML = tableRows.join("");
    $("#tableItemCount").textContent = "Showing " + products.length + " products (" + stockoutProducts.length + " at risk)";

    // Wire individual reorder buttons
    document.querySelectorAll(".order-btn").forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute("data-id");
        var p = store.products.find(function (item) { return item.id === id; });
        var targetQty = parseInt(this.getAttribute("data-qty"), 10) || (p ? p.reorderQty : 100);
        if (p && typeof window.openReorderModal === "function") {
          window.openReorderModal(Object.assign({}, p, { reorderQty: targetQty }));
        }
      };
    });

    // Wire Bulk Order button
    var orderAllBtn = $("#actionOrderAllBtn");
    if (orderAllBtn) {
      orderAllBtn.onclick = function () {
        if (stockoutProducts.length === 0) {
          window.showToast("No shortfalls to reorder under this scenario");
          return;
        }
        window.showToast("Draft PO created for " + stockoutProducts.length + " SKUs (" + totalShortfallUnits + " total units)");
      };
    }

    // Update Simulation Chart (Baseline vs Scenario Daily Trajectory)
    var chartLabels = [];
    var baseTrajectory = [];
    var simTrajectory = [];
    var baseDailyStore = store.forecast.reduce(function (a, b) { return a + b; }, 0) / store.forecast.length;

    for (var i = 1; i <= Math.min(14, days); i++) {
      chartLabels.push("Day " + i);
      var dayFactor = 1 + (Math.sin(i) * 0.08); // realistic weekday seasonality
      var baseVal = Math.round(baseDailyStore * dayFactor);
      baseTrajectory.push(baseVal);
      simTrajectory.push(Math.round(baseVal * factor));
    }

    lineChart($("#simChart"), {
      label: "Demand trajectory simulation",
      labels: chartLabels,
      isCurrency: true,
      format: inr,
      series: [
        { name: "Baseline forecast", values: baseTrajectory, color: "var(--chart-1)" },
        { name: "Simulated scenario (" + (state.demandIncrease >= 0 ? "+" : "") + state.demandIncrease + "%)", values: simTrajectory, color: "var(--chart-3)" }
      ]
    });
  }

  function setDemand(val) {
    state.demandIncrease = Math.max(-20, Math.min(100, Math.round(val)));
    $("#stepperDisplay").textContent = (state.demandIncrease >= 0 ? "+" : "") + state.demandIncrease + "%";
    $("#demandSlider").value = state.demandIncrease;

    // sync chips
    document.querySelectorAll("#presetChips .chip").forEach(function (c) {
      var inc = parseInt(c.getAttribute("data-increase"), 10);
      c.classList.toggle("active", inc === state.demandIncrease);
    });

    runScenario();
  }

  function initWhatIf() {
    // Stepper
    $("#stepMinus").onclick = function () { setDemand(state.demandIncrease - 5); };
    $("#stepPlus").onclick = function () { setDemand(state.demandIncrease + 5); };
    
    // Slider
    $("#demandSlider").oninput = function () {
      setDemand(parseInt(this.value, 10));
    };

    // Presets
    document.querySelectorAll("#presetChips .chip").forEach(function (c) {
      c.onclick = function () {
        var inc = parseInt(this.getAttribute("data-increase"), 10);
        setDemand(inc);
      };
    });

    // Horizon Period Chips
    document.querySelectorAll("#periodChips .chip").forEach(function (c) {
      c.onclick = function () {
        document.querySelectorAll("#periodChips .chip").forEach(function (ch) { ch.classList.remove("active"); });
        this.classList.add("active");
        state.periodDays = parseInt(this.getAttribute("data-days"), 10);
        runScenario();
      };
    });

    // Category Filter
    $("#catFilter").onchange = function () {
      state.category = this.value;
      runScenario();
    };

    // Reset button
    $("#resetScenarioBtn").onclick = function () {
      setDemand(0);
      state.periodDays = 7;
      document.querySelectorAll("#periodChips .chip").forEach(function (ch) {
        ch.classList.toggle("active", ch.getAttribute("data-days") === "7");
      });
      state.category = "All";
      $("#catFilter").value = "All";
      runScenario();
      window.showToast("Reset simulation to baseline (0% shift)");
    };

    // Save button
    $("#saveScenarioBtn").onclick = function () {
      window.showToast("Scenario saved: " + (state.demandIncrease >= 0 ? "+" : "") + state.demandIncrease + "% surge over " + state.periodDays + " days");
    };

    runScenario();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWhatIf);
  } else {
    initWhatIf();
  }
})();
