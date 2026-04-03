A cinematic, Netflix-inspired event website for CyberFest 2026, the annual tech fest of the Department of Computer Science & Engineering.

Built with React + TypeScript + Tailwind CSS, deployed on the Internet Computer (ICP) via Caffeine AI.

 Live Demo

Link coming soon


 Features

 Cinematic Loading Screen — Lightning, glitch text, and progress bar intro sequence
 Netflix-style Profile Selector — Choose from Creators, Innovators, or Technologists
 Hero Section — Looping dark tech video background with animated electric energy orb
 Events Grid — 8 event cards (Tech, Non-Tech, and a prank card)
 Full-Page Event Detail View — Netflix-style detail page with descriptions, rounds, rules & registration
 Team Carousel — 3D perspective carousel, auto-scrolls every 3s across 10 teams
 Electric Energy Orb — Animated red orb with arc rings, persistent in background
 Custom Cursor — Electric shock effect with red arcs
 Lightning Flash — Periodic lightning strike effect behind the hero
 Fully Responsive — Mobile, tablet, and desktop layouts


 Tech Stack
LayerTechnologyFrontendReact 18 + TypeScriptStylingTailwind CSS + Custom CSSUI Componentsshadcn/uiBackendMotoko (Internet Computer)PlatformCaffeine AI / ICPFontShare Tech Mono (Google Fonts)

Project Structure
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

 Events
#EventCategoryRounds1Paper PresentationTECH22DebuggingTECH33Technical QuizTECH44Vibe CodingTECH25IPL AuctionNON-TECH26Meme QuizNON-TECH47One Piece TriviaPRANK—8Breaking BugTECH3

 Color Palette
TokenValueUsageBackground#141414Page backgroundCyberFest Red#e50914Primary accent, buttons, badges, orbCard Background#181818Event cards, modalsText Primary#ffffffHeadings, names, labelsText Secondary#808080Subtitles, meta infoSuccess Green#46d369Match score indicator

 How to Update Content
Edit an Event
Open src/frontend/src/components/EventsSection.tsx and update the EVENTS array.
Each event has: title, category, poster, description, time, venue, contact, isPrank.
Change Event Tags or Match Score
Edit EVENT_TAGS and MATCH_SCORES in src/frontend/src/components/EventDetailPage.tsx.
Add a Photo

Drop the image into src/frontend/public/assets/uploads/
Import it in the relevant component
Replace the placeholder src with the import

Update Registration Link
Find alert("Registration portal opening soon") in EventDetailPage.tsx and replace with:
tswindow.open("YOUR_GOOGLE_FORM_URL", "_blank");

 Downloading the Project
To download as a ZIP from Caffeine:

Open Project Settings
Go to More
Click Download files


 Credits
Website Developer — Sreenithi R
Built with Caffeine AI on the Internet Computer Protocol.
Department of Computer Science & Engineering — CyberFest 2026


 This project is inspired by Netflix's UI for educational and academic purposes. It is not affiliated with or endorsed by Netflix, Inc.
