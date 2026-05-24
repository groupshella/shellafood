/**
 * Pick & Order — Production-Grade Landing Page
 * Modern, clean, RTL Arabic delivery service UI
 */
"use client";

import HeroSection from "./HeroSection";
import TransportTypeSection from "./TransportTypeSection";
import FeaturesSection from "./FeaturesSection";
import StepsSection from "./StepsSection";

function PickAndOrderPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-white mb-8" style={{ fontFamily: "'Tajawal', 'Cairo', 'Segoe UI', sans-serif" }}>
      <HeroSection />
      <TransportTypeSection />
      <FeaturesSection />
      <StepsSection />
    </div>
  );
}

export default PickAndOrderPage;
export { PickAndOrderPage };
