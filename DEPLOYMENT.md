# 🚀 Deployment Guide

Dieses Dokument beschreibt wie du die ABI-2029 Web-App auf Vercel deployest.

## Voraussetzungen

- Ein GitHub-Account mit dem Projekt-Repository
- Ein Vercel-Account (vercel.com)
- Eine PostgreSQL Datenbank (Neon.tech empfohlen)
- Alle Umgebungsvariablen bereit

## Schritt 1: Code auf GitHub pushen

```bash
git add .
git commit -m "Initial commit: ABI 2029 Web-App"
git push origin main
```

## Schritt 2: Vercel mit GitHub verbinden

1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf "New Project"
3. Wähle "Import Git Repository"
4. Wähle dein GitHub-Repository
5. Konfiguriere die Build-Settings (sollten automatisch .next erkennen)

## Schritt 3: Umgebungsvariablen hinzufügen

Im Vercel Dashboard unter "Settings" → "Environment Variables" folgende hinzufügen:

```env
# Datenbank
DATABASE_URL=postgresql://user:password@host/database

# NextAuth
NEXTAUTH_SECRET=<generiert mit: openssl rand -base64 32>
NEXTAUTH_URL=https://deine-domain.vercel.app

# Root Admin
ROOT_ADMIN_EMAIL=admin@gymnasium.de
```

### Datenbank Setup (Neon)

1. Gehe zu [neon.tech](https://neon.tech)
2. Erstelle ein neues Projekt
3. Kopiere die Connection String
4. In Vercel als `DATABASE_URL` einfügen

## Schritt 4: Datenbank Migrations durchführen

Nach dem ersten Deployment musst du die Migrations durchführen:

```bash
# Lokal oder über Vercel CLI
vercel env pull  # Lokale .env.local aktualisieren
npm run db:push  # Prisma Migrations durchführen
npm run db:seed  # Datenbank mit Sample-Daten füllen
```

Oder via Vercel Dashboard:

1. Gehe zu "Deployments"
2. Klicke auf "Functions" und wähle "logs"
3. Führe Commands via Postgres-Client durch

## Schritt 5: Root-Admin initialisieren

Der Root-Admin wird automatisch bei der ersten Datenbanknutzung erstellt:

```bash
curl -X POST https://deine-domain.vercel.app/api/init/root-admin
```

**Wichtig**: Speichere das temporäre Passwort sicher!

## Schritt 6: Domain konfigurieren

1. Im Vercel Dashboard unter "Settings" → "Domains"
2. Füge deine custom Domain ein
3. Folge den DNS-Anweisungen
4. NEXTAUTH_URL in Vercel ändern auf die neue Domain

```
NEXTAUTH_URL=https://abi2029.deine-domain.de
```

## Monitoring & Logs

### Vercel Logs ansehen

```bash
vercel logs
```

### Datenbank-Logs (Neon)

1. Gehe zu Neon Dashboard
2. Wähle dein Projekt
3. Klicke auf "Logs"

### Fehlerbehandlung

Falls Prisma-Fehler auftreten:

```bash
# Regenerate Prisma Client
vercel env pull
npm run prisma:generate
vercel deploy --prod
```

## Performance & Sicherheit

### Wichtige Security-Settings

1. **CORS**: Nur eigene Domain erlaubt (in API Routes)
2. **CSRF**: NextAuth kümmert sich automatisch
3. **Rate Limiting**: Mit Middleware implementieren (optional)

### Performance Optmierung

```bash
# Next.js Image Optimierung aktiviert
# Vercel Cache: Automatisch für Static Content
# ISR: Static Pages werden regeneriert
```

### Analytics

Vercel bietet automatisch:
- Performance Metrics
- Real User Monitoring
- Build Metrics

In Vercel Dashboard unter "Analytics" abrufen.

## Rollback & Deployment History

```bash
# Vercel Deployment History
vercel list

# Zu älterem Deployment zurückgehen
vercel rollback

# Produktion Deployment
vercel deploy --prod
```

## Automatische Deployments konfigurieren

✅ **Automatisch**: Jeder Push zu main → Production Deploy

Optional: Weitere Branchen einrichten
1. Settings → Git
2. Production Branch: main
3. Preview Deployments: Alle anderen Branches

## Backup & Disaster Recovery

### Datenbank Backup (Neon)

1. Neon Dashboard öffnen
2. Settings → Backup / Branch
3. Automatische Backups konfigurieren

### Code Backup

GitHub ist automatisches Backup!

### Recovery Prozess

Falls etwas schiefgeht:

```bash
# 1. Vercel Rollback
vercel rollback

# 2. Oder manuell deployen
git checkout <commit-hash>
git push origin main
```

## Checkliste vor Production

- [ ] `.env.local` ist in `.gitignore`
- [ ] NEXTAUTH_SECRET ist strong & secret
- [ ] DATABASE_URL ist erreichbar
- [ ] ROOT_ADMIN_EMAIL ist korrekt
- [ ] Domain ist konfiguriert
- [ ] Datenbank-Migrations sind durchgeführt
- [ ] SSL/HTTPS aktiviert
- [ ] Error Handling Pages sind angepasst
- [ ] Analytics konfiguriert
- [ ] Backup-Strategie ist vorhanden

## Support & Troubleshooting

### Häufige Fehler

**"Deployment failed: Build step failed"**
```bash
# Local build testen
npm run build
# Falls error: Dependencies aktualisieren
npm install --force
```

**"Database connection failed"**
- DATABASE_URL in .env checken
- Neon Console öffnen und IP-Whitelist überprüfen

**"NextAuth error"**
- NEXTAUTH_SECRET überprüfen
- NEXTAUTH_URL muss mit deploy URL übereinstimmen

---

**Weitere Hilfe**:
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
