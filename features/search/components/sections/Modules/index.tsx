import { getSearchModules } from "@/features/search/api/modules";
import { ModulesClient } from "./ModulesClient";
import ModulesSkeleton from "./skeleton";

export const Modules = Object.assign(
    async function Modules({ isArabic }: { isArabic: boolean }) {
        const modules = await getSearchModules(isArabic ? "ar" : "en");
        if (modules.length === 0) return null;

        return <ModulesClient modules={modules} isArabic={isArabic} />;
    },
    { skeleton: ModulesSkeleton }
);
