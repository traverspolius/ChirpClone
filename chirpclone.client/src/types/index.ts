export interface User {
    id: string;
    handle: string;
    displayName: string;
}

export interface PollOption {
    id: string;
    optionText: string;
    voteCount: number;
}

export interface Poll {
    id: string;
    expiresAtUtc: string;
    options: PollOption[];
}

export interface Post {
    id: string;
    content: string;
    createdAtUtc: string;
    author: User;
    poll?: Poll | null;
}

export interface NotificationItem {
    id: string;
    type: number | string;
    message: string;
    createdAtUtc: string;
    isRead: boolean;
}

export interface TrendingTopic {
    topic: string;
    category: string;
    posts: number;
}

export interface NewsItem {
    title: string;
    category: string;
    age: string;
    posts: number;
}

export interface FollowSuggestion {
    handle: string;
    displayName: string;
    badge?: string;
}
