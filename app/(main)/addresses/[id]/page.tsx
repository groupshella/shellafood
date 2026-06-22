import { Suspense } from "react";
import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import { AddressDetail, skeleton as AddressDetailSkeleton } from "@/features/addresses/components/sections/AddressDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "تفاصيل العنوان | شيلافود",
};

export default async function AddressDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <AddressesShell title="تفاصيل العنوان">
      <Suspense fallback={<AddressDetailSkeleton />}>
        <AddressDetail id={id} />
      </Suspense>
    </AddressesShell>
  );
}
