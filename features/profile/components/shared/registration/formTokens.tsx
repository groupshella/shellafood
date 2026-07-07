export const footerAboveNavClass =
    "bottom-[calc(68px+env(safe-area-inset-bottom))] z-40 border-t border-[#F6F5F8] bg-white/95 pb-4 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-[0_-8px_24px_rgba(0,0,0,0.25)]";

export const formContainerClass = "mx-auto grid w-full max-w-lg grid-cols-1 gap-4 sm:max-w-2xl md:grid-cols-2 lg:max-w-3xl lg:gap-5";

export const sectionTitleClass =
    "mb-3 text-[14px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[15px]";

export const inputClassName =
    "flex h-14 w-full min-h-[48px] items-center rounded-xl border border-[#E8ECEF] bg-white px-3 text-[14px] font-medium leading-[160%] text-[#111B18] outline-none transition-[border-color,box-shadow] placeholder:text-[#707784] focus:border-[#30913F]/40 focus:ring-2 focus:ring-[#30913F]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-[#30913F]/50 dark:focus:ring-[#30913F]/20 sm:min-h-[52px] sm:px-4";

export const readOnlyInputClassName =
    "flex h-14 w-full min-h-[48px] items-center rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3 text-[14px] font-medium leading-[160%] text-[#707784] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:min-h-[52px] sm:px-4";

export function RequiredMark() {
    return (
        <span className="text-[14px] font-bold leading-none text-[#DB2626] dark:text-red-400" aria-hidden>
            *
        </span>
    );
}
