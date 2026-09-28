// Dependency-free SVG line chart. lineChart(el, { labels, series:[{name, values, color, dashed}], format, isCurrency })
function lineChart(el, o) {
  if (!el) return;
  var W = 640, H = 240, m = { t: 16, r: 16, b: 28, l: 52 };
  var all = o.series.flatMap(function (s) { return s.values.filter(function (v) { return v != null; }); });
  if (all.length === 0) {
    el.innerHTML = '<div style="display:grid;place-items:center;height:100%;color:var(--text-3);font-size:var(--fs-meta)">No data points available</div>';
    return;
  }
  
  var rawMax = Math.max.apply(null, all);
  var rawMin = Math.min.apply(null, all);
  
  var step = 10000;
  if (rawMax < 100) step = 10;
  else if (rawMax < 1000) step = 100;
  else if (rawMax < 5000) step = 500;
  else if (rawMax < 20000) step = 2000;
  else if (rawMax < 50000) step = 5000;
  
  var max = Math.ceil(rawMax / step) * step;
  var min = Math.max(0, Math.floor(rawMin / step) * step - step);
  if (max === min) { max += step; min = Math.max(0, min - step); }

  var n = o.labels.length;
  var x = function (i) { return m.l + i * (W - m.l - m.r) / Math.max(1, n - 1); };
  var y = function (v) { return m.t + (1 - (v - min) / (max - min)) * (H - m.t - m.b); };
  var fmt = o.format || function (v) { return typeof v === 'number' ? v.toLocaleString('en-IN') : v; };

  var svg = "";
  for (var g = 0; g <= 4; g++) {
    var gv = min + g * (max - min) / 4;
    var tickLabel = gv >= 1000 ? Math.round(gv / 1000) + 'k' : Math.round(gv);
    if (o.isCurrency && gv >= 100000) tickLabel = '₹' + (gv / 100000).toFixed(1) + 'L';
    else if (o.isCurrency) tickLabel = '₹' + tickLabel;

    svg += '<line class="grid" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(gv) + '" y2="' + y(gv) + '"/>' +
           '<text x="' + (m.l - 8) + '" y="' + (y(gv) + 4) + '" text-anchor="end">' + tickLabel + '</text>';
  }

  o.labels.forEach(function (l, i) {
    svg += '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + l + '</text>';
  });

  o.series.forEach(function (s) {
    var d = "";
    s.values.forEach(function (v, i) {
      if (v != null) d += (d ? " L " : "M ") + x(i) + " " + y(v);
    });
    if (d) {
      svg += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="2.2"' +
             (s.dashed ? ' stroke-dasharray="5 4"' : '') + ' stroke-linecap="round" stroke-linejoin="round"/>';
    }
  });

  svg += '<line id="cs-cursor" class="grid" y1="' + m.t + '" y2="' + (H - m.b) + '" x1="0" x2="0" opacity="0"/>';
  el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="' + (o.label || "Line chart") + '">' + svg + '</svg><div class="tip"></div>';

  var tip = el.querySelector(".tip"), cur = el.querySelector("#cs-cursor");
  el.onmousemove = function (e) {
    var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * W;
    var i = Math.max(0, Math.min(n - 1, Math.round((px - m.l) / ((W - m.l - m.r) / Math.max(1, n - 1)))));
    cur.setAttribute("x1", x(i));
    cur.setAttribute("x2", x(i));
    cur.setAttribute("opacity", 1);
    
    var lines = o.series.map(function (s) {
      return '<span style="color:' + s.color + '">■</span> ' + s.name + ': <strong>' + (s.values[i] == null ? "–" : fmt(s.values[i])) + '</strong>';
    });
    tip.innerHTML = '<div style="font-weight:600;margin-bottom:4px;border-bottom:1px solid var(--border);padding-bottom:2px">' + o.labels[i] + '</div>' + lines.join("<br>");
    tip.style.opacity = 1;
    var tipLeft = e.clientX - r.left + 12;
    if (tipLeft + 160 > r.width) tipLeft = e.clientX - r.left - 170;
    tip.style.left = Math.max(4, tipLeft) + "px";
    tip.style.top = "12px";
  };
  el.onmouseleave = function () {
    tip.style.opacity = 0;
    cur.setAttribute("opacity", 0);
  };
}
