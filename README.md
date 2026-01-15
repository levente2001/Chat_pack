# Chat Pack – kész webapp (React + Vite + Firebase + Stripe)

Ebben a projektben a csatolt Base44 oldalakból készült egy futtatható webapp:
- `/` – landing + rendelés (Stripe Checkout)
- `/success` – sikeres fizetés visszaigazolása + rendelés státusz frissítés
- `/cancel` – megszakított fizetés
- `/admin` – rendeléskezelő admin (Firebase Firestore)

## 1) Telepítés

```bash
npm install
```

## 2) Környezeti változók

Másold le a `.env.example` fájlt `.env` néven, és töltsd ki:

```bash
cp .env.example .env
```

### Stripe (kötelező)
- `STRIPE_SECRET_KEY` – **csak ez kell a fizetéshez** (test vagy live kulcs)

### Firebase (kötelező az admin + rendelések mentéséhez)
A Firestore-hoz a webes Firebase config kell (Firebase Console → Project settings → Your apps → Web app).

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 3) Futtatás lokálisan

A `npm run dev` egyszerre indítja a Vite frontendet és egy kis Stripe dev szervert (`server/dev.js`).
A frontend `/api/...` hívásai proxyn keresztül ehhez a szerverhez mennek.

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Stripe dev server: http://localhost:4242

## 4) Stripe fizetés hogyan működik?

1. A rendelés mentésre kerül Firestore-ba `status: "pending"`-gel.
2. A backend (server) létrehoz egy Stripe Checkout Session-t.
3. A vásárló átirányításra kerül Stripe Checkout oldalra.
4. Sikeres fizetés után Stripe visszairányít a `/success?session_id=...` oldalra.
5. A `/success` oldal lekérdezi a session-t, és `status: "paid"`-re frissíti a rendelést.

## 5) Deploy (ajánlott: Vercel)

Ez a repo tartalmaz Vercel serverless API-kat is:
- `api/stripe/create-checkout-session.js`
- `api/stripe/verify-session.js`

Vercel-en állítsd be Environment Variables-ben:
- `STRIPE_SECRET_KEY`
- a Firebase `VITE_*` változók

A frontendben a fetch hívások relatív `/api/...` útvonalon mennek, ezért Vercel-en automatikusan az API route-okat használja.

## 6) Firestore kollekciók

- `orders`
- `reviews`

> Tipp: ha még nincsenek Firestore indexek, a Firebase Console a query hibáknál linkeli, mit kell létrehozni.

---

Ha szeretnéd, a következő lépés lehet:
- admin beléptetés (Firebase Auth + admin role),
- webhook alapú fizetés-visszaigazolás (nem csak a success redirectre támaszkodva),
- kupon / több termék / kosár.
