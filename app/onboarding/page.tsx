"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import OnboardingScreens from "@/features/onboarding/OnboardingScreens";

export default function OnboardingPage() {
	const router = useRouter();

	const handleComplete = useCallback(() => {
		router.push("/login");
	}, [router]);

	const handleSkip = useCallback(() => {
		router.push("/login");
	}, [router]);

	return <OnboardingScreens onComplete={handleComplete} onSkip={handleSkip} />;
}
