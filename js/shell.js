// CartSence Shared Shell Navigation & Controls
(function () {
  function initShell() {
    var storeSelect = document.querySelector("#storeSelect");
    if (storeSelect) {
      storeSelect.value = window.getActiveStoreId();
      storeSelect.addEventListener("change", function () {
        window.setActiveStoreId(this.value);
        if (typeof window.renderDashboard === "function") {
          window.renderDashboard();
        } else if (typeof window.renderPage === "function") {
          window.renderPage();
        } else {
          location.reload();
        }
        window.showToast("Switched to " + window.CS.name);
      });
    }

    var dateSelect = document.querySelector("#dateSelect");
    if (dateSelect) {
      dateSelect.addEventListener("change", function () {
        window.showToast("Date range updated to " + this.options[this.selectedIndex].text);
        if (typeof window.renderDashboard === "function") window.renderDashboard();
        if (typeof window.renderPage === "function") window.renderPage();
      });
    }

    // Notifications Dropdown
    var notifBtn = document.querySelector("#notifBtn");
    var notifMenu = document.querySelector("#notifMenu");
    if (notifBtn && notifMenu) {
      renderNotifications();
      notifBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllDropdowns(notifMenu);
        notifMenu.classList.toggle("active");
      });
    }

    // Profile Dropdown
    var profileBtn = document.querySelector("#profileBtn");
    var profileMenu = document.querySelector("#profileMenu");
    if (profileBtn && profileMenu) {
      renderProfileMenu();
      profileBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllDropdowns(profileMenu);
        profileMenu.classList.toggle("active");
      });
    }

    // Mobile nav toggle
    var mobileMenuBtn = document.querySelector("#mobileMenuBtn");
    var primaryNav = document.querySelector(".nav");
    if (mobileMenuBtn && primaryNav) {
      mobileMenuBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        primaryNav.classList.toggle("mobile-active");
      });
    }

    // Global click listener to close dropdowns
    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAllDropdowns();
        closeModal();
      }
    });
  }

  function closeAllDropdowns(except) {
    document.querySelectorAll(".dropdown-menu").forEach(function (m) {
      if (m !== except) m.classList.remove("active");
    });
  }

  function renderNotifications() {
    var menu = document.querySelector("#notifMenu");
    var btn = document.querySelector("#notifBtn");
    if (!menu || !btn) return;

    var items = window.CS.attention || [];
    var count = items.length;

    var badge = btn.querySelector(".badge-count");
    if (!badge && count > 0) {
      badge = document.createElement("span");
      badge.className = "badge-count";
      btn.appendChild(badge);
    }
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "grid" : "none";
    }

    menu.innerHTML = '<div class="dropdown-head"><h3>Notifications</h3><span class="meta">' + count + ' unread</span></div>' +
      '<ul class="dropdown-list">' +
      items.map(function (item) {
        return '<li class="dropdown-item"><span class="dot ' + item.level + '"></span><strong>' + item.title + '</strong><p>' + item.text + '</p><div class="meta" style="margin-top:4px">' + (item.time || "Just now") + '</div></li>';
      }).join("") +
      '</ul>' +
      '<div class="dropdown-foot"><button id="markReadBtn">Mark all as read</button></div>';

    var markBtn = menu.querySelector("#markReadBtn");
    if (markBtn) {
      markBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        window.CS.attention = [];
        renderNotifications();
        window.showToast("All notifications marked as read");
        menu.classList.remove("active");
      });
    }
  }

  function renderProfileMenu() {
    var menu = document.querySelector("#profileMenu");
    if (!menu) return;
    var store = window.CS;

    menu.innerHTML = '<div class="profile-card">' +
      '<div class="p-name">' + (store.manager || "Lakshmi Narayanan") + '</div>' +
      '<div class="p-role">' + (store.role || "Store Operations Lead") + '</div>' +
      '<div class="p-store">● ' + store.name + ' (' + store.city + ')</div>' +
      '</div>' +
      '<div class="profile-actions">' +
      '<a class="profile-link" href="dashboard.html">Command Center</a>' +
      '<a class="profile-link" href="what-if.html">What-If Scenarios</a>' +
      '<a class="profile-link" href="assistant.html">Retail Assistant</a>' +
      '<div style="border-top:1px solid var(--border);margin:4px 0"></div>' +
      '<div class="profile-link" id="roleSwitchDemo">Switch to Regional Manager</div>' +
      '</div>';

    var switchRole = menu.querySelector("#roleSwitchDemo");
    if (switchRole) {
      switchRole.addEventListener("click", function (e) {
        e.stopPropagation();
        window.showToast("Switched role to Regional Manager (Chennai North)");
        menu.classList.remove("active");
      });
    }
  }

  // Toast system
  window.showToast = function (msg) {
    var toast = document.querySelector("#appToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "appToast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("active");
    clearTimeout(window.__toastTimeout);
    window.__toastTimeout = setTimeout(function () {
      toast.classList.remove("active");
    }, 2800);
  };

  // Reorder Modal helper
  window.openReorderModal = function (product) {
    var modalBackdrop = document.querySelector("#reorderModalBackdrop");
    if (!modalBackdrop) {
      modalBackdrop = document.createElement("div");
      modalBackdrop.id = "reorderModalBackdrop";
      modalBackdrop.className = "modal-backdrop";
      document.body.appendChild(modalBackdrop);
    }

    var defaultQty = product ? (product.reorderQty || 100) : 100;
    var price = product ? (product.cost || product.price || 40) : 40;
    var name = product ? product.name : "Milk 500ml";
    var supplier = product ? (product.supplier || "Direct Primary Supplier") : "Heritage Foods Ltd.";
    var leadTime = product ? (product.leadTimeDays || 2) : 2;

    modalBackdrop.innerHTML = '<div class="modal">' +
      '<div class="modal-head"><h3>Purchase order reorder</h3><button class="icon-btn" id="closeModalBtn" aria-label="Close">✕</button></div>' +
      '<div class="modal-body">' +
      '<div><label class="meta">Product</label><div style="font-weight:600;font-size:1rem;margin-top:2px">' + name + '</div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">' +
      '<div><label class="meta">Supplier</label><div style="font-weight:500;margin-top:2px">' + supplier + '</div></div>' +
      '<div><label class="meta">Lead time</label><div style="font-weight:500;margin-top:2px">' + leadTime + ' days</div></div>' +
      '</div>' +
      '<div><label class="meta">Order quantity (units)</label>' +
      '<div class="stepper" style="margin-top:6px;width:100%;justify-content:space-between">' +
      '<button class="stepper-btn" id="mMinus">−</button>' +
      '<span class="stepper-val" id="mQty">' + defaultQty + '</span>' +
      '<button class="stepper-btn" id="mPlus">+</button>' +
      '</div></div>' +
      '<div class="kv"><div><span class="meta">Estimated cost</span><strong id="mCost">₹' + (defaultQty * price).toLocaleString("en-IN") + '</strong></div>' +
      '<div><span class="meta">Expected arrival</span><strong>' + leadTime + ' days</strong></div></div>' +
      '</div>' +
      '<div class="modal-foot">' +
      '<button class="btn" id="mCancel">Cancel</button>' +
      '<button class="btn btn-primary" id="mConfirm">Submit purchase order</button>' +
      '</div>' +
      '</div>';

    modalBackdrop.classList.add("active");

    var qtyEl = modalBackdrop.querySelector("#mQty");
    var costEl = modalBackdrop.querySelector("#mCost");
    var currentQty = defaultQty;

    function updateModalCost() {
      qtyEl.textContent = currentQty;
      costEl.textContent = "₹" + (currentQty * price).toLocaleString("en-IN");
    }

    modalBackdrop.querySelector("#mMinus").onclick = function () {
      if (currentQty > 10) currentQty -= 10;
      updateModalCost();
    };
    modalBackdrop.querySelector("#mPlus").onclick = function () {
      currentQty += 10;
      updateModalCost();
    };
    modalBackdrop.querySelector("#closeModalBtn").onclick = closeModal;
    modalBackdrop.querySelector("#mCancel").onclick = closeModal;
    modalBackdrop.querySelector("#mConfirm").onclick = function () {
      closeModal();
      window.showToast("Purchase order of " + currentQty + " units placed for " + name);
    };

    modalBackdrop.onclick = function (e) {
      if (e.target === modalBackdrop) closeModal();
    };
  };

  function closeModal() {
    var modalBackdrop = document.querySelector("#reorderModalBackdrop");
    if (modalBackdrop) modalBackdrop.classList.remove("active");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShell);
  } else {
    initShell();
  }
})();
