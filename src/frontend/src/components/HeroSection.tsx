import { useEffect, useState } from "react";

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-04-01T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToEvents = () => {
    document
      .getElementById("events")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToRegister = () => {
    document
      .getElementById("registerSection")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      data-ocid="hero.section"
      className="relative flex items-center overflow-hidden"
      style={{ height: "85vh", minHeight: "540px" }}
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          filter: "brightness(0.70) contrast(1.15) saturate(0.85)",
          transform: "scale(1.02)",
        }}
      >
        <source src="/assets/uploads/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Cinematic overlay — left-heavy dark */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Bottom fade to page bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #141414 0%, rgba(20,20,20,0.8) 40%, transparent 100%)",
        }}
      />

      {/* Scanline texture — cinematic CRT feel */}
      <div className="hero-scanlines" />

      {/* Film grain layer */}
      <div className="hero-grain" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-3xl pt-24">
        {/* Meta ticker */}
        <div className="mb-5 flex flex-col gap-2">
          <div className="section-rule">
            <span
              className="text-xs font-bold tracking-[0.3em] uppercase font-mono-tech"
              style={{ color: "#e50914" }}
            >
              ■
            </span>
            <span
              className="text-sm font-medium tracking-[0.25em] uppercase font-mono-tech"
              style={{ color: "#c0c0c0" }}
            >
              SEASON 1 &nbsp;•&nbsp; 7 EVENTS
            </span>
          </div>
          <div className="flex items-center gap-3 pl-5">
            <span
              className="text-sm font-bold font-mono-tech"
              style={{ color: "#e5e5e5" }}
            >
              1.4.2026
            </span>
            <span
              className="px-2 py-0.5 text-[10px] font-black tracking-[0.2em] uppercase"
              style={{
                border: "1px solid rgba(229,9,20,0.7)",
                borderRadius: "2px",
                color: "#e50914",
                background: "rgba(229,9,20,0.08)",
              }}
            >
              TREND
            </span>
          </div>
        </div>

        {/* Split title — CYBERFEST large / 2026 red */}
        <div className="relative mb-7 select-none" style={{ lineHeight: 0.88 }}>
          {/* Ghost layer for chromatic depth */}
          <div
            className="hero-title-ghost absolute"
            aria-hidden="true"
            style={{
              fontSize: "clamp(52px, 10vw, 108px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.15)",
              top: "2px",
              left: "2px",
            }}
          >
            CYBERFEST
          </div>

          {/* Main title line 1 */}
          <h1
            className="font-black text-white uppercase block"
            style={{
              fontSize: "clamp(52px, 10vw, 108px)",
              letterSpacing: "-0.03em",
              textShadow: "0 0 60px rgba(229,9,20,0.2), 0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            CYBERFEST
          </h1>

          {/* Year — smaller, punchy red */}
          <div
            className="font-black uppercase block"
            style={{
              fontSize: "clamp(36px, 6.5vw, 72px)",
              letterSpacing: "0.18em",
              color: "#e50914",
              textShadow:
                "0 0 30px rgba(229,9,20,0.8), 0 0 60px rgba(229,9,20,0.4), 0 0 100px rgba(229,9,20,0.2)",
              marginTop: "4px",
            }}
          >
            2&thinsp;0&thinsp;2&thinsp;6
          </div>
        </div>

        {/* Description */}
        <p
          className="text-base md:text-lg mb-6 leading-relaxed max-w-md"
          style={{ color: "#b8b8b8" }}
        >
          Join the ultimate tech symposium where innovation meets competition.
          Cutting-edge challenges in coding, hacking, AI, and debugging.
        </p>

        {/* Countdown Timer */}
        <div className="mb-9 flex gap-4">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HRS", value: timeLeft.hours },
            { label: "MIN", value: timeLeft.minutes },
            { label: "SEC", value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center"
              style={{
                background: "rgba(229,9,20,0.1)",
                border: "1px solid rgba(229,9,20,0.3)",
                borderRadius: "4px",
                padding: "8px 12px",
                minWidth: "60px",
              }}
            >
              <span
                className="font-black font-mono-tech"
                style={{ color: "#e50914", fontSize: "24px" }}
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span
                className="text-[10px] font-mono-tech tracking-wider"
                style={{ color: "#666" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            data-ocid="hero.primary_button"
            className="flex items-center justify-center gap-2 px-9 py-3.5 bg-white text-black font-black text-sm rounded-sm tracking-[0.15em] uppercase hover:bg-white/85 transition-all duration-200 active:scale-95"
            onClick={scrollToEvents}
          >
            ▶&nbsp; VIEW EVENTS
          </button>
          <button
            type="button"
            data-ocid="hero.secondary_button"
            className="flex items-center justify-center gap-2 px-9 py-3.5 font-black text-sm text-white rounded-sm tracking-[0.15em] uppercase transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(60,60,62,0.75)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(80,80,82,0.75)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(60,60,62,0.75)";
            }}
            onClick={scrollToRegister}
          >
            +&nbsp; REGISTRATION
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex"
        style={{
          animation: "bounce 2s infinite",
        }}
      >
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToEvents}
        >
          <span className="text-xs text-[#888] font-mono-tech tracking-widest uppercase">
            Scroll
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e50914"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>
  );
}
