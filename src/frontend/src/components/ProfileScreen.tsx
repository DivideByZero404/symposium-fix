import { useState } from "react";
import BinaryRain from "./BinaryRain";

interface ProfileScreenProps {
  onSelect: () => void;
}

const PROFILES = [
  {
    id: "creators",
    name: "Creators",
    image: "/assets/generated/C.dim_300x300.png",
    comment: "Creators logged in.",
    ocid: "profile.item.1",
  },
  {
    id: "innovators",
    name: "Innovators",
    image: "/assets/generated/I.dim_300x300.png",
    comment: "Innovators detected.",
    ocid: "profile.item.2",
  },
  {
    id: "technologists",
    name: "Technologists",
    image: "/assets/generated/T.dim_300x300.png",
    comment: "Technologists online.",
    ocid: "profile.item.3",
  },
];

export default function ProfileScreen({ onSelect }: ProfileScreenProps) {
  const [hoveredComment, setHoveredComment] = useState("");

  return (
    <div
      data-ocid="profile.section"
      className="fixed inset-0 z-40 bg-[#0d0d0d] flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Binary Rain Background */}
      <BinaryRain />
      
      {/* Atmosphere layers */}
      <div className="profile-atmosphere" aria-hidden="true" />
      <div className="profile-vignette" aria-hidden="true" />
      <div className="profile-fog-tl" aria-hidden="true" />
      <div className="profile-fog-br" aria-hidden="true" />

      {/* Logo */}
      <div
        className="absolute top-4 md:top-8 left-4 md:left-10 text-2xl md:text-4xl font-black tracking-widest z-10"
        style={{
          color: "#e50914",
          textShadow:
            "0 0 20px rgba(229,9,20,0.6), 0 0 40px rgba(229,9,20,0.3)",
        }}
      >
        CYBERFEST
      </div>

      {/* System status line */}
      <div
        className="absolute top-5 md:top-9 right-4 md:right-10 font-mono-tech text-[8px] md:text-[10px] tracking-[0.25em] z-10"
        style={{ color: "rgba(229,9,20,0.5)" }}
        aria-hidden="true"
      >
        SYS://IDENTIFY_USER
      </div>

      {/* Heading */}
      <h1
        className="relative z-10 text-2xl md:text-4xl font-light text-white mb-8 md:mb-14 tracking-[0.08em] text-center px-4"
        style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
      >
        Who's logging in?
      </h1>

      {/* Profile grid */}
      <div className="relative z-10 flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-10 lg:gap-14 px-4">
        {PROFILES.map((profile) => (
          <button
            type="button"
            key={profile.id}
            data-ocid={profile.ocid}
            className="flex flex-col items-center cursor-pointer group bg-transparent border-0 p-0"
            onClick={onSelect}
            onMouseEnter={() => setHoveredComment(profile.comment)}
            onMouseLeave={() => setHoveredComment("")}
            aria-label={`Login as ${profile.name}`}
          >
            {/* Avatar with glow ring on hover */}
            <div
              className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[158px] md:h-[158px] rounded-lg overflow-hidden"
              style={{
                border: "3px solid transparent",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "0 0 0 0 transparent",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#fff";
                el.style.boxShadow =
                  "0 0 20px rgba(229,9,20,0.35), 0 0 40px rgba(229,9,20,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "transparent";
                el.style.boxShadow = "0 0 0 0 transparent";
              }}
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-108"
                style={{ transition: "transform 0.4s ease" }}
              />
              {/* Dark inner vignette on avatar */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)",
                }}
              />
            </div>

            {/* Name */}
            <p
              className="mt-3 md:mt-4 text-[11px] md:text-[12px] font-medium tracking-widest uppercase transition-colors duration-300 text-[#666] group-hover:text-[#e5e5e5] font-mono-tech"
              style={{ letterSpacing: "0.18em" }}
            >
              {profile.name}
            </p>
          </button>
        ))}
      </div>

      {/* Hover comment */}
      <p
        className="relative z-10 mt-8 md:mt-12 text-[10px] md:text-xs italic min-h-[18px] font-mono-tech tracking-widest text-center px-4"
        style={{ color: "rgba(229,9,20,0.7)" }}
      >
        {hoveredComment ? `> ${hoveredComment}` : ""}
      </p>

      {/* Corner decorative brackets */}
      <div
        className="absolute bottom-4 md:bottom-8 left-4 md:left-8 font-mono-tech text-[8px] md:text-[10px] tracking-widest"
        style={{ color: "rgba(229,9,20,0.2)" }}
        aria-hidden="true"
      >
        {"[CYBERFEST 2026 // AUTH MODULE v1.0]"}
      </div>
    </div>
  );
}
