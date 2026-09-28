(function () {
  var $ = function (s) { return document.querySelector(s); };
  var inr = function (v) { return "₹" + Math.round(v).toLocaleString("en-IN"); };
  var inrLakh = function (v) {
    if (v >= 100000) return "₹" + (v / 100000).toFixed(2) + "L";
    return inr(v);
  };

  var horizonDays = 7;

  window.renderPage = function () {
    renderForecast();
  };

  function renderForecast() {
    var store = window.CS;
    if (!store) return;

    $("#forecastSubtitle").textContent = "Predictive demand planning for " + store.name + " (" + horizonDays + "-Day window)";

    var catData = store.categoryForecast || [];
    var totalPast = catData.reduce(function (s, c) { return s + c.pastSales; }, 0);
    var totalForecast = catData.reduce(function (s, c) { return s + (c.forecastDemand * (horizonDays / 7)); }, 0);
    var overallGrowth = (((totalForecast - totalPast) / totalPast) * 100).toFixed(1);

    $("#kpiProjDemand").textContent = inrLakh(totalForecast);
    $("#kpiConfidence").textContent = "91.4%";

    // Render Table
    var tbody = $("#categoryTableBody");
    tbody.innerHTML = catData.map(function (c) {
      var adjustedForecast = Math.round(c.forecastDemand * (horizonDays / 7));
      return '<tr>' +
        '<td><strong>' + c.category + '</strong></td>' +
        '<td class="num">' + inr(c.pastSales) + '</td>' +
        '<td class="num"><strong>' + inr(adjustedForecast) + '</strong></td>' +
        '<td class="num" style="color:var(--success);font-weight:600">' + c.growth + '</td>' +
        '<td class="num">' + c.accuracy + '</td>' +
        '<td><span class="badge ' + (c.confidence >= 90 ? 'low' : 'medium') + '">' + c.confidence + '%</span></td>' +
        '</tr>';
    }).join("");

    // Generate chart data based on horizon
    var labels = [];
    var actuals = [];
    var forecastVals = [];
    var upperBounds = [];

    var baseSales = store.sales;
    var baseForecast = store.forecast;

    if (horizonDays === 7) {
      labels = store.days;
      actuals = baseSales;
      forecastVals = baseForecast;
      upperBounds = baseForecast.map(function (v) { return Math.round(v * 1.12); });
    } else {
      var daysCount = horizonDays;
      for (var d = 1; d <= daysCount; d++) {
        labels.push("D" + d);
        if (d <= 5) actuals.push(baseSales[d - 1] || null);
        else actuals.push(null);

        var seasonalFactor = 1 + (Math.sin(d) * 0.12);
        var fVal = Math.round(52000 * seasonalFactor * (1 + (d * 0.005)));
        forecastVals.push(fVal);
        upperBounds.push(Math.round(fVal * 1.12));
      }
    }

    lineChart($("#forecastChart"), {
      label: "Demand forecast vs actual sales",
      labels: labels,
      isCurrency: true,
      format: inr,
      series: [
        { name: "Actual sales", values: actuals, color: "var(--chart-1)" },
        { name: "Forecast demand", values: forecastVals, color: "var(--chart-2)", dashed: true },
        { name: "Upper bound (+12%)", values: upperBounds, color: "var(--chart-3)", dashed: true }
      ]
    });
  }

  function initForecast() {
    document.querySelectorAll("#forecastHorizonChips .chip").forEach(function (chip) {
      chip.onclick = function () {
        document.querySelectorAll("#forecastHorizonChips .chip").forEach(function (c) { c.classList.remove("active"); });
        this.classList.add("active");
        horizonDays = parseInt(this.getAttribute("data-days"), 10);
        renderForecast();
      };
    });

    renderForecast();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initForecast);
  } else {
    initForecast();
  }
})();
