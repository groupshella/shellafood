import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/features/home/types/banners.types";

function getBannerHref(banner: Banner): string | null {
	if (banner.link) return banner.link;
	if (banner.store?.slug) return `/store/${banner.store.slug}`;
	return null;
}

export function BannerSlide({ banner, priority = false }: { banner: Banner; priority?: boolean }) {
	const href = getBannerHref(banner);

	const image = (
		<Image
			src={banner.image_full_url}
			alt={banner.title || "عرض ترويجي"}
			fill
			priority={priority}
			quality={85}
			className="object-cover object-center"
			sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1024px) calc(100vw - 48px), (max-width: 1536px) 896px, 1152px"
			placeholder="blur"
			blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iMzIwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
		/>
	);

	const wrapper = (
		<div className="group relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm ring-1 ring-black/[0.04] dark:from-gray-800 dark:to-gray-700 dark:ring-white/[0.06] sm:aspect-[21/8] sm:rounded-2xl md:aspect-[21/7] lg:aspect-[21/6] xl:aspect-[21/5.5]">
			{image}
			<div
				className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent dark:from-black/25"
				aria-hidden
			/>
		</div>
	);

	if (href) {
		return (
			<Link
				href={'/hyper-market/'}
				className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 sm:rounded-2xl dark:focus-visible:ring-offset-gray-900"
				draggable={false}
			>
				{wrapper}
			</Link>
		);
	}

	return wrapper;
}
