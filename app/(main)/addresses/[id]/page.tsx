import { Suspense } from "react";
import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import { AddressDetail, skeleton as AddressDetailSkeleton } from "@/features/addresses/components/sections/AddressDetail";
import { getServerLocale } from "@/features/language/getServerLocale";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "تفاصيل العنوان | شيلة فود",
  description: "عرض تفاصيل عنوان التوصيل",
};

export default async function AddressDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getServerLocale()
  const isArabic = locale === "ar";
  return (
    <AddressesShell title={isArabic ? "تفاصيل العنوان" : "Address details"} isArabic={isArabic}>
      <Suspense fallback={<AddressDetailSkeleton />}>
        <AddressDetail id={id} isArabic={isArabic} />
      </Suspense>
    </AddressesShell>
  );
}
