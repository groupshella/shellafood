import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
            <Topbar moduleName={moduleName} moduleId={moduleId} />

            {!isAuthenticated ? (
                <Link
                    href="/auth"
                    className="mx-4 flex w-fit items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 font-bold"
                >
                    <p className="text-sm text-gray-700">انضم إلينا ، واستمتع بخدمات شلة</p>
                    <ArrowLeft className="h-5 w-5 text-gray-700" strokeWidth={1.8} />
                </Link>
            ) : (
                <Link
                    href="/auth/login"
                    className="mx-4 flex w-fit items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 font-bold"
                >
                    <p className="text-sm text-gray-700">ضع عنوانك لتكتشف خدماتنا بسهولة</p>
                    <ArrowLeft className="h-5 w-5 text-gray-700" strokeWidth={1.8} />
                </Link>
            )}

            {children}
        </div>
    );
}
