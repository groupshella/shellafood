"use client";

import { Minus, Plus } from "lucide-react";

interface ProfilePhotoCropProps {
	photoSrc: string;
	zoom: number;
	onZoomChange: (zoom: number) => void;
	error?: string | null;
	isArabic?: boolean;
}

/**
 * Uses a plain <img> so local data:/blob: previews work without next/image
 * sizing requirements (which previously blanked the photo confirm screen).
 */
export function ProfilePhotoCrop({
	photoSrc,
	zoom,
	onZoomChange,
	error,
	isArabic = true,
}: ProfilePhotoCropProps) {
	const adjustZoom = (delta: number) => {
		onZoomChange(Math.min(3, Math.max(1, Number((zoom + delta).toFixed(1)))));
	};

	return (
		<div className="flex w-full flex-col items-center gap-6 sm:gap-8">
			<div className="relative aspect-square w-full max-w-48 overflow-hidden rounded-full bg-card ring-1 ring-border sm:max-w-56 md:max-w-64">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={photoSrc}
					alt=""
					className="h-full w-full object-cover transition-transform duration-200"
					style={{ transform: `scale(${zoom})` }}
					draggable={false}
				/>
			</div>

			<div className="flex w-full max-w-sm items-center gap-3 sm:gap-4 md:max-w-md">
				<button
					type="button"
					onClick={() => adjustZoom(-0.1)}
					className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-foreground transition-colors active:brightness-95 sm:h-12 sm:w-12"
					aria-label={isArabic ? "تصغير" : "Zoom out"}
				>
					<Minus className="h-4 w-4" />
				</button>
				<input
					type="range"
					min={1}
					max={3}
					step={0.1}
					value={zoom}
					onChange={(e) => onZoomChange(Number(e.target.value))}
					className="min-w-0 flex-1 accent-brand"
					aria-label={isArabic ? "تكبير الصورة" : "Zoom photo"}
				/>
				<button
					type="button"
					onClick={() => adjustZoom(0.1)}
					className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground transition-colors active:brightness-95 sm:h-12 sm:w-12"
					aria-label={isArabic ? "تكبير" : "Zoom in"}
				>
					<Plus className="h-4 w-4" />
				</button>
			</div>

			<div className="w-full max-w-2xl text-start">
				<p className="mb-3 text-[14px] font-bold text-foreground sm:text-[15px]">
					{isArabic
						? "يرجى التأكد من أن الصورة:"
						: "Please make sure the photo:"}
				</p>
				<ul className="space-y-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
					<li>
						•{" "}
						{isArabic
							? "لا توجد بالصورة أي ضبابية والإضاءة بها جيدة"
							: "Is clear and well lit"}
					</li>
					<li>
						•{" "}
						{isArabic
							? "دون نظارات أو قبعات أو أي اكسسوارات أخرى"
							: "Has no glasses, hats, or other accessories"}
					</li>
				</ul>
			</div>

			{error && (
				<p className="w-full text-center text-[13px] text-red-500" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
