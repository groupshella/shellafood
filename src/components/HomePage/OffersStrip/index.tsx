'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import offerService from '@/services/offer.service';
import { Offer as OfferType } from '@/types/offer.types';

interface Offer {
	id: string;
	title: string;
	titleAr: string;
	discount: string;
	discountAr: string;
	link?: string;
}

export default function OffersStrip() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const router = useRouter();
	const [offers, setOffers] = useState<OfferType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch real offers
	useEffect(() => {
		async function loadOffers() {
			try {
				const fetchedOffers = await offerService.getAllOffers();
				// Filter out offer with id 1 (general offer) and only show offers with discounts
				const validOffers = fetchedOffers.filter(
					(offer) => offer.id !== 1 && offer.discount && offer.discount.value > 0
				);
				setOffers(validOffers);
			} catch (error) {
				console.error('Error loading offers:', error);
			} finally {
				setIsLoading(false);
			}
		}
		loadOffers();
	}, []);

	// Convert OfferType to Offer format for display
	const displayOffers = useMemo(() => {
		return offers.map((offer) => {
			const discountText = offer.discount
				? offer.discount.type === 'percentage'
					? `${offer.discount.value}% ${isArabic ? 'خصم' : 'OFF'}`
					: `${offer.discount.value} ${isArabic ? 'ر.س خصم' : 'SAR OFF'}`
				: '';

			const discountDetails = offer.discount?.minOrder
				? isArabic
					? `للطلبات فوق ${offer.discount.minOrder} ريال`
					: `Orders over ${offer.discount.minOrder} SAR`
				: isArabic
					? 'عرض خاص'
					: 'Special Offer';

			return {
				id: offer.id.toString(),
				title: offer.titleEn,
				titleAr: offer.title,
				discount: discountText || discountDetails,
				discountAr: discountText || discountDetails,
				link: offer.link || `/offers/${offer.id}`,
			};
		});
	}, [offers, isArabic]);

	// Duplicate offers for seamless infinite loop
	const DUPLICATED_OFFERS = useMemo(() => {
		if (displayOffers.length === 0) return [];
		return [...displayOffers, ...displayOffers, ...displayOffers, ...displayOffers];
	}, [displayOffers]);

	const handleOfferClick = (offer: Offer) => {
		if (offer.link) {
			// If link is to pickandorder, navigate to offer details page instead
			if (offer.link.includes('/pickandorder/')) {
				// Extract offer ID from the offer object
				const offerId = offer.id;
				router.push(`/offers/${offerId}`);
			} else {
				router.push(offer.link);
			}
		}
	};

	// Don't render if loading or no offers
	if (isLoading || displayOffers.length === 0) {
		return null;
	}

	return (
		<section className="my-6 sm:my-8 border-y border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir={isArabic ? 'rtl' : 'ltr'}>
			<div className="overflow-hidden py-4">
				<div className="hover-pause inline-flex">
					<div
						className={`flex gap-6 sm:gap-8 ${isArabic ? 'animate-marquee-rtl' : 'animate-marquee-ltr'}`}
						style={{
							display: 'inline-flex',
						}}
					>
						{DUPLICATED_OFFERS.map((offer, index) => {
							const displayTitle = isArabic ? offer.titleAr : offer.title;
							const displayDiscount = isArabic ? offer.discountAr : offer.discount;

							return (
								<div
									key={`${offer.id}-${index}`}
									onClick={() => handleOfferClick(offer)}
									className={`
										flex-shrink-0 flex items-center gap-3 sm:gap-4
										px-4 sm:px-5 py-2 sm:py-2.5
										rounded-lg
										bg-white dark:bg-gray-800
										border border-gray-200 dark:border-gray-700
										text-gray-900 dark:text-gray-100
										shadow-sm hover:shadow-md
										cursor-pointer
										transition-all duration-200
										hover:border-gray-300 dark:hover:border-gray-600
										whitespace-nowrap
										group
									`}
								>
									{/* Content */}
									<div className="flex items-center gap-2 sm:gap-3">
										<h3 className="font-semibold text-sm sm:text-base">
											{displayTitle}
										</h3>
										<span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
											•
										</span>
										<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
											{displayDiscount}
										</p>
									</div>

									{/* Arrow */}
									<ArrowRight
										className={`
											flex-shrink-0 w-4 h-4 sm:w-4 sm:h-4
											text-gray-400 dark:text-gray-500
											group-hover:text-gray-600 dark:group-hover:text-gray-300
											transition-all
											group-hover:translate-x-0.5
											${isArabic ? 'rotate-180' : ''}
										`}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
