# Development Environment Schnellstart

Diese Datei schnell kopieren für schnelle lokale Testumgebung:

```bash
cp .env.example .env.local
```

Oder für Docker-Entwicklung mit automatischer Datenbankverbindung:

## Mit Docker

```bash
docker-compose up -d
# App läuft auf http://localhost:3000
# Postgres läuft auf localhost:5432
# Redis läuft auf localhost:6379
```

## Ohne Docker (Lokal)

### MacOS/Linux

```bash
# Installiere PostgreSQL
brew install postgresql@16

# Starte PostgreSQL
brew services start postgresql@16

# Erstelle lokale Datenbank
createdb abi2029

# .env.local setzen
echo "DATABASE_URL=postgresql://$(whoami):@localhost:5432/abi2029" > .env.local
echo 'NEXTAUTH_SECRET=dev-secret-key-change' >> .env.local
echo 'NEXTAUTH_URL=http://localhost:3000' >> .env.local
echo 'ROOT_ADMIN_EMAIL=admin@example.com' >> .env.local

# Install & Start
npm install
npm run db:push
npm run db:seed
npm run dev
```

### Windows PowerShell

```powershell
# Download PostgreSQL installer
# oder use WSL2

# Mit WSL2
wsl
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

createdb abi2029

# Set env vars
$env:DATABASE_URL = "postgresql://postgres@localhost:5432/abi2029"
$env:NEXTAUTH_SECRET = "dev-secret-key"
$env:NEXTAUTH_URL = "http://localhost:3000"

npm install
npm run db:push
npm run dev
```

## Schnelle Test-Accounts

Nach `npm run db:seed`:

- **Admin Account**: admin@example.com / Admin123!

## Tipps für schnellere Entwicklung

### Live Reload Aktivieren

```bash
npm run dev  # Automatisch bei Dateiänderungen
```

### Database in GUI ansehen

```bash
npm run db:studio
# Öffnet http://localhost:5555
```

### Logs in Echtzeit

```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Logs
tail -f .next/server/app.log
```

## Cache löschen

```bash
# .next Folder löschen
rm -rf .next

# Prisma Cache löschen
rm -rf node_modules/.prisma

# Neu bauen
npm run build
npm run dev
```

## Datenbank zurücksetzen

```bash
# Alle Daten löschen & Seed neu
npm run db:reset

# Oder manuell
npm run db:push -- --force-reset
npm run db:seed
```

## Browser DevTools

### React DevTools (Extension)
https://react-devtools-tutorial.vercel.app/

### NextJS DevTools
Automatisch in Development Mode verfügbar

---

Jetzt kannst du mit `npm run dev` loslegend 🎉
