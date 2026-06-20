import { getModules } from "@/features/home/api/modules";
import { ModulesClient } from "./ModulesClient";
import ModuleSkeleton from "./skeleton";

export const Modules = Object.assign(
    async function Modules() {
        const modules = await getModules();
        if (modules.length === 0) return null;

        return <ModulesClient modules={modules} />;
    },
    { skeleton: ModuleSkeleton }
);
