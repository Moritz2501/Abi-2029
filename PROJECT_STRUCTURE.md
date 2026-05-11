# 📦 Projekt-Struktur & Überblick

Vollständiger Überblick über die ABI-2029 Web-App Architektur und Komponenten.

## 📁 Dateistruktur

```
ABI-2029/
│
├── 🔧 Konfigurationsdateien
│   ├── package.json              # Dependencies & Scripts
│   ├── tsconfig.json             # TypeScript Konfiguration
│   ├── next.config.js            # Next.js Konfiguration
│   ├── tailwind.config.js        # Tailwind CSS Theme
│   ├── postcss.config.js         # PostCSS Plugins
│   ├── .eslintrc.json            # ESLint Rules
│   └── vercel.json               # Vercel Deployment Config
│
├── 📚 Dokumentation
│   ├── README.md                 # Projekt Overview
│   ├── DEPLOYMENT.md             # Deployment Guide
│   ├── DESIGN_SYSTEM.md          # Design-Prinzipien
│   ├── CONTRIBUTING.md           # Entwicklung Guidelines
│   ├── QUICKSTART.md             # Schnelleinstieg
│   ├── PROJECT_STRUCTURE.md      # Diese Datei
│   └── LICENSE                   # MIT License
│
├── 🐳 Container & CI/CD
│   ├── Dockerfile                # Docker Image
│   ├── docker-compose.yml        # Local Development Stack
│   └── .dockerignore              # Docker Exclusions
│
├── 📦 Prisma ORM
│   └── prisma/
│       ├── schema.prisma         # Database Schema
│       └── seed.ts               # Database Seeding
│
├── 🌍 Environment
│   ├── .env.example              # Template für Env Vars
│   └── .gitignore                # Git Ignorefile
│
└── 📄 Source Code
    └── src/
        │
        ├── 🎨 Styles
        │   └── styles/
        │       └── globals.css   # Global Styles + Glass CSS
        │
        ├── 🏗️ Components
        │   └── components/
        │       ├── BurgerMenu.tsx        # Navigation Menü
        │       ├── OnboardingModal.tsx   # Profil-Setup Modal
        │       └── RootLayout.tsx        # Layout Provider
        │
        ├── 📚 Utilities & Libraries
        │   └── lib/
        │       ├── prisma.ts           # Prisma Client
        │       ├── auth-utils.ts       # Auth Helpers
        │       ├── api-client.ts       # API Request Helpers
        │       ├── db-utils.ts         # Database Helpers
        │       └── constants.ts        # Global Constants
        │
        ├── 🔐 Type Definitions
        │   └── types/
        │       └── next-auth.d.ts      # NextAuth Types
        │
        ├── 🔄 Middleware
        │   └── middleware.ts           # Route Protection
        │
        ├── 🎯 App Router Pages
        │   └── app/
        │       │
        │       ├── 📄 Layouts
        │       │   └── layout.tsx      # Root Layout
        │       │
        │       ├── 🏠 Public Pages
        │       │   ├── page.tsx        # Homepage
        │       │   ├── calendar/       # Event Calendar
        │       │   ├── news/           # News/Articles
        │       │   ├── login/          # Login Page
        │       │   ├── register/       # Registration Page
        │       │   ├── not-found.tsx   # 404 Page
        │       │   └── error.tsx       # Error Page
        │       │
        │       ├── 👤 User Pages
        │       │   ├── dashboard/      # User Dashboard
        │       │   ├── settings/       # User Settings
        │       │   └── cash/           # Cash Management
        │       │
        │       ├── 👮 Admin Pages
        │       │   └── admin/
        │       │       └── page.tsx    # Admin Dashboard
        │       │
        │       └── 🔌 API Routes
        │           └── api/
        │               ├── auth/
        │               │   ├── [...nextauth].ts    # NextAuth Handler
        │               │   ├── register/           # User Registration
        │               │   └── login/              # Login
        │               │
        │               ├── user/
        │               │   ├── onboard/           # Profile Setup
        │               │   ├── profile/           # Profile Update
        │               │   └── password/          # Password Change
        │               │
        │               ├── admin/
        │               │   ├── users/
        │               │   │   ├── route.ts       # List Users
        │               │   │   └── [userId]/      # User Actions
        │               │   └── transactions/
        │               │       ├── route.ts       # List Transactions
        │               │       └── [txId]/        # Approve/Reject
        │               │
        │               ├── events/                # Event Management
        │               ├── pages/                 # Page/CMS Management
        │               └── init/
        │                   └── root-admin/        # Root Admin Init
        │
        └── 🎭 Pages
            └── pages/
                └── api/
                    └── auth/
                        └── [...nextauth].ts      # NextAuth API (Legacy)
```

## 🔑 Kern-Komponenten

