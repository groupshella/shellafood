/**
 * Auth Feature Public API
 * Clean imports: import { LoginForm, RegisterForm, useAuth } from '@/features/auth'
 * 
 * @module features/auth
 */

// Components
export { default as LoginForm } from './components/LoginForm';
export { default as RegisterForm } from './components/RegisterForm';
export * from './components/PersonalInfoSection';
export * from './components/AccountSection';

// Hooks
export * from './hooks/useAuth';

// Types
export * from './types/auth.types';

// Constants
export * from './constants/auth.constants';

// API
export * from './api/auth.api';

// Validation
export * from './lib/validation/auth.validation';

// Utils
export * from './lib/utils/auth.utils';
