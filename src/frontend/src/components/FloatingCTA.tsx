import { useEffect, useState } from "react";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.85;
      setIsVisible(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToRegister = () => {
    document
      .getElementById("registerSection")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToRegister}
      className="fixed bottom-8 right-8 z-50 px-6 py-3 font-black text-sm rounded-lg tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 font-mono-tech"
      style={{
        background: "#0a0a0a",
        color: "#e50914",
        borderTop: "2px solid #e50914",
        border: "1px solid rgba(229,9,20,0.3)",
        boxShadow: "0 0 10px rgba(229,9,20,0.2), 0 4px 20px rgba(0,0,0,0.8)",
        animation: "fadeInUp 0.5s ease-out",
      }}
    >
      REGISTER NOW
    </button>
  );
}
