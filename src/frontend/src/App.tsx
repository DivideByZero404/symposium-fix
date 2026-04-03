import { useEffect, useRef, useState } from "react";
import Homepage from "./components/Homepage";
import LoadingScreen from "./components/LoadingScreen";
import ProfileScreen from "./components/ProfileScreen";

type Screen = "loading" | "profile" | "homepage";

export default function App() {
  const [screen, setScreen] = useState<Screen>("loading");

  return (
    <div className="relative min-h-screen bg-[#141414] text-white overflow-x-hidden">
      {screen === "loading" && (
        <LoadingScreen onComplete={() => setScreen("profile")} />
      )}
      {screen === "profile" && (
        <ProfileScreen onSelect={() => setScreen("homepage")} />
      )}
      {screen === "homepage" && <Homepage />}
    </div>
  );
}
