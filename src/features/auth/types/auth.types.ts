/**
 * Auth Feature Types
 * All types for authentication feature
 */

// ============================================================================
// User Types
// ============================================================================

export interface AuthUser {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
	avatar?: string;
	email_verified_at: string | null;
	created_at: string;
	updated_at: string;
}

// ============================================================================
// Form Data Types
// ============================================================================

export interface LoginFormData {
	email: string;
	password: string;
	remember?: boolean;
}

export interface RegisterFormData {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	password: string;
	password_confirmation: string;
	accept_terms: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface LoginResponse {
	success: boolean;
	data: {
		user: AuthUser;
		token: string;
		token_type: string;
		expires_at: string;
	};
	message?: string;
}

export interface RegisterResponse {
	success: boolean;
	data: {
		user: AuthUser;
		token: string;
		token_type: string;
		expires_at: string;
	};
	message?: string;
}

export interface UserProfileResponse {
	success: boolean;
	data: AuthUser;
}

// ============================================================================
// UI Types
// ============================================================================

export interface NotificationState {
	message: string;
	type: "success" | "error" | "info";
	isVisible: boolean;
}
