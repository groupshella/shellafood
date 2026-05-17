'use client';
import { SpeedInsights } from "@vercel/speed-insights/next";
import MainLandingPage from "./Main/MainLandingPage";
import { useEffect } from "react";

export default function LandingPage() {

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 overflow-x-hidden w-full">

			{/* <SpeedInsights /> */}
			<MainLandingPage />
		</div>
	);
}