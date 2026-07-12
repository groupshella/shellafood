"use client";

import { MapPin, Building2, Hash, Layers, DoorOpen, Info, Tag } from "lucide-react";
import { Address } from "@/features/addresses/types/address.types";

const BUILDING_TYPE_LABELS: Record<string, { ar: string; en: string }> = {
	apartment: { ar: "شقة", en: "Apartment" },
	villa: { ar: "فيلا", en: "Villa" },
	office: { ar: "مكتب", en: "Office" },
};

interface DetailRowProps {
	icon: React.ReactNode;
	label: string;
	value?: string;
}

const cardClass =
	"rounded-2xl border border-gray-100 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:px-4 md:px-5";

function DetailRow({ icon, label, value }: DetailRowProps) {
	if (!value) return null;
	return (
		<div className="flex items-start gap-2.5 border-b border-gray-50 py-3 last:border-0 dark:border-gray-700/60 sm:gap-3">
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#30913F]/10 dark:bg-[#30913F]/20 sm:h-10 sm:w-10">
				{icon}
			</div>
			<div className="flex min-w-0 flex-col gap-0.5">
				<span className="text-xs text-gray-400 dark:text-gray-500 sm:text-[13px]">{label}</span>
				<span className="break-words text-sm font-medium text-gray-900 dark:text-gray-100 sm:text-base">{value}</span>
			</div>
		</div>
	);
}

export function AddressDetailClient({ address, isArabic }: { address: Address, isArabic: boolean }) {
	const iconClass = "h-4 w-4 text-[#30913F] dark:text-[#3da84f]";

	const hasBuildingDetails =
		address.building_type ||
		address.building_number ||
		address.floor_number ||
		address.apartment_number;

	return (
		<div className="flex flex-col gap-3 px-3 pb-8 pt-4 sm:gap-4 sm:px-5 sm:pt-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:px-6 lg:pb-10 xl:gap-6">
			<section aria-label={isArabic ? "الموقع" : "Location"} className={cardClass} dir={isArabic ? "rtl" : "ltr"}>
				<DetailRow
					icon={<MapPin className={iconClass} aria-hidden />}
					label={isArabic ? "المدينة" : "City"}
					value={address.city}
				/>
				<DetailRow
					icon={<MapPin className={iconClass} aria-hidden />}
					label={isArabic ? "المنطقة" : "District"}
					value={address.region}
				/>
				<DetailRow
					icon={<MapPin className={iconClass} aria-hidden />}
					label={isArabic ? "اسم الشارع" : "Street name"}
					value={address.street_name}
				/>
			</section>

			<div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
				{hasBuildingDetails && (
					<section aria-label={isArabic ? "تفاصيل المبنى" : "Building details"} className={cardClass}>
						<DetailRow
							icon={<Building2 className={iconClass} aria-hidden />}
							label={isArabic ? "نوع المبنى" : "Building type"}
							value={
								address.building_type
									? BUILDING_TYPE_LABELS[address.building_type]
										? isArabic
											? BUILDING_TYPE_LABELS[address.building_type].ar
											: BUILDING_TYPE_LABELS[address.building_type].en
										: address.building_type
									: undefined
							}
						/>
						<DetailRow
							icon={<Hash className={iconClass} aria-hidden />}
							label={isArabic ? "رقم المبنى" : "Building number"}
							value={address.building_number}
						/>
						<DetailRow
							icon={<Layers className={iconClass} aria-hidden />}
							label={isArabic ? "رقم الطابق" : "Floor number"}
							value={address.floor_number}
						/>
						<DetailRow
							icon={<DoorOpen className={iconClass} aria-hidden />}
							label={isArabic ? "رقم الشقة" : "Apartment number"}
							value={address.apartment_number}
						/>
					</section>
				)}

				{address.additional_info && (
					<section aria-label={isArabic ? "معلومات إضافية" : "Additional info"} className={cardClass}>
						<DetailRow
							icon={<Info className={iconClass} aria-hidden />}
							label={isArabic ? "معلومات إضافية" : "Additional info"}
							value={address.additional_info}
						/>
					</section>
				)}

				<section aria-label={isArabic ? "تسمية العنوان" : "Address label"} className={cardClass}>
					<DetailRow
						icon={<Tag className={iconClass} aria-hidden />}
						label={isArabic ? "تسمية العنوان" : "Address label"}
						value={address.address_label}
					/>
				</section>
			</div>
		</div>
	);
}
