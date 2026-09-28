// Load in <head> WITHOUT defer so the saved theme applies before first paint.
(function () {
  var KEY = "cartsence-theme", root = document.documentElement;
  var saved; try { saved = localStorage.getItem(KEY); } catch (e) {}
  root.setAttribute("data-theme", saved === "dark" ? "dark" : "light"); // light is the default
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
      });
    });
  });
})();
