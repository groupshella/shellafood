import Link from "next/link";
import { Cairo } from "next/font/google";

const cairo = Cairo({
	subsets: ["arabic", "latin"],
	weight: ["500", "600", "700", "900"],
});

export type OfferDiscountPercent = 50 | 35 | 25;

interface OfferDiscountCardProps {
	percent: OfferDiscountPercent;
	href: string;
}

function TagIcon() {
	return (
		<svg className="h-[45%] w-[45%]" viewBox="0 0 8 8" fill="none" aria-hidden>
			<path
				d="M1.5 4.5 3 6l3.5-4"
				stroke="rgba(223, 211, 245, 0.9)"
				strokeWidth="0.74"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function CtaArrowIcon() {
	return (
		<svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5 -scale-x-100 sm:h-[9.5px] sm:w-[9.5px]" aria-hidden>
			<path
				d="M3 2.5 7 5 3 7.5"
				stroke="#FFFFFF"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function OfferDiscountCard({ percent, href }: OfferDiscountCardProps) {
	return (
		<Link
			href={href}
			className={`${cairo.className} relative block aspect-[271/111] w-[min(78vw,300px)] min-w-[220px] shrink-0 overflow-visible rounded-[7%] bg-white shadow-[0px_1px_4px_rgba(120,97,166,0.06)] outline-none transition-transform duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:bg-gray-800 dark:shadow-[0px_1.57895px_6.31579px_rgba(120,97,166,0.06)] sm:w-[min(72vw,290px)] sm:min-w-[250px] md:w-[270px] lg:w-[290px] xl:w-[300px]`}
			aria-label={`خصومات حصرية حتى ${percent}% على آلاف المنتجات المختارة`}
		>
			<div
				className="pointer-events-none absolute left-[-5.25%] top-[-12.9%] aspect-square w-[18.7%] rounded-full"
				style={{ background: "rgba(223, 211, 245, 0.55)" }}
				aria-hidden
			/>

			<div
				className="pointer-events-none absolute left-[16%] top-[84.3%] aspect-square w-[12.8%] rounded-full"
				style={{ background: "rgba(62, 200, 86, 0.07)" }}
				aria-hidden
			/>

			<div
				className="pointer-events-none absolute left-[59.2%] top-[-6.4%] flex aspect-square w-[46%] items-center justify-center rounded-full shadow-[0px_4.73684px_18.9474px_rgba(48,145,63,0.38)]"
				style={{
					background: "linear-gradient(145deg, #3EC856 6.17%, #30913F 58.77%, #22702E 93.83%)",
					boxShadow:
						"0px 4.73684px 18.9474px rgba(48, 145, 63, 0.38), inset 0px 0.789474px 0px rgba(255, 255, 255, 0.18)",
				}}
				aria-hidden
			>
				<div className="absolute inset-[6.3%] rounded-full border border-[rgba(255,255,255,0.18)]" />

				<div className="relative z-10 flex w-[49%] flex-col items-center">
					<span className="text-right text-[clamp(8px,2.2vw,11px)] font-semibold leading-none text-white/90">
						خصم حتى
					</span>
					<span className="text-center text-[clamp(1.5rem,9vw,2.375rem)] font-black leading-none tracking-tight text-white">
						{percent}%
					</span>
					<span className="text-center text-[clamp(7px,2vw,10px)] font-medium leading-none text-white/80">
						لفترة محدودة
					</span>
				</div>
			</div>

			<div
				className="pointer-events-none absolute left-[74.5%] top-[3.9%] flex h-[15.4%] items-center gap-[3%] rounded-e-lg px-[2%] pe-[2.6%] text-white"
				style={{
					background: "rgba(120, 97, 166, 0.82)",
					border: "0.631579px solid rgba(223, 211, 245, 0.45)",
					boxShadow:
						"0px 1.57895px 7.89474px rgba(120, 97, 166, 0.35), inset 0px 0.789474px 0px rgba(255, 255, 255, 0.15)",
				}}
				aria-hidden
			>
				<TagIcon />
				<span className="text-[clamp(6px,1.8vw,7px)] font-bold leading-none text-white">
					خصم حصري
				</span>
			</div>

			<div className="absolute inset-y-0 left-0 flex w-[60.4%] flex-col items-end justify-between px-[4%] py-[10%] pe-[4.7%]">
				<div className="flex w-full flex-col items-start">
					<p className="text-[clamp(10px,2.8vw,12px)] font-extrabold leading-snug text-[#1A1A2E] dark:text-gray-100">
						خصومات حصرية حتى {percent}%
					</p>
					<p className="pt-[2%] text-[clamp(8px,2.4vw,10px)] font-medium leading-snug text-[#52526A] dark:text-gray-400">
						على آلاف المنتجات المختارة
					</p>
					<div className="flex w-full items-center justify-end gap-[2%] pt-[3%]">
						<span className={`${cairo.className} text-[clamp(7px,2vw,8px)] font-semibold leading-tight text-[#30913F]`}>
							أكثر من 6,800 منتج ضمن العروض
						</span>
						<span className="aspect-square w-[1.5%] min-w-[3px] shrink-0 rounded-full bg-[#30913F]" />
					</div>
				</div>

				<span className="inline-flex h-[clamp(22px,6.5vw,25px)] min-h-[22px] w-[60%] min-w-[88px] max-w-[98px] items-center justify-center gap-0.5 rounded bg-[#30913F] px-2 text-[clamp(7px,2vw,8px)] font-bold leading-none text-white sm:px-2.5">
					استكشف العروض
					<CtaArrowIcon />
				</span>
			</div>
		</Link>
	);
}
