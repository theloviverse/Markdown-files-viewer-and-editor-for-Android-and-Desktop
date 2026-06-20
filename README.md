# 📝 Markdown Megjelenítő &amp; Szerkesztő

> Reszponzív, tiszta dizájnú, **teljesen offline** webes Markdown megjelenítő és szerkesztő —
> sötét móddal, drag &amp; drop fájlbehúzással, kódszínezéssel és táblázatokkal. Egyetlen
> önálló `index.html` fájl: **internet nélkül is működik**. Mobil böngészőkre
> (pl. **Samsung Galaxy S25 Ultra**) és Windows desktop PC-re egyaránt optimalizálva.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)
![Offline](https://img.shields.io/badge/offline-100%25-success)
![Single file](https://img.shields.io/badge/single--file-index.html-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Funkciók

- **Élő megosztott nézet** – bal oldalt szerkesztő, jobb oldalt valós idejű előnézet (mobilon fülekkel váltható).
- **Drag &amp; drop** – húzz be bármilyen `.md` / `.markdown` / `.txt` fájlt az ablakba.
- **🌙 Sötét mód** – egy kattintással, a rendszer beállítását követve, a kódtéma is vált. A választás megmarad.
- **Kódszínezés** – [highlight.js](https://highlightjs.org/) automatikus nyelvfelismeréssel.
- **GitHub-stílusú Markdown (GFM)** – táblázatok, tennivaló listák, áthúzás, automatikus linkek.
- **Eszköztár** – gyors formázó gombok (félkövér, dőlt, címsorok, listák, link, kép, kódblokk, táblázat, idézet…).
- **Mentés &amp; export** – automatikus mentés a böngészőbe (`localStorage`), `.md` letöltés, önálló `.html` export.
- **Reszponzív &amp; érintőbarát** – mobile-first elrendezés, biztonságos terület (safe-area) támogatás a lekerekített kijelzőkhöz.
- **Biztonságos render** – a kimenetet a [DOMPurify](https://github.com/cure53/DOMPurify) tisztítja XSS ellen.

---

## 🚀 Élő demó

GitHub Pages-en (a `Pages` engedélyezése után):

```
https://<felhasznalonev>.github.io/<repo-nev>/
```

---

## 🛠️ Használt technológiák

| Réteg            | Eszköz                                   |
| ---------------- | ---------------------------------------- |
| Markdown → HTML  | [marked.js](https://marked.js.org/) (beágyazva) |
| Kódszínezés      | [highlight.js](https://highlightjs.org/) (beágyazva) |
| Szanitálás       | [DOMPurify](https://github.com/cure53/DOMPurify) (beágyazva) |
| Stílus           | Sima, kézzel írt CSS (CSS-változókkal, sötét mód) |
| Logika           | Vanilla JavaScript (nincs framework)     |

Minden függőség **be van ágyazva** a kész `index.html`-be — nincs CDN, nincs külső kérés,
így a fájl internet nélkül is hibátlanul fut.

---

## 💻 Helyi futtatás

Elég **megnyitni az `index.html`-t** a böngészőben (dupla kattintás), vagy átküldeni a
telefonra és onnan megnyitni — **internet nélkül is teljesen működik**. Nincs szükség
külön mappákra vagy szerverre.

> ⚠️ **Fontos:** a használathoz a **kész `index.html`** kell (a beágyazott könyvtárakkal),
> **nem** az `index.src.html` forrássablon. Ha a repót klónozod és módosítasz, futtasd a
> buildet (lásd lent), hogy frissüljön az `index.html`.

Opcionálisan helyi szerverrel is futtatható (pl. fejlesztéshez):

```bash
python3 -m http.server 8000   # majd: http://localhost:8000
```

---

## 📱 Telepítés telefonra (S25 Ultra is)

> 🚫 **NE másold ki a kódot Jegyzettömbbe / Samsung Notes-ba**, és onnan mentve `.html`-ként.
> A jegyzetalkalmazások „rich text” szerkesztők: átalakítják a karaktereket (okos
> idézőjelek, eltűnő `<`/`>`, sortörések), ettől a beágyazott, minified JavaScript
> **megsérül**, és a gombok némán nem működnek (a kód forrása szövegként jelenhet meg az
> oldal alján). A fájl csak **byte-pontos** átvitellel jó.

**A) Byte-pontos letöltés (offline, azonnal működik)**
1. Nyisd meg a telefon böngészőjében a repó `index.html` fájlját a GitHubon.
2. Koppints a **„Download raw file”** (letöltés ⬇️) ikonra — **ne** a sima „Raw” nézetet
   használd, mert az csak megjeleníti a szöveget.
3. A letöltött `index.html`-t nyisd meg a böngészővel (Chrome / Samsung Internet).
   Innentől internet nélkül is működik.

**B) GitHub Pages link (csak megnyitod, nincs letöltés)**

A repó Settings → Pages alatt engedélyezhető:
1. (Ingyenes csomagon a Pages csak **publikus** repón működik — szükség esetén tedd
   publikussá: Settings → General → Change visibility.)
2. **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**.
3. Branch: `claude/markdown-editor-viewer-nrun01` (vagy a fő branch), mappa: `/ (root)` → **Save**.
4. ~1 perc múlva elérhető:
   `https://theloviverse.github.io/Markdown-files-viewer-and-editor-for-Android-and-Desktop/`
5. A telefonon megnyitva: böngészőmenü → **„Hozzáadás a kezdőképernyőhöz”** — így ikonról,
   offline is indítható.

(Alternatíva: **Source: GitHub Actions** — a mellékelt `.github/workflows/pages.yml`
automatikusan deployol a fő/feature branchre pusholva.)

---

## 📲 Telepítés alkalmazásként (PWA)

Az app **telepíthető PWA** — saját ikonnal, külön ablakban (nem böngészőfülön) indul, és
offline is működik.

> ⚠️ A telepítés **csak a HTTPS-en kiszolgált Pages-linkről** működik. Helyi `file://`
> megnyitásnál a böngészők biztonsági okból **nem** kínálják fel a telepítést (ez böngésző-
> korlát, minden weboldalra igaz). A letöltött `index.html` ettől még offline használható,
> csak ikon/telepítés nélkül.

Telepítés a Pages-linkről:
- **Chrome (Android):** menü (⋮) → **„Alkalmazás telepítése”** / „Hozzáadás a kezdőképernyőhöz”.
- **Samsung Internet:** menü → „Oldal hozzáadása” → **Kezdőképernyő**.
- **Asztali Chrome/Edge:** a címsor jobb szélén megjelenő **telepítés** ikon.

Telepítés után az ikonról indul, és az első betöltés után **internet nélkül is** működik
(a `sw.js` service worker gyorsítótárazza az alkalmazást).

A PWA-réteg fájljai: `manifest.webmanifest`, `sw.js`, `icons/icon.svg`.

---

## 🧱 Build (csak fejlesztéshez)

A kész `index.html`-t egy egyszerű, függőség nélküli Node-szkript állítja elő az
`index.src.html` sablonból, beágyazva a `tools/vendor/` alatti minified könyvtárakat:

```bash
node tools/build.js          # index.src.html + tools/vendor/* → index.html
# vagy: npm run build
```

A könyvtárak frissítése (ritkán szükséges):

```bash
npm i marked@12.0.2 dompurify@3.1.6 @highlightjs/cdn-assets@11.9.0
node tools/update-vendor.js  # dist fájlok másolása a tools/vendor/ alá
node tools/build.js
```

---

## 📂 Projektstruktúra

```
.
├── index.html              # ⭐ KÉSZ, önálló offline app (ezt nyisd meg / telepítsd)
├── index.src.html          # Forrássablon: felület + CSS + app JS + vendor-helyőrzők
├── manifest.webmanifest    # PWA manifest (telepíthető app — Pages-en aktív)
├── sw.js                   # Service worker (offline gyorsítótár a PWA-hoz)
├── icons/
│   └── icon.svg            # App ikon (manifest + favicon + apple-touch-icon)
├── tools/
│   ├── build.js            # A vendor könyvtárak beágyazása → index.html
│   ├── update-vendor.js    # Minified libek másolása node_modules-ból
│   └── vendor/             # Beágyazandó minified könyvtárak (marked, DOMPurify, highlight.js)
├── package.json            # build / vendor npm-scriptek
├── .github/workflows/
│   └── pages.yml           # Automatikus GitHub Pages deploy
├── .nojekyll               # Pages: Jekyll feldolgozás kikapcsolása
├── LICENSE                 # MIT
└── README.md
```

---

## ⌨️ Billentyűparancsok

| Parancs            | Művelet            |
| ------------------ | ------------------ |
| `Ctrl/Cmd + B`     | Félkövér           |
| `Ctrl/Cmd + I`     | Dőlt               |
| `Ctrl/Cmd + K`     | Hivatkozás beszúrása |

---

## 🌐 Deploy GitHub Pages-re

A repó tartalmaz egy GitHub Actions workflow-t (`.github/workflows/pages.yml`),
amely automatikusan közzéteszi az oldalt:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push a fő branchre → az Action lefut, és élesíti az oldalt.

Alternatíva: **Settings → Pages → Deploy from a branch**, válaszd a branchet és a
`/ (root)` mappát. A kész `index.html` a repó gyökerében van, így azonnal kiszolgálható.

---

## 🤝 Közreműködés

A hibajelzések és javaslatok (Issue) valamint a Pull Requestek szívesen látottak.

1. Forkold a repót
2. Hozz létre egy feature branchet (`git checkout -b feature/uj-funkcio`)
3. Commitold a változtatást
4. Nyiss egy Pull Requestet

---

## 📄 Licenc

[MIT](LICENSE) © 2026
