import { Suspense } from "react";
import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import { EditAddress, skeleton as EditAddressSkeleton } from "@/features/addresses/components/sections/EditAddress";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "تعديل العنوان | شيلافود",
};

export default async function EditAddressPage({ params }: Props) {
  const { id } = await params;

  return (
    <AddressesShell title="تعديل العنوان">
      <Suspense fallback={<EditAddressSkeleton />}>
        <EditAddress id={id} />
      </Suspense>
    </AddressesShell>
  );
}
