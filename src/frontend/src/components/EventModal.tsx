import { useEffect, useRef } from "react";

export interface EventData {
  title: string;
  category: string;
  description: string;
  time: string;
  venue: string;
  contact: string;
  isPrank?: boolean;
}

interface EventModalProps {
  event: EventData;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleBackdropKeyDown}
      role="presentation"
      data-ocid="event.modal"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-lg outline-none ${
          event.isPrank ? "modal-shake" : ""
        }`}
        style={{ backgroundColor: "#181818" }}
      >
        {/* Close button */}
        <button
          type="button"
          data-ocid="event.modal.close_button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-2xl text-white transition-colors duration-200 hover:bg-[#333]"
          style={{ backgroundColor: "#181818" }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Modal body */}
        <div className="p-8 md:p-10">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 pr-10 uppercase tracking-tight">
            {event.isPrank ? "APRIL FOOLS 😄" : event.title}
          </h2>

          {/* Category badge */}
          <div className="mb-6">
            <span
              className="inline-block px-4 py-1.5 text-sm font-bold text-white rounded tracking-widest uppercase"
              style={{ backgroundColor: "#e50914" }}
            >
              {event.isPrank ? "FOOLED YOU!" : event.category}
            </span>
          </div>

          {/* Description */}
          <p
            className="font-mono-tech text-base leading-relaxed text-[#e5e5e5] mb-8 whitespace-pre-line"
            style={{ fontSize: "15px" }}
          >
            {event.description}
          </p>

          {/* Details */}
          <div className="font-mono-tech mb-8 space-y-4">
            <div className="flex gap-4 text-base">
              <span className="text-[#808080] font-semibold min-w-[80px]">
                Time:
              </span>
              <span className="text-[#e5e5e5]">{event.time}</span>
            </div>
            <div className="flex gap-4 text-base">
              <span className="text-[#808080] font-semibold min-w-[80px]">
                Venue:
              </span>
              <span className="text-[#e5e5e5]">{event.venue}</span>
            </div>
            <div className="flex gap-4 text-base">
              <span className="text-[#808080] font-semibold min-w-[80px]">
                Contact:
              </span>
              <span className="text-[#e5e5e5]">{event.contact}</span>
            </div>
          </div>

          {/* Register button */}
          {!event.isPrank && (
            <button
              type="button"
              data-ocid="event.modal.submit_button"
              className="w-full py-4 text-lg font-black text-white uppercase tracking-widest rounded transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ backgroundColor: "#e50914" }}
              onClick={() =>
                alert("Registration portal opening soon! Stay tuned 🪄")
              }
            >
              REGISTER NOW
            </button>
          )}

          {event.isPrank && (
            <button
              type="button"
              data-ocid="event.modal.submit_button"
              className="w-full py-4 text-lg font-black text-white uppercase tracking-widest rounded transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ backgroundColor: "#444" }}
              onClick={onClose}
            >
              NICE TRY, CLOSE THIS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
