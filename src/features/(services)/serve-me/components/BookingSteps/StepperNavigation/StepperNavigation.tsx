"use client";

import React, { useEffect, useMemo } from "react";
import { useLanguage } from "@/providers";
import { usePathname, useRouter } from "next/navigation";
import { getBookingSteps } from "../../../constants/serve-me.constants";
import StepConnector from "./StepConnector";
import StepItem from "./StepItem";

interface StepperNavigationProps {
	service: string;
	serviceType: string;
}

export default function StepperNavigation({ service, serviceType }: StepperNavigationProps) {
	const { language } = useLanguage();
	const pathname = usePathname();
	const router = useRouter();

	const isArabic = language === "ar";

	// Generate steps based on service/serviceType
	const steps = useMemo(
		() => getBookingSteps(service, serviceType),
		[service, serviceType]
	);

	// Detect current step from URL with safe fallback
	const currentStepIndex = useMemo(() => {
		const index = steps.findIndex((step) => pathname?.includes(step.path));
		return index >= 0 ? index : 0;
	}, [steps, pathname]);

	// Prefetch all steps for instant navigation
	useEffect(() => {
		steps.forEach((step) => router.prefetch(step.path));
	}, [steps, router]);

	return (
		<div className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-start justify-between">
					{steps.map((step, index) => {
						const isCompleted = index < currentStepIndex;
						const isActive = index === currentStepIndex;
						const isLast = index === steps.length - 1;

						return (
							<React.Fragment key={step.id}>
								<StepItem
									step={step}
									index={index}
									isActive={isActive}
									isCompleted={isCompleted}
									isArabic={isArabic}
								/>

								{!isLast && (
									<StepConnector isActive={isActive || isCompleted} />
								)}
							</React.Fragment>
						);
					})}
				</div>
			</div>
		</div>
	);
}




