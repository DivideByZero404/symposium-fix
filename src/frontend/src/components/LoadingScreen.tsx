import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const MESSAGES = [
  "CYBERFEST 2026 LOADING...",
  "ARE YOU SURE YOU WANT TO PROCEED?",
  "SO YOU THINK YOU CAN HANDLE THIS?",
  "CYBERFEST 2026 LOADING...",
];

const LIGHTNING_BOLTS = [
  { left: "10%", delay: "0.1s", skew: "-5deg" },
  { left: "20%", delay: "0.3s", skew: "3deg" },
  { left: "35%", delay: "0.6s", skew: "-2deg" },
  { left: "50%", delay: "0.2s", skew: "4deg" },
  { left: "65%", delay: "0.8s", skew: "-3deg" },
  { left: "75%", delay: "0.4s", skew: "2deg" },
  { left: "85%", delay: "0.7s", skew: "-4deg" },
  { left: "92%", delay: "0.5s", skew: "3deg" },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [isThunder, setIsThunder] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Thunder effect at ~600ms
    const thunderTimer = setTimeout(() => {
      setIsThunder(true);
      setShowFlash(true);
      setTimeout(() => {
        setIsThunder(false);
        setShowFlash(false);
      }, 700);
    }, 600);

    // Cycle messages every 400ms
    intervalRef.current = setInterval(() => {
      setMsgIndex((prev) => {
        if (prev < MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 400);

    // Transition after 3000ms
    const doneTimer = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(thunderTimer);
      clearTimeout(doneTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onComplete]);

  const isLastMessage = msgIndex === MESSAGES.length - 1;

  return (
    <div
      data-ocid="loading.section"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden ${isThunder ? "thunder-screen" : ""}`}
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover loading-video-filter pointer-events-none"
      >
        <source
          src="https://cdn.pixabay.com/video/2023/04/29/160827-822726980_large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Lightning bolts layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {LIGHTNING_BOLTS.map((bolt) => (
          <div
            key={bolt.left}
            className="lightning-bolt"
            style={{
              left: bolt.left,
              animationDelay: bolt.delay,
              transform: `skewX(${bolt.skew})`,
            }}
          />
        ))}
      </div>

      {/* Thunder flash overlay */}
      {showFlash && (
        <div className="thunder-flash-overlay animate-lightning-flash" />
      )}

      {/* Center content */}
      <div className="relative z-20 flex flex-col items-center gap-8 px-4 w-full max-w-xl mx-auto text-center">
        {/* Glitch loading text */}
        <div
          className={`font-mono-tech text-3xl md:text-5xl font-bold uppercase tracking-widest text-white ${
            isLastMessage
              ? "loading-text-glitch text-red-600"
              : "loading-text-pulse"
          }`}
          style={{
            textShadow:
              "0 0 20px rgba(229,9,20,0.8), 0 0 40px rgba(229,9,20,0.6), 0 0 60px rgba(229,9,20,0.4)",
          }}
        >
          {MESSAGES[msgIndex]}
        </div>

        {/* Progress bar */}
        <div
          className="w-full max-w-sm h-2 rounded-full overflow-hidden border border-[#e50914]"
          style={{ boxShadow: "0 0 20px rgba(229,9,20,0.5)" }}
        >
          <div className="h-full progress-bar-fill rounded-full" />
        </div>
      </div>
    </div>
  );
}
