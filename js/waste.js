(function () {
  var $ = function (s) { return document.querySelector(s); };
  var inr = function (v) { return "₹" + Math.round(v).toLocaleString("en-IN"); };

  window.renderPage = function () {
    renderWaste();
  };

  function renderWaste() {
    var store = window.CS;
    if (!store) return;

    $("#wasteSubtitle").textContent = "Proactive markdown recommendations and stock transfers for " + store.name;

    var items = store.wasteItems || [];
    var totalLoss = items.reduce(function (s, i) { return s + i.totalLoss; }, 0);
    var criticalCount = items.filter(function (i) { return i.expiryDays <= 3; }).reduce(function (s, i) { return s + i.units; }, 0);

    $("#kWasteValue").textContent = inr(totalLoss);
    $("#kCriticalCount").textContent = criticalCount + " units";
    $("#wasteQueueCount").textContent = items.length + " batches pending";

    var tbody = $("#wasteTableBody");
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:var(--space-6);color:var(--text-2)"><p style="font-weight:600">Zero active expiry risks</p><p class="meta">All perishable batches are safely within shelf-life thresholds.</p></td></tr>';
      return;
    }

    tbody.innerHTML = items.map(function (item) {
      var dayBadge = item.expiryDays <= 2 ? 'badge high' : (item.expiryDays <= 4 ? 'badge medium' : 'badge low');
      var imgPath = item.image || (item.product.indexOf("Bread") !== -1 ? "images/bakery.jpg" : "images/dairy.jpg");

      return '<tr>' +
        '<td>' +
          '<div class="prod-cell">' +
            '<img class="prod-thumb" src="' + imgPath + '" alt="' + item.product + '" />' +
            '<div><strong>' + item.product + '</strong><br><span class="meta">' + item.batch + '</span></div>' +
          '</div>' +
        '</td>' +
        '<td class="num">' + item.units + ' units</td>' +
        '<td class="num"><span class="' + dayBadge + '">' + item.expiryDays + ' days left</span></td>' +
        '<td class="num">₹' + item.unitCost + '</td>' +
        '<td class="num" style="color:var(--danger);font-weight:600">' + inr(item.totalLoss) + '</td>' +
        '<td><div style="font-size:var(--fs-body);color:var(--text)">' + item.suggestedAction + '</div></td>' +
        '<td style="text-align:right">' +
          '<button class="btn btn-sm btn-primary action-btn" data-id="' + item.id + '" data-name="' + item.product + '">Execute action</button>' +
        '</td>' +
        '</tr>';
    }).join("");

    // Wire action buttons
    document.querySelectorAll(".action-btn").forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute("data-id");
        var name = this.getAttribute("data-name");
        this.textContent = "Done ✓";
        this.classList.remove("btn-primary");
        this.disabled = true;
        window.showToast("Action applied for " + name + ". Markdown synced with POS.");
      };
    });
  }

  function initWaste() {
    var scanBtn = $("#scanExpiryBtn");
    if (scanBtn) {
      scanBtn.onclick = function () {
        scanBtn.textContent = "Scanning...";
        setTimeout(function () {
          scanBtn.textContent = "Run expiry audit";
          renderWaste();
          window.showToast("Expiry audit completed. 0 additional risks found.");
        }, 400);
      };
    }

    var applyAllBtn = $("#applyAllMarkdownsBtn");
    if (applyAllBtn) {
      applyAllBtn.onclick = function () {
        document.querySelectorAll(".action-btn").forEach(function (btn) {
          btn.textContent = "Done ✓";
          btn.classList.remove("btn-primary");
          btn.disabled = true;
        });
        window.showToast("All recommended clearance markdowns and transfers triggered!");
      };
    }

    renderWaste();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWaste);
  } else {
    initWaste();
  }
})();
