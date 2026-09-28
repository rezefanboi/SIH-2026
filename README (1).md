# CartSence: base project

A starter for CartSence, a professional retail intelligence app (inventory, demand forecast, waste control, sales, assistant, what-if analysis).

This is plain HTML, CSS and JavaScript. There is no build step, no framework and no npm install. Everything runs by opening a file in a browser.

The visual direction is **professional, clean, trustworthy and business-oriented**. It is not futuristic, not cyberpunk and not an "AI lab". If an element looks impressive but doesn't improve understanding, decisions, navigation, data interpretation or credibility, remove it.

---

## 1. Quick start

1. Keep the folder structure exactly as it is (`css/` and `js/` sit next to the HTML files).
2. Open `index.html` (landing page) or `dashboard.html` (Command Center) in a browser.
3. Click the sun/moon icon in the top right to switch themes. The choice is saved and survives reloads.

For real development, use a local server so paths behave like production:

```bash
# any one of these, run inside the cartsence/ folder
python3 -m http.server 5500
npx serve .
```

In VS Code you can also use the **Live Server** extension. Then visit `http://localhost:5500`.

**Note:** the font (IBM Plex Sans) loads from Google Fonts, so you need an internet connection to see it. Offline, the page falls back to your system font and still works.

---

## 2. What's in the box

```
cartsence/
├── index.html          Landing page
├── dashboard.html      Command Center (main app screen)
├── README.md           This file
├── css/
│   ├── tokens.css      Colors, fonts, spacing, radii for light and dark themes
│   ├── base.css        Reset, typography, focus ring, reduced-motion
│   ├── components.css  Nav, buttons, cards, badges, tables, lists, chart styles
│   └── layout.css      Page grids, breakpoints, landing layout
└── js/
    ├── theme.js        Theme toggle + localStorage persistence
    ├── data.js         Placeholder data (window.CS)
    ├── charts.js       Small SVG line chart: lineChart(el, options)
    └── dashboard.js    Renders dashboard sections from data.js
```

### Load order matters

Each page loads its CSS in this order: `tokens → base → components → layout`. Tokens come first because everything else reads from them.

`theme.js` is loaded in the `<head>` **without** `defer`. This is intentional: it sets the theme before the page paints, which prevents a flash of the wrong theme.

The dashboard scripts load at the end of `<body>` in this order: `data.js → charts.js → dashboard.js`, because `dashboard.js` uses both of the others.

---

## 3. How theming works

All colors live as CSS variables in `css/tokens.css`.

- `:root` holds the **light** theme (the default).
- `:root[data-theme="dark"]` overrides the same variables for **dark** mode.

`theme.js` sets `data-theme="light"` or `data-theme="dark"` on `<html>` and stores the choice in `localStorage` under the key `cartsence-theme`.

**The one rule:** never hard-code a hex color in a component. Use a variable (`var(--surface)`, `var(--text-2)`, ...). Then both themes work automatically.

| Token | Meaning |
|---|---|
| `--bg` | Page background |
| `--surface` / `--surface-2` | Cards and panels / secondary areas (table headers, hover) |
| `--border` | All borders and dividers |
| `--text` / `--text-2` / `--text-3` | Primary / secondary / muted text |
| `--accent`, `--accent-hover`, `--accent-soft` | The single brand accent (restrained green) |
| `--success` `--warning` `--danger` `--info` | Status colors, with matching `-soft` backgrounds |
| `--chart-1`, `--chart-2`, `--grid` | Chart line colors and grid lines |

### Changing the accent color

Edit `--accent`, `--accent-hover`, `--accent-soft` and `--on-accent` in **both** the light and dark blocks. Keep it restrained. Your design doc says "professional green or blue". If you switch to blue, also update `--chart-1` if you want it to differ from the accent.

### Adding a new token

1. Add it to `:root` (light).
2. Add the dark value to `:root[data-theme="dark"]`.
3. Use it as `var(--your-token)`.

Skipping step 2 is the most common cause of a component that looks fine in one theme and broken in the other.

---

## 4. Design rules (checklist)

Use this before you add anything new.

**Do**
- Use clean grids, generous spacing and clear hierarchy: page title, section heading, metric, supporting text, metadata.
- Use 8 to 12px card radius (`--radius` is 10px). Use `--radius-sm` (6px) for buttons and inputs.
- Show inventory as **compact tables**, not a wall of cards.
- Use color **only when it carries meaning**: green means healthy, yellow means needs attention, red means urgent, blue means informational. Everything else stays neutral.
- Write concise, specific, evidence-based copy, like an analyst sitting beside the retailer.
- Show the reasoning behind AI output: evidence bullets, a recommended quantity, and a plain confidence number.
- Keep motion subtle: fades, slides, hover states, number and chart transitions.

