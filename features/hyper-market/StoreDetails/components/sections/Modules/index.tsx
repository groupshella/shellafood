import { getStoreModules } from "@/features/hyper-market/StoreDetails/api/modules";
import { ModulesClient } from "./ModulesClient";
import ModulesSkeleton from "./skeleton";

export const Modules = Object.assign(
    async function Modules({ moduleId }: { moduleId: string }) {
        const modules = await getStoreModules();
        if (modules.length === 0) return null;

        return <ModulesClient modules={modules} moduleId={moduleId} />;
    },
    { skeleton: ModulesSkeleton }
);
