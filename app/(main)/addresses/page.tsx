import { Suspense } from "react";
import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import { AddressList, skeleton as AddressListSkeleton } from "@/features/addresses/components/sections/AddressList";
import { getServerLocale } from "@/features/language/getServerLocale";

export const metadata: Metadata = {
  title: "عناوين التوصيل | شيلة فود",
  description: "إدارة عناوين التوصيل المحفوظة",
};

export default async function AddressesPage() {
  const locale = await getServerLocale()
  const isArabic = locale === "ar";
  return (
    <AddressesShell title={isArabic ? "عناوين التوصيل" : "Delivery addresses"} isArabic={isArabic}>
      <Suspense fallback={<AddressListSkeleton />}>
        <AddressList isArabic={isArabic} />
      </Suspense>
    </AddressesShell>
  );
}
