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
                <div className="flex items-center justify-start gap-1">
                    <span className="text-[14px] font-bold leading-[160%] text-[#111B18]">{label}</span>
                    <span className="text-[12px] font-medium leading-[160%] text-[#555555]">{hint}</span>
                </div>
            ) : (
                <div className="flex items-center justify-start gap-1">
                    <span className="text-[14px] font-bold leading-[160%] text-[#111B18]">{label}</span>
                    {required && <RequiredMark />}
                </div>
            )}
            <div className="w-full">{children}</div>
        </div>
    );
}

export { inputClassName, readOnlyInputClassName, footerAboveNavClass, formContainerClass, sectionTitleClass } from "./formTokens";
