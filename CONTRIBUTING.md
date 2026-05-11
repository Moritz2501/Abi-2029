# 👨‍💻 Contributing Guide

Danke dass du zur ABI-2029 Web-App beitragen möchtest! Hier sind die Richtlinien.

## 🚀 Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/ABI-2029.git
cd ABI-2029
```

### 2. Setup Development Environment

```bash
# Mit Docker (empfohlen)
docker-compose up -d

# Oder lokal
npm install
npm run db:push
npm run db:seed
npm run dev
```

### 3. Create Feature Branch

```bash
git checkout -b feature/my-feature
```

## 📝 Code Conventions

### TypeScript

- Immer TypeScript verwenden (`.ts` / `.tsx`)
- Strikte Type-Safety
- Keine `any` TypeScript!

```tsx
// ✅ Good
interface UserProps {
  name: string;
  role: 'USER' | 'ADMIN' | 'ROOT';
}

// ❌ Bad
interface UserProps {
  [key: string]: any;
}
```

### React Components

- Functional Components nur
- Props-Typing obligatorisch
- "use client" für Client-Komponenten

```tsx
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return <button onClick={onClick}>{label}</button>;
};

// ❌ Bad
export default function Button(props) {
  // ...
}
```

### Naming Conventions

```
Components:        PascalCase (Button.tsx)
Functions:         camelCase (getUserRole())
Constants:         UPPER_SNAKE_CASE (MAX_RETRIES)
Files:             kebab-case (user-form.tsx)
CSS Classes:       kebab-case (glass-container)
Database Tables:   snake_case (user_preferences)
```

### File Structure

```
src/
├── components/
│   ├── shared/          # Reusable components
│   ├── auth/
│   ├── admin/
│   └── ui/
├── lib/
│   ├── api-client.ts
│   ├── auth-utils.ts
│   └── db-utils.ts
├── app/
│   ├── api/            # Route Handlers
│   ├── (auth)/         # Auth Pages
│   ├── admin/
│   └── dashboard/
└── types/
    └── index.ts
```

## 🎨 Design & Styling

### Tailwind CSS

- Nutze vorhandene Tailwind-Klassen
- Custom Glass-Klassen für Glassmorphismus
- Keine inline-styles!

```tsx
// ✅ Good
<div class="glass-lg p-8 rounded-3xl hover:shadow-glass-glow-purple">

// ❌ Bad
<div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '32px' }}>
```

### Color Palette

```css
/* Always use CSS Variables */
background-color: var(--dark-bg);
color: var(--accent-purple);
```

## 🔐 Security

### Authentication

- Immer NextAuth.js verwenden
- Keine Passwörter in Logs
- Validate all inputs

### Database

- Immer Prisma verwenden
- Prepared Statements (Prisma macht das automatisch)
- Keine SQL-Injection Anfälligkeit

```tsx
// ✅ Good
const user = await prisma.user.findUnique({
  where: { email: userEmail }
});

// ❌ Bad
const user = db.raw(`SELECT * FROM users WHERE email = '${userEmail}'`);
```

### Environment Variables

- Sensitive Daten nur in `.env.local`
- `.env.local` in `.gitignore`
- Dokumentiere neue Vars in `.env.example`

## 📝 Commit Guidelines

### Format

```
type: subject

body (optional)

footer (optional)
```

### Types

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Code style (no logic change)
refactor: Code refactoring
perf:     Performance improvement
test:     Test-related changes
chore:    Build/dependencies changes
```

### Examples

```bash
# ✅ Good
git commit -m "feat: add user profile completion modal"
git commit -m "fix: prevent null pointer in onboarding"
git commit -m "docs: update deployment guide"

# ❌ Bad
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "blah blah"
```

## 🧪 Testing

### Before Submitting PR

```bash
# Run build check
npm run build

# Run lint
npm run lint

# Manual testing
npm run dev
```

### Test Requirements

- Test lokale Änderungen
- Teste verschiedene Rollen (USER, ADMIN, ROOT)
- Teste auf Mobile & Desktop

## 📤 Pull Request Process

### 1. Vor dem PR

```bash
# Update main branch
git fetch origin
git rebase origin/main

# Ensure build works
npm run build

# Commit clean
git push origin feature/my-feature
```

### 2. PR erstellen

- Beschreibe was du geändert hast
- Link relevant Issues
- Screenshots/Videos wenn UI changes

### 3. PR Template

```markdown
## Description
Was tut dieser PR?

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📚 Documentation update
- [ ] 🎨 Styling/Design
- [ ] 🔄 Refactoring

## Testing
Wie wurde getestet?

## Checklist
- [ ] Code folgt den Konventionen
- [ ] Selbst überprüft (reviews own code first)
- [ ] Kommentare hinzugefügt für komplexe Logik
- [ ] Lokale build erfolgreicht
- [ ] Keine breaking changes
```

## 📚 API Development

### Creating Endpoints

```tsx
// src/app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/users/[id]:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

## 🐛 Debugging Tips

### Enable Debug Logs

```bash
DEBUG=* npm run dev
```

### Prisma Studio

```bash
npm run db:studio
# Öffnet GUI für Datenbankansicht
```

### Browser DevTools

- React DevTools für Component Inspection
- Network Tab für API Debugging

## 📖 Documentation

### Code Comments

```tsx
// ✅ Good - Erklär WARUM
// Check if user exists before creating account
const existingUser = await prisma.user.findUnique({...});

// ❌ Bad - Offensichtliches wiederholen
// Find user by email
const user = prisma.user.findUnique({...});
```

### Function Docs

```tsx
/**
 * Generiert einen eindeutigen Username aus Vor- und Nachname
 * @param firstName - Vorname des Benutzers
 * @param lastName - Nachname des Benutzers
 * @returns Username im Format "XXyy" (erste 2 Buchstaben)
 * @example
 * generateUsername('Moritz', 'Bauer') // returns 'MoBa'
 */
export function generateUsername(firstName: string, lastName: string): string {
  return `${firstName.substring(0, 2)}${lastName.substring(0, 2)}`.toUpperCase();
}
```

## 🤝 Code Review

### What to Look For

- Follows conventions ✓
- Type-safe ✓
- No security issues ✓
- Performance okay ✓
- Tests if needed ✓
- Documentation complete ✓

## ❓ Questions?

- Check existing Issues/PRs
- Frag in Discussions
- Kontaktiere @maintainer

---

**Danke für deine Unterstützung! 🙏**
