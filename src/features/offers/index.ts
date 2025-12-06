/**
 * Offers Feature Public API
 * Clean imports: import { OffersListingClient, OfferDetailsClient } from '@/features/offers'
 */

// Components
export * from './components';

// Types - export explicitly to avoid conflicts with OfferTerms component
export type { OfferTerms as OfferTermsType } from './types';
// Export other types explicitly (excluding OfferTerms)
export type {
	Offer,
	OfferDiscount,
	OfferDriver,
	OfferBookingData,
	OfferBenefit,
	ApiResponse
} from './types';

// Constants
export * from './constants/offers.constants';

// API
export * from './api/offers.api';

// Services
export { default as offerService } from './services/offer.service';

