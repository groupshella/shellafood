"use client";

import { MapPin, Building2, Hash, Layers, DoorOpen, Info, Tag } from "lucide-react";
import { Address } from "@/features/addresses/types/address.types";

const BUILDING_TYPE_LABELS: Record<string, string> = {
  apartment: "شقة",
  villa: "فيلا",
  office: "مكتب",
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-[#30913F]/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-sm text-gray-900 font-medium">{value}</span>
      </div>
    </div>
  );
}

export function AddressDetailClient({ address }: { address: Address }) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-8">
      <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
        <DetailRow
          icon={<MapPin className="w-4 h-4 text-[#30913F]" />}
          label="المدينة"
          value={address.city}
        />
        <DetailRow
          icon={<MapPin className="w-4 h-4 text-[#30913F]" />}
          label="المنطقة"
          value={address.region}
        />
        <DetailRow
          icon={<MapPin className="w-4 h-4 text-[#30913F]" />}
          label="اسم الشارع"
          value={address.street_name}
        />
      </div>

      {(address.building_type ||
        address.building_number ||
        address.floor_number ||
        address.apartment_number) && (
        <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
          <DetailRow
            icon={<Building2 className="w-4 h-4 text-[#30913F]" />}
            label="نوع المبنى"
            value={
              address.building_type
                ? BUILDING_TYPE_LABELS[address.building_type] ?? address.building_type
                : undefined
            }
          />
          <DetailRow
            icon={<Hash className="w-4 h-4 text-[#30913F]" />}
            label="رقم المبنى"
            value={address.building_number}
          />
          <DetailRow
            icon={<Layers className="w-4 h-4 text-[#30913F]" />}
            label="رقم الطابق"
            value={address.floor_number}
          />
          <DetailRow
            icon={<DoorOpen className="w-4 h-4 text-[#30913F]" />}
            label="رقم الشقة"
            value={address.apartment_number}
          />
        </div>
      )}

      {address.additional_info && (
        <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
          <DetailRow
            icon={<Info className="w-4 h-4 text-[#30913F]" />}
            label="معلومات إضافية"
            value={address.additional_info}
          />
        </div>
      )}

      <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
        <DetailRow
          icon={<Tag className="w-4 h-4 text-[#30913F]" />}
          label="تسمية العنوان"
          value={address.address_label}
        />
      </div>
    </div>
  );
}
