"use client";

import ModuleTopbar from "./topbar";
import Offers from "./Offers";
import Categories from "./Categories";
import Brands from "./Brands";
import Stores from "./Stores";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ModulePageProps {
    moduleId: string;
    moduleName: string;
    isAuthenticated: boolean;
}

export default function ModulePage({ moduleId, moduleName, isAuthenticated }: ModulePageProps) {
    return (
        <div className="flex min-h-screen flex-col gap-4 pb-6">
            <ModuleTopbar moduleName={moduleName} />
            {!isAuthenticated ? (
                <Link href="/auth" className="flex items-center gap-2 px-2 py-1 font-bold bg-gray-100 rounded-lg w-fit ">
                    <p className="text-sm text-gray-700">انضم إلينا ، واستمتع بخدمات شلة</p>
                    <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
                </Link>
            ) : (
                <Link href="/auth/login" className="flex items-center gap-2 px-2 py-1 font-bold bg-gray-100 rounded-lg w-fit ">
                    <p className="text-sm text-gray-700">ضع عنوانك لتكتشف خدماتنا بسهولة</p>
                    <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
                </Link>
            )}
            <Categories moduleId={moduleId} moduleName={moduleName} />
            <Offers moduleId={moduleId} moduleName={moduleName} />
            <Brands moduleId={moduleId} moduleName={moduleName} />
            <Stores moduleId={moduleId} moduleName={moduleName} />
        </div>
    );
}
