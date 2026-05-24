"use client";

import React, { memo, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MainServiceDto } from "../types/serve-me.types";

export const ServiceCard: React.FC<MainServiceDto> = memo((service) => {
	const router = useRouter();

	return (
		<motion.div
			whileHover={{ y: -4, scale: 1.02 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#10b981]/30 dark:hover:border-green-500/50 			}`}
			dir={"rtl" }
		>
			{/* Image Container */}
			<div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
				<Image
					src={service.imageUrl || ""}
					alt={service.title}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover transition-transform duration-500 group-hover:scale-110"
					priority={false}
				/>
				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
				
				
			</div>

			{/* Content */}
			<div className="p-5 sm:p-6">
				{/* Title */}
				<h3 className={`text-lg sm:text-xl md:text-2xl font-black text-gray-900  mb-3 text-center ${
					"text-right"
				}`}>
					{service.title}
				</h3>

				{/* Description */}
				{service.description && (
					<p className={`text-sm sm:text-base text-gray-600  mb-4 line-clamp-2 leading-relaxed text-right`}>
						{service.description}
					</p>
				)}

				{/* Buttons Container */}
				<div className={`flex gap-3 `}>
				<Link
						href={`/${service.id}/book/details?title=${encodeURIComponent(service.title)}&new=true`}
						prefetch={true}
						className={`group/btn flex-1 rounded-xl bg-gradient-to-r from-[#10b981] via-emerald-600 to-teal-600 hover:from-[#059669] hover:via-emerald-700 hover:to-teal-700 text-white py-3 sm:py-3.5 px-4 sm:px-6 font-bold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#10b981]/30 text-center focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-offset-2 active:scale-[0.98]`}
					>
						<span className="flex items-center justify-center gap-2">
							{"اختر الخدمة"}
							<motion.span
								animate={{ x: [0, 4, 0] }}
								className="inline-block"
							>
								→
							</motion.span>
						</span>
					</Link>
				</div>
			</div>
		</motion.div>
	);
});

ServiceCard.displayName = "ServiceCard";
