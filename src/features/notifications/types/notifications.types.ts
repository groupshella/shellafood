export interface NotificationData {
	title: string;
	description: string;
	order_id?: number;
	image?: string;
	type: string;
}

export interface Notification {
	id: number;
	data: NotificationData;
	status: number;
	user_id: number;
	vendor_id: number | null;
	delivery_man_id: number | null;
	created_at: string;
	updated_at: string;
}

export interface NotificationsResponse {
	notifications?: Notification[];
	total_size?: number;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	status?: number;
}

