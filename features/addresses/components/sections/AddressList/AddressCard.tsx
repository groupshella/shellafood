import { Trash2, MapPin, Pencil } from "lucide-react";
import { AddressListItem } from "@/features/addresses/types/address.types";

interface AddressCardProps {
  address: AddressListItem;
  showDelete: boolean;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isDeleting?: boolean;
}

export function AddressCard({
  address,
  showDelete,
  onClick,
  onDelete,
  onEdit,
  isDeleting = false,
}: AddressCardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100
        flex items-start justify-between gap-3
        transition-opacity ${isDeleting ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      {/* Content — clickable area */}
      <button
        onClick={onClick}
        className="flex items-start gap-3 flex-1 text-right"
      >
        <div className="mt-0.5 w-9 h-9 rounded-full bg-[#30913F]/10 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 text-[#30913F]" />
        </div>

        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-900 truncate">
            {address.address_label}
          </span>
          <span className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {[address.city, address.region, address.street_name]
              .filter(Boolean)
              .join(" ، ")}
          </span>
        </div>
      </button>

      {/* Action icons */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 rounded-full text-[#30913F] hover:bg-[#30913F]/10 active:bg-[#30913F]/20 transition-colors"
          aria-label={`تعديل عنوان ${address.address_label}`}
          disabled={isDeleting}
        >
          <Pencil className="w-4 h-4" />
        </button>

        {showDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded-full text-red-400 hover:bg-red-50 active:bg-red-100 transition-colors"
            aria-label={`حذف عنوان ${address.address_label}`}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
