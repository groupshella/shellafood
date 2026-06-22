"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { addAddress } from "@/features/addresses/actions/add-address";
import { PickedLocation } from "@/features/addresses/types/address.types";

const BUILDING_TYPES = [
  { value: "apartment", label: "شقة" },
  { value: "villa", label: "فيلا" },
  { value: "office", label: "مكتب" },
];

interface FieldErrors {
  city?: string[];
  region?: string[];
  street_name?: string[];
  address_label?: string[];
  [key: string]: string[] | undefined;
}

interface AddressFormClientProps {
  location: PickedLocation;
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="text-xs font-medium text-gray-600 mb-1.5 block">
      {text}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
  );
}

export function AddressFormClient({ location }: AddressFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [form, setForm] = useState({
    city: location.city,
    region: location.region,
    street_name: location.street_name,
    building_type: "",
    building_number: "",
    floor_number: "",
    apartment_number: "",
    additional_info: "",
    address_label: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit() {
    startTransition(async () => {
      setGeneralError(null);
      setErrors({});

      const result = await addAddress({
        latitude: location.lat,
        longitude: location.lng,
        city: form.city,
        region: form.region,
        street_name: form.street_name,
        address_label: form.address_label,
        building_type: form.building_type || undefined,
        building_number: form.building_number || undefined,
        floor_number: form.floor_number || undefined,
        apartment_number: form.apartment_number || undefined,
        additional_info: form.additional_info || undefined,
      });

      if (result.success) {
        router.push("/addresses");
        router.refresh();
      } else if (result.errors) {
        setErrors(result.errors);
      } else {
        setGeneralError(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-8">
      <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col">
          <FieldLabel text="المدينة" required />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="مثال: الرياض"
            className={inputClass(!!errors.city)}
          />
          <FieldError messages={errors.city} />
        </div>

        <div className="flex flex-col">
          <FieldLabel text="المنطقة" required />
          <input
            name="region"
            value={form.region}
            onChange={handleChange}
            placeholder="مثال: الملقا"
            className={inputClass(!!errors.region)}
          />
          <FieldError messages={errors.region} />
        </div>

        <div className="flex flex-col">
          <FieldLabel text="اسم الشارع" required />
          <input
            name="street_name"
            value={form.street_name}
            onChange={handleChange}
            placeholder="مثال: طريق الأمير محمد بن سعد"
            className={inputClass(!!errors.street_name)}
          />
          <FieldError messages={errors.street_name} />
        </div>
      </div>

      <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col">
          <FieldLabel text="نوع المبنى" />
          <select
            name="building_type"
            value={form.building_type}
            onChange={handleChange}
            className={inputClass(false)}
          >
            <option value="">اختر نوع المبنى</option>
            {BUILDING_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col">
            <FieldLabel text="رقم المبنى" />
            <input
              name="building_number"
              value={form.building_number}
              onChange={handleChange}
              placeholder="12"
              className={inputClass(false) + " text-center"}
            />
          </div>
          <div className="flex flex-col">
            <FieldLabel text="رقم الطابق" />
            <input
              name="floor_number"
              value={form.floor_number}
              onChange={handleChange}
              placeholder="3"
              className={inputClass(false) + " text-center"}
            />
          </div>
          <div className="flex flex-col">
            <FieldLabel text="رقم الشقة" />
            <input
              name="apartment_number"
              value={form.apartment_number}
              onChange={handleChange}
              placeholder="15"
              className={inputClass(false) + " text-center"}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100">
        <FieldLabel text="معلومات إضافية" />
        <textarea
          name="additional_info"
          value={form.additional_info}
          onChange={handleChange}
          placeholder="مثال: بالقرب من المسجد"
          rows={3}
          className={inputClass(false) + " resize-none"}
        />
      </div>

      <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100">
        <FieldLabel text="تسمية العنوان" required />
        <input
          name="address_label"
          value={form.address_label}
          onChange={handleChange}
          placeholder="مثال: المنزل"
          className={inputClass(!!errors.address_label)}
        />
        <FieldError messages={errors.address_label} />
      </div>

      {generalError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-center">
          <p className="text-sm text-red-600">{generalError}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="
          w-full bg-[#30913F] text-white text-sm font-semibold
          rounded-2xl py-4 flex items-center justify-center gap-2
          active:bg-[#267332] transition-colors mt-2
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري الحفظ...</span>
          </>
        ) : (
          "حفظ العنوان"
        )}
      </button>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `
    w-full bg-gray-50 border rounded-xl px-3 py-3 text-sm text-right
    text-gray-900 placeholder:text-gray-400
    outline-none focus:ring-2 focus:ring-[#30913F]/30 focus:border-[#30913F]
    transition-colors
    ${hasError ? "border-red-400 bg-red-50/30" : "border-gray-200"}
  `;
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-xs text-red-500 mt-1">{messages[0]}</p>;
}
