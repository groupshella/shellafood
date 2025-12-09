/**
 * Serve Me Feature Public API
 * Clean imports: import { ServeMe, ServiceCategoryPage, IndividualServicePage } from '@/features/serve-me'
 * 
 * @module features/serve-me
 */

// Components
export { default as ServeMe } from './components/Main/ServeMe';
export { HeroSection } from './components/Main/HeroSection';
export { ServicesGrid } from './components/Main/ServicesGrid';
export { FeaturesSection } from './components/Main/FeaturesSection';
export { default as ServiceCategoryPage } from './components/Service/ServiceCategoryPage';
export { ServiceCard } from './components/Service/ServiceCard';
export { default as IndividualServicePage } from './components/ServiceType/IndividualServicePage';
export { default as ChooseWorker } from './components/Worker/ChooseWorker';
export { default as ScheduleService } from './components/Worker/ScheduleService';
export { default as BookingDetailsPage } from './components/Booking/steps/BookingDetailsPage/BookingDetailsPage'
export { default as BookingSummaryPage } from './components/Booking/steps/BookingSummaryPage';
export { default as ConfirmationPage } from './components/Booking/steps/ConfirmationPage';
export { default as PaymentPage } from './components/Booking/steps/PaymentPage';
export { default as StepperNavigation } from './components/Booking/StepperNavigation';
export { default as AttachmentGuidelinesModal } from './components/Booking/modals/AttachmentGuidelinesModal';
export { default as DescriptionTooltipModal } from './components/Booking/modals/DescriptionTooltipModal';
export { default as RatingModal } from './components/Booking/modals/RatingModal';
export { default as WorkerRecommendationModal } from './components/Booking/modals/WorkerRecommendationModal';
export { default as WaitingWorkerPage } from './components/Booking/steps/WaitingWorkerPage';
export { default as AcceptedWorkersPage } from './components/Booking/steps/AcceptedWorkersPage';

// Types - Export non-conflicting types with wildcard, conflicting types explicitly
export type {
	Service,
	ServiceType,
	Worker,
	Address,
	BookingData,
	TimeSlot,
	ApiResponse,
	NotificationState,
	ServiceGridItem,
	BookingAddress,
	BookingServiceType,	
	BookingStep,
	RecommendedWorker,
	RatingModalProps,
} from './types/serve-me.types';

// Export PaymentMethod type from types (simpler version for API/data) with alias to avoid conflict
export type { PaymentMethod as PaymentMethodType } from './types/serve-me.types';

// Constants
export * from './constants/serve-me.constants';

// API
export * from './api/serve-me.api';

// Hooks
export { useServiceCategory } from './hooks/useServiceCategory';
export { useIndividualService } from './hooks/useIndividualService';

// Utils
// Export PaymentMethod from utils (UI-specific implementation with React components)
export type { PaymentMethod, PaymentMethodId } from './lib/utils/paymentMethods';
export { PAYMENT_METHODS } from './lib/utils/paymentMethods';
export * from './lib/utils/pricing';
export * from './lib/utils/validation';
export * from './lib/utils/workerUtils';

