import { AUTH_ENDPOINTS, DEFAULT_LANG, getBaseUrl } from '../constants/auth.constants';
import { saveAuthToken, getAuthHeader, saveUser } from '../lib/utils/auth.utils';
import type {
	LoginFormData,
	RegisterFormData,
	VerifyPhoneData,
	SendOtpData,
	LoginResponse,
	RegisterResponse,
	VerifyPhoneResponse,
	SendOtpResponse,
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
		// Construct the full URL
		const baseUrl = getBaseUrl();
		const url = `${baseUrl}/api/v1${AUTH_ENDPOINTS.LOGIN}`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-LANG': lang,
				'Accept': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				phone: data.phone,
				password: data.password,
				login_type: 'manual',
				guest_id: '',
			}),
		})
		console.log("response", response);

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			const errorMessage =
				(lang === 'ar'
					? 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد والمحاولة مرة أخرى.'
					: 'Login failed. Please check your credentials and try again.');
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

		console.log("error in login", error);
		throw error;
	}
}

/**
 * Register new user (Sign Up)
 * POST /api/v1/auth/sign-up
 * 
 * @param data - Registration data
 * @param lang - Language code (default: 'ar')
 * @returns Promise with registration response containing token
 */
export async function register(data: RegisterFormData, lang: string = DEFAULT_LANG): Promise<RegisterResponse> {
	try {
		// Use Next.js API route to avoid CORS issues
		const url = '/api/auth/sign-up';

		console.log('[Auth API] Register URL:', url);
		console.log('[Auth API] Register data:', {
			name: `${data.first_name} ${data.last_name}`,
			phone: data.phone,
			email: data.email,
			ref_code: data.ref_code || '',
			guest_id: data.guest_id || '',
		});

		let response: Response;
		try {
			response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-LANG': lang,
					'Accept': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					name: `${data.first_name} ${data.last_name}`,
					phone: data.phone,
					email: data.email,
					password: data.password,
					ref_code: data.ref_code || '',
					guest_id: data.guest_id || '',
				}),
			});
		} catch (fetchError: any) {
			// Handle network errors (CORS, connection refused, etc.)
			console.error('[Auth API] Network error:', fetchError);
			throw new Error(
				lang === 'ar'
					? 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
					: 'Failed to connect to server. Please check your internet connection and try again.'
			);
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			const errorMessage = errorData?.message || errorData?.error ||
				(lang === 'ar'
					? 'فشل التسجيل. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
					: 'Registration failed. Please check your data and try again.');
			throw new Error(errorMessage);
		}

		const result: RegisterResponse = await response.json();

		// Store authentication data if token is present
		// The API returns token directly, not in data.token
		const token = result.token || result.data?.token;
		if (token) {
			saveAuthToken(token);
			if (result.data?.user) {
				saveUser(result.data.user);
			}
		}

		return result;
	} catch (error: any) {
		// If error is already an Error instance with a message, re-throw it
		if (error instanceof Error) {
			throw error;
		}
		// Otherwise, create a new error with a default message
		throw new Error(
			lang === 'ar'
				? 'فشل التسجيل. حاول مرة أخرى.'
				: 'Registration failed. Please try again.'
		);
	}
}

/**
 * Verify phone number with OTP
 * POST /api/v1/auth/verify-phone
 * 
 * @param data - Phone and OTP data
 * @param lang - Language code (default: 'ar')
 * @returns Promise with verification response
 */
export async function verifyPhone(data: VerifyPhoneData, lang: string = DEFAULT_LANG): Promise<VerifyPhoneResponse> {
	try {
		const baseUrl = getBaseUrl();
		const url = `${baseUrl}/api/v1${AUTH_ENDPOINTS.VERIFY_PHONE}`;
		const authHeader = getAuthHeader();

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-LANG': lang,
				'Accept': 'application/json',
				...(authHeader && { 'Authorization': authHeader }),
			},
			credentials: 'include',
			body: JSON.stringify({
				phone: data.phone,
				otp: data.otp,
			}),
		}).catch((fetchError) => {
			console.error('[Auth API] Network error:', fetchError);
			throw new Error(
				lang === 'ar'
					? 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
					: 'Failed to connect to server. Please check your internet connection and try again.'
			);
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			const errorMessage = errorData?.message ||
				(lang === 'ar'
					? 'فشل التحقق من رقم الهاتف. يرجى التحقق من رمز OTP والمحاولة مرة أخرى.'
					: 'Phone verification failed. Please check the OTP code and try again.');
			throw new Error(errorMessage);
		}

		const result: VerifyPhoneResponse = await response.json();
		return result;
	} catch (error: any) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(
			lang === 'ar'
				? 'فشل التحقق من رقم الهاتف. حاول مرة أخرى.'
				: 'Phone verification failed. Please try again.'
		);
	}
}

/**
 * Send OTP again to phone number
 * POST /api/v1/auth/send-otp-again
 * 
 * @param data - Phone data
 * @param lang - Language code (default: 'ar')
 * @returns Promise with OTP send response
 */
export async function sendOtpAgain(data: SendOtpData, lang: string = DEFAULT_LANG): Promise<SendOtpResponse> {
	try {
		const baseUrl = getBaseUrl();
		const url = `${baseUrl}/api/v1${AUTH_ENDPOINTS.SEND_OTP_AGAIN}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-LANG': lang,
				'Accept': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				phone: data.phone,
			}),
		}).catch((fetchError) => {
			console.error('[Auth API] Network error:', fetchError);
			throw new Error(
				lang === 'ar'
					? 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
					: 'Failed to connect to server. Please check your internet connection and try again.'
			);
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			const errorMessage = errorData?.message ||
				(lang === 'ar'
					? 'فشل إرسال رمز OTP. يرجى المحاولة مرة أخرى.'
					: 'Failed to send OTP. Please try again.');
			throw new Error(errorMessage);
		}

		const result: SendOtpResponse = await response.json();
		return result;
	} catch (error: any) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(
			lang === 'ar'
				? 'فشل إرسال رمز OTP. حاول مرة أخرى.'
				: 'Failed to send OTP. Please try again.'
		);
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

		// Construct the full URL
		const baseUrl = getBaseUrl();
		const url = `${baseUrl}/api/v1${AUTH_ENDPOINTS.ME}`;

		// Validate BASE_URL
		if (!baseUrl || baseUrl === '') {
			throw new Error('API base URL is not configured. Please check your environment variables.');
		}

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
				...(authHeader && { 'Authorization': authHeader }),
			},
			credentials: 'include',
		}).catch((fetchError) => {
			// Handle network errors (CORS, connection refused, etc.)
			console.error('[Auth API] Network error:', fetchError);
			throw new Error(
				lang === 'ar'
					? 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
					: 'Failed to connect to server. Please check your internet connection and try again.'
			);
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			const errorMessage = errorData?.message ||
				(lang === 'ar'
					? 'فشل تحميل بيانات المستخدم'
					: 'Failed to load user data');
			throw new Error(errorMessage);
		}

		const result: UserProfileResponse = await response.json();

		// Update user in localStorage
		if (result.success && result.data) {
			saveUser(result.data);
		}

		return result;
	} catch (error: any) {
		// If error is already an Error instance with a message, re-throw it
		if (error instanceof Error) {
			throw error;
		}
		// Otherwise, create a new error with a default message
		throw new Error(
			lang === 'ar'
				? 'فشل تحميل بيانات المستخدم'
				: 'Failed to load user data'
		);
	}
}
