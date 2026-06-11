import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import ModulePage from "@/features/module/components/ModulePage";
import { cookies } from "next/headers";

interface ModulePageRouteProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ module_name?: string }>;
}

export default async function ModulePageRoute({ params, searchParams }: ModulePageRouteProps) {
    const { id } = await params;
    const { module_name } = await searchParams;
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    return (
        <ModulePage
            moduleId={id}
            moduleName={module_name || ""}
            isAuthenticated={token ? true : false}
        />
    );
}
