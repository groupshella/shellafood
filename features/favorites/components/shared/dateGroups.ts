// features/favorites/components/shared/dateGroups.ts

export interface DateGroup<T> {
    /** Stable YYYY-MM-DD key for React keys and sorting */
    key: string;
    label: string;
    items: T[];
}

function parseDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr?.trim()) return null;

    const normalized = dateStr.trim().includes("T")
        ? dateStr.trim()
        : dateStr.trim().replace(" ", "T");

    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
}

function toLocalDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function dateFromKey(key: string): Date {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function getTodayKey(): string {
    return toLocalDateKey(new Date());
}

function getYesterdayKey(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return toLocalDateKey(date);
}

function formatArabicDate(date: Date): string {
    return date.toLocaleDateString("ar-SA", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        calendar: "gregory",
    });
}

function sortNewestFirst<T extends { wishlisted_at?: string | null }>(items: T[]): T[] {
    return [...items].sort((a, b) => {
        const timeA = parseDate(a.wishlisted_at)?.getTime() ?? 0;
        const timeB = parseDate(b.wishlisted_at)?.getTime() ?? 0;
        return timeB - timeA;
    });
}

export function groupByDate<T extends { wishlisted_at?: string | null }>(
    items: T[]
): DateGroup<T>[] {
    const todayKey = getTodayKey();
    const yesterdayKey = getYesterdayKey();
    const map = new Map<string, T[]>();

    for (const item of items) {
        const parsed = parseDate(item.wishlisted_at);
        const key = parsed ? toLocalDateKey(parsed) : "unknown";
        const group = map.get(key) ?? [];
        group.push(item);
        map.set(key, group);
    }

    const sorted = [...map.entries()].sort(([a], [b]) => {
        if (a === "unknown") return 1;
        if (b === "unknown") return -1;
        return b.localeCompare(a);
    });

    return sorted.map(([key, groupItems]) => {
        let label: string;

        if (key === "unknown") {
            label = "بدون تاريخ";
        } else if (key === todayKey) {
            label = "اليوم";
        } else if (key === yesterdayKey) {
            label = "أمس";
        } else {
            label = formatArabicDate(dateFromKey(key));
        }

        return { key, label, items: sortNewestFirst(groupItems) };
    });
}