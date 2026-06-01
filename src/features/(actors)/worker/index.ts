/**
 * Worker Feature Public API
 * Clean imports: import { WorkerPage, WorkerForm } from '@/features/worker'
 * 
 * @module features/worker
 */

// Components
export { default as WorkerPage } from './components/registration/WorkerPage';
export { default as WorkerForm } from './components/registration/WorkerForm';
export { default as WorkerFormSection } from './components/registration/WorkerFormSection';
export { default as WorkerHero } from './components/registration/WorkerHero';
export { default as WorkerBenefits } from './components/registration/WorkerBenefits';
export { default as ChatInterface } from './components/profile/ChatInterface';
export { default as WorkerDetails } from './components/profile/WorkerDetails';

// Hooks
export { useWorkerRegistration } from './hooks/useWorkerRegistration';
export { useWorkerProfile } from './hooks/useWorkerProfile';
export { useWorkerChat } from './hooks/useWorkerChat';

// Types
export * from './types/worker.types';

// Constants
export * from './constants/worker.constants';

// API
export * from './api/worker.api';

// Validation
export * from './lib/validation/worker.validation';

// Utils
export * from './lib/utils/file.utils';
