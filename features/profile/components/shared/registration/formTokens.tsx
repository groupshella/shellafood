export const footerAboveNavClass =
    "bottom-[calc(68px+env(safe-area-inset-bottom))] z-40 border-t border-[#F6F5F8] bg-white/95 pb-4 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm";

export const formContainerClass = "mx-auto flex w-full max-w-[343px] flex-col gap-4";

export const sectionTitleClass = "mb-3 text-[14px] font-bold leading-[160%] text-[#111B18]";

export const inputClassName =
    "flex h-14 w-full items-center rounded-xl border border-[#E8ECEF] bg-white px-3 text-[14px] font-medium leading-[160%] text-[#111B18] outline-none transition-[border-color,box-shadow] placeholder:text-[#707784] focus:border-[#30913F]/40 focus:ring-2 focus:ring-[#30913F]/10";

export const readOnlyInputClassName =
    "flex h-14 w-full items-center rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3 text-[14px] font-medium leading-[160%] text-[#707784]";

export function RequiredMark() {
    return (
        <span className="text-[14px] font-bold leading-none text-[#DB2626]" aria-hidden>
            *
        </span>
    );
}
