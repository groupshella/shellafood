import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { MarketsShell } from "@/features/markets/components/MarketsShell";
import { Categories } from "@/features/markets/components/sections/Categories";
import { Offers } from "@/features/markets/components/sections/Offers";
import { CurrentOffers } from "@/features/markets/components/sections/CurrentOffers";
import { RecentOrders } from "@/features/markets/components/sections/RecentOrders";
import { PopularBrands } from "@/features/markets/components/sections/PopularBrands";
import { Stores } from "@/features/markets/components/sections/Stores";

const DEFAULT_MODULE_ID = "7";

interface MarketsPageProps {
    searchParams: Promise<{ module_id?: string; module_name?: string }>;
}

export async function generateMetadata({ searchParams }: MarketsPageProps): Promise<Metadata> {
    const { module_name } = await searchParams;
    const name = module_name || "الأسواق";

    return {
        title: `${name} | شلة فود`,
        description: `تصفّح المتاجر والعروض والمنتجات المتوفرة ضمن ${name} عبر شلة فود.`,
        alternates: { canonical: "/markets" },
    };
}

export default async function MarketsPage({ searchParams }: MarketsPageProps) {
    const { module_id, module_name } = await searchParams;
    const moduleId = module_id || DEFAULT_MODULE_ID;
    const moduleName = module_name || "الأسواق";

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    const isAuthenticated = !!token;

    return (
        <MarketsShell moduleId={moduleId} moduleName={moduleName} isAuthenticated={isAuthenticated}>
            <Suspense fallback={<Categories.skeleton />}>
                <Categories moduleId={moduleId} />
            </Suspense>

            <Suspense fallback={<Offers.skeleton />}>
                <Offers moduleId={moduleId} />
            </Suspense>

            <Suspense fallback={<CurrentOffers.skeleton />}>
                <CurrentOffers moduleId={moduleId} />
            </Suspense>

            <Suspense fallback={<RecentOrders.skeleton />}>
                <RecentOrders moduleId={moduleId} />
            </Suspense>

            <Suspense fallback={<PopularBrands.skeleton />}>
                <PopularBrands moduleId={moduleId} />
            </Suspense>

            <Suspense fallback={<Stores.skeleton />}>
                <Stores moduleId={moduleId} />
            </Suspense>
        </MarketsShell>
    );
}
