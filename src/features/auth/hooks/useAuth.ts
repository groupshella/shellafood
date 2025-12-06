'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	login as loginApi,
	register as registerApi,
	getCurrentUserProfile,
} from '../api/auth.api';
import { getCurrentUser, isAuthenticated, removeUser, removeAuthToken } from '../lib/utils/auth.utils';
import { AUTH_ROUTES } from '../constants/auth.constants';
import { loginSchema, registerSchema } from '../lib/validation/auth.validation';
import type { LoginFormData, RegisterFormData, AuthUser } from '../types/auth.types';

/**
 * Auth hook for managing authentication state
 * 
 * @returns Auth state and actions
 */
export function useAuth() {
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Initialize: Check if user is authenticated
	useEffect(() => {
		const initAuth = async () => {
			try {
				if (isAuthenticated()) {
					const currentUser = getCurrentUser();
					setUser(currentUser);
					
					// Refresh user data from API
					try {
						const response = await getCurrentUserProfile();
						setUser(response.data);
					} catch (err) {
						// If API fails, keep localStorage user
						console.error('Failed to refresh user:', err);
					}
				}
			} catch (err) {
				console.error('Auth initialization error:', err);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	/**
	 * Login user with validation
	 */
	const login = async (data: LoginFormData) => {
		try {
			setIsLoading(true);
			setError(null);

			// Validate form data
			const validationResult = loginSchema.safeParse(data);
			if (!validationResult.success) {
				const firstError = validationResult.error.issues[0];
				const errorMessage = firstError.message;
				setError(errorMessage);
				throw new Error(errorMessage);
			}

			const response = await loginApi(validationResult.data);
			
			if (response.success) {
				setUser(response.data.user);
				router.push(AUTH_ROUTES.HOME);
				router.refresh();
			}
		} catch (err: any) {
			const errorMessage = err.message || 'فشل تسجيل الدخول. حاول مرة أخرى';
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Register new user with validation
	 */
	const register = async (data: RegisterFormData) => {
		try {
			setIsLoading(true);
			setError(null);

			// Validate form data
			const validationResult = registerSchema.safeParse(data);
			if (!validationResult.success) {
				const firstError = validationResult.error.issues[0];
				const errorMessage = firstError.message;
				setError(errorMessage);
				throw new Error(errorMessage);
			}

			const response = await registerApi(validationResult.data);
			
			if (response.success) {
				setUser(response.data.user);
				router.push(AUTH_ROUTES.HOME);
				router.refresh();
			}
		} catch (err: any) {
			const errorMessage = err.message || 'فشل التسجيل. حاول مرة أخرى';
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Logout user
	 */
	const logout = async () => {
		try {
			setIsLoading(true);
			setError(null);
			removeAuthToken();
			removeUser();
			setUser(null);
			router.push(AUTH_ROUTES.LOGIN);
			router.refresh();
		} catch (err: any) {
			// Clear user anyway
			removeAuthToken();
			removeUser();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Clear error
	 */
	const clearError = () => {
		setError(null);
	};

	return {
		user,
		isAuthenticated: !!user,
		isLoading,
		error,
		login,
		register,
		logout,
		clearError,
	};
}
