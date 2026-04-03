/**
 * TEAM SECTION — Voyager2-Style 3D Perspective Carousel
 * ======================================================
 * Center card is large and flat-on; ±1 cards are scaled/rotated in Y;
 * ±2 cards are even smaller/more rotated; beyond ±2 are hidden.
 * Auto-scrolls every 3s. Arrow buttons pause auto-scroll for 6s.
 */

import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface TeamSlide {
  /** Team display name */
  label: string;
  /** Optional photo path. If absent, shows a styled placeholder. */
  image?: string;
  /** Gradient used for placeholder slides */
  gradient: string;
}

// ─── SLIDE DATA — UPDATE image FIELDS WHEN PHOTOS ARRIVE ───────────────────
const SLIDES: TeamSlide[] = [
  {
    label: "CyberFest Team",
    image: "/assets/uploads/class.png",
    gradient:
      "linear-gradient(135deg, #1a0000 0%, #3d0000 35%, #1a0000 70%, #0a0000 100%)",
  },
  {
    label: "Paper Presentation Team",
    image: "/assets/uploads/paper-3.jpeg",
    gradient:
      "linear-gradient(120deg, #0a0000 0%, #1f0000 40%, #cc0812 55%, #0a0000 100%)",
  },
  {
    label: "Debugging Team",
    image: "/assets/uploads/debugging-1.jpeg",
    gradient:
      "linear-gradient(150deg, #000000 0%, #1a0000 45%, #e50914 60%, #000000 100%)",
  },
  {
    label: "Technical Quiz Team",
    image: "/assets/uploads/technicalquiz.jpeg",
    gradient: "linear-gradient(135deg, #1a0000 0%, #3d0000 100%)",
  },
  {
    label: "Vibe Coding Team",
    image: "/assets/uploads/vibecoding-2-1.jpeg",
    gradient: "linear-gradient(135deg, #1a0000 0%, #3d0000 100%)",
  },
  {
    label: "IPL Auction Team",
    image: "/assets/uploads/IPL-2-6.jpeg",
    gradient: "linear-gradient(135deg, #1a0000 0%, #3d0000 100%)",
  },
  {
    label: "Meme Quiz Team",
    image: "/assets/uploads/memequiz-7.jpeg",
    gradient: "linear-gradient(135deg, #1a0000 0%, #3d0000 100%)",
  },
  {
    label: "Design Team",
    image: "/assets/uploads/designteam-5.jpeg",
    gradient:
      "linear-gradient(135deg, #1a0000 0%, #3d0000 35%, #1a0000 70%, #0a0000 100%)",
  },
  {
    label: "Video Editing Team",
    image: "/assets/uploads/videoeditting-4.jpeg",
    gradient:
      "linear-gradient(145deg, #0d0000 0%, #2a0000 30%, #e50914 50%, #1a0000 80%, #0d0000 100%)",
  },
  {
    label: "Event Organizing Team",
    image: "/assets/uploads/organizers-2.jpeg",
    gradient: "linear-gradient(135deg, #1a0000 0%, #3d0000 100%)",
  },
];
// ────────────────────────────────────────────────────────────────────────────

const AUTO_SCROLL_MS = 3000;
const PAUSE_DURATION_MS = 6000;

/** Returns the signed shortest distance between two indices on a circular array */
function circularDelta(from: number, to: number, total: number): number {
  const raw = to - from;
  if (raw > total / 2) return raw - total;
  if (raw < -total / 2) return raw + total;
  return raw;
}

