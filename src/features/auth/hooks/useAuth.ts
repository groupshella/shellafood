'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	login as loginApi,
	register as registerApi,
	getCurrentUserProfile,
} from '../api/auth.api';
import { removeUser, removeAuthToken } from '../lib/utils/auth.utils';
import { AUTH_ROUTES } from '../constants/auth.constants';
import { loginSchema, registerSchema } from '../lib/validation/auth.validation';
import type { LoginFormData, RegisterFormData } from '../types/auth.types';

/**
 * Auth hook for managing authentication state
 * 
 * @returns Auth state and actions
 */
export function useAuth() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Login user with validation
	 */
	const login = async (data: LoginFormData) => {
		try {
			setIsLoading(true);
			setError(null);

			// Validate form data
			const validationResult = loginSchema.safeParse(data);
			console.log("validationResult", validationResult);
			if (!validationResult.success) {
				const firstError = validationResult.error.issues[0];
				const errorMessage = firstError.message;
				setError(errorMessage);
				throw new Error(errorMessage);
			}

			const response = await loginApi(validationResult.data);
			console.log("response", response);
			if (response.success) {
				router.push(AUTH_ROUTES.HOME);
				router.refresh();
			}
		} catch (err: any) {
			const errorMessage = 'فشل تسجيل الدخول. حاول مرة أخرى';
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
			console.log("validationResult", validationResult);
			if (!validationResult.success) {
				const firstError = validationResult.error.issues[0];
				const errorMessage = firstError.message;
				setError(errorMessage);
				throw new Error(errorMessage);
			}

			const response = await registerApi(validationResult.data);
			console.log("response", response);
			if (response.success) {
				router.push(AUTH_ROUTES.HOME);
				router.refresh();
			}
		} catch (err: any) {
			console.log("error in register", err);
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
			router.push(AUTH_ROUTES.LOGIN);
			router.refresh();
		} catch (err: any) {
			// Clear user anyway
			removeAuthToken();
			removeUser();
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
		isLoading,
		error,
		login,
		register,
		logout,
		clearError,
	};
}
