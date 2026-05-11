# ABI-2029 Web-App 🎓

Offizielle Web-App für den Abiturjahrgang 2029 des Maria-Wächtler Gymnasiums.

## 🌟 Features

### Design & UI
- **Liquid Glass Ästhetik**: Moderne Glassmorphismus Design mit Backdrop-Blur und glänzenden Oberflächen
- **Deep Dark Mode**: Dunkles Blau (#0a0f1e) mit Lila-Akzenten (#2d0a4e)
- **Framer Motion**: Smooth Animationen und Übergänge
- **Abgerundete Formen**: Alle Komponenten mit großzügigen Radien für modernen Look

### Funktionalitäten
- **Authentifizierung**: NextAuth.js mit komplexem RBAC-System
- **Root-Admin-System**: Initiale Root-Admins über Umgebungsvariable, mit Delegierungsoptionen
- **User-Onboarding**: Erzwungenes Profilvervollständigungs-Modal mit Username-Generierung
- **Benutzerverwaltung**: Admin-Dashboard zur Verwaltung von Usern und Berechtigung
- **Event-Kalender**: Interaktiver Kalender mit Event-Verwaltung
- **Dynamisches CMS**: Rich-Text-Editor für öffentliche Seiten
- **Abikasse**: Verwaltung von Finanztransaktionen mit Validierungsworkflow

### Sicherheit
- **Rollenbasierte Zugriffskontrolle (RBAC)**: USER, PLANUNG, KASSE, ADMIN, ROOT
- **Root-Admin-Schutz**: Root-Admins sind vor Löschung/Herabstufung geschützt
- **Password Hashing**: bcryptjs für sichere Passwort-Speicherung
- **Session Management**: JWT-basierte Sessions mit Ablauf

## 🛠️ Tech-Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS mit Custom Glass-Klassen
- **Animationen**: Framer Motion
- **Authentifizierung**: NextAuth.js
- **Datenbank**: PostgreSQL (Neon) mit Prisma ORM
- **Hosting**: Optimiert für Vercel

## 📋 Voraussetzungen

- Node.js 18+ und npm/yarn
- PostgreSQL Datenbank (empfohlen: [Neon](https://neon.tech))
- GitHub OAuth App (optional, für Social Login)

## 🚀 Schnellstart

### 1. Projekt klonen und Setup

```bash
git clone <repository-url>
cd ABI-2029
npm install
```

### 2. Umgebungsvariablen einrichten

Erstelle `.env.local` basierend auf `.env.example`:

```bash
cp .env.example .env.local
```

Fülle folgende Variablen:
```env
# Datenbank
DATABASE_URL=postgresql://user:password@host:5432/abi2029

# NextAuth
NEXTAUTH_SECRET=<generiert mit: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Root Admin
ROOT_ADMIN_EMAIL=admin@maria-waechter-gymnasium.de
```

### 3. Datenbank initialisieren

```bash
npm run db:push
npm run db:seed
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## 📝 Benutzerverwaltung

### Rollen-Hierarchie

```
USER (0)
├── PLANUNG (1)
├── KASSE (1)
├── ADMIN (2)
└── ROOT (3)
```

### Root-Admin erstellen

Root-Admins werden über Umgebungsvariable konfiguriert:

```env
ROOT_ADMIN_EMAIL=admin@gymnasium.de
```

Beim ersten Start wird automatisch ein Root-Admin mit diesem Email erstellt.

## 🎨 Design-System

### Farbpalette

```css
--dark-bg: #0a0f1e;           /* Haupthintergrund */
--dark-secondary: #0f1629;    /* Sekundärer Hintergrund */
--accent-purple: #2d0a4e;     /* Lila Akzent */
--accent-blue: #1a3a52;       /* Blau Akzent */
```

### Glas-Effekt-Klassen

```html
<!-- Standard Glass Container -->
<div class="glass"></div>

<!-- Großer Container mit mehr Blur -->
<div class="glass-lg"></div>

<!-- Glossy Effekt mit Spiegelung -->
<div class="glass-glossy"></div>

<!-- Mit Glow-Effekt -->
<div class="glass-glow"></div>
```

### Button-Stile

```html
<!-- Standard Glass Button -->
<button class="btn-glass">Klick mich</button>

<!-- Gradient Button -->
<button class="btn-gradient">Gradient</button>
```

## 📚 API-Endpunkte

### Authentication
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/[...nextauth]` - NextAuth Callback (vorgebaut)

### Users
- `POST /api/user/onboard` - Profil vervollständigen
- `GET /api/admin/users` - Alle User auflisten (Admin nur)

### Events
- `GET /api/events` - Alle Events abrufen
- `POST /api/events` - Event erstellen (Admin nur)

### Pages
- `GET /api/pages` - Veröffentlichte Seiten abrufen
- `POST /api/pages` - Neue Seite erstellen (Admin nur)

## 🗂️ Projektstruktur

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root Layout
│   ├── page.tsx             # Homepage
│   ├── login/               # Login-Seite
│   ├── register/            # Registrierungs-Seite
│   ├── dashboard/           # User Dashboard
│   ├── admin/               # Admin Panel
│   ├── calendar/            # Event-Kalender
│   ├── news/                # Neuigkeiten-Seite
│   └── api/                 # API Routes
├── components/              # React Komponenten
│   ├── BurgerMenu.tsx       # Navigations-Menü
│   ├── OnboardingModal.tsx  # Onboarding-Modal
│   └── RootLayout.tsx       # Layout-Provider
├── lib/                     # Utility-Funktionen
│   ├── prisma.ts            # Prisma Client
│   └── auth-utils.ts        # Auth Utilities
├── styles/
│   └── globals.css          # Global Styles mit Glass-Effekte
└── types/
    └── next-auth.d.ts       # NextAuth Type Definitionen
```

## 🔐 Sicherheits-Architektur

### Rollen-Permissions Matrix

| Aktion | USER | PLANUNG | KASSE | ADMIN | ROOT |
|--------|------|---------|-------|-------|------|
| Kalender ansehen | ✅ | ✅ | ✅ | ✅ | ✅ |
| User verwalten | ❌ | ❌ | ❌ | ✅ | ✅ |
| Rollen ändern | ❌ | ❌ | ❌ | ✅* | ✅ |
| Root-Admin erstellen | ❌ | ❌ | ❌ | ❌ | ✅ |
| System-Settings | ❌ | ❌ | ❌ | ❌ | ✅ |

*Außer Root-Admins können nicht herabgestuft werden

## 📦 Deployment auf Vercel

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment
vercel
```

Stellen Sie sicher, dass folgende Environment Variables in Vercel konfiguriert sind:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ROOT_ADMIN_EMAIL`

## 🐛 Troubleshooting

### Fehler beim Datenbank-Konnnekt
```bash
npm run db:push  # DB Migrationen anwenden
```

### Sessions funktionieren nicht
- Überprüfen Sie `NEXTAUTH_SECRET` und `NEXTAUTH_URL`
- Stellen Sie sicher, dass Cookies aktiviert sind

### Styling sind nicht sichtbar
```bash
npm install
npm run dev  # Dev-Server neu starten
```

## 📖 Weitere Dokumentation

- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 👥 Team

Erstellt für den Abiturjahrgang 2029 des Maria-Wächtler Gymnasiums.

## 📄 Lizenz

MIT - Siehe LICENSE Datei für Details
