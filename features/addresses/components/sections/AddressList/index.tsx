import { getAddresses } from "@/features/addresses/api/addresses";
import { AddressListClient } from "./AddressListClient";
import AddressListSkeleton from "./skeleton";

export { AddressListSkeleton as skeleton };

export async function AddressList() {
  const addresses = await getAddresses();

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        </div>
        <p className="text-sm text-gray-500 text-center">
          لا توجد عناوين محفوظة
        </p>
        <a
          href="/addresses/add"
          className="bg-[#30913F] text-white text-sm font-semibold rounded-2xl px-8 py-3"
        >
          أضف عنوانك الأول
        </a>
      </div>
    );
  }

  return <AddressListClient addresses={addresses} />;
}
