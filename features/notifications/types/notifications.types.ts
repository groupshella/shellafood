export interface Notification {
    id: number;
    title: string;
    description: string;
    image?: string | null;
    image_full_url?: string | null;
    status?: 0 | 1;
    created_at: string;
}

export interface GetNotificationsResponse {
    total_size?: number;
    limit?: number;
    offset?: number;
    notifications: Notification[];
}
