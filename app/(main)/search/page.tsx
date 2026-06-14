import SearchPage from "@/features/search/components/SearchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "البحث | شلة فود",
    description: "ابحث عن منتجات ومتاجر وعلامات تجارية في شلة فود",
};

export default async function SearchRoute({ searchParams }: { searchParams: Promise<{ module_id: string }> }) {
    const { module_id } = await searchParams;
    return <SearchPage moduleId={module_id} />;
}
