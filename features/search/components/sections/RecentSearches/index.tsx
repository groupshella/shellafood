import { RecentSearchesClient } from "./RecentSearchesClient";

export function RecentSearches({ isArabic }: { isArabic: boolean }) {
    return <RecentSearchesClient isArabic={isArabic} />;
}
