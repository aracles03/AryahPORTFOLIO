# Portfolio — Arya Kusuma

Interactive portfolio website built with **React + Vite**.

## Cara pakai

### 1. Install dependencies

```bash
npm install
```

### 2. Jalankan dev server

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

### 3. Build untuk production

```bash
npm run build
```

Output ada di folder `dist/` — tinggal deploy ke Vercel, Netlify, atau hosting apapun.

---

## Struktur file

```
src/
├── App.jsx                   # Root: intro vs portfolio state
├── App.css
├── index.css                 # Global reset
├── main.jsx
├── hooks/
│   └── useTypewriter.js      # Typing animation hook
└── components/
    ├── Cursor.jsx             # Blinking cursor
    ├── Cursor.module.css
    ├── IntroScreen.jsx        # Layar awal + spam popup logic
    ├── IntroScreen.module.css
    ├── SpamPopup.jsx          # Satu popup spam
    ├── SpamPopup.module.css
    ├── Portfolio.jsx          # Halaman portfolio
    └── Portfolio.module.css
```

## Kustomisasi

Edit `src/components/Portfolio.jsx` — ubah nama, daftar project, experience, dan stack sesuai data kamu.

Edit `src/components/SpamPopup.jsx` — ubah teks-teks popup kalau mau.

Edit `src/components/IntroScreen.jsx` line `useTypewriter(...)` — ubah pertanyaan opening.

---

## Deploy ke Vercel

```bash
npm i -g vercel
vercel
```

Atau drag-drop folder `dist/` ke [netlify.com/drop](https://app.netlify.com/drop).
