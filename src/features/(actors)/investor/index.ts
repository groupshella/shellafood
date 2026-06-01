/**
 * Investor Feature Public API
 * Clean imports: import { InvestorPage, InvestorForm } from '@/features/investor'
 * 
 * @module features/investor
 */

// Components
export { default as InvestorPage } from './components/registration/InvestorPage';
export { default as InvestorHero } from './components/registration/InvestorHero';
export { default as InvestorCards } from './components/registration/InvestorCards';
export { default as InvestorBenefits } from './components/registration/InvestorBenefits';

// Registration Components
export { default as InvestorForm } from './components/registration/InvestorForm';
export { default as ContractModal } from './components/modals/ContractModal';
export { ProgressIndicator } from './components/ProgressIndicator';
export { InvestorDocumentSigner } from './components/InvestorDocumentSigner';

// Hooks
export { useInvestorRegistration } from './hooks/useInvestorRegistration';

// Types
export * from './types/investor.types';

// Constants
export * from './constants/investor.constants';

// API
export * from './api/investor.api';

// Validation
export * from './lib/validation/investor.validation';

// Utils
// export * from './lib/utils/file.utils';
