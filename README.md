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
- ORM/DB: Prisma + SQLite (lokal)
- Validierung: zod
- Auth: httpOnly Session-Cookie (JWT-signiert), serverseitig geprüft
- Security: Security-Header per `middleware.ts`, Login-Rate-Limit, Upload-Validierung, SameSite-Cookies
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
DATABASE_URL="file:./dev.db"
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

## Deployment (z. B. Vercel)
### Wichtig zu SQLite
SQLite-Dateien sind auf Serverless-Umgebungen oft nicht persistent. Für echtes Deployment wird Postgres empfohlen.

### Empfohlenes Vorgehen
1. Managed Postgres bereitstellen (z. B. Neon, Supabase, Railway).
2. Prisma auf Postgres umstellen (`provider = "postgresql"` in `prisma/schema.prisma`).
3. `DATABASE_URL` in Vercel-Projektvariablen setzen.
4. Migrationen im Deployment mit `prisma migrate deploy` ausführen.
5. Alle ENV-Werte (`AUTH_USERNAME`, `AUTH_PASSWORD`, `BUDGET_PASSWORD`, `SESSION_SECRET`, `UPLOAD_DIR`) in Vercel setzen.

### Uploads im Deployment
Lokale Dateispeicherung ist in Serverless oft nicht persistent. Für Produktion stattdessen Object Storage nutzen (z. B. S3/R2).

## Nützliche Skripte
- `npm run dev` – Development-Server
- `npm run build` – Production-Build
- `npm run start` – Production-Server lokal
- `npm run prisma:migrate` – Migrationen lokal
- `npm run prisma:generate` – Prisma Client generieren
- `npm run seed` – festen User + Budget-Secret setzen/aktualisieren
- `npm run lint` – ESLint
- `npm run test` – Vitest
- `npm run format` / `npm run format:write` – Prettier
