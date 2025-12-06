import { AUTH_ENDPOINTS, DEFAULT_LANG, BASE_URL } from '../constants/auth.constants';
import { saveAuthToken, getAuthHeader, saveUser } from '../lib/utils/auth.utils';
import type {
	LoginFormData,
	RegisterFormData,
	LoginResponse,
	RegisterResponse,
	UserProfileResponse,
} from '../types/auth.types';

/**
 * Login user with email and password
 * 
 * @param data - Login credentials
 * @param lang - Language code (default: 'ar')
 * @returns Promise with login response
 */
export async function login(data: LoginFormData, lang: string = DEFAULT_LANG): Promise<LoginResponse> {
	try {
		const response = await fetch(`${BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-LANG': lang,
				'Accept': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				email: data.email,
				password: data.password,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			const errorMessage = errorData?.message || 'فشل تسجيل الدخول. حاول مرة أخرى';
			throw new Error(errorMessage);
		}

		const result: LoginResponse = await response.json();

		// Store authentication data
		if (result.success && result.data.token) {
			saveAuthToken(result.data.token, data.remember);
			saveUser(result.data.user);
		}

		return result;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('فشل تسجيل الدخول. حاول مرة أخرى');
	}
}

/**
 * Register new user
 * 
 * @param data - Registration data
 * @param lang - Language code (default: 'ar')
 * @returns Promise with registration response
 */
export async function register(data: RegisterFormData, lang: string = DEFAULT_LANG): Promise<RegisterResponse> {
	try {
		const response = await fetch(`${BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-LANG': lang,
				'Accept': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				first_name: data.first_name,
				last_name: data.last_name,
				phone: data.phone,
				email: data.email,
				password: data.password,
				password_confirmation: data.password_confirmation,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			const errorMessage = errorData?.message || 'فشل التسجيل. حاول مرة أخرى';
			throw new Error(errorMessage);
		}

		const result: RegisterResponse = await response.json();

		// Store authentication data
		if (result.success && result.data.token) {
			saveAuthToken(result.data.token);
			saveUser(result.data.user);
		}

		return result;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('فشل التسجيل. حاول مرة أخرى');
	}
}

/**
 * Get current authenticated user profile
 * 
 * @param lang - Language code (default: 'ar')
 * @returns Promise with user profile
 */
export async function getCurrentUserProfile(lang: string = DEFAULT_LANG): Promise<UserProfileResponse> {
	try {
		const authHeader = getAuthHeader();
		
		const response = await fetch(`${BASE_URL}${AUTH_ENDPOINTS.ME}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
				...(authHeader && { 'Authorization': authHeader }),
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			const errorMessage = errorData?.message || 'فشل تحميل بيانات المستخدم';
			throw new Error(errorMessage);
		}

		const result: UserProfileResponse = await response.json();

		// Update user in localStorage
		if (result.success && result.data) {
			saveUser(result.data);
		}

		return result;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('فشل تحميل بيانات المستخدم');
	}
}
