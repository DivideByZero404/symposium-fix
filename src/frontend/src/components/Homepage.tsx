import { useEffect, useState } from "react";
import EventModal, { type EventData } from "./EventModal";
import EventsSection from "./EventsSection";
import Footer from "./Footer";
import GetInvolvedSection from "./GetInvolvedSection";
import CircuitBackground from "./CircuitBackground";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import TeamSection, { EventCoordinatorsCarousel } from "./TeamSection";
import FloatingCTA from "./FloatingCTA";

export default function Homepage() {
  const [activeModal, setActiveModal] = useState<EventData | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  return (
    <div
      id="homepage"
      className="min-h-screen bg-[#141414] text-white relative"
    >
      <CircuitBackground />
      <Navbar />

      <main>
        <HeroSection />
        <EventsSection onEventClick={setActiveModal} />
        <TeamSection />
        <EventCoordinatorsCarousel />
        <GetInvolvedSection />
      </main>

      <Footer />

      <FloatingCTA />

      {activeModal && (
        <EventModal event={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
