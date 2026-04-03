import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#hero", ocid: "nav.link.1" },
  { label: "Events", href: "#events", ocid: "nav.link.2" },
  { label: "Team", href: "#team", ocid: "nav.link.3" },
  { label: "Contact", href: "#registerSection", ocid: "nav.link.4" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-[100] transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(0,0,0,0.98)" : "rgba(0,0,0,0.95)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <button
          type="button"
          className="text-2xl md:text-3xl font-black tracking-widest cursor-pointer bg-transparent border-0 p-0"
          style={{
            color: "#e50914",
            textShadow: "0 0 12px rgba(229,9,20,0.5)",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          CYBERFEST
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.ocid}
              data-ocid={link.ocid}
              className="text-[#e5e5e5] hover:text-white text-sm font-medium tracking-wide transition-colors duration-200"
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden flex flex-col gap-4 px-6 py-4"
          style={{ backgroundColor: "rgba(0,0,0,0.98)" }}
        >
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.ocid}
              data-ocid={link.ocid}
              className="text-[#e5e5e5] hover:text-white text-base font-medium tracking-wide transition-colors duration-200 text-left"
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
