import { getAddressDetail } from "@/features/addresses/api/address-detail";
import { EditAddressClient } from "./EditAddressClient";
import EditAddressSkeleton from "./skeleton";

export { EditAddressSkeleton as skeleton };

export async function EditAddress({ id }: { id: string }) {
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

  return <EditAddressClient address={address} />;
}
