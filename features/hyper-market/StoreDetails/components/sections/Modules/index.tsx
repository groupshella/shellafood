import { getStoreModules } from "@/features/hyper-market/StoreDetails/api/modules";
import { ModulesClient } from "./ModulesClient";
import ModulesSkeleton from "./skeleton";

export const Modules = Object.assign(
    async function Modules({ moduleId, isArabic }: { moduleId: string, isArabic: boolean }) {
        const modules = await getStoreModules(isArabic);
        if (modules.length === 0) return null;

        return <ModulesClient modules={modules} moduleId={moduleId} isArabic={isArabic} />;
    },
    { skeleton: ModulesSkeleton }
);
