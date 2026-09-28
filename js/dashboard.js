(function () {
  var $ = function (s) { return document.querySelector(s); };
  var inr = function (v) { return "₹" + Number(v).toLocaleString("en-IN"); };

  window.renderDashboard = function () {
    var D = window.CS;
    if (!D) return;

    // Subtitle & Greeting
    var subEl = $("#storeSubtitle");
    if (subEl) subEl.textContent = "Operational status for " + D.name + " (" + D.city + ") · Active SKUs: " + D.totalSkus;

    var locEl = $("#storeLocation");
    if (locEl) locEl.textContent = D.name + " · " + D.city + ", Tamil Nadu";

    var hr = new Date().getHours();
    var greetingText = (hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening") + ", " + (D.manager ? D.manager.split(" ")[0] : "Team") + ". Here's what needs attention.";
    $("#greeting").textContent = greetingText;

    // KPIs with subtle top accent stripes
    $("#kpis").innerHTML = D.kpis.map(function (k, idx) {
      var stripeColor = idx === 0 ? "var(--accent)" : idx === 2 ? "var(--danger)" : "var(--border)";
      return '<div class="card metric" style="position:relative">' +
        '<div style="position:absolute;top:0;left:0;right:0;height:3px;background:' + stripeColor + '"></div>' +
        '<div class="muted">' + k.label + '</div>' +
        '<div class="value">' + k.value + '</div>' +
        '<div class="delta ' + (k.dir || "") + '">' + k.delta + '</div>' +
        '</div>';
    }).join("");

    // Sales vs Forecast Chart
    lineChart($("#chart"), {
      label: "Sales and forecast for the week in " + D.name,
      labels: D.days,
      isCurrency: true,
      format: inr,
      series: [
        { name: "Actual sales", values: D.sales, color: "var(--chart-1)" },
        { name: "Forecast", values: D.forecast, color: "var(--chart-2)", dashed: true }
      ]
    });

    // Attention List
    var attCount = $("#attentionCount");
    if (attCount) attCount.textContent = D.attention.length + " pending";

    if (D.attention.length === 0) {
      $("#attention").innerHTML = '<li style="padding:var(--space-4);text-align:center;color:var(--text-2)"><span class="badge low">All clear</span><p style="margin-top:6px">No high-risk stockouts or expiries detected.</p></li>';
    } else {
      $("#attention").innerHTML = D.attention.map(function (a) {
        return '<li>' +
          '<span class="dot ' + a.level + '"></span>' +
          '<div>' +
            '<strong>' + a.title + '</strong>' +
            '<p class="muted">' + a.text + '</p>' +
            '<span class="meta" style="margin-top:2px;display:inline-block">' + (a.time || "Recent") + '</span>' +
          '</div>' +
          '</li>';
      }).join("");
    }

    // Inventory Table (Top 6 critical/fast products with stock image thumbnails)
    var label = { high: "High", medium: "Medium", low: "Low" };
    var displayedProducts = D.products.slice(0, 6);
    $("#inventory").innerHTML = displayedProducts.map(function (p) {
      var t = p.trend > 0 ? "↑" + p.trend + "%" : p.trend < 0 ? "↓" + Math.abs(p.trend) + "%" : "→ 0%";
      var imgPath = p.image || (p.category === "Bakery" ? "images/bakery.jpg" : "images/dairy.jpg");

      return '<tr class="risk-' + p.risk + '">' +
        '<td>' +
          '<div class="prod-cell">' +
            '<img class="prod-thumb" src="' + imgPath + '" alt="' + p.name + '" />' +
            '<div><strong>' + p.name + '</strong><br><span class="meta">' + p.category + '</span></div>' +
          '</div>' +
        '</td>' +
        '<td class="num">' + p.stock + '</td>' +
        '<td class="num">' + p.daily + ' /d</td>' +
        '<td class="num"><strong>' + p.daysLeft + ' d</strong></td>' +
        '<td>' + t + '</td>' +
        '<td><span class="badge ' + p.risk + '">' + label[p.risk] + '</span></td>' +
        '<td style="text-align:right">' +
          '<button class="btn btn-sm order-btn" data-id="' + p.id + '">Reorder</button>' +
        '</td>' +
        '</tr>';
    }).join("");

    // Wire reorder buttons in table
    document.querySelectorAll(".order-btn").forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute("data-id");
        var product = D.products.find(function (p) { return p.id === id; });
        if (typeof window.openReorderModal === "function") {
          window.openReorderModal(product);
        }
      };
    });

    // AI Recommendation with product photo thumbnail
    var r = D.recommendation;
    if (r) {
      var recImg = r.image || "images/dairy.jpg";
      $("#recommendation").innerHTML = '<div style="display:flex;gap:var(--space-3);align-items:center;margin-bottom:var(--space-3)">' +
        '<img src="' + recImg + '" alt="' + r.title + '" style="width:54px;height:54px;border-radius:var(--radius-sm);object-fit:cover;border:1px solid var(--border);box-shadow:var(--shadow)" />' +
        '<div><h3>' + r.title + '</h3><p class="meta" style="margin-top:2px">' + (r.action || "") + '</p></div>' +
        '</div>' +
        '<p class="meta">Evidence:</p>' +
        '<ul class="evidence">' + r.why.map(function (w) { return "<li>" + w + "</li>"; }).join("") + '</ul>' +
        '<div class="kv">' +
          '<div><span class="meta">Quantity</span><strong>' + r.quantity + '</strong></div>' +
          '<div><span class="meta">Est. cost</span><strong>' + (r.projectedCost || "–") + '</strong></div>' +
          '<div><span class="meta">Confidence</span><strong>' + r.confidence + '</strong></div>' +
        '</div>' +
        '<div style="margin-top:var(--space-4);display:flex;gap:var(--space-2)">' +
          '<button class="btn btn-primary btn-sm" id="recOrderBtn" style="flex:1">Approve purchase order</button>' +
          '<a class="btn btn-sm" href="what-if.html">Simulate surge</a>' +
        '</div>';

      var recOrderBtn = $("#recOrderBtn");
      if (recOrderBtn) {
        recOrderBtn.onclick = function () {
          var product = D.products.find(function (p) { return p.name.indexOf("Milk") !== -1; }) || D.products[0];
          if (typeof window.openReorderModal === "function") {
            window.openReorderModal(product);
          }
        };
      }
    }
  };

  // Wire refresh button
  var refreshBtn = $("#refreshBtn");
  if (refreshBtn) {
    refreshBtn.onclick = function () {
      refreshBtn.textContent = "Updating...";
      setTimeout(function () {
        window.renderDashboard();
        refreshBtn.textContent = "Refresh data";
        if (typeof window.showToast === "function") window.showToast("Telemetry synced with store POS");
      }, 350);
    };
  }

  // Initial render
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.renderDashboard);
  } else {
    window.renderDashboard();
  }
})();
