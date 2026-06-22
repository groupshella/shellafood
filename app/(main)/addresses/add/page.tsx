import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import { AddAddressClient } from "@/features/addresses/components/sections/AddressForm/AddAddressClient";

export const metadata: Metadata = {
  title: "إضافة عنوان | شيلافود",
};

export default function AddAddressPage() {
  return (
    <AddressesShell title="إضافة عنوان جديد">
      <AddAddressClient />
    </AddressesShell>
  );
}
