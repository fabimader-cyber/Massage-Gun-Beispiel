# Massage Magic – Online-Shop

Statische Website (HTML, CSS, JavaScript) für den Verkauf von Massagepistolen.
Keine Datenbank, kein Server – läuft kostenlos über GitHub Pages.

## Dateien im Überblick

| Datei / Ordner | Wofür? |
|---|---|
| `products.json` | **Alle Produkte** (Name, Preis, Texte, technische Daten, Lieferumfang, Bilder, Stripe-Link) |
| `index.html` | Startseite (Hero, Vorteile, Produkte, Vergleich, Anleitung, Bewertungen, FAQ) |
| `produkt.html` | Detailseite – füllt sich automatisch, z. B. `produkt.html?id=magic-pro` |
| `faq.html`, `ueber-uns.html`, `kontakt.html` | Weitere Seiten |
| `impressum.html`, `datenschutz.html`, `agb.html`, `widerruf.html`, `versand.html` | Rechtstexte (Platzhalter – bitte ausfüllen) |
| `css/style.css` | Design. Farben ganz oben unter `:root` |
| `js/layout.js` | Menü, Fußzeile und **deine E-Mail-Adresse** (für alle Seiten) |
| `js/shop.js` | Liest `products.json` und baut die Produktansichten – muss nicht geändert werden |
| `images/` | Bilder (aktuell Platzhalter) |

Texte in `[eckigen Klammern]` sind Platzhalter, die du ersetzen solltest.

## Produkt ändern oder hinzufügen

1. `products.json` öffnen (auf GitHub: Datei anklicken → Stift-Symbol).
2. Einen bestehenden Produktblock `{ ... }` kopieren und hinter dem letzten einfügen.
   Zwischen zwei Blöcken muss ein **Komma** stehen, nach dem letzten **keins**.
3. Werte anpassen:
   - `id`: eindeutig, klein, ohne Leerzeichen (z. B. `magic-ultra`) – erscheint in der Adresse
   - `kategorie`: `massagepistole` oder `zubehoer`
     (Zubehör erscheint automatisch in einem eigenen Abschnitt auf der Startseite)
   - `preis`: mit **Punkt** statt Komma, z. B. `149.99`
   - `highlight`: `true` = Produkt bekommt das Badge „Empfehlung“
   - `technischeDaten`: beliebige Zeilen `"Name": "Wert"` – erscheinen auf der Detailseite und in der Vergleichstabelle
   - `stripeLink`: dein Stripe Payment Link
4. Speichern („Commit changes“). Nach 1–2 Minuten ist es online.

Tipp: Wenn nach einer Änderung keine Produkte mehr erscheinen, ist meist ein Komma oder
Anführungszeichen falsch. Prüfen kannst du die Datei z. B. auf https://jsonlint.com.

## Stripe-Links eintragen

In Stripe unter **Payment Links** pro Produkt einen Link erstellen und in `products.json`
bei `stripeLink` statt `https://buy.stripe.com/PLATZHALTER-...` einfügen.
Solange `PLATZHALTER` im Link steht, zeigt der Button nur den Hinweis „bald verfügbar“.

## Eigene Bilder einsetzen

1. Fotos am besten im Format **4:3** (z. B. 1600 × 1200 px) als `.jpg` oder `.webp`, möglichst unter 300 KB.
2. Auf GitHub in den Ordner `images/produkte` gehen → **Add file → Upload files**.
3. In `products.json` bei `bilder` die Dateinamen eintragen, z. B. `"images/produkte/magic-pro-front.jpg"`.
   Das erste Bild ist das Hauptbild, beliebig viele weitere erscheinen in der Galerie.
4. Hero-Bild: `images/hero.jpg` hochladen und in `index.html` `images/hero.svg` durch `images/hero.jpg` ersetzen.
   Gleiches für `images/ueber-uns.svg` in `ueber-uns.html`.

## Farbe & E-Mail ändern

- **Akzentfarbe:** `css/style.css`, ganz oben `--accent: #ff5a1f;` (z. B. `#00e0a4` für Mint, `#3d7bff` für Blau).
- **E-Mail-Adresse:** `js/layout.js`, Zeile `email: "..."`.

## Online stellen mit GitHub Pages

1. Im Repository auf **Settings → Pages** gehen.
2. Unter **Build and deployment → Source**: „Deploy from a branch“ wählen.
3. Branch auswählen (z. B. `main`), Ordner `/ (root)`, **Save**.
4. Nach 1–2 Minuten erscheint oben die Adresse, z. B.
   `https://<dein-benutzername>.github.io/<repository-name>/`.

Eine eigene Domain (z. B. `massage-magic.de`) kannst du ebenfalls unter **Settings → Pages → Custom domain** eintragen.

## Lokal ansehen (optional)

Weil die Produkte aus `products.json` geladen werden, funktioniert ein einfacher Doppelklick
auf `index.html` nicht. Stattdessen im Projektordner ausführen:

```
python3 -m http.server
```

und im Browser `http://localhost:8000` öffnen.

## Hinweise zu Texten

Die Texte verzichten bewusst auf medizinische Heilversprechen. Formuliere auch neue Texte
z. B. als „unterstützt die Entspannung“ oder „ideal nach dem Training“ – nicht „heilt“ oder „lindert Schmerzen“.
Die Website lädt keine externen Schriften oder Tracker; das vereinfacht die Datenschutzerklärung.
