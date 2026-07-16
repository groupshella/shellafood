import type { ReactNode } from "react";
import { RequiredMark } from "./formTokens";

interface FormFieldProps {
	label: string;
	required?: boolean;
	hint?: string;
	children: ReactNode;
}

export function FormField({ label, required, hint, children }: FormFieldProps) {
	return (
		<div className="flex w-full flex-col items-start gap-1.5">
			{hint ? (
				<div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-0.5">
					<span className="text-[14px] font-bold leading-[160%] text-foreground sm:text-[15px]">
						{label}
					</span>
					<span className="text-[12px] font-medium leading-[160%] text-muted">
						{hint}
					</span>
				</div>
			) : (
				<div className="flex items-center justify-start gap-1">
					<span className="text-[14px] font-bold leading-[160%] text-foreground sm:text-[15px]">
						{label}
					</span>
					{required && <RequiredMark />}
				</div>
			)}
			<div className="w-full">{children}</div>
		</div>
	);
}

export {
	inputClassName,
	readOnlyInputClassName,
	footerAboveNavClass,
	formContainerClass,
	sectionTitleClass,
} from "./formTokens";
