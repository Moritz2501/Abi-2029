# Abitur 2029 – Maria Wächtler Gymnasium

Vollständige Next.js-Web-App mit:
- Login (genau ein Benutzerkonto)
- Chat/Pinnwand
- Galerie mit Bild-Upload (jpg/png/webp)
- Budget-Verwaltung mit separatem Budget-Passwort
- Admin-Bereich für Ankündigungen

## Tech-Stack
- Frontend/Backend: Next.js (App Router) + TypeScript + Tailwind CSS
- API: Route Handlers (`app/api/...`)
- ORM/DB: Prisma + PostgreSQL (Neon empfohlen)
- Validierung: zod
- Auth: httpOnly Session-Cookie (JWT-signiert), serverseitig geprüft
- Security: Security-Header per `proxy.ts`, Login-Rate-Limit, Upload-Validierung, SameSite-Cookies
- Tests: Vitest

## Seiten
- `/` öffentliche Startseite + öffentliche Ankündigungen
- `/login` Login für den festen Account
- `/chat` geschützte Pinnwand
- `/gallery` geschützte Galerie + Upload
- `/budget` geschützte Budgetseite + Einzahlung mit Budget-Passwort
- `/admin/announcements` geschützter CRUD-Bereich für Ankündigungen

## Setup
1. Dependencies installieren:
   ```bash
   npm install
   ```
2. Umgebungsvariablen setzen:
   ```bash
   cp .env.example .env
   ```
3. Prisma-Migration ausführen:
   ```bash
   npm run prisma:migrate -- --name init
   ```
4. Seed ausführen (legt den einen Login-User + Budget-Passwort an):
   ```bash
   npm run seed
   ```
5. Dev-Server starten:
   ```bash
   npm run dev
   ```

## Wichtige ENV-Werte
In `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
AUTH_USERNAME="admin"
AUTH_PASSWORD="dein_login_passwort"
BUDGET_PASSWORD="dein_budget_passwort"
SESSION_SECRET="lange-zufällige-geheime-zeichenkette"
UPLOAD_DIR="uploads"
```

## Login/Budget-Passwort ändern
- Admin-Login ändern: `AUTH_USERNAME` und/oder `AUTH_PASSWORD` in `.env` ändern, danach `npm run seed` ausführen.
- Budget-Passwort ändern: `BUDGET_PASSWORD` in `.env` ändern, danach `npm run seed` ausführen.

`seed` aktualisiert vorhandene Hashes sicher (bcrypt), ohne Klartext in der DB.

## Qualitätschecks
- Lint:
  ```bash
  npm run lint
  ```
- Tests:
  ```bash
  npm run test
  ```
- Prettier prüfen:
  ```bash
  npm run format
  ```

## Deployment mit Vercel + Neon

### 1) Neon-Projekt anlegen
1. In Neon ein neues Projekt erstellen.
2. Datenbank (`neondb`) und User erstellen/prüfen.
3. Unter Neon `Connection Details` die Verbindungs-URL kopieren.

### 2) URLs in `.env` setzen

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

Hinweis: Bei Neon kann `DIRECT_URL` in der Regel identisch zu `DATABASE_URL` sein.

### 3) Lokal einmal gegen Postgres testen
```bash
npm install
cp .env.example .env
# DATABASE_URL + Passwörter in .env eintragen
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

### 4) Vercel konfigurieren
1. Repo mit Vercel verbinden.
2. In Vercel Environment Variables setzen:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_USERNAME`
   - `AUTH_PASSWORD`
   - `BUDGET_PASSWORD`
   - `SESSION_SECRET`
   - `UPLOAD_DIR`
3. Build Command in Vercel setzen auf:

```bash
npm run vercel-build
```

Dieser Befehl führt `prisma migrate deploy`, `prisma generate` und den Next-Build aus.

### Uploads im Deployment
Lokale Dateispeicherung ist in Serverless oft nicht persistent. Für Produktion stattdessen Object Storage nutzen (z. B. S3/R2).

## Nützliche Skripte
- `npm run dev` – Development-Server
- `npm run build` – Production-Build
- `npm run vercel-build` – Vercel Build inkl. Prisma Migrate Deploy
- `npm run start` – Production-Server lokal
- `npm run prisma:migrate` – Migrationen lokal
- `npm run prisma:generate` – Prisma Client generieren
- `npm run seed` – festen User + Budget-Secret setzen/aktualisieren
- `npm run lint` – ESLint
- `npm run test` – Vitest
- `npm run format` / `npm run format:write` – Prettier
