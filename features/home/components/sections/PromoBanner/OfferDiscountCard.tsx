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
		<svg width="7.11" height="7.11" viewBox="0 0 8 8" fill="none" aria-hidden>
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
		<svg
			width="9.54"
			height="9.54"
			viewBox="0 0 10 10"
			fill="none"
			className="-scale-x-100"
			aria-hidden
		>
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
			className={`${cairo.className} relative block h-[110.53px] w-[270.79px] shrink-0 overflow-visible rounded-[18.9474px] bg-white shadow-[0px_1.57895px_6.31579px_rgba(120,97,166,0.06)] outline-none transition-transform duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2`}
			aria-label={`خصومات حصرية حتى ${percent}% على آلاف المنتجات المختارة`}
		>
			{/* Decorative circle A — purple, top-left bleed */}
			<div
				className="pointer-events-none absolute left-[-14.21px] top-[-14.21px] h-[50.53px] w-[50.53px] rounded-[25.2632px]"
				style={{ background: "rgba(223, 211, 245, 0.55)" }}
				aria-hidden
			/>

			{/* Decorative circle B — green tint, bottom-left */}
			<div
				className="pointer-events-none absolute left-[43.42px] top-[93.16px] h-[34.74px] w-[34.74px] rounded-[17.3684px]"
				style={{ background: "rgba(62, 200, 86, 0.07)" }}
				aria-hidden
			/>

			{/* Large green gradient circle */}
			<div
				className="pointer-events-none absolute left-[160.26px] top-[-7.11px] flex h-[124.74px] w-[124.74px] items-center justify-center rounded-[62.3684px] shadow-[0px_4.73684px_18.9474px_rgba(48,145,63,0.38)]"
				style={{
					background: "linear-gradient(145deg, #3EC856 6.17%, #30913F 58.77%, #22702E 93.83%)",
					boxShadow:
						"0px 4.73684px 18.9474px rgba(48, 145, 63, 0.38), inset 0px 0.789474px 0px rgba(255, 255, 255, 0.18)",
				}}
				aria-hidden
			>
				{/* Inner white border ring */}
				<div className="absolute left-[7.9px] top-[7.9px] h-[108.95px] w-[108.95px] rounded-[54.4737px] border-[0.631579px] border-[rgba(255,255,255,0.18)]" />

				{/* Discount text stack */}
				<div className="relative z-10 flex w-[61.06px] flex-col items-center">
					<span
						className="text-right text-[11px] font-semibold leading-[8px] text-white"
						style={{ opacity: 0.88, letterSpacing: "0.315789px" }}
					>
						خصم حتى
					</span>
					<span
						className="text-center text-[37.8947px] font-black leading-[38px] text-white"
						style={{ letterSpacing: "-1.57895px" }}
					>
						{percent}%
					</span>
					<span
						className="text-center text-[10px] font-medium leading-[7px] text-white"
						style={{ opacity: 0.82, letterSpacing: "0.236842px" }}
					>
						لفترة محدودة
					</span>
				</div>
			</div>

			{/* Exclusive badge */}
			<div
				className="pointer-events-none absolute left-[201.79px] top-[4.26px] flex h-[17px] items-center gap-[3.16px] rounded-[0px_8px] px-[5.53px] pe-[7.11px] py-[2.37px] text-white"
				style={{
					background: "rgba(120, 97, 166, 0.82)",
					border: "0.631579px solid rgba(223, 211, 245, 0.45)",
					boxShadow:
						"0px 1.57895px 7.89474px rgba(120, 97, 166, 0.35), inset 0px 0.789474px 0px rgba(255, 255, 255, 0.15)",
				}}
				aria-hidden
			>
				<TagIcon />
				<span
					className="text-[7.10526px] font-bold leading-[11px] text-white"
					style={{ letterSpacing: "0.315789px" }}
				>
					خصم حصري
				</span>
			</div>

			{/* Left content area — Tajawal inherited from HomeShell */}
			<div className="absolute left-0 top-0 flex h-[110.53px] w-[163.42px] flex-col items-end gap-[14px] px-[11.05px] pb-[11.05px] pe-[12.63px] pt-4">
				<div className="flex w-[139.74px] flex-col items-start">
					<p className="text-[12px] font-extrabold leading-[14px] text-[#1A1A2E]">
						خصومات حصرية حتى {percent}%
					</p>
					<p className="pt-[2.37px] text-[10px] font-medium leading-3 text-[#52526A]">
						على آلاف المنتجات المختارة
					</p>
					<div className="flex w-full items-center justify-end gap-[3.16px] pt-[3.16px]">
						<span
							className={`${cairo.className} text-[8px] font-semibold leading-[7px] text-[#30913F]`}
						>
							أكثر من 6,800 منتج ضمن العروض
						</span>
						<span className="h-[3.95px] w-[3.95px] shrink-0 rounded-[1.97368px] bg-[#30913F]" />
					</div>
				</div>

				<span className="inline-flex h-[25px] w-[98.13px] items-center justify-end gap-[1.59px] rounded bg-[#30913F] px-2.5 py-1.5 text-[8px] font-bold leading-[13px] text-white">
					استكشف العروض
					<CtaArrowIcon />
				</span>
			</div>
		</Link>
	);
}
