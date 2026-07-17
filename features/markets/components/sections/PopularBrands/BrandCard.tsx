import Image from "@/shared/components/SecureImage";
import { PopularBrand } from "@/features/markets/types/popular-brands.types";

export function BrandCard({ brand }: { brand: PopularBrand }) {
	const name = brand.name?.trim() || "";

	return (
		<div
			className={[
				"flex min-h-[68px] items-center gap-2.5 rounded-2xl bg-card p-2.5 sm:min-h-[76px] sm:gap-3 sm:p-3 lg:min-h-20",
				"ring-1 ring-border",
			].join(" ")}
			aria-label={name}
		>
			<div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-background ring-1 ring-border sm:h-14 sm:w-14 lg:h-16 lg:w-16">
				{brand.image_full_url ? (
					<Image
						src={brand.image_full_url}
						alt=""
						fill
						className="object-contain p-1.5"
						sizes="(max-width: 640px) 44px, 64px"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-card text-xs text-muted">
						{name.charAt(0)}
					</div>
				)}
			</div>

			<h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-bold text-foreground sm:text-[15px] lg:text-base">
				{name}
			</h3>
		</div>
	);
}
