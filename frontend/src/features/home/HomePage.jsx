import { useNavigate } from "react-router-dom";
import { StarBackground } from "../universe/StarBackground.jsx";
import { HeroSection } from "./HeroSection.jsx";
import { FeatureSection } from "./FeatureSection.jsx";
import { SkillGalaxyPreview } from "./SkillGalaxyPreview.jsx";
import { MemoryCrystalPreview } from "./MemoryCrystalPreview.jsx";
import { FinalCTA } from "./FinalCTA.jsx";
import { useAuth } from "../auth/useAuth.js";

export function HomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="relative min-h-screen bg-nebula-bg overflow-hidden">
      <StarBackground />
      <div className="relative z-20 flex justify-end px-6 pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.1]"
        >
          Logout
        </button>
      </div>
      <HeroSection />
      <FeatureSection />
      <SkillGalaxyPreview />
      <MemoryCrystalPreview />
      <FinalCTA />
    </div>
  );
}
