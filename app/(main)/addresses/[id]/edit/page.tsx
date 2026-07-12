import { Suspense } from "react";
import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import { EditAddress, skeleton as EditAddressSkeleton } from "@/features/addresses/components/sections/EditAddress";
import { getServerLocale } from "@/features/language/getServerLocale";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "تعديل العنوان | شيلة فود",
  description: "تعديل بيانات عنوان التوصيل",
};

export default async function EditAddressPage({ params }: Props) {
  const { id } = await params;
  const locale = await getServerLocale()
  const isArabic = locale === "ar";
  return (
    <AddressesShell title={isArabic ? "تعديل العنوان" : "Edit address"} isArabic={isArabic}>
      <Suspense fallback={<EditAddressSkeleton />}>
        <EditAddress id={id} isArabic={isArabic} />
      </Suspense>
    </AddressesShell>
  );
}
