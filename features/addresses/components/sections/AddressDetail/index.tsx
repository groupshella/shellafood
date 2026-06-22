import { getAddressDetail } from "@/features/addresses/api/address-detail";
import { AddressDetailClient } from "./AddressDetailClient";
import AddressDetailSkeleton from "./skeleton";

export { AddressDetailSkeleton as skeleton };

export async function AddressDetail({ id }: { id: string }) {
  const address = await getAddressDetail(id);

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-16 px-6">
        <p className="text-sm text-gray-500 text-center">
          لم يتم العثور على العنوان
        </p>
      </div>
    );
  }

  return <AddressDetailClient address={address} />;
}
