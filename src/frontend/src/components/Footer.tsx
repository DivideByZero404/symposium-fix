export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      className="px-6 md:px-12 py-10 border-t"
      style={{ borderColor: "#222", backgroundColor: "#0a0a0a" }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div
          className="text-xl font-black tracking-widest"
          style={{ color: "#e50914" }}
        >
          CYBERFEST 2026
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-6 text-sm text-[#666]">
          <button
            type="button"
            className="hover:text-white transition-colors duration-200"
            onClick={() =>
              document
                .getElementById("events")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Events
          </button>
          <button
            type="button"
            className="hover:text-white transition-colors duration-200"
            onClick={() =>
              document
                .getElementById("team")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Team
          </button>
          <button
            type="button"
            className="hover:text-white transition-colors duration-200"
            onClick={() =>
              document
                .getElementById("registerSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Contact
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p
          className="text-xs font-mono-tech"
          style={{ color: "#e50914", opacity: 0.4, letterSpacing: "0.3em" }}
        >
          CIT • CYBERFEST 2026 • 1.4.2026
        </p>
      </div>
    </footer>
  );
}
