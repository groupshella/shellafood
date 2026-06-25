import { getSearchModules } from "@/features/search/api/modules";
import { ModulesClient } from "./ModulesClient";
import ModulesSkeleton from "./skeleton";

export const Modules = Object.assign(
    async function Modules() {
        const modules = await getSearchModules();
        if (modules.length === 0) return null;

        return <ModulesClient modules={modules} />;
    },
    { skeleton: ModulesSkeleton }
);
