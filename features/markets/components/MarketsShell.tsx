import { Topbar } from "./Topbar";

export function MarketsShell({
    children,
    moduleId,
    moduleName,
    isAuthenticated,
}: {
    children: React.ReactNode;
    moduleId: string;
    moduleName: string;
    isAuthenticated: boolean;
}) {
    return (
        <div
            className="mx-auto flex min-h-screen w-full max-w-lg flex-col gap-4 pb-6 sm:max-w-2xl lg:max-w-4xl"
            dir="rtl"
        >
            <Topbar moduleName={moduleName} moduleId={moduleId} isAuthenticated={isAuthenticated} />

            {children}
        </div>
    );
}
