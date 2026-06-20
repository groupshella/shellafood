import { getPopularSearch } from "@/features/search/api/popular-search";
import { PopularSearchClient } from "./PopularSearchClient";
import PopularSearchSkeleton from "./skeleton";

export const PopularSearch = Object.assign(
    async function PopularSearch() {
        const items = await getPopularSearch();
        if (items.length === 0) return null;

        return <PopularSearchClient items={items} />;
    },
    { skeleton: PopularSearchSkeleton }
);
