/**
 * Driver Feature Public API
 * Clean imports: import { DriverPage, DriverForm, useDriverRegistration } from '@/features/driver'
 * 
 * @module features/driver
 */

// Components
export { default as DriverPage } from './components/registration/DriverPage';
export { default as DriverForm } from './components/registration/DriverForm';
export { default as DriverFormSection } from './components/registration/DriverFormSection';
export { default as DriverHero } from './components/registration/DriverHero';
export { default as DriverBenefits } from './components/registration/DriverBenefits';

// Profile Components
export { default as DriverProfilePage } from './components/profile/DriverProfilePage';
export { default as DriverProfileModal } from './components/profile/DriverProfileModal';
export { default as DriverChatPage } from './components/profile/DriverChatPage';

// Hooks
export { useDriverRegistration } from './hooks/useDriverRegistration';
export { useDriverProfile } from './hooks/useDriverProfile';
export { useDriverChat } from './hooks/useDriverChat';

// Types
export * from './types/driver.types';

// Constants
export * from './constants/driver.constants';

// API
export * from './api/driver.api';

// Validation
export * from './lib/validation/driver.validation';

// Utils
export * from './lib/utils/phone.utils';
export * from './lib/utils/file.utils';
