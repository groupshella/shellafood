"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import StepConnector from "./StepConnector";
import StepItem from "./StepItem";
import { getBookingSteps } from "@/features/booking/constants/booking.constants";
interface StepperNavigationProps {
	service: string;
}

export default function StepperNavigation({ service }: StepperNavigationProps) {
	const pathname = usePathname();
	const router = useRouter();

	// Generate steps based on service/serviceType
	const steps = useMemo(
		() => getBookingSteps(service),
		[service]
	);

	// Detect current step from URL with safe fallback
	const currentStepIndex = useMemo(() => {
		const index = steps.findIndex((step) => pathname?.includes(step.id));
		return index >= 0 ? index : 0;
	}, [steps, pathname]);



	return (
		<div className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8 bg-white  border-gray-200  shadow-sm" dir="rtl">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-start justify-between ">
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




