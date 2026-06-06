"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import OnboardingScreens from "@/features/onboarding/OnboardingScreens";

export default function OnboardingPage() {
	const router = useRouter();

	const handleComplete = useCallback(() => {
		router.push("/auth");
	}, [router]);

	const handleSkip = useCallback(() => {
		router.push("/auth");
	}, [router]);

	return <OnboardingScreens onComplete={handleComplete} onSkip={handleSkip} />;
}
