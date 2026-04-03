import { useState, useEffect } from "react";
import type { EventData } from "./EventModal";

interface EventsSectionProps {
  onEventClick: (event: EventData) => void;
}

const EVENTS: (EventData & { poster: string; index: number })[] = [
  {
    index: 0,
    title: "PAPER PRESENTATION",
    category: "TECH",
    poster: "/assets/generated/wenesday.dim_400x560.png",
    description:
      "An academic presentation event where participants showcase innovative ideas, research findings, or technical solutions. Evaluation will be based on clarity, originality, and presentation skills.\n\nSlides matter. So does confidence.",
    time: "To be announced",
    venue: "To be announced",
    contact: "Event Coordinator",
  },
  {
    index: 1,
    title: "DEBUGGING",
    category: "TECH",
    poster: "/assets/generated/breaking.dim_400x560.png",
    description:
      "A time-bound challenge focused on identifying and fixing logical and syntactical errors in given programs. Accuracy, speed, and attention to detail are key to progressing through the rounds.\n\nThe bugs are intentional. Mostly.",
    time: "To be announced",
    venue: "To be announced",
    contact: "Event Coordinator",
  },
  {
    index: 2,
    title: "TECHNICAL QUIZ",
    category: "TECH",
    poster: "/assets/generated/techy.dim_400x560.png",
    description:
      "A quiz-based event covering fundamentals of computer science, emerging technologies, and logical reasoning. Questions will range from basic concepts to advanced technical knowledge.\n\nOverthinking is encouraged.",
    time: "To be announced",
    venue: "To be announced",
    contact: "Event Coordinator",
  },
  {
    index: 3,
    title: "VIBE CODING",
    category: "TECH",
    poster: "/assets/generated/got.dim_400x560.png",
    description:
      "A coding challenge where participants solve problems in a relaxed, creative environment. Focus is on fun, collaboration, and exploring unconventional approaches to programming.\n\nNo pressure. Just vibes.",
    time: "To be announced",
    venue: "To be announced",
    contact: "Event Coordinator",
  },
  {
    index: 4,
    title: "IPL AUCTION",
    category: "NON-TECH",
    poster: "/assets/generated/stranger.dim_400x560.png",
    description:
      "A strategy-based simulation where teams bid for players using a fixed virtual budget. Decision-making, planning, and risk assessment play a major role in building a strong team.\n\nRegret is part of the experience.",
    time: "To be announced",
    venue: "To be announced",
    contact: "Event Coordinator",
  },
  {
    index: 5,
    title: "MEME QUIZ",
    category: "NON-TECH",
    poster: "/assets/generated/mind.dim_400x560.png",
    description:
      "A fun quiz based on popular memes, movie references, and internet culture. Participants will answer questions by identifying contexts, punchlines, and visual cues.\n\nJudging will be strictly subjective.",
    time: "To be announced",
    venue: "To be announced",
    contact: "Event Coordinator",
  },
  {
    index: 6,
    title: "ONE PIECE TRIVIA",
    category: "NON-TECH",
    poster: "/assets/generated/onepiece.dim_400x560.png",
    description:
      "YOU JUST GOT PRANKED! This event does not exist. Thanks for playing along.",
    time: "25:00pm",
    venue: "Dawn Island",
    contact: "Luffy D. Monkey",
    isPrank: true,
  },
];

const OCIDS = [
  "events.item.1",
  "events.item.2",
  "events.item.3",
  "events.item.4",
  "events.item.5",
  "events.item.6",
  "events.item.7",
];

export default function EventsSection({ onEventClick }: EventsSectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Debug: Log events to console
  console.log('EventsSection rendering with', EVENTS.length, 'events');

  // track screen width for responsive grid and image sizing
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="events"
      data-ocid="events.section"
      className="px-6 md:px-12 py-16"
      style={{ 
        scrollMarginTop: "80px",
        // Ensure section is visible
        minHeight: "600px",
        backgroundColor: "rgba(20, 20, 20, 0.5)"
      }}
    >
      {/* Section header */}
      <div className="mb-10">
        <div className="section-rule">
          <h2 className="text-2xl font-bold text-white mb-4">TRENDING EVENTS</h2>
          <span className="text-sm text-gray-400">({EVENTS.length} events)</span>
        </div>
      </div>

      {/* Grid — with rank number offset trick */}
      <div
        className="grid gap-6"
        style={{
          // single column layout on mobile, otherwise flexible grid
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill, minmax(210px, 1fr))",
          // Ensure grid is visible
          minHeight: "400px",
        }}
      >
        {EVENTS.map((event, i) => (
          <div
            key={event.index}
            className="event-card-outer relative"
            style={{ paddingBottom: "12px" }}
          >
            {/* Netflix rank number */}
            <span className="event-rank-number" aria-hidden="true" style={{
              WebkitTextFillColor: "rgba(229, 9, 20, 0.25)",
              WebkitTextStroke: "2px rgba(229, 9, 20, 0.5)",
              bottom: "-8px",
              left: "-6px",
              zIndex: 3,
            }}>
              {i + 1}
            </span>

            {/* Clickable card */}
            <button
              type="button"
              data-ocid={OCIDS[i]}
              className="relative w-full text-left rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.04] hover:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              style={{
                // Remove animation dependency, add fallback
                animation: `fadeInUp 0.6s ease-out backwards`,
                animationDelay: `${i * 0.07}s`,
                borderRadius: "10px",
                background: "#0d0d0d",
                border: "none",
                padding: 0,
                // Ensure button is visible
                opacity: 1,
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(229,9,20,0.4), 0 4px 16px rgba(0,0,0,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
              onClick={() => onEventClick(event)}
              aria-label={`View ${event.title}`}
            >
              {/* Poster with hover-reveal overlay */}
              <div
                className="event-card-poster-wrap"
                style={{ height: isMobile ? "400px" : "360px" }}
              >
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    console.log(`Failed to load image: ${event.poster}`);
                    e.currentTarget.style.backgroundColor = '#333';
                    e.currentTarget.style.display = 'flex';
                    e.currentTarget.style.alignItems = 'center';
                    e.currentTarget.style.justifyContent = 'center';
                    e.currentTarget.innerHTML = `<div style="color: #fff; text-align: center; padding: 20px;">${event.title}<br/><small>Image not found</small></div>`;
                  }}
                />

                {/* Hover-reveal overlay — slides up title + badge */}
                <div className="event-card-hover-overlay">
                  <p className="event-card-hover-title">{event.title}</p>
                  <span
                    className="event-card-hover-badge"
                    style={{
                      backgroundColor:
                        event.category === "TECH"
                          ? "rgba(229,9,20,0.85)"
                          : "rgba(255,255,255,0.15)",
                      color: "#fff",
                    }}
                  >
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Static info bar — minimal, clean */}
              <div
                className="px-3 pt-2.5 pb-3"
                style={{ backgroundColor: "#111", position: "relative", zIndex: 2 }}
              >
                <h4 className="text-xs font-black text-[#ddd] truncate uppercase tracking-[0.08em]">
                  {event.title}
                </h4>
                <p
                  className="mt-0.5 text-[10px] font-mono-tech"
                  style={{
                    color: event.category === "TECH" ? "#e50914" : "#888",
                    letterSpacing: "0.12em",
                  }}
                >
                  {event.category}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
