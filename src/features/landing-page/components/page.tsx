'use client';
import { SpeedInsights } from "@vercel/speed-insights/next";
import MainLandingPage from "./Main/MainLandingPage";
import { useEffect } from "react";

export default function LandingPage({ guestId }: { guestId: string | undefined }) {
	useEffect(() => {
		const getGuestId = async () => {
			const response = await fetch('/api/auth/guest/request', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-LANG': 'ar',
				},
			});
			const data = await response.json();
			console.log("data", data);
		}
		console.log("guestId", guestId);
		if (!guestId) {
			getGuestId();
		}
	}, [guestId]);
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 overflow-x-hidden w-full">
			{/* Skip to content link for accessibility */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-lg focus:outline-none"
			>
				Skip to content
			</a>
			{/* <SpeedInsights /> */}
			<MainLandingPage />
		</div>
	);
}