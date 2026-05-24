import Link from "next/link";
import { Check } from "lucide-react";

 
function StepItem({
	step,
	index,
	isActive,
	isCompleted,
}: {
		step: {
			id: string;
			path: string;
			label: string;
		};
	index: number;
	isActive: boolean;
	isCompleted: boolean;
}) {
	const circleStyles = isActive
		? "border-green-600  bg-green-600 text-white scale-110 shadow-lg shadow-green-500/30"
		: isCompleted
			? "border-green-600  bg-green-600  text-white shadow-md group-hover:scale-105"
			: "border-gray-300  bg-white  text-gray-400  group-hover:border-green-400 ";

	const labelStyles = isActive
		? "text-green-600  font-bold"
		: isCompleted
			? "text-green-600 "
			: "text-gray-400  group-hover:text-gray-600 ";

	return (
		<Link
			href={step.path}
			prefetch={true}
			className="flex flex-col items-center flex-1 min-w-0 cursor-pointer group"
			aria-label={ step.label}
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
				{step.label}
			</div>
		</Link>
	);
}
export default StepItem;