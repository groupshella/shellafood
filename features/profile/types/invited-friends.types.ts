export interface InvitedFriendApi {
    user_id: number;
    name: string;
    phone: string;
    avatar_full_url: string | null;
    registered_at: string;
    date_group_key: string;
    date_group_label: string;
    status: string;
    status_label: string;
    reward_amount: number | null;
    reward_text: string | null;
    reward_status: string | null;
}

export interface InvitedFriendsSummaryApi {
    total_invites: number;
    total_rewards: number;
    currency: string;
}

export interface InvitedFriendsPaginationApi {
    offset: number;
    limit: number;
    total_size: number;
}

export interface InvitedFriendsApiResponse {
    summary: InvitedFriendsSummaryApi;
    friends: InvitedFriendApi[];
    pagination: InvitedFriendsPaginationApi;
}
