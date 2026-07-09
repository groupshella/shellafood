import { getPopularSearch } from "@/features/search/api/popular-search";
import { PopularSearchClient } from "./PopularSearchClient";
import PopularSearchSkeleton from "./skeleton";

export const PopularSearch = Object.assign(
    async function PopularSearch({ moduleId }: { moduleId?: string }) {
        if (!moduleId || Number.isNaN(Number(moduleId))) return null;

        const items = await getPopularSearch(moduleId);
        if (items.length === 0) return null;

        return <PopularSearchClient items={items} />;
    },
    { skeleton: PopularSearchSkeleton }
);
