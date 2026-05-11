# 🎨 Design System Guide

Umfassender Leitfaden zum ABI-2029 Design System mit Liquid Glass Ästhetik.

## 🎯 Design-Philosophie

Das ABI-2029 Design System basiert auf **Liquid Glass Morphism** - eine moderne Interpretation von Glassmorphismus mit organischen, flüssig aussehenden Formen und subtilen Glow-Effekten.

## 🌈 Farbpalette

### Primary Colors
```css
--dark-bg: #0a0f1e;              /* Main Background - Sehr dunkles Blau */
--dark-secondary: #0f1629;       /* Secondary Background */
--dark-tertiary: #141d2f;        /* Tertiary Background */
```

### Accent Colors
```css
--accent-purple: #2d0a4e;        /* Primary Accent - Deep Purple */
--accent-purple-light: #4a1a7f;  /* Purple Light Variant */
--accent-blue: #1a3a52;          /* Secondary Accent - Blue */
```

### Glass Colors
```css
--glass-white: rgba(255, 255, 255, 0.10);  /* Base Glass Color */
```

## 🔮 Liquid Glass Komponenten

### 1. Basic Glass Container

```html
<!-- Standard Glass (mid-size blur) -->
<div class="glass">
  Content
</div>

<!-- Large Glass (more blur) -->
<div class="glass-lg">
  Content
</div>

<!-- Small Glass (less blur) -->
<div class="glass-sm">
  Content
</div>
```

**CSS Eigenschaften:**
- `backdrop-blur-xl`: 40px blur effect
- `bg-glass-white`: Semi-transparent white background
- `border border-white/20`: Subtle border
- `box-shadow: shadow-glass`: Subtile Schatten

### 2. Glossy Glass (mit Spiegelungen)

```html
<div class="glass-glossy">
  Content
</div>
```

**Features:**
- Gradient-Spiegelung von oben-links
- Simuliert Metallische Oberfläche
- Moderne, glänzende Optik

### 3. Glowing Glass (mit Farbglow)

```html
<!-- Purple Glow -->
<div class="glass-glow" style="background: linear-gradient(135deg, #2d0a4e 0%, #1a3a52 100%)">
  Content
</div>

<!-- Blue Glow -->
<div class="glass-glow shadow-glass-glow-blue">
  Content
</div>
```

**Glow Effects:**
- `shadow-glass-glow-purple`: Lila Glow
- `shadow-glass-glow-blue`: Blau Glow
- Wird durch `::after` pseudo-element erzeugt

## 🔘 Button Styles

### Glass Button

```html
<button class="btn-glass">
  Standard Button
</button>
```

**Features:**
- Glasmorphismus-Stil
- Hover-Effekt mit Shine-Animation
- Active-State mit Scale-Down

### Gradient Button

```html
<button class="btn-gradient px-6 py-3 rounded-full font-medium">
  Gradient Button
</button>
```

