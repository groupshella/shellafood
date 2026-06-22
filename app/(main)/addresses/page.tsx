import { Suspense } from "react";
import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import { AddressList, skeleton as AddressListSkeleton } from "@/features/addresses/components/sections/AddressList";

export const metadata: Metadata = {
  title: "عناوين التوصيل | شيلافود",
};

export default function AddressesPage() {
  return (
    <AddressesShell title="عناوين التوصيل">
      <Suspense fallback={<AddressListSkeleton />}>
        <AddressList />
      </Suspense>
    </AddressesShell>
  );
}