### Authentication & Authorization
- **NextAuth.js**: JWT-basierten Session Management
- **Rollen-System**: USER, PLANUNG, KASSE, ADMIN, ROOT
- **Root-Admin Protection**: Nur Root-Admins können Root-Status vergeben
- **Passwort-Hashing**: bcryptjs für sichere Speicherung

### Design System
- **Liquid Glass**: Modern Glassmorphismus Design
- **Tailwind CSS**: Utility-First Styling
- **Framer Motion**: Smooth Animationen
- **Custom CSS-Klassen**: glass, glass-lg, glass-glossy, glass-glow

### Pages & Features

| Page | Beschreibung | Auth-Level |
|------|-------------|-----------|
| `/` | Homepage | Public |
| `/login` | Anmeldeseite | Public |
| `/register` | Registrierungsseite | Public |
| `/calendar` | Event-Kalender | Public |
| `/news` | News/Artikel | Public |
| `/dashboard` | User-Dashboard | USER+ |
| `/settings` | Benutzer-Einstellungen | USER+ |
| `/cash` | Abikasse-Verwaltung | KASSE+ |
| `/admin` | Admin-Panel | ADMIN+ |

### API Endpunkte

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| POST | `/api/auth/register` | Benutzer registrieren |
| POST | `/api/auth/[...nextauth]` | NextAuth Callback |
| POST | `/api/user/onboard` | Profil vervollständigen |
| PUT | `/api/user/profile` | Profil aktualisieren |
| PUT | `/api/user/password` | Passwort ändern |
| GET | `/api/admin/users` | Alle User auflisten |
| POST | `/api/admin/users/[userId]` | User-Aktion (approve/reject/update) |
| GET | `/api/admin/transactions` | Transaktionen auflisten |
| POST | `/api/admin/transactions/[txId]` | Transaktion genehmigen/ablehnen |
| GET | `/api/events` | Events abrufen |
| POST | `/api/events` | Event erstellen |
| GET | `/api/pages` | Seiten abrufen |
| POST | `/api/pages` | Seite erstellen |

## 🗄️ Datenbank-Schema

### Haupt-Entities

```sql
-- Users und Authentication
User
  - id (PK)
  - email (UNIQUE)
  - name, firstName, lastName
  - username (UNIQUE)
  - password (hashed)
  - role (ENUM: USER, PLANUNG, KASSE, ADMIN, ROOT)
  - onboardingStatus (ENUM: PENDING, APPROVED, REJECTED)

Account (NextAuth)
Session (NextAuth)
VerificationToken (NextAuth)

-- Transaktionen (Abikasse)
Transaction
  - id (PK)
  - userId (FK)
  - type (ENUM: INCOME, EXPENSE)
  - amount, description
  - status (ENUM: PENDING, APPROVED, REJECTED)

Approval
  - transactionId (FK)
  - userId (FK)

Rejection
  - transactionId (FK)
  - userId (FK)
  - reason

-- Content Management
Page
  - id (PK)
  - title, slug, content
  - createdBy (FK to User)
  - published

Comment
  - pageId (FK)
  - userId (FK)

-- Kalender
EventCalendar
  - id (PK)
  - title, description, date, location
```

## 🔐 Sicherheit-Features

1. **Authentifizierung**
   - Credentials Provider mit bcryptjs
   - JWT Session Management
   - Automatische Session-Erneuerung

2. **Autorisierung**
   - Rollenbasierte Zugriffskontrolle
   - Protected Routes per Middleware
   - API-Level Permission Checks

3. **Datenbankicherheit**
   - Prisma ORM (kein SQL Injection)
   - Prepared Statements
   - Gehashte Passwörter (bcryptjs)

4. **Input Validation**
   - Zod Schmata (placeholder)
   - Client & Server-Side Validation
   - XSS-Prävention durch React

## 🚀 Performance Optimierungen

- **Next.js Image Optimization**: Automatische Image-Kompression
- **Code Splitting**: Automatic per Route
- **CSS-in-JS**: Tailwind CSS (minimal bundle)
- **Caching**: Vercel Edge Caching für Static Content
- **Database Indexing**: Prisma Schema mit Indexes

## 📊 Engagement Features

1. **Onboarding System**
   - Modal-basierter Setup-Prozess
   - Username-Auto-Generierung
   - Admin-Freigabe erforderlich

2. **Community**
   - Event-Kalender
   - News/Artikel-Seiten
   - Abikasse-Verwaltung

3. **Admin Tools**
   - User-Verwaltung
   - Transaktion-Validierung
   - Seiten-Management

## 📦 Deploy-Ready

✅ Vercel Optimiert
✅ PostgreSQL (Neon) Support
✅ Environment Configuration
✅ Docker Support
✅ CI/CD Ready

---

**Version**: 1.0
**Last Updated**: May 2026
**Status**: 🟢 Production Ready