/** Compute transform/style for a card based on its position offset from center */
function getCardStyle(offset: number, isMobile: boolean): React.CSSProperties {
  const absOffset = Math.abs(offset);

  // Hide cards beyond ±2, or any non-center card on mobile
  if (absOffset > (isMobile ? 0 : 2)) {
    return {
      opacity: 0,
      pointerEvents: "none",
      transform: `translateX(${offset * (isMobile ? 100 : 450)}px) rotateY(${offset > 0 ? 75 : -75}deg) scale(0.3)`,
      zIndex: 0,
    };
  }

  const configs = {
    center: {
      scale: 1,
      rotateY: 0,
      translateX: 0,
      opacity: 1,
      zIndex: 10,
    },
    adj: {
      // ±1
      scale: isMobile ? 0.72 : 0.78,
      rotateY: 45,
      // spacing should grow with card width so larger cards don't overlap
      translateX: isMobile ? 140 : 600,
      opacity: 0.75,
      zIndex: 7,
    },
    far: {
      // ±2
      scale: isMobile ? 0.5 : 0.58,
      rotateY: 65,
      // further apart to keep far cards from collapsing into center
      translateX: isMobile ? 260 : 1100,
      opacity: 0.4,
      zIndex: 4,
    },
  };

  let cfg: typeof configs.center;
  if (absOffset === 0) cfg = configs.center;
  else if (absOffset === 1) cfg = configs.adj;
  else cfg = configs.far;

  const sign = offset < 0 ? -1 : offset > 0 ? 1 : 0;
  const rotateYDeg = sign * cfg.rotateY;
  const translateXpx = sign * cfg.translateX;

  return {
    opacity: cfg.opacity,
    zIndex: cfg.zIndex,
    pointerEvents: offset === 0 ? "auto" : "none",
    transform: `translateX(${translateXpx}px) rotateY(${rotateYDeg}deg) scale(${cfg.scale})`,
  };
}

