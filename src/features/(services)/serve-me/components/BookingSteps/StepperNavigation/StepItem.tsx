import Link from "next/link";
import { Check } from "lucide-react";
import { BookingStep } from "@/features/(services)/serve-me/types/serve-me.types";
function StepItem({
	step,
	index,
	isActive,
	isCompleted,
	isArabic,
}: {
	step: BookingStep;
	index: number;
	isActive: boolean;
	isCompleted: boolean;
	isArabic: boolean;
}) {
	const circleStyles = isActive
		? "border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white scale-110 shadow-lg shadow-green-500/30"
		: isCompleted
			? "border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white shadow-md group-hover:scale-105"
			: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:border-green-400 dark:group-hover:border-green-500";

	const labelStyles = isActive
		? "text-green-600 dark:text-green-400 font-bold"
		: isCompleted
			? "text-green-600 dark:text-green-400"
			: "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300";

	return (
		<Link
			href={step.path}
			prefetch={true}
			className="flex flex-col items-center flex-1 min-w-0 cursor-pointer group"
			aria-label={isArabic ? step.labelAr : step.labelEn}
		>
			{/* Step Circle */}
			<div
				className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 z-10 ${circleStyles}`}
			>
				{isCompleted ? (
					<Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
				) : (
					<span className="text-sm sm:text-base font-bold">{index + 1}</span>
				)}
			</div>

			{/* Step Label */}
			<div
				className={`mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center max-w-[80px] sm:max-w-[100px] leading-tight transition-colors ${labelStyles}`}
			>
				{isArabic ? step.labelAr : step.labelEn}
			</div>
		</Link>
	);
}
export default StepItem;