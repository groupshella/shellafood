export interface PointsHistoryItem {
    id: string;
    points: number;
    timeLabel: string;
    title: string;
    subtitle: string;
    href?: string;
}

export interface PointsHistoryGroup {
    id: string;
    dateLabel: string;
    items: PointsHistoryItem[];
}

export interface PointsTransactionsPage {
    groups: PointsHistoryGroup[];
    nextOffset: number;
    hasMore: boolean;
}

export interface MyPointsData {
    convertiblePoints: number;
    history: PointsHistoryGroup[];
}
