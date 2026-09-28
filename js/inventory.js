(function () {
  var $ = function (s) { return document.querySelector(s); };
  var inr = function (v) { return "₹" + Math.round(v).toLocaleString("en-IN"); };

  var state = {
    search: "",
    risk: "all",
    category: "all",
    sortField: "daysLeft",
    sortAsc: true
  };

  window.renderPage = function () {
    renderInventory();
  };

  function renderInventory() {
    var store = window.CS;
    if (!store) return;

    $("#invSubtitle").textContent = "Real-time stock coverage and replenishment recommendations for " + store.name;

    // Filter
    var filtered = store.products.filter(function (p) {
      if (state.risk !== "all" && p.risk !== state.risk) return false;
      if (state.category !== "all" && p.category !== state.category) return false;
      if (state.search) {
        var q = state.search.toLowerCase();
        var matchName = p.name.toLowerCase().indexOf(q) !== -1;
        var matchCat = p.category.toLowerCase().indexOf(q) !== -1;
        var matchBatch = (p.batchId || "").toLowerCase().indexOf(q) !== -1;
        if (!matchName && !matchCat && !matchBatch) return false;
      }
      return true;
    });

    // Sort
    filtered.sort(function (a, b) {
      var valA = a[state.sortField];
      var valB = b[state.sortField];

      if (state.sortField === "value") {
        valA = a.stock * a.price;
        valB = b.stock * b.price;
      }

      if (typeof valA === "string") {
        return state.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return state.sortAsc ? (valA - valB) : (valB - valA);
    });

    // Summary KPIs with colored indicators
    var totalUnits = store.products.reduce(function (sum, p) { return sum + p.stock; }, 0);
    var totalVal = store.products.reduce(function (sum, p) { return sum + (p.stock * p.price); }, 0);
    var highRiskCount = store.products.filter(function (p) { return p.risk === "high"; }).length;
    var avgDays = (store.products.reduce(function (sum, p) { return sum + p.daysLeft; }, 0) / store.products.length).toFixed(1);

    $("#kpiValuation").textContent = "₹" + (totalVal / 100000).toFixed(2) + "L";
    $("#kpiTotalUnits").textContent = totalUnits.toLocaleString("en-IN") + " total units on hand";
    $("#kpiStockoutCount").textContent = highRiskCount + " SKUs";
    $("#kpiAvgDays").textContent = avgDays + " days";

    // Table render
    var label = { high: "High Risk", medium: "Medium", low: "Adequate" };
    var tbody = $("#inventoryTableBody");

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:var(--space-6);color:var(--text-2)"><p style="font-size:1rem;font-weight:600">No products found</p><p class="meta" style="margin-top:4px">Try adjusting your search query or filter settings</p></td></tr>';
      $("#tableFilterCount").textContent = "0 products found";
      return;
    }

    $("#tableFilterCount").textContent = "Showing " + filtered.length + " of " + store.products.length + " products";

    tbody.innerHTML = filtered.map(function (p) {
      var t = p.trend > 0 ? "↑" + p.trend + "%" : p.trend < 0 ? "↓" + Math.abs(p.trend) + "%" : "→ 0%";
      var stockVal = p.stock * p.price;
      var daysColor = p.daysLeft < 3 ? 'color:var(--danger);font-weight:600' : (p.daysLeft < 6 ? 'color:var(--warning);font-weight:600' : '');
      var imgPath = p.image || (p.category === "Bakery" ? "images/bakery.jpg" : "images/dairy.jpg");

      return '<tr class="risk-' + p.risk + '">' +
        '<td>' +
          '<div class="prod-cell">' +
            '<img class="prod-thumb" src="' + imgPath + '" alt="' + p.name + '" />' +
            '<div><strong>' + p.name + '</strong><br><span class="meta">' + p.category + ' · ' + (p.batchId || "BAT-2026") + '</span></div>' +
          '</div>' +
        '</td>' +
        '<td class="num">' + p.stock + '</td>' +
        '<td class="num">' + p.daily + ' /day</td>' +
        '<td class="num" style="' + daysColor + '">' + p.daysLeft + ' d</td>' +
        '<td class="num">₹' + p.price + '</td>' +
        '<td class="num"><strong>' + inr(stockVal) + '</strong></td>' +
        '<td>' + t + '</td>' +
        '<td><span class="badge ' + p.risk + '">' + label[p.risk] + '</span></td>' +
        '<td style="text-align:right">' +
          '<button class="btn btn-sm order-btn" data-id="' + p.id + '">Reorder</button>' +
        '</td>' +
        '</tr>';
    }).join("");

    // Wire reorder action buttons
    document.querySelectorAll(".order-btn").forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute("data-id");
        var product = store.products.find(function (p) { return p.id === id; });
        if (typeof window.openReorderModal === "function") {
          window.openReorderModal(product);
        }
      };
    });
  }

  function initInventory() {
    var searchInput = $("#invSearch");
    if (searchInput) {
      searchInput.oninput = function () {
        state.search = this.value.trim();
        renderInventory();
      };
    }

    document.querySelectorAll("#riskFilterChips .chip").forEach(function (chip) {
      chip.onclick = function () {
        document.querySelectorAll("#riskFilterChips .chip").forEach(function (c) { c.classList.remove("active"); });
        this.classList.add("active");
        state.risk = this.getAttribute("data-risk");
        renderInventory();
      };
    });

    var catSelect = $("#invCategorySelect");
    if (catSelect) {
      catSelect.onchange = function () {
        state.category = this.value;
        renderInventory();
      };
    }

    document.querySelectorAll("th.sortable").forEach(function (th) {
      th.onclick = function () {
        var field = this.getAttribute("data-sort");
        if (state.sortField === field) {
          state.sortAsc = !state.sortAsc;
        } else {
          state.sortField = field;
          state.sortAsc = true;
        }
        renderInventory();
      };
    });

    var exportBtn = $("#exportBtn");
    if (exportBtn) {
      exportBtn.onclick = function () {
        var store = window.CS;
        var headers = ["Product,Category,Stock,Daily Sales,Days Left,Price,Value,Trend,Risk\n"];
        var rows = store.products.map(function (p) {
          return '"' + p.name + '","' + p.category + '",' + p.stock + ',' + p.daily + ',' + p.daysLeft + ',' + p.price + ',' + (p.stock * p.price) + ',' + p.trend + '%,' + p.risk;
        });
        var csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "cartsence_inventory_" + store.id + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.showToast("Exported inventory CSV for " + store.name);
      };
    }

    var newPoBtn = $("#newPoBtn");
    if (newPoBtn) {
      newPoBtn.onclick = function () {
        var store = window.CS;
        var highRisk = store.products.find(function (p) { return p.risk === "high"; }) || store.products[0];
        if (typeof window.openReorderModal === "function") {
          window.openReorderModal(highRisk);
        }
      };
    }

    renderInventory();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInventory);
  } else {
    initInventory();
  }
})();
