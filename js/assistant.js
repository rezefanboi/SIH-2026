(function () {
  var $ = function (s) { return document.querySelector(s); };
  var inr = function (v) { return "₹" + Math.round(v).toLocaleString("en-IN"); };

  function appendMessage(sender, htmlContent) {
    var feed = $("#chatFeed");
    if (!feed) return;

    var msgDiv = document.createElement("div");
    msgDiv.className = "chat-msg " + sender;
    var senderLabel = sender === "user" ? "You" : "CartSence Analyst";

    msgDiv.innerHTML = '<span class="meta">' + senderLabel + '</span>' +
      '<div class="bubble ' + sender + '">' + htmlContent + '</div>';

    feed.appendChild(msgDiv);
    feed.scrollTop = feed.scrollHeight;
  }

  function handleQuery(text) {
    var store = window.CS;
    var q = text.toLowerCase().trim();

    if (!q) return;

    // Echo user message
    appendMessage("user", escapeHtml(text));

    // Show typing state or direct reply
    setTimeout(function () {
      generateResponse(q, store);
    }, 280);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function generateResponse(q, store) {
    // 1. Stockout risk query (e.g. Milk 500ml)
    if (q.indexOf("milk") !== -1 || q.indexOf("stockout") !== -1) {
      var milk = store.products.find(function (p) { return p.name.indexOf("Milk") !== -1; }) || store.products[0];
      var reply = '<p><strong>Stockout Assessment: ' + milk.name + '</strong></p>' +
        '<ul>' +
          '<li><strong>Current Stock:</strong> ' + milk.stock + ' units</li>' +
          '<li><strong>Daily Velocity:</strong> ' + milk.daily + ' units/day (+' + milk.trend + '% week-over-week)</li>' +
          '<li><strong>Coverage:</strong> Only <strong>' + milk.daysLeft + ' days</strong> remaining</li>' +
          '<li><strong>Supplier Lead Time:</strong> ' + milk.leadTimeDays + ' days</li>' +
        '</ul>' +
        '<p style="margin:6px 0"><strong>Recommendation:</strong> Reorder <strong>' + milk.reorderQty + ' units</strong> immediately to prevent weekend stockout.</p>' +
        '<div style="margin-top:8px">' +
          '<button class="btn btn-sm btn-primary order-btn" data-id="' + milk.id + '">Place purchase order (' + milk.reorderQty + ' units)</button>' +
        '</div>';
      appendMessage("assistant", reply);
      bindOrderButtons();
      return;
    }

    // 2. What-If scenario query (e.g. surge, increase, weekend, what if)
    if (q.indexOf("what if") !== -1 || q.indexOf("surge") !== -1 || q.indexOf("increase") !== -1 || q.indexOf("25%") !== -1 || q.indexOf("30%") !== -1) {
      var factor = 1.25;
      var shortfalls = 0;
      var lostRev = 0;
      store.products.forEach(function (p) {
        var dem = Math.round(p.daily * factor * 7);
        var sf = Math.max(0, dem - p.stock);
        if (sf > 0) {
          shortfalls += sf;
          lostRev += sf * p.price;
        }
      });

      var reply = '<p><strong>Simulation Result (+25% surge over 7 days in ' + store.name + '):</strong></p>' +
        '<ul>' +
          '<li><strong>Projected Revenue:</strong> ' + inr(Math.round(48260 * 7 * 1.15)) + ' (assuming adequate stock)</li>' +
          '<li><strong>Stockout Impact:</strong> 3 products will stock out before day 4.</li>' +
          '<li><strong>Inventory Shortfall:</strong> <strong>' + shortfalls + ' units</strong> across Dairy and Bakery.</li>' +
          '<li><strong>Unmitigated Lost Sales:</strong> <span style="color:var(--danger);font-weight:600">' + inr(lostRev) + '</span></li>' +
        '</ul>' +
        '<p style="margin:6px 0">You can inspect product-level sensitivity and adjust parameters in the interactive Scenario tool:</p>' +
        '<a class="btn btn-sm" href="what-if.html">Open What-If Scenario Engine →</a>';
      appendMessage("assistant", reply);
      return;
    }

    // 3. Expiry / Waste query
    if (q.indexOf("expiry") !== -1 || q.indexOf("waste") !== -1 || q.indexOf("perish") !== -1) {
      var items = store.wasteItems || [];
      var totalLoss = items.reduce(function (s, i) { return s + i.totalLoss; }, 0);
      var reply = '<p><strong>Perishable Expiry Audit (' + store.name + '):</strong></p>' +
        '<p>There are <strong>' + items.length + ' batches</strong> currently expiring within 5 days, totaling <strong style="color:var(--danger)">' + inr(totalLoss) + '</strong> in potential loss:</p>' +
        '<ul>' +
          items.map(function (it) {
            return '<li><strong>' + it.product + ':</strong> ' + it.units + ' units (expires in ' + it.expiryDays + 'd) · <em>' + it.suggestedAction + '</em></li>';
          }).join("") +
        '</ul>' +
        '<div style="margin-top:8px"><a class="btn btn-sm btn-primary" href="waste.html">Manage clearance markdowns →</a></div>';
      appendMessage("assistant", reply);
      return;
    }

    // 4. Bread / Bakery query
    if (q.indexOf("bread") !== -1 || q.indexOf("bakery") !== -1) {
      var bread = store.products.find(function (p) { return p.name.indexOf("Bread") !== -1; }) || store.products[1];
      var reply = '<p><strong>Bakery Stock Status: ' + bread.name + '</strong></p>' +
        '<ul>' +
          '<li>Current stock: ' + bread.stock + ' units (' + bread.daysLeft + ' days left)</li>' +
          '<li>Sales trend: +' + bread.trend + '% velocity lift</li>' +
          '<li>Recommended reorder: <strong>' + bread.reorderQty + ' units</strong> from Modern Bakeries</li>' +
        '</ul>' +
        '<div style="margin-top:8px"><button class="btn btn-sm btn-primary order-btn" data-id="' + bread.id + '">Reorder ' + bread.name + '</button></div>';
      appendMessage("assistant", reply);
      bindOrderButtons();
      return;
    }

    // 5. Store comparison query
    if (q.indexOf("compare") !== -1 || q.indexOf("t nagar") !== -1 || q.indexOf("anna nagar") !== -1) {
      var s1 = window.CS_STORES.anna;
      var s2 = window.CS_STORES.tnagar;
      var reply = '<p><strong>Multi-Store Operational Comparison:</strong></p>' +
        '<table>' +
          '<thead><tr><th>Metric</th><th>Anna Nagar</th><th>T. Nagar</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>Sales today</td><td><strong>' + s1.kpis[0].value + '</strong></td><td><strong>' + s2.kpis[0].value + '</strong></td></tr>' +
            '<tr><td>Inventory on hand</td><td>' + s1.kpis[1].value + '</td><td>' + s2.kpis[1].value + '</td></tr>' +
            '<tr><td>At-risk inventory</td><td>' + s1.kpis[2].value + '</td><td>' + s2.kpis[2].value + '</td></tr>' +
            '<tr><td>Operations Lead</td><td>' + s1.manager + '</td><td>' + s2.manager + '</td></tr>' +
          '</tbody>' +
        '</table>' +
        '<p class="meta" style="margin-top:6px">T. Nagar exhibits 16% higher footfall in Beverages and Staples due to commercial foot traffic.</p>';
      appendMessage("assistant", reply);
      return;
    }

    // 6. Generic analytical reply citing live data
    var reply = '<p><strong>Analytical Summary for ' + store.name + ':</strong></p>' +
      '<p>Current operational health score is <strong>' + store.healthScore + '%</strong> across ' + store.totalSkus + ' active SKUs.</p>' +
      '<ul>' +
        '<li><strong>Sales:</strong> ' + store.kpis[0].value + ' (' + store.kpis[0].delta + ')</li>' +
        '<li><strong>Critical Reorders:</strong> ' + (store.recommendation ? store.recommendation.title : "Milk 500ml") + '</li>' +
        '<li><strong>At-risk Batches:</strong> ' + store.kpis[2].value + '</li>' +
      '</ul>' +
      '<p class="meta" style="margin-top:6px">You can ask about specific items (e.g., "status of coffee", "why is milk low"), simulate demand shifts, or review waste reduction actions.</p>';
    appendMessage("assistant", reply);
  }

  function bindOrderButtons() {
    document.querySelectorAll(".order-btn").forEach(function (btn) {
      btn.onclick = function () {
        var id = this.getAttribute("data-id");
        var store = window.CS;
        var p = store.products.find(function (item) { return item.id === id; });
        if (p && typeof window.openReorderModal === "function") {
          window.openReorderModal(p);
        }
      };
    });
  }

  function initAssistant() {
    var form = $("#chatForm");
    var input = $("#chatInput");

    if (form && input) {
      form.onsubmit = function (e) {
        e.preventDefault();
        var val = input.value;
        input.value = "";
        handleQuery(val);
      };
    }

    // Prompt chips
    document.querySelectorAll("#promptChips .chip").forEach(function (chip) {
      chip.onclick = function () {
        var p = this.getAttribute("data-prompt");
        handleQuery(p);
      };
    });

    // Clear chat
    var clearBtn = $("#clearChatBtn");
    if (clearBtn) {
      clearBtn.onclick = function () {
        var feed = $("#chatFeed");
        if (feed) {
          feed.innerHTML = '';
          appendMessage("assistant", "<p>Conversation cleared. How can I assist you with store intelligence?</p>");
        }
      };
    }

    // Update Context side card with current store
    var store = window.CS;
    if (store) {
      var badge = $("#ctxStoreBadge");
      if (badge) badge.textContent = store.name;
      var mgr = $("#ctxManager");
      if (mgr) mgr.textContent = store.manager;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAssistant);
  } else {
    initAssistant();
  }
})();
