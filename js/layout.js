/* =========================================================
   Massage Magic – Kopfzeile (Menü) und Fußzeile
   ---------------------------------------------------------
   Menü und Fußzeile stehen nur HIER und werden automatisch
   auf jeder Seite eingefügt. Änderst du hier einen Link,
   ändert er sich überall.
   ========================================================= */

const SHOP = {
  name: "Massage Magic",
  email: "hallo@massage-magic.de", // PLATZHALTER: deine E-Mail-Adresse
  slogan: "Power für deine Regeneration."
};

const NAV_LINKS = [
  { href: "index.html#produkte", label: "Produkte" },
  { href: "index.html#vergleich", label: "Vergleich" },
  { href: "index.html#anleitung", label: "Anleitung" },
  { href: "faq.html", label: "FAQ" },
  { href: "ueber-uns.html", label: "Über uns" },
  { href: "kontakt.html", label: "Kontakt" }
];

const LEGAL_LINKS = [
  { href: "impressum.html", label: "Impressum" },
  { href: "datenschutz.html", label: "Datenschutz" },
  { href: "agb.html", label: "AGB" },
  { href: "widerruf.html", label: "Widerrufsbelehrung" },
  { href: "versand.html", label: "Versand & Zahlung" }
];

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const current = location.pathname.split("/").pop() || "index.html";
  const links = NAV_LINKS.map(l => {
    const isCurrent = l.href === current ? ' aria-current="page"' : "";
    return `<li><a href="${l.href}"${isCurrent}>${l.label}</a></li>`;
  }).join("");

  el.outerHTML = `
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html" aria-label="${SHOP.name} – Startseite">
        <span class="logo-mark">M</span>${SHOP.name}
      </a>
      <button class="nav-toggle" aria-label="Menü öffnen" aria-expanded="false" aria-controls="main-nav"><span></span></button>
      <nav class="main-nav" id="main-nav" aria-label="Hauptmenü">
        <ul>
          ${links}
          <li><a class="btn btn--primary btn--sm" href="index.html#produkte">Jetzt kaufen</a></li>
        </ul>
      </nav>
    </div>
  </header>`;

  const toggle = document.querySelector(".nav-toggle");
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  });
  document.querySelectorAll(".main-nav a").forEach(a =>
    a.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const year = new Date().getFullYear();
  const legal = LEGAL_LINKS.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join("");

  el.outerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <a class="logo" href="index.html"><span class="logo-mark">M</span>${SHOP.name}</a>
          <p>${SHOP.slogan} Massagepistolen für Sport, Alltag und Büro.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="index.html#produkte">Alle Produkte</a></li>
            <li><a href="index.html#vergleich">Modelle vergleichen</a></li>
            <li><a href="index.html#anleitung">Anleitung</a></li>
            <li><a href="faq.html">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Unternehmen</h4>
          <ul>
            <li><a href="ueber-uns.html">Über uns</a></li>
            <li><a href="kontakt.html">Kontakt</a></li>
            <li><a href="mailto:${SHOP.email}">${SHOP.email}</a></li>
          </ul>
        </div>
        <div>
          <h4>Rechtliches</h4>
          <ul>${legal}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} ${SHOP.name}. Alle Rechte vorbehalten.</span>
        <span>Sichere Zahlung über Stripe</span>
      </div>
    </div>
  </footer>
  <div class="toast" role="status" aria-live="polite"></div>`;

  // E-Mail-Adresse überall einsetzen, wo data-shop-email steht
  document.querySelectorAll("[data-shop-email]").forEach(a => {
    a.href = `mailto:${SHOP.email}`;
    a.textContent = SHOP.email;
  });
}

/* Kleiner Hinweis unten am Bildschirm */
function showToast(message) {
  const toast = document.querySelector(".toast");
  if (!toast) return alert(message);
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 3500);
}

/* Solange ein Stripe-Link noch ein Platzhalter ist, wird beim
   Klick ein Hinweis angezeigt statt auf eine kaputte Seite zu führen. */
document.addEventListener("click", e => {
  const link = e.target.closest("a[href*='PLATZHALTER']");
  if (!link) return;
  e.preventDefault();
  showToast("Der Bezahl-Link wird gerade eingerichtet – bald verfügbar!");
});

renderHeader();
renderFooter();
