export const footerAboveNavClass =
	"bottom-[calc(68px+env(safe-area-inset-bottom))] z-40 border-t border-border bg-background/95 pb-4 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm";

export const formContainerClass =
	"mx-auto grid w-full max-w-lg grid-cols-1 gap-4 sm:max-w-2xl md:grid-cols-2 lg:max-w-3xl lg:gap-5";

export const sectionTitleClass =
	"mb-3 text-[14px] font-bold leading-[160%] text-foreground sm:text-[15px]";

export const inputClassName =
	"flex h-14 w-full min-h-[48px] items-center rounded-xl border border-border bg-card px-3 text-[14px] font-medium leading-[160%] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted focus:border-brand/40 focus:ring-2 focus:ring-brand/10 sm:min-h-[52px] sm:px-4";

export const readOnlyInputClassName =
	"flex h-14 w-full min-h-[48px] items-center rounded-xl border border-border bg-background px-3 text-[14px] font-medium leading-[160%] text-muted sm:min-h-[52px] sm:px-4";

export function RequiredMark() {
	return (
		<span
			className="text-[14px] font-bold leading-none text-red-500"
			aria-hidden
		>
			*
		</span>
	);
}