**Farben:**
- Purple (#6d28d9) zu Accent Purple (#2d0a4e)
- Für wichtige CTAs

## 📝 Input Fields

### Glass Input

```html
<input type="text" class="input-glass" placeholder="Tippe hier..." />
```

**States:**
- Default: Semi-transparent with white border
- Focus: Brighter border + purple ring
- Disabled: Reduced opacity

### Styling Details
- `placeholder-white/40`: Subtile Platzhalter
- `focus:ring-2 focus:ring-accent-purple/30`: Purple Focus Ring
- `rounded-2xl`: Abgerundete Ecken

## 🎭 Backdrop Blur Levels

```css
/* Predefined Blur Levels */
.backdrop-blur-xs    /* 2px */
.backdrop-blur-sm    /* 4px */
.backdrop-blur-md    /* 12px */
.backdrop-blur-lg    /* 20px */
.backdrop-blur-xl    /* 40px */
```

**Einsatz:**
- `xs/sm`: Feines Glas für Buttons
- `md`: Standard für normale Elemente
- `lg/xl`: Für Sidebar/Large Components

## 🌊 Gradients

### Purple to Blue Gradient

```html
<div class="bg-gradient-purple-blue">
  Content
</div>
```

```css
background: linear-gradient(135deg, #2d0a4e 0%, #1a3a52 100%);
```

### Glassmorphism Gradient

```html
<div class="bg-gradient-glass">
  Content
</div>
```

```css
background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
```

## 🎬 Animationen

### Slide In (Links)

```html
<div class="animate-slide-in-left">
  Content slides in from left
</div>
```

### Slide In (Rechts)

```html
<div class="animate-slide-in-right">
  Content slides in from right
</div>
```

### Fade In

```html
<div class="animate-fade-in">
  Content fades in
</div>
```

### Glow Animation

```html
<div class="animate-glow">
  Content glows pulsing
</div>
```

## 🔄 Schatten & Glow Effects

```css
/* Glass Shadow */
.shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

/* Glow Shadows */
.shadow-glass-glow-purple: 0 0 30px 0 rgba(109, 40, 217, 0.3);
.shadow-glass-glow-blue: 0 0 30px 0 rgba(59, 130, 246, 0.3);

/* Inner Shadow (Vertiefung) */
.shadow-glass-inner: inset 0 2px 8px 0 rgba(255, 255, 255, 0.15);
```

## 📐 Border Radius Standards

```css
.rounded-xl    /* 0.75rem - Klein */
.rounded-2xl   /* 1rem - Standard */
.rounded-3xl   /* 1.5rem - Groß */
.rounded-4xl   /* 2rem - Extra Groß */
.rounded-full  /* 9999px - Völlig rund */
```

**Einsatz:**
- `rounded-2xl`: Standard für alle Container
- `rounded-full`: Für Buttons & Pills
- `rounded-3xl`: Für Large Cards
- `rounded-xl`: Für Small Elements

## 🎨 Komponenten-Beispiele

### Card mit Liquid Glass

```html
<div class="glass-lg p-8 rounded-3xl hover:shadow-glass-glow-purple transition-all duration-300">
  <h2 class="text-2xl font-bold text-white mb-3">Titel</h2>
  <p class="text-white/60">Beschreibung</p>
</div>
```

### Button mit Glass Effekt

```html
<button class="glass px-6 py-3 rounded-full font-medium text-white hover:bg-white/10 active:scale-95 transition-all">
  Click me
</button>
```

### Modal mit Glassmorphism

```html
<div class="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
  <div class="glass-lg max-w-md w-full p-8 rounded-3xl">
    <!-- Modal Content -->
  </div>
</div>
```

### Navigation mit Liquid Glass

```html
<nav class="sidebar-glass backdrop-blur-2xl border-r border-white/10 p-6">
  <!-- Nav Items -->
</nav>
```

## 🔍 Best Practices

### ✅ Do's

1. **Kombiniere Glass-Klassen logisch**
   ```html
   <div class="glass-lg glass-glossy">...</div>  <!-- ✅ OK -->
   ```

2. **Nutze Transparenzen für Tiefe**
   ```css
   .bg-glass-white            /* 10% opacity */
   .bg-white/20               /* Borders */
   .text-white/60             /* Secondary text */
   .text-white/40             /* Disabled text */
   ```

3. **Hover/Active States konsistent halten**
   ```html
   <button class="glass hover:shadow-glass-glow-purple active:scale-95 transition-all">
   ```

### ❌ Don'ts

1. **Nicht zu viele Glow Effects überlagern**
   ```html
   <!-- ❌ Avoid -->
   <div class="shadow-glass-glow-purple shadow-glass-glow-blue">
   ```

2. **Nicht unterschiedliche Blur-Level vermischen**
   ```html
   <!-- ❌ Avoid -->
   <div class="glass backdrop-blur-xl">  <!-- Conflict -->
   ```

3. **Nicht opacity bei Background übertreiben**
   ```css
   /* ❌ Avoid */
   .bg-white/80  /* Zu opak, verlässt Glass-Prinzip */
   ```

## 📱 Responsive Design

Glass-Komponenten skalieren automatisch:

```html
<!-- Größe anpassen je nach Screen -->
<div class="glass-lg p-8 md:p-12 lg:p-16 rounded-3xl">
  Content
</div>
```

```css
/* Blur auch responsive */
.backdrop-blur-md md:backdrop-blur-lg
```

## 🎯 Kontakt & Feedback

Für Design-Fragen oder Verbesserungsvorschläge bitte ein Issue im Repository öffnen.

---

**Version**: 1.0
**Last Updated**: May 2026
