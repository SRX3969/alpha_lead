# Alpha Lead Academy — Premium Website Redesign

> **Master System Implementation**  
> Defining Leadership through authority, trust, and elegance. Grounded in operational military discipline and DIPR psychological assessment.

---

## 🏛️ Project Architecture & Key Features

Alpha Lead Academy is engineered as a high-performance, pristine leadership web application built on vanilla technologies (HTML5, Modular CSS3, Vanilla JS) complying with WCAG AA accessibility, sub-2.5s LCP loading performance, and 60fps micro-animations.

```
alphalead/
├── index.html              # Master Homepage (Hero, 4 Pillars, Founders, Vision, FAQs, Contact)
├── defence.html            # Dedicated Defence SSB Mentorship Page (NDA, CDS, AFCAT, GTO, Psych)
├── corporate.html          # Dedicated Corporate Leadership Under Pressure & CRM Page
├── career.html             # Dedicated Career Launchpad & Interview Mastery Page
├── ssb-stay.html           # Dedicated SSB Stay Mysuru (5 mins from 2 AFSB) Residential Page
├── blog.html               # Defence Knowledge Hub & Blog Dossier Reader (All 9 Articles)
├── README.md               # Project documentation
├── css/
│   ├── tokens.css          # Color palette, 8px spacing system, typography scales, easing curves
│   ├── base.css            # CSS reset, typography, accessibility skip-link, container grids
│   ├── components.css      # Header, nav drawer, buttons, cards, accordions, modals, footer
│   ├── animations.css      # 12 micro-interactions, scroll reveals, shake, spinners, reduced-motion
│   └── main.css            # Bundled CSS import entry point
├── js/
│   ├── animations.js       # IntersectionObserver scroll reveals, accordion, modals, stat counters
│   ├── forms.js            # Client-side validation, error shake, spinner, accessible alerts
│   └── main.js             # Mobile drawer, active nav tracking, interactive pathway selector
└── assets/
    └── images/             # Authentic, high-resolution desaturated leadership photography
        ├── hero-leader.jpg
        ├── founder-iaf.jpg
        ├── founder-psychologist.jpg
        ├── pillar-defence.jpg
        ├── pillar-corporate.jpg
        ├── pillar-career.jpg
        └── pillar-stay.jpg
```

---

## 🎨 Design System & Palette

| Token | Hex / Value | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Pure white canvas foundation |
| `--color-text-primary` | `#1A1A1A` | Deep charcoal (warm authority) |
| `--color-text-secondary` | `#6B6B6B` | Sophisticated gray for body copy |
| `--color-text-tertiary` | `#A8A8A8` | Subtle metadata and captions |
| `--color-border` | `#E8E8E8` | Barely-there structural dividers |
| `--color-accent-primary` | `#2C5F8D` | Deep navy (authority, primary CTA) |
| `--color-accent-secondary` | `#5B9BD5` | Refined sky blue (clarity, focus states) |
| `--color-accent-tertiary` | `#D4AF37` | Subtle gold (distinction, crest accent) |
| `--color-accent-support` | `#2D7A4A` | Deep forest green (growth, verified badges) |
| `--color-surface-light` | `#FAFAFA` | Subtle off-white for soft sections |
| `--color-surface-accent` | `#F3F6F9` | Barely-tinted blue for cards & footer |

---

## ⚡ 12 Micro-Interactions & Animations

1. **Button States**: Primary, secondary, tertiary buttons with hover lift (1-2px), active compression, and focus rings.
2. **Navigation Underlines**: Dynamic sliding underline reveal on hover and scroll-based section tracking.
3. **Form Focus & Validation**: Focus outline glow, real-time error clearance, and input validation.
4. **Form Error Shake**: Subtle 0.4s horizontal vibration on invalid submit attempts.
5. **Form Submission State**: Button transitions to spinning loader during async processing.
6. **Success State Pop-in**: Checkmark pop-in with `bounce-light` easing and pulsing green halo.
7. **Accordion Transitions**: Accessible smooth expand/collapse with rotating chevron icons.
8. **Scroll Reveals**: IntersectionObserver triggered `fadeInUp` with staggered delays (`delay-1`, `delay-2`, etc.).
9. **Animated Stat Counters**: Numbers count up to target values using cubic easing when scrolled into view.
10. **Modal Transitions**: Scale-up (`0.95 -> 1`) with background backdrop blur and Escape key dismissal.
11. **Interactive Pathway Tabs**: Dynamic switching between SSB Fresher, Repeater, Corporate, and Graduate blueprints.
12. **Accessibility**: Full `@media (prefers-reduced-motion: reduce)` support instantly bypassing transitions.

---

## 🚀 Running Locally

You can preview the website locally using any HTTP server:

```powershell
# Using Python
python -m http.server 8080

# Using Node.js npx
npx serve . -p 8080
```

Then open `http://localhost:8080` in your web browser.
