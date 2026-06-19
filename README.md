# 📝 Markdown Megjelenítő &amp; Szerkesztő

> Reszponzív, tiszta dizájnú webes Markdown megjelenítő és szerkesztő — sötét móddal,
> drag &amp; drop fájlbehúzással, kódszínezéssel és táblázatokkal. Mobil böngészőkre
> (pl. **Samsung Galaxy S25 Ultra**) és Windows desktop PC-re egyaránt optimalizálva.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)
![No build](https://img.shields.io/badge/build-none-success)
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
| Markdown → HTML  | [marked.js](https://marked.js.org/)      |
| Kódszínezés      | [highlight.js](https://highlightjs.org/) |
| Szanitálás       | [DOMPurify](https://github.com/cure53/DOMPurify) |
| Stílus           | [Tailwind CSS](https://tailwindcss.com/) (Play CDN) |
| Logika           | Vanilla JavaScript (nincs framework)     |

Nincs build lépés és nincs `node_modules` – minden függőség CDN-ről töltődik.

---

## 💻 Helyi futtatás

Mivel a projekt statikus, elég megnyitni az `index.html`-t a böngészőben.
A drag &amp; drop és a fájlműveletek megbízhatóbbak helyi szerverrel:

```bash
# Python 3
python3 -m http.server 8000
# majd nyisd meg: http://localhost:8000

# vagy Node-dal
npx serve .
```

---

## 📂 Projektstruktúra

```
.
├── index.html              # Felület, CDN linkek, Tailwind config
├── css/
│   └── styles.css          # Markdown tipográfia, kódblokk/táblázat stílus, nézet-módok
├── js/
│   └── app.js              # Render, eszköztár, fájlműveletek, drag & drop, sötét mód
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

Alternatíva build nélkül: **Settings → Pages → Deploy from a branch**, válaszd a
branchet és a `/ (root)` mappát.

> ℹ️ A Tailwind **Play CDN** kényelmes, de a böngésző konzoljára kiír egy production
> figyelmeztetést. Éles, optimalizált CSS-hez később át lehet állni a
> [Tailwind CLI](https://tailwindcss.com/docs/installation) buildre – a felület ettől nem változik.

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