**Don't**
- No glows, neon, glassmorphism, particles, holograms, 3D, "AI brain" imagery or gradient text.
- No 30 to 40px rounded cards, and no pill shapes everywhere.
- No giant glowing AI percentages. Confidence is just a normal metric.
- No "AI detected a HUGE anomaly!!!". Write "Demand anomaly detected. Beverage sales are 27% above the four-week average."
- No rainbow, 3D or decorative charts.

**Writing style for UI copy:** sentence case, plain verbs, and a button that says exactly what it does ("Run scenario", not "Submit").

---

## 5. How the dashboard is built

`dashboard.html` is mostly empty containers. `dashboard.js` fills them from `window.CS` (defined in `data.js`).

| Container ID | Filled with | Data source |
|---|---|---|
| `#greeting` | Time-based greeting | `Date` (browser clock) |
| `#kpis` | Four metric cards | `CS.kpis` |
| `#chart` | Sales vs forecast line chart | `CS.days`, `CS.sales`, `CS.forecast` |
| `#attention` | Stockout, expiry and anomaly list | `CS.attention` |
| `#inventory` | Table body rows | `CS.products` |
| `#recommendation` | Evidence-based recommendation | `CS.recommendation` |

### Editing the placeholder data

Open `js/data.js` and change the values. Refresh the page. That's it.

- `risk` on a product must be `"high"`, `"medium"` or `"low"`. It drives the badge and the row highlight (high-risk rows get a subtle tint).
- `level` on an attention item must be `"high"`, `"medium"` or anything else (which renders blue/info).
- In `sales`, use `null` for days that haven't happened yet. The chart line stops there.

### Using the chart

```js
lineChart(document.querySelector("#chart"), {
  label: "Sales and forecast for the week",   // accessible description
  labels: ["Mon", "Tue", "Wed"],               // x-axis
  format: v => "₹" + v.toLocaleString("en-IN"),// tooltip number format
  series: [
    { name: "Actual sales", values: [41200, 43800, 42100], color: "var(--chart-1)" },
    { name: "Forecast",     values: [40500, 42900, 43300], color: "var(--chart-2)", dashed: true }
  ]
});
```

Colors are passed as CSS variables, so charts follow the theme automatically. Calling `lineChart` again on the same element re-renders it (useful for the what-if page).

### Known chart limitations

- The SVG uses `preserveAspectRatio="none"`, so on very wide or narrow containers the **text labels can look stretched**. If that bothers you, either give the chart a fixed aspect ratio, or switch to a library (Chart.js or Recharts) and keep the same styling rules.
- The y-axis rounds to the nearest 10,000, so it suits rupee-scale sales values. For small numbers (percentages, units) adjust the rounding in `charts.js`.
- Line charts only. Bar and area charts are on you (or on a library).

---

## 6. Adding a new page

Example: an Inventory page.

1. Copy `dashboard.html` to `inventory.html`.
2. In the `<nav>`, move `aria-current="page"` from "Command Center" to "Inventory", and point the nav links at real files (currently they are `href="#"`).
3. Replace the `<main>` content. Reuse the existing pieces:
   - `.page` is the centered container with spacing.
   - `.page-head` is the title row with an optional action button.
   - `.grid-4` is a row of four metric cards, `.grid-main` is a 2/3 + 1/3 split.
   - `.card`, `.card-head`, `.card-body` are the standard panel.
   - `.table-wrap > table` is the standard table. Use `.num` on numeric columns to right-align them.
4. Add `js/inventory.js` if it needs rendering logic, and load it at the bottom of the page.

Tip: the nav and top-bar HTML is duplicated across pages right now. When you have 4 or more pages, either move it into a small JS include or move to a framework (see section 9).

---

## 7. Roadmap: what still needs building

Suggested order. The specs come straight from your design document.

### A. Navigation and shared shell
- Point the nav links at real pages.
- Make the store selector, date selector and notifications bell actually do something (currently the two `<select>` elements are visual only, and the bell has no dropdown).
- Add a simple profile menu.

### B. What-If (Scenario Analysis): highest-value feature
Layout: inputs on the left, results on the right.

Inputs:
- Demand increase, with a `−` / `+` stepper (for example 25%)
- Forecast period (for example 7 days)

Outputs (all recalculate as the input changes, with number transitions):
- Projected revenue (for example ₹3.84L)
- Projected stockouts (for example 11)
- Additional inventory required (for example 482 units)
- Potential lost sales (for example ₹18,420)
- Recommended action (for example "Increase inventory for 8 high-velocity products")

Also update the forecast chart and the inventory projection. The power comes from the data changing logically in front of the user, with no flashy effects.

