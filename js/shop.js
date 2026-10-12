/* =========================================================
   Massage Magic – Produkte anzeigen
   ---------------------------------------------------------
   Liest products.json und baut daraus:
   - die Produktkarten (Startseite)
   - die Vergleichstabelle (Startseite)
   - die Produkt-Detailseite (produkt.html?id=...)
   Hier musst du normalerweise nichts ändern – Produkte
   pflegst du ausschließlich in products.json.
   ========================================================= */

const CATEGORY_LABELS = {
  massagepistole: "Massagepistolen",
  zubehoer: "Zubehör"
};

let currency = "EUR";

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function formatPrice(value) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(value);
}

async function loadProducts() {
  const res = await fetch("products.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("products.json konnte nicht geladen werden");
  const data = await res.json();
  currency = data.waehrung || "EUR";
  return data.produkte || [];
}

function buyButton(p, cls = "") {
  return `<a class="btn btn--primary ${cls}" href="${esc(p.stripeLink)}" rel="noopener">Kaufen</a>`;
}

function productCard(p) {
  const img = (p.bilder && p.bilder[0]) || "images/hero.svg";
  return `
  <article class="product-card${p.highlight ? " product-card--highlight" : ""}">
    ${p.highlight ? '<span class="product-badge">Empfehlung</span>' : ""}
    <a href="produkt.html?id=${encodeURIComponent(p.id)}">
      <img src="${esc(img)}" alt="${esc(p.name)}" loading="lazy" width="800" height="600">
    </a>
    <div class="product-body">
      <h3>${esc(p.name)}</h3>
      ${p.untertitel ? `<div class="product-sub">${esc(p.untertitel)}</div>` : ""}
      <p>${esc(p.kurzbeschreibung)}</p>
      <div class="product-price">${formatPrice(p.preis)} <small>inkl. MwSt.</small></div>
      <div class="product-actions">
        <a class="btn btn--ghost" href="produkt.html?id=${encodeURIComponent(p.id)}">Details</a>
        ${buyButton(p)}
      </div>
    </div>
  </article>`;
}

/* Produktkarten in alle Elemente mit data-product-grid einfügen.
   data-product-grid="massagepistole" zeigt nur diese Kategorie.
   Ist eine Kategorie leer, wird der zugehörige Abschnitt ausgeblendet. */
function renderGrids(products) {
  document.querySelectorAll("[data-product-grid]:not([data-product-grid='andere'])").forEach(grid => {
    const cat = grid.dataset.productGrid;
    const list = cat ? products.filter(p => p.kategorie === cat) : products;
    const section = grid.closest("[data-hide-if-empty]");
    if (!list.length) {
      if (section) section.hidden = true;
      else grid.innerHTML = '<p class="loading">Hier gibt es bald neue Produkte.</p>';
      return;
    }
    if (section) section.hidden = false;
    grid.innerHTML = list.map(productCard).join("");
  });
}

function renderComparison(products) {
  const wrap = document.getElementById("compare-table");
  if (!wrap) return;
  const guns = products.filter(p => p.kategorie === "massagepistole");
  const section = wrap.closest("[data-hide-if-empty]");
  if (guns.length < 2) { if (section) section.hidden = true; return; }

  // Alle Merkmale sammeln, die in mindestens einem Produkt vorkommen
  const keys = [];
  guns.forEach(p => Object.keys(p.technischeDaten || {}).forEach(k => { if (!keys.includes(k)) keys.push(k); }));

  const hl = p => (p.highlight ? ' class="is-highlight"' : "");
  const head = guns.map(p => `<th scope="col"${hl(p)}>${esc(p.name)}</th>`).join("");
  const rows = keys.map(k => `
    <tr><th scope="row">${esc(k)}</th>${guns.map(p => `<td${hl(p)}>${esc((p.technischeDaten || {})[k] ?? "–")}</td>`).join("")}</tr>`).join("");

  wrap.innerHTML = `
  <div class="table-wrap">
    <table class="compare">
      <thead><tr><th scope="col">Modell</th>${head}</tr></thead>
      <tbody>
        <tr class="row-price"><th scope="row">Preis</th>${guns.map(p => `<td${hl(p)}>${formatPrice(p.preis)}</td>`).join("")}</tr>
        ${rows}
        <tr><th scope="row"></th>${guns.map(p => `<td${hl(p)}>${buyButton(p, "btn--sm")}</td>`).join("")}</tr>
      </tbody>
    </table>
  </div>
  <p class="table-hint">← Tabelle seitlich wischen →</p>`;
}

function renderDetail(products) {
  const root = document.getElementById("product-detail");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = products.find(x => x.id === id);

  if (!p) {
    root.innerHTML = `
      <div class="prose" style="padding-left:0">
        <h1>Produkt nicht gefunden</h1>
        <p>Dieses Produkt gibt es leider nicht (mehr).</p>
        <a class="btn btn--primary" href="index.html#produkte">Zur Produktübersicht</a>
      </div>`;
    return;
  }

  document.title = `${p.name} – Massage Magic`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", p.kurzbeschreibung);
  document.getElementById("crumb-name").textContent = p.name;

  const images = p.bilder && p.bilder.length ? p.bilder : ["images/hero.svg"];
  const thumbs = images.length > 1 ? `
    <div class="gallery-thumbs">
      ${images.map((src, i) => `
        <button type="button" data-src="${esc(src)}" aria-label="Bild ${i + 1} anzeigen"${i === 0 ? ' aria-current="true"' : ""}>
          <img src="${esc(src)}" alt="" loading="lazy" width="800" height="600">
        </button>`).join("")}
    </div>` : "";

  const specs = Object.entries(p.technischeDaten || {})
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
  const box = (p.lieferumfang || []).map(item => `<li>${esc(item)}</li>`).join("");

  root.innerHTML = `
  <div class="detail">
    <div>
      <div class="gallery-main"><img id="gallery-main" src="${esc(images[0])}" alt="${esc(p.name)}" width="800" height="600"></div>
      ${thumbs}
    </div>
    <div class="detail-info">
      <div class="detail-buy">
        <span class="eyebrow">${esc(CATEGORY_LABELS[p.kategorie] || "")}</span>
        <h1>${esc(p.name)}</h1>
        ${p.untertitel ? `<div class="product-sub">${esc(p.untertitel)}</div>` : ""}
        <div class="detail-price">${formatPrice(p.preis)}</div>
        <div class="detail-tax">inkl. MwSt., zzgl. <a href="versand.html">Versandkosten</a></div>
        <p class="muted">${esc(p.beschreibung || p.kurzbeschreibung)}</p>
        ${buyButton(p, "btn--block")}
        <ul class="usp-list">
          <li>Sichere Zahlung über Stripe</li>
          <li>Schneller Versand innerhalb Deutschlands</li>
          <li>14 Tage Widerrufsrecht</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="detail" style="padding-top:0">
    ${specs ? `<section class="detail-section"><h2>Technische Daten</h2><dl class="spec-list">${specs}</dl></section>` : ""}
    ${box ? `<section class="detail-section"><h2>Lieferumfang</h2><ul class="box-list">${box}</ul></section>` : ""}
  </div>`;

  // Galerie: Klick auf Vorschaubild tauscht das große Bild
  const main = document.getElementById("gallery-main");
  root.querySelectorAll(".gallery-thumbs button").forEach(btn => {
    btn.addEventListener("click", () => {
      main.src = btn.dataset.src;
      root.querySelectorAll(".gallery-thumbs button").forEach(b => b.removeAttribute("aria-current"));
      btn.setAttribute("aria-current", "true");
    });
  });

  // Weitere Modelle anzeigen
  const others = document.querySelector('[data-product-grid="andere"]');
  if (others) {
    const rest = products.filter(x => x.id !== p.id && x.kategorie === p.kategorie);
    if (rest.length) others.innerHTML = rest.map(productCard).join("");
    else others.closest("section").hidden = true;
  }
}

loadProducts()
  .then(products => {
    renderGrids(products);
    renderComparison(products);
    renderDetail(products);
  })
  .catch(err => {
    console.error(err);
    document.querySelectorAll("[data-product-grid], #compare-table, #product-detail").forEach(el => {
      el.innerHTML = '<p class="loading">Die Produkte konnten gerade nicht geladen werden. Bitte lade die Seite neu.</p>';
    });
  });
