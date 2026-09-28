(function () {
  var $ = function (s) { return document.querySelector(s); };
  var inr = function (v) { return "₹" + Math.round(v).toLocaleString("en-IN"); };
  var inrLakh = function (v) {
    if (v >= 100000) return "₹" + (v / 100000).toFixed(2) + "L";
    return inr(v);
  };

  var viewMode = "top"; // "top" or "slow"

  window.renderPage = function () {
    renderSales();
  };

  function renderSales() {
    var store = window.CS;
    if (!store) return;

    $("#salesSubtitle").textContent = "Revenue trajectory and velocity analysis for " + store.name;

    var actuals = store.sales.filter(function (v) { return v != null; });
    var totalActual = actuals.reduce(function (a, b) { return a + b; }, 0);
    var avgDaily = Math.round(totalActual / actuals.length);

    $("#kpiWtdRev").textContent = inrLakh(totalActual);
    $("#kpiAvgDaily").textContent = inr(avgDaily);

    // Sales Trend Chart
    var budgetTargets = store.forecast.map(function (f) { return Math.round(f * 0.96); });
    lineChart($("#salesTrendChart"), {
      label: "Actual daily sales vs budget target in " + store.name,
      labels: store.days,
      isCurrency: true,
      format: inr,
      series: [
        { name: "Actual daily sales", values: store.sales, color: "var(--chart-1)" },
        { name: "Store budget target", values: budgetTargets, color: "var(--chart-2)", dashed: true }
      ]
    });

    // Velocity Table
    var products = store.products.slice();
    if (viewMode === "top") {
      products.sort(function (a, b) { return (b.daily * b.price) - (a.daily * a.price); });
    } else {
      products.sort(function (a, b) { return (a.daily * a.price) - (b.daily * b.price); });
    }

    var displayed = products.slice(0, 6);
    var tbody = $("#velocityTableBody");
    tbody.innerHTML = displayed.map(function (p) {
      var weeklyRev = p.daily * 7 * p.price;
      var t = p.trend > 0 ? "↑" + p.trend + "%" : p.trend < 0 ? "↓" + Math.abs(p.trend) + "%" : "→ 0%";
      var coverBadge = p.daysLeft < 3 ? 'badge high' : (p.daysLeft < 6 ? 'badge medium' : 'badge low');

      return '<tr>' +
        '<td><strong>' + p.name + '</strong><br><span class="meta">' + p.category + '</span></td>' +
        '<td class="num">' + p.daily + ' units/day</td>' +
        '<td class="num">₹' + p.price + '</td>' +
        '<td class="num"><strong>' + inr(weeklyRev) + '</strong></td>' +
        '<td>' + t + '</td>' +
        '<td><span class="' + coverBadge + '">' + p.daysLeft + ' days</span></td>' +
        '</tr>';
    }).join("");
  }

  function initSales() {
    var tabTop = $("#tabTopMovers");
    var tabSlow = $("#tabSlowMovers");

    if (tabTop && tabSlow) {
      tabTop.onclick = function () {
        tabTop.classList.add("active");
        tabSlow.classList.remove("active");
        viewMode = "top";
        renderSales();
      };

      tabSlow.onclick = function () {
        tabSlow.classList.add("active");
        tabTop.classList.remove("active");
        viewMode = "slow";
        renderSales();
      };
    }

    renderSales();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSales);
  } else {
    initSales();
  }
})();
