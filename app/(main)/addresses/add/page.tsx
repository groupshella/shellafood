import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import { AddAddressClient } from "@/features/addresses/components/sections/AddressForm/AddAddressClient";
import { getServerLocale } from "@/features/language/getServerLocale";

export const metadata: Metadata = {
  title: "إضافة عنوان | شيلة فود",
  description: "أضف عنوان توصيل جديداً على الخريطة",
};

export default async function AddAddressPage() {
  const locale = await getServerLocale()
  const isArabic = locale === "ar";
  return (
    <AddressesShell title={isArabic ? "إضافة عنوان جديد" : "Add new address"} isArabic={isArabic}>
      <AddAddressClient isArabic={isArabic} />
    </AddressesShell>
  );
}
