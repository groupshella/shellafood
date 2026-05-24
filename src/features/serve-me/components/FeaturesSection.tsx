import React, { memo } from "react";
import { FeatureItem } from "../types/serve-me.types";

/**
 * Features Section Component
 * Bottom section showing key features/benefits
 */
export const FeaturesSection: React.FC<{ features: FeatureItem[] }> = memo(({ features }) => {
	return (
		<div className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-16 lg:py-20">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
						لماذا تختارنا؟
					</h2>
					<p className="text-sm sm:text-base md:text-lg text-gray-600">
						نقدم لك أفضل تجربة في الخدمات
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
					{features.map((feature, index) => (
						<div
							key={`feature-${feature.title}-${index}`}
							className="flex flex-col items-center text-center p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 hover:border-green-200 group"
						>
							{/* Icon */}
							<div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 transition-all duration-300 group-hover:scale-110">
								<div className="text-green-600 group-hover:text-green-700 transition-colors duration-300">
									{feature.icon}
								</div>
							</div>

							{/* Title */}
							<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
								{feature.title}
							</h3>

							{/* Description */}
							<p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
});

FeaturesSection.displayName = "FeaturesSection";