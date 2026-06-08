import OnboardingScreens from "@/features/onboarding/OnboardingScreens";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "مرحباً بك | شلة فود",
	description: "تعرّف على شلة فود واكتشف خدمات التوصيل والطلبات المتنوعة",
};

export default function OnboardingPage() {
	return <OnboardingScreens />;
}
