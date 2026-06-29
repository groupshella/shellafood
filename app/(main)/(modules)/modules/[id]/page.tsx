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
import { Banners } from "@/features/hyper-market/StoreDetails/components/sections/Banners";
import { Modules } from "@/features/hyper-market/StoreDetails/components/sections/Modules";
import { AddressTopbarBanner } from "@/features/addresses/components/sections/AddressTopbarBanner";

interface ModulePageRouteProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ module_name?: string }>;
}

export async function generateMetadata({
    params,
    searchParams,
}: ModulePageRouteProps): Promise<Metadata> {
    const { id } = await params;
    const { module_name } = await searchParams;
    const name = module_name || "القسم";

    return {
        title: `${name} | شلة فود`,
        description: `تصفّح المتاجر والعروض والمنتجات المتوفرة ضمن ${name} عبر شلة فود.`,
        alternates: { canonical: `/modules/${id}` },
    };
}

export default async function ModulePageRoute({ params, searchParams }: ModulePageRouteProps) {
    const { id } = await params;
    const { module_name } = await searchParams;
    const moduleName = module_name || "";

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    const isAuthenticated = !!token;

    return (
        <MarketsShell moduleId={id} moduleName={moduleName} isAuthenticated={isAuthenticated}>
            <Suspense
                fallback={
                    <div className="px-4 sm:px-5">
                        <AddressTopbarBanner.skeleton />
                    </div>
                }
            >

                <AddressTopbarBanner isAuthenticated={isAuthenticated} className="px-4 sm:px-5" />

            </Suspense>

            <Suspense fallback={<Modules.skeleton />}>
                <Modules />
            </Suspense>
            <Suspense fallback={<Banners.skeleton />}>
                <Banners />
            </Suspense>
            <Suspense fallback={<Categories.skeleton />}>
                <Categories moduleId={id} moduleName={moduleName} />
            </Suspense>

            <Suspense fallback={<Offers.skeleton />}>
                <Offers moduleId={id} />
            </Suspense>

            {/* <Suspense fallback={<CurrentOffers.skeleton />}>
                <CurrentOffers moduleId={id} />
            </Suspense> */}
            {/* 
            <Suspense fallback={<RecentOrders.skeleton />}>
                <RecentOrders moduleId={id} />
            </Suspense> */}

            <Suspense fallback={<PopularBrands.skeleton />}>
                <PopularBrands moduleId={id} />
            </Suspense>

            <Suspense fallback={<Stores.skeleton />}>
                <Stores moduleId={id} />
            </Suspense>
        </MarketsShell>
    );
}
