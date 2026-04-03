#  CyberFest 2026 — Official Event Website

> A cinematic, Netflix-inspired event website for **CyberFest 2026**, the annual tech fest of the Department of Computer Science & Engineering.

Built with **React + TypeScript + Tailwind CSS**, deployed on the [Internet Computer (ICP)](https://internetcomputer.org/) via [Caffeine AI](https://caffeine.ai/).

---

##  Live Demo

> _Link coming soon_

---

##  Features

-  **Cinematic Loading Screen** — Lightning, glitch text, and progress bar intro sequence
-  **Netflix-style Profile Selector** — Choose from Creators, Innovators, or Technologists
-  **Hero Section** — Looping dark tech video background with animated electric energy orb
   **Events Grid** — 8 event cards (Tech, Non-Tech, and a prank card)
-  **Full-Page Event Detail View** — Netflix-style detail page with descriptions, rounds, rules & registration
-  **Team Carousel** — 3D perspective carousel, auto-scrolls every 3s across 10 teams
-  **Electric Energy Orb** — Animated red orb with arc rings, persistent in background
-  **Custom Cursor** — Electric shock effect with red arcs
-  **Lightning Flash** — Periodic lightning strike effect behind the hero
-  **Fully Responsive** — Mobile, tablet, and desktop layouts

---

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| UI Components | shadcn/ui |
| Backend | Motoko (Internet Computer) |
| Platform | Caffeine AI / ICP |
| Font | Share Tech Mono (Google Fonts) |

---

##  Project Structure

```
src/
├── backend/
│   └── main.mo                     # Motoko backend canister
└── frontend/
    ├── public/
    │   └── assets/
    │       ├── uploads/            # Team / coordinator / leadership photos
    │       └── generated/          # AI-generated event poster images
    └── src/
        ├── App.tsx                 # Root app, routing between screens
        ├── components/
        │   ├── LoadingScreen.tsx   # Cinematic intro sequence
        │   ├── ProfileScreen.tsx   # Netflix profile selector
        │   ├── Homepage.tsx        # Main page layout
        │   ├── Navbar.tsx          # Navigation bar
        │   ├── HeroSection.tsx     # Hero with video bg + orb
        │   ├── GlobeBackground.tsx # Animated electric energy orb
        │   ├── EventsSection.tsx   # ← Edit events here
        │   ├── EventDetailPage.tsx # ← Edit tags & match scores here
        │   ├── TeamSection.tsx     # Team + Coordinator + Leadership carousels
        │   ├── GetInvolvedSection.tsx
        │   ├── Footer.tsx
        │   └── CustomCursor.tsx    # Electric shock cursor animation
        └── main.tsx                # React entry point
```

---

##  Events

| # | Event | Category | Rounds |
|---|-------|----------|--------|
| 1 | Paper Presentation | TECH | 2 |
| 2 | Debugging | TECH | 3 |
| 3 | Technical Quiz | TECH | 4 |
| 4 | Vibe Coding | TECH | 2 |
| 5 | IPL Auction | NON-TECH | 2 |
| 6 | Meme Quiz | NON-TECH | 4 |
| 7 | One Piece Trivia | PRANK | — |
| 8 | Breaking Bug | TECH | 3 |

---

##  Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#141414` | Page background |
| CyberFest Red | `#e50914` | Primary accent, buttons, badges, orb |
| Card Background | `#181818` | Event cards, modals |
| Text Primary | `#ffffff` | Headings, names, labels |
| Text Secondary | `#808080` | Subtitles, meta info |
| Success Green | `#46d369` | Match score indicator |


##  Downloading the Project

To download as a ZIP from Caffeine:
1. Open **Project Settings**
2. Go to **More**
3. Click **Download files**

---

##  Credits

**Website Developer** — Sreenithi R  
Built with [Caffeine AI](https://caffeine.ai/) on the Internet Computer Protocol.  
Department of Computer Applications — CyberFest 2026

---

>  _This project is inspired by Netflix's UI for educational and academic purposes. It is not affiliated with or endorsed by Netflix, Inc._