**Logic sketch:** for each product, `projected demand = daily × (1 + increase) × days`. If that exceeds `stock`, the shortfall is additional inventory required, and `shortfall × price` is potential lost sales. Add a `price` field to the products in `data.js` to support this.

### C. Store Simulation
Current state (revenue, inventory units, at-risk inventory), then a "simulate demand increase" control. Same engine as What-If, presented as a summary.

### D. Inventory page
A full product table with sorting, search, and a filter by risk level. Keep it a table, not cards.

### E. Forecast, Waste Control, Sales
- **Forecast:** chart plus a per-category demand table
- **Waste Control:** expiry-risk list, at-risk value, suggested actions (markdown, transfer, reorder less)
- **Sales:** trend chart, top and bottom products, category breakdown

### F. Assistant
A chat-style analyst. Keep the tone concise and evidence-based. The sparkle or message icon should be used **very subtly**.

### G. Polish
- Icons (Lucide recommended; the nav currently has none)
- Loading and empty states ("No expiry risks this week" with a next action)
- A mobile navigation menu (the nav currently scrolls horizontally on small screens)
- Number count-up on KPI values and chart draw-in transitions

---

## 8. Connecting real data

Right now everything comes from `data.js`. To move to a real backend, keep the **same shape** of the objects in `window.CS` and load them instead of hard-coding:

```js
// js/api.js (example)
async function loadDashboard(storeId, range) {
  const res = await fetch(`/api/dashboard?store=${storeId}&range=${range}`);
  window.CS = await res.json();
}
// then in dashboard.js: await loadDashboard(...); renderEverything();
```

To do this, wrap the rendering code in `dashboard.js` in a function (for example `render()`), and call it after the data arrives. It also lets the store and date selectors trigger a re-render.

For a college project or demo, a good middle step is a `products.csv` or JSON file that you `fetch()` locally. Most browsers block `fetch` on `file://` URLs, so run a local server (section 1).

The confidence percentage and forecast should come from an actual model (for example a simple moving average or exponential smoothing in Python), not a made-up number. Judges will ask how it's calculated.

---

## 9. Growing beyond plain HTML

When the pages start repeating each other (3 to 5 pages), consider moving to **React + Vite** (or Next.js):

- Turn `.card`, `.badge`, table rows and the top bar into components.
- Copy `css/tokens.css`, `base.css`, `components.css` and `layout.css` over unchanged. The class names and variables work as they are.
- Replace `charts.js` with Recharts or Chart.js, styled with the same `var(--...)` colors.
- Keep `theme.js`'s logic (set `data-theme` on `<html>`, persist in `localStorage`).

Don't migrate before you need to. Plain files are faster to iterate on.

---

## 10. Accessibility and quality checklist

Already handled:
- Visible keyboard focus ring (`:focus-visible`)
- `prefers-reduced-motion` disables transitions and animations
- Icon-only buttons have `aria-label`s
- Chart has a text `aria-label`
- Layout is responsive (4 columns, then 2, then 1)
- `font-variant-numeric: tabular-nums` keeps numbers aligned in tables

Check as you build:
- Text contrast in both themes (especially `--text-3` on `--surface`)
- Every new interactive element is reachable with Tab
- Status is never shown by color alone (badges carry a text label like "High")
- Test at 375px wide, 768px and 1280px

---

## 11. Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Page looks unstyled | CSS paths broken. Keep `css/` next to the HTML files. |
| Dashboard is empty | Open the browser console (F12). Usually a script load-order or path issue (`data.js` must load before `dashboard.js`). |
| Theme flashes on load | `theme.js` must stay in `<head>` with no `defer` or `async`. |
| Theme toggle does nothing | The button needs the `data-theme-toggle` attribute, and `theme.js` must be loaded on that page. |
| Theme doesn't persist | Browser blocks `localStorage` (private mode or some `file://` setups). Use a local server. |
| Component looks wrong in dark mode | It uses a hard-coded color or a token missing its dark value (section 3). |
| Font looks different | Google Fonts isn't loading (offline). The system font fallback is used. |
| High-risk row has no tint in an old browser | `color-mix()` needs a modern browser (2023+). Replace it with a solid `var(--danger-soft)` if you must support older ones. |

---

## 12. Deploying

The project is static files, so any static host works:

- **GitHub Pages:** push the folder to a repo, then Settings, Pages, deploy from the main branch.
- **Netlify or Vercel:** drag and drop the folder, or connect the repo. No build command is needed.

Make sure `index.html` sits at the root of what you deploy.

---

## 13. The one-line reminder

CartSence should look like software that exists today: **Trust → Clarity → Intelligence → Control**. It should be sophisticated because it's well designed, not because it has effects.
