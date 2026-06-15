import StorePage from "@/features/store/components/StorePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "المتجر | شلة فود",
    description: "تصفح منتجات المتجر والتصنيفات",
};

interface StorePageRouteProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ module_id?: string }>;
}

export default async function StorePageRoute({ params, searchParams }: StorePageRouteProps) {
    const { id } = await params;
    const { module_id } = await searchParams;

    return <StorePage storeId={id} moduleId={module_id} />;
}