export default function TeamSection() {
  const [current, setCurrent] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const total = SLIDES.length;

  // ── Detect mobile ─────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Navigation helpers ────────────────────────────────────────────────────
  const pauseAutoScroll = useCallback(() => {
    setIsUserInteracting(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, PAUSE_DURATION_MS);
  }, []);

  const goTo = useCallback(
    (index: number, fromUser = false) => {
      setCurrent((index + total) % total);
      if (fromUser) pauseAutoScroll();
    },
    [total, pauseAutoScroll],
  );

  const prev = useCallback(() => goTo(current - 1, true), [current, goTo]);
  const next = useCallback(() => goTo(current + 1, true), [current, goTo]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isUserInteracting) {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      return;
    }
    autoScrollRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTO_SCROLL_MS);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [isUserInteracting, total]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  // Card dimensions
  // Card dimensions
  // enlarge the cards substantially so the central card fills more of the viewport
  const cardW = isMobile ? 340 : 800;
  const cardH = isMobile ? 260 : 480;

  // Stage height (cards + some breathing room for rotation depth)
  // increase to match larger card sizes
  const stageH = isMobile ? 300 : 540;

  return (
    <section
      id="team"
      data-ocid="team.section"
      className="py-16 px-6 md:px-12"
      style={{ scrollMarginTop: "80px" }}
    >
      {/* ── Section header ── */}
      <div className="mb-12">
        <div className="section-rule">
          <h2 className="text-3xl font-black tracking-[0.25em] uppercase text-white">
            TEAM
          </h2>
        </div>
        <p className="mt-2 text-sm text-[#666] italic font-mono-tech">
          The minds behind CyberFest 2026
        </p>
      </div>

      {/* ── Perspective stage wrapper ── */}
      <div
        data-ocid="team.carousel.panel"
        className="relative mx-auto select-none"
        style={{
          maxWidth: isMobile ? "100%" : "2000px",
          perspective: isMobile ? "600px" : "1600px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* ── Carousel stage ── */}
        <div
          className="relative mx-auto"
          style={{
            height: `${stageH}px`,
            width: `${cardW}px`,
            transformStyle: "preserve-3d",
          }}
        >
          {SLIDES.map((slide, i) => {
            const offset = circularDelta(current, i, total);
            const cardStyle = getCardStyle(offset, isMobile);

            return (
              <div
                key={slide.label}
                data-ocid={`team.item.${i + 1}`}
                aria-hidden={offset !== 0}
                role={offset !== 0 ? "button" : undefined}
                tabIndex={offset !== 0 ? 0 : undefined}
                onClick={() => offset !== 0 && goTo(i, true)}
                onKeyDown={(e) => {
                  if (offset !== 0 && (e.key === "Enter" || e.key === " ")) {
                    goTo(i, true);
                  }
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${cardW}px`,
                  height: `${cardH}px`,
                  marginTop: `-${cardH / 2}px`,
                  marginLeft: `-${cardW / 2}px`,
                  borderRadius: "14px",
                  overflow: "hidden",
                  cursor: offset !== 0 ? "pointer" : "default",
                  transition:
                    "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, box-shadow 0.5s ease",
                  boxShadow:
                    offset === 0
                      ? "0 0 0 1.5px #e50914, 0 12px 60px rgba(229,9,20,0.35), 0 4px 24px rgba(0,0,0,0.8)"
                      : "0 4px 20px rgba(0,0,0,0.5)",
                  ...cardStyle,
                }}
              >
                {/* ── Card visuals ── */}
                {slide.image ? (
                  <>
                    <img
                      src={slide.image}
                      alt={slide.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      draggable={false}
                    />
                    {/* Bottom gradient overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)",
                      }}
                    />
                  </>
                ) : (
                  <>
                    {/* Placeholder gradient bg */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: slide.gradient,
                      }}
                    />
                    {/* Noise grain */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.12,
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                        backgroundSize: "200px 200px",
                      }}
                    />
                    {/* Camera icon */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(229,9,20,0.15)",
                          border: "1px solid rgba(229,9,20,0.4)",
                          boxShadow: "0 0 20px rgba(229,9,20,0.2)",
                        }}
                      >
                        <Camera
                          style={{
                            width: "22px",
                            height: "22px",
                            color: "#e50914",
                          }}
                        />
                      </div>
                      <p
                        style={{
                          color: "#555",
                          fontSize: "10px",
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          fontFamily: "var(--font-mono-tech, monospace)",
                        }}
                      >
                        Photo Coming Soon
                      </p>
                    </div>
                    {/* Bottom gradient */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)",
                      }}
                    />
                  </>
                )}

                {/* ── Team label (always bottom of card) ── */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "0 14px 14px",
                  }}
                >
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: isMobile ? "13px" : "16px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      textShadow:
                        "0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(229,9,20,0.3)",
                      lineHeight: 1.2,
                    }}
                  >
                    {slide.label}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Arrow buttons (below stage, centered) ── */}
        <div
          className="flex items-center justify-center gap-6 mt-8"
          style={{ marginTop: `${stageH / 2 - cardH / 2 + 32}px` }}
        >
          <button
            type="button"
            data-ocid="team.pagination_prev"
            onClick={prev}
            aria-label="Previous team"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1.5px solid rgba(229,9,20,0.6)",
              background: "rgba(20,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 12px rgba(229,9,20,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(229,9,20,0.2)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(229,9,20,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(20,0,0,0.85)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px rgba(229,9,20,0.15)";
            }}
          >
            <ChevronLeft
              style={{ width: "22px", height: "22px", color: "#fff" }}
              strokeWidth={2.5}
            />
          </button>

          {/* ── Dot indicators ── */}
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Team carousel indicators"
          >
            {SLIDES.map((s, i) => (
              <button
                type="button"
                key={s.label}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to ${s.label}`}
                onClick={() => goTo(i, true)}
                style={{
                  width: i === current ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: i === current ? "#e50914" : "#333",
                  boxShadow:
                    i === current ? "0 0 8px rgba(229,9,20,0.7)" : "none",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            data-ocid="team.pagination_next"
            onClick={next}
            aria-label="Next team"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1.5px solid rgba(229,9,20,0.6)",
              background: "rgba(20,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 12px rgba(229,9,20,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(229,9,20,0.2)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(229,9,20,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(20,0,0,0.85)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px rgba(229,9,20,0.15)";
            }}
          >
            <ChevronRight
              style={{ width: "22px", height: "22px", color: "#fff" }}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* ── Active slide team label below controls ── */}
        <div className="mt-4 text-center">
          <p
            className="text-xs font-mono-tech tracking-[0.2em] uppercase transition-all duration-300"
            style={{ color: "#ffffff" }}
          >
            {SLIDES[current].label}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   EVENT COORDINATORS CAROUSEL — same 3D perspective pattern as team carousel
   ══════════════════════════════════════════════════════════════════════════════ */

interface CoordSlide {
  label: string;
  role: string;
  gradient: string;
  image?: string;
}

const EVENT_COORDINATOR_SLIDES: CoordSlide[] = [
  {
    label: "Vibe Coding",
    role: "Event Coordinator",
    gradient:
      "linear-gradient(135deg,#1a0000 0%,#3d0000 35%,#1a0000 70%,#0a0000 100%)",
  },
  {
    label: "Technical Quiz",
    role: "Event Coordinator",
    gradient:
      "linear-gradient(145deg,#0d0000 0%,#2a0000 30%,#e50914 50%,#1a0000 80%,#0d0000 100%)",
  },
  {
    label: "Paper Presentation",
    role: "Event Coordinator",
    gradient:
      "linear-gradient(120deg,#0a0000 0%,#1f0000 40%,#cc0812 55%,#0a0000 100%)",
  },
  {
    label: "Debugging",
    role: "Event Coordinator",
    gradient:
      "linear-gradient(150deg,#000000 0%,#1a0000 45%,#e50914 60%,#000000 100%)",
  },
  {
    label: "IPL Auction",
    role: "Event Coordinator",
    gradient: "linear-gradient(135deg,#1a0000 0%,#3d0000 100%)",
  },
  {
    label: "Meme Quiz",
    role: "Event Coordinator",
    gradient: "linear-gradient(135deg,#0a0000 0%,#2a0000 100%)",
  },
];

/* ── Leadership data ──────────────────────────────────────────────────────── */
interface LeadershipMember {
  role: string;
  name: string;
  image?: string;
}

const LEADERSHIP: LeadershipMember[] = [
  { role: "Chairman", name: "Devarajan S", image: "/assets/uploads/deva.JPG" },
  { role: "Vice Chairman", name: "Dhanashri S", image: "/assets/uploads/dhana.jpg" },
  { role: "Secretary", name: "Karthick R S", image: "/assets/uploads/karthi.jpg" },
  { role: "Vice Secretary", name: "Akshaya S K", image: "/assets/uploads/aks.JPG" },
  { role: "Treasurer", name: "Rithik R", image: "/assets/uploads/rithik.jpg" },
  { role: "Joint Treasurer", name: "Boomika S", image: "/assets/uploads/boomika.jpg" },
];

/* ── Event Coordinators Carousel ─────────────────────────────────────────── */
export function EventCoordinatorsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const total = EVENT_COORDINATOR_SLIDES.length;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pauseAutoScroll = useCallback(() => {
    setIsUserInteracting(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, PAUSE_DURATION_MS);
  }, []);

  const goTo = useCallback(
    (index: number, fromUser = false) => {
      setCurrent((index + total) % total);
      if (fromUser) pauseAutoScroll();
    },
    [total, pauseAutoScroll],
  );

  const prev = useCallback(() => goTo(current - 1, true), [current, goTo]);
  const next = useCallback(() => goTo(current + 1, true), [current, goTo]);

  useEffect(() => {
    if (isUserInteracting) {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      return;
    }
    autoScrollRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTO_SCROLL_MS);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [isUserInteracting, total]);

  useEffect(() => {
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const cardW = isMobile ? 200 : 280;
  const cardH = isMobile ? 270 : 380;
  const stageH = isMobile ? 300 : 430;

  return (
    <section
      id="event-coordinators"
      data-ocid="event-coordinators.section"
      className="py-16 px-6 md:px-12"
      style={{ scrollMarginTop: "80px" }}
    >
      {/* Section header */}
      <div className="mb-12">
        <div className="section-rule">
          <h2 className="text-3xl font-black tracking-[0.25em] uppercase text-white">
            EVENT COORDINATORS
          </h2>
        </div>
        <p className="mt-2 text-sm text-[#666] italic font-mono-tech">
          The faces behind every event
        </p>
      </div>

      {/* Perspective stage wrapper */}
      <div
        data-ocid="event-coordinators.carousel.panel"
        className="relative mx-auto select-none"
        style={{
          maxWidth: isMobile ? "100%" : "1100px",
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Carousel stage */}
        <div
          className="relative mx-auto"
          style={{
            height: `${stageH}px`,
            width: `${cardW}px`,
            transformStyle: "preserve-3d",
          }}
        >
          {EVENT_COORDINATOR_SLIDES.map((slide, i) => {
            const offset = circularDelta(current, i, total);
            const cardStyle = getCardStyle(offset, isMobile);

            return (
              <div
                key={slide.label}
                data-ocid={`event-coordinators.item.${i + 1}`}
                aria-hidden={offset !== 0}
                role={offset !== 0 ? "button" : undefined}
                tabIndex={offset !== 0 ? 0 : undefined}
                onClick={() => offset !== 0 && goTo(i, true)}
                onKeyDown={(e) => {
                  if (offset !== 0 && (e.key === "Enter" || e.key === " ")) {
                    goTo(i, true);
                  }
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${cardW}px`,
                  height: `${cardH}px`,
                  marginTop: `-${cardH / 2}px`,
                  marginLeft: `-${cardW / 2}px`,
                  borderRadius: "14px",
                  overflow: "hidden",
                  cursor: offset !== 0 ? "pointer" : "default",
                  transition:
                    "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, box-shadow 0.5s ease",
                  boxShadow:
                    offset === 0
                      ? "0 0 0 1.5px #e50914, 0 12px 60px rgba(229,9,20,0.35), 0 4px 24px rgba(0,0,0,0.8)"
                      : "0 4px 20px rgba(0,0,0,0.5)",
                  ...cardStyle,
                }}
              >
                {/* Card visuals */}
                {slide.image ? (
                  <>
                    <img
                      src={slide.image}
                      alt={slide.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      draggable={false}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: slide.gradient,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.12,
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                        backgroundSize: "200px 200px",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(229,9,20,0.15)",
                          border: "1px solid rgba(229,9,20,0.4)",
                          boxShadow: "0 0 20px rgba(229,9,20,0.2)",
                        }}
                      >
                        <Camera
                          style={{
                            width: "22px",
                            height: "22px",
                            color: "#e50914",
                          }}
                        />
                      </div>
                      <p
                        style={{
                          color: "#555",
                          fontSize: "10px",
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          fontFamily: "var(--font-mono-tech, monospace)",
                        }}
                      >
                        Photo Coming Soon
                      </p>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)",
                      }}
                    />
                  </>
                )}

                {/* Card label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "0 14px 14px",
                  }}
                >
                  <p
                    style={{
                      color: "#e50914",
                      fontSize: "10px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-mono-tech, monospace)",
                      marginBottom: "4px",
                    }}
                  >
                    {slide.role}
                  </p>
                  <p
                    style={{
                      color: "#888",
                      fontSize: "9px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-mono-tech, monospace)",
                      marginBottom: "6px",
                    }}
                  >
                    {`${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
                  </p>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: isMobile ? "13px" : "16px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      textShadow:
                        "0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(229,9,20,0.3)",
                      lineHeight: 1.2,
                    }}
                  >
                    {slide.label}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrow buttons */}
        <div
          className="flex items-center justify-center gap-6"
          style={{ marginTop: `${stageH / 2 - cardH / 2 + 32}px` }}
        >
          <button
            type="button"
            data-ocid="event-coordinators.pagination_prev"
            onClick={prev}
            aria-label="Previous event coordinator"
            style={{
              width: "48px",
              height: "48px",
              minWidth: "44px",
              minHeight: "44px",
              borderRadius: "50%",
              border: "1.5px solid rgba(229,9,20,0.6)",
              background: "rgba(20,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 12px rgba(229,9,20,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(229,9,20,0.2)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(229,9,20,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(20,0,0,0.85)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px rgba(229,9,20,0.15)";
            }}
          >
            <ChevronLeft
              style={{ width: "22px", height: "22px", color: "#fff" }}
              strokeWidth={2.5}
            />
          </button>

          {/* Dot indicators */}
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Event coordinators carousel indicators"
          >
            {EVENT_COORDINATOR_SLIDES.map((s, i) => (
              <button
                type="button"
                key={s.label}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to ${s.label} coordinator`}
                onClick={() => goTo(i, true)}
                style={{
                  width: i === current ? "24px" : "8px",
                  height: "8px",
                  minHeight: "8px",
                  borderRadius: "9999px",
                  border: "none",
                  padding: "4px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: i === current ? "#e50914" : "#333",
                  boxShadow:
                    i === current ? "0 0 8px rgba(229,9,20,0.7)" : "none",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            data-ocid="event-coordinators.pagination_next"
            onClick={next}
            aria-label="Next event coordinator"
            style={{
              width: "48px",
              height: "48px",
              minWidth: "44px",
              minHeight: "44px",
              borderRadius: "50%",
              border: "1.5px solid rgba(229,9,20,0.6)",
              background: "rgba(20,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 12px rgba(229,9,20,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(229,9,20,0.2)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(229,9,20,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(20,0,0,0.85)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px rgba(229,9,20,0.15)";
            }}
          >
            <ChevronRight
              style={{ width: "22px", height: "22px", color: "#fff" }}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Active slide label */}
        <div className="mt-4 text-center">
          <p
            className="text-xs font-mono-tech tracking-[0.2em] uppercase transition-all duration-300"
            style={{ color: "#ffffff" }}
          >
            {EVENT_COORDINATOR_SLIDES[current].label}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LEADERSHIP SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <LeadershipSection />
    </section>
  );
}

/* ── Holographic card CSS injected once ─────────────────────────────────── */
const HOLO_STYLE_ID = "leadership-holo-style";
function injectHoloStyles() {
  if (typeof document === "undefined" || document.getElementById(HOLO_STYLE_ID))
    return;
  const style = document.createElement("style");
  style.id = HOLO_STYLE_ID;
  style.textContent = `
    @keyframes holoScan {
      0%   { background-position: 0 -100%; }
      100% { background-position: 0 300%; }
    }
    @keyframes holoFlicker {
      0%,100% { opacity:1; }
      92%     { opacity:1; }
      93%     { opacity:0.7; }
      94%     { opacity:1; }
      96%     { opacity:0.85; }
      97%     { opacity:1; }
    }
    @keyframes ledBlink {
      0%,49%,51%,100% { opacity:1; }
      50%             { opacity:0.1; }
    }
    .holo-card {
      animation: holoFlicker 8s ease-in-out infinite;
    }
    .holo-scanline {
      position:absolute;
      inset:0;
      background: repeating-linear-gradient(
        180deg,
        transparent 0px,
        transparent 3px,
        rgba(229,9,20,0.04) 3px,
        rgba(229,9,20,0.04) 4px
      );
      pointer-events:none;
      z-index:3;
    }
    .holo-sweep {
      position:absolute;
      inset:0;
      background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(229,9,20,0.12) 48%,
        rgba(255,255,255,0.06) 50%,
        transparent 52%
      );
      background-size:100% 200%;
      animation: holoScan 4s linear infinite;
      pointer-events:none;
      z-index:4;
    }
    .holo-corner {
      position:absolute;
      width:12px;height:12px;
      border-color:#e50914;
      border-style:solid;
      opacity:0.8;
      z-index:5;
    }
    .holo-corner-tl { top:8px;left:8px;  border-width:2px 0 0 2px; }
    .holo-corner-tr { top:8px;right:8px; border-width:2px 2px 0 0; }
    .holo-corner-bl { bottom:8px;left:8px;  border-width:0 0 2px 2px; }
    .holo-corner-br { bottom:8px;right:8px; border-width:0 2px 2px 0; }
    .holo-led {
      width:5px;height:5px;border-radius:50%;
      background:#e50914;
      box-shadow:0 0 6px 2px rgba(229,9,20,0.8);
      animation: ledBlink 3s step-start infinite;
    }
  `;
  document.head.appendChild(style);
}

/* ── Leadership Carousel ─────────────────────────────────────────────────── */
function LeadershipSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const total = LEADERSHIP.length;
  const itemsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    injectHoloStyles();
  }, []);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pauseAutoScroll = useCallback(() => {
    setIsUserInteracting(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, PAUSE_DURATION_MS);
  }, []);

  const goTo = useCallback(
    (index: number, fromUser = false) => {
      setActiveIndex((index + totalPages) % totalPages);
      if (fromUser) pauseAutoScroll();
    },
    [totalPages, pauseAutoScroll],
  );

  const prev = useCallback(
    () => goTo(activeIndex - 1, true),
    [activeIndex, goTo],
  );
  const next = useCallback(
    () => goTo(activeIndex + 1, true),
    [activeIndex, goTo],
  );

  useEffect(() => {
    if (isUserInteracting) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((c) => (c + 1) % totalPages);
    }, AUTO_SCROLL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isUserInteracting, totalPages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const CARD_W = isMobile ? 280 : 320;
  const CARD_H = isMobile ? 380 : 420;
  const GAP = 20;

  const startIdx = activeIndex * itemsPerPage;
  const currentMembers = LEADERSHIP.slice(startIdx, startIdx + itemsPerPage);

  return (
    <section
      id="leadership"
      data-ocid="leadership.section"
      className="mt-20"
      style={{ scrollMarginTop: "80px" }}
    >
      {/* Section header */}
      <div className="mb-10">
        <div className="section-rule">
          <h2 className="text-3xl font-black tracking-[0.25em] uppercase text-white">
            LEADERSHIP
          </h2>
        </div>
        <p className="mt-2 text-sm text-[#666] italic font-mono-tech">
          The core of CyberFest 2026
        </p>
      </div>

      {/* ── Carousel container ── */}
      <div
        data-ocid="leadership.carousel.panel"
        className="relative mx-auto select-none"
        style={{
          maxWidth: isMobile ? "100%" : `${CARD_W * 2 + GAP + 40}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Grid wrapper */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: `${GAP}px`,
            width: "100%",
            maxWidth: isMobile ? `${CARD_W}px` : `${CARD_W * 2 + GAP}px`,
          }}
        >
          {currentMembers.map((member, idx) => (
            <div
              key={startIdx + idx}
              data-ocid={`leadership.item.${startIdx + idx + 1}`}
              style={{
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                borderRadius: "14px",
                overflow: "hidden",
                background: "rgba(10,0,0,0.99)",
                border: "1.5px solid rgba(229,9,20,0.9)",
                boxShadow: [
                  "0 0 0 1px rgba(229,9,20,0.25)",
                  "0 0 32px rgba(229,9,20,0.4)",
                  "0 0 80px rgba(229,9,20,0.15)",
                  "inset 0 0 40px rgba(229,9,20,0.07)",
                  "0 24px 60px rgba(0,0,0,0.95)",
                ].join(", "),
                position: "relative",
              }}
              className="holo-card"
            >
              {/* Scanline overlay */}
              <div className="holo-scanline" />
              {/* Sweep line animation */}
              <div className="holo-sweep" />
              {/* Corner brackets */}
              <div className="holo-corner holo-corner-tl" />
              <div className="holo-corner holo-corner-tr" />
              <div className="holo-corner holo-corner-bl" />
              <div className="holo-corner holo-corner-br" />

              {/* LED indicator */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "24px",
                  zIndex: 6,
                }}
              >
                <div
                  className="holo-led"
                  style={{ animationDelay: `${(startIdx + idx) * 0.7}s` }}
                />
              </div>

              {/* Image taking full card */}
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "radial-gradient(circle, rgba(229,9,20,0.2) 0%, rgba(0,0,0,0.7) 100%)",
                  }}
                >
                  <Camera
                    style={{
                      width: "34px",
                      height: "34px",
                      color: "#e50914",
                      opacity: 0.85,
                    }}
                  />
                </div>
              )}

              {/* Bottom gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "120px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)",
                  zIndex: 5,
                }}
              />

              {/* Text overlay at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "20px",
                  zIndex: 6,
                }}
              >
                <p
                  style={{
                    color: "#e50914",
                    fontSize: "10px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-mono-tech, monospace)",
                    fontWeight: 700,
                    marginBottom: "6px",
                    textShadow: "0 0 10px rgba(229,9,20,0.7)",
                  }}
                >
                  {member.role}
                </p>
                <p
                  style={{
                    color: "#ffffff",
                    fontSize: "18px",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textShadow:
                      "0 0 16px rgba(229,9,20,0.35), 0 2px 10px rgba(0,0,0,0.9)",
                  }}
                >
                  {member.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Controls row: prev · dots · next ── */}
        <div className="flex items-center justify-center gap-5 mt-6">
          {/* Prev arrow */}
          <button
            type="button"
            data-ocid="leadership.pagination_prev"
            onClick={prev}
            aria-label="Previous leader"
            style={{
              width: "48px",
              height: "48px",
              minWidth: "44px",
              minHeight: "44px",
              borderRadius: "50%",
              border: "1.5px solid rgba(229,9,20,0.6)",
              background: "rgba(20,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 12px rgba(229,9,20,0.15)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(229,9,20,0.2)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(229,9,20,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(20,0,0,0.9)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px rgba(229,9,20,0.15)";
            }}
          >
            <ChevronLeft
              style={{ width: "22px", height: "22px", color: "#fff" }}
              strokeWidth={2.5}
            />
          </button>

          {/* Navigation dots */}
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Leadership carousel indicators"
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                type="button"
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to page ${i + 1}`}
                onClick={() => goTo(i, true)}
                style={{
                  width: i === activeIndex ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: i === activeIndex ? "#e50914" : "#333",
                  boxShadow:
                    i === activeIndex ? "0 0 10px rgba(229,9,20,0.8)" : "none",
                }}
              />
            ))}
          </div>

          {/* Next arrow */}
          <button
            type="button"
            data-ocid="leadership.pagination_next"
            onClick={next}
            aria-label="Next leader"
            style={{
              width: "48px",
              height: "48px",
              minWidth: "44px",
              minHeight: "44px",
              borderRadius: "50%",
              border: "1.5px solid rgba(229,9,20,0.6)",
              background: "rgba(20,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 12px rgba(229,9,20,0.15)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(229,9,20,0.2)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(229,9,20,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(20,0,0,0.9)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px rgba(229,9,20,0.15)";
            }}
          >
            <ChevronRight
              style={{ width: "22px", height: "22px", color: "#fff" }}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
