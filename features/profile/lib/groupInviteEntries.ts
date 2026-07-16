import type { InviteDateGroup, ReferralEntry } from "@/features/profile/types/referral.types";

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

function formatGroupLabel(
	key: string,
	todayKey: string,
	yesterdayKey: string,
	lang: "ar" | "en",
): string {
	if (key === todayKey) return lang === "ar" ? "اليوم" : "Today";
	if (key === yesterdayKey) return lang === "ar" ? "الأمس" : "Yesterday";

	const date = dateFromKey(key);
	const day = date.getDate();
	const month = date.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
		month: "long",
		calendar: "gregory",
	});
	const year = date.getFullYear();
	return `${day} ${month}, ${year}`;
}

export function groupInviteEntriesByDate(
	entries: ReferralEntry[],
	lang: "ar" | "en" = "ar",
): InviteDateGroup[] {
	const todayKey = toLocalDateKey(new Date());
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayKey = toLocalDateKey(yesterday);

	const map = new Map<string, ReferralEntry[]>();
	for (const entry of entries) {
		const key = entry.createdAt.slice(0, 10);
		const group = map.get(key) ?? [];
		group.push(entry);
		map.set(key, group);
	}

	return [...map.entries()]
		.sort(([a], [b]) => b.localeCompare(a))
		.map(([key, groupEntries]) => ({
			key,
			label: formatGroupLabel(key, todayKey, yesterdayKey, lang),
			entries: groupEntries,
		}));
}
