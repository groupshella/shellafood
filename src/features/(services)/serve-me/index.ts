/**
 * Serve Me Feature Public API
 * Clean imports: import { ServeMe, ServiceCategoryPage, IndividualServicePage } from '@/features/serve-me'
 * 
 * @module features/serve-me
 */

// Components
export { default as ServeMe } from './components/MainPage/ServeMe';
export { HeroSection } from './components/MainPage/HeroSection';
export { ServicesGrid } from './components/MainPage/ServicesGrid';
export { FeaturesSection } from './components/MainPage/FeaturesSection';
export { default as ServiceCategoryPage } from './components/ServicePage/ServiceCategoryPage';
export { ServiceCard } from './components/ServicePage/ServiceCard';
export { default as IndividualServicePage } from './components/ServiceTypePage/IndividualServicePage';
export { default as ChooseWorker } from './components/BookingSteps/ChooseWorkerPage';
export { default as BookingDetailsPage } from './components/BookingSteps/BookingDetailsPage'
export { default as BookingSummaryPage } from './components/BookingSteps/BookingSummaryPage';
export { default as ConfirmationPage } from './components/BookingSteps/ConfirmationPage';
export { default as PaymentPage } from './components/BookingSteps/PaymentPage';
export { default as StepperNavigation } from './components/BookingSteps/StepperNavigation/StepperNavigation';
export { default as AttachmentGuidelinesModal } from './components/Modals/AttachmentGuidelinesModal';
export { default as DescriptionTooltipModal } from './components/Modals/DescriptionTooltipModal';
export { default as RatingModal } from './components/Modals/RatingModal';
export { default as WorkerRecommendationModal } from './components/Modals/WorkerRecommendationModal';
export { default as WaitingWorkerPage } from './components/BookingSteps/WaitingWorkerPage';
export { default as AcceptedWorkersPage } from './components/BookingSteps/AcceptedWorkersPage';

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

