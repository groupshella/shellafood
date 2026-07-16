"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { addAddress } from "@/features/addresses/actions/add-address";
import { updateAddress } from "@/features/addresses/actions/update-address";
import { Address, PickedLocation } from "@/features/addresses/types/address.types";
import { useNotification } from "@/shared/components/NotificationToast";

const BUILDING_TYPES = [
	{ value: "apartment", label: { ar: "شقة", en: "Apartment" } },
	{ value: "villa", label: { ar: "فيلا", en: "Villa" } },
	{ value: "office", label: { ar: "مكتب", en: "Office" } },
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
	editAddress?: Address;
	isArabic: boolean;
}

const cardClass =
	"flex flex-col gap-3 rounded-2xl border border-border bg-background px-3 py-3.5 shadow-sm sm:gap-4 sm:px-4 sm:py-4 md:px-5";

function FieldLabel({
	text,
	required,
	htmlFor,
	isArabic,
}: {
	text: string;
	required?: boolean;
	htmlFor?: string;
	isArabic: boolean;
}) {
	return (
		<label
			htmlFor={htmlFor}
			className="mb-1.5 block text-xs font-medium text-muted sm:text-sm"
		>
			{text}
			{required && (
				<span className="ms-1 text-red-500" aria-hidden>
					*
				</span>
			)}
			{required && (
				<span className="sr-only">
					{isArabic ? " (مطلوب)" : " (required)"}
				</span>
			)}
		</label>
	);
}

export function AddressFormClient({
	location,
	editAddress,
	isArabic,
}: AddressFormClientProps) {
	const router = useRouter();
	const { success, error: notifyError } = useNotification();
	const [isPending, startTransition] = useTransition();
	const [errors, setErrors] = useState<FieldErrors>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const isEdit = !!editAddress;

	const [form, setForm] = useState({
		city: location.city,
		region: location.region,
		street_name: location.street_name,
		building_type: editAddress?.building_type ?? "",
		building_number: editAddress?.building_number ?? "",
		floor_number: editAddress?.floor_number ?? "",
		apartment_number: editAddress?.apartment_number ?? "",
		additional_info: editAddress?.additional_info ?? "",
		address_label: editAddress?.address_label ?? "",
	});

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
	}

	function handleSubmit() {
		startTransition(async () => {
			setGeneralError(null);
			setErrors({});

			const payload = {
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
			};

			const result = isEdit
				? await updateAddress(editAddress!.id, payload)
				: await addAddress(payload);

			if (result.success) {
				success(
					isEdit
						? isArabic
							? "تم تحديث العنوان"
							: "Address updated"
						: isArabic
							? "تم حفظ العنوان"
							: "Address saved",
				);
				router.push("/addresses");
				router.refresh();
			} else if (result.errors) {
				setErrors(result.errors);
			} else {
				setGeneralError(result.message);
				notifyError(result.message);
			}
		});
	}

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className="mx-auto flex w-full max-w-lg flex-col gap-3 px-3 pb-8 pt-4 sm:max-w-xl sm:gap-4 sm:px-5 sm:pt-5 md:max-w-2xl lg:max-w-3xl lg:gap-5 lg:px-6 lg:pb-10"
		>
			<section
				aria-label={isArabic ? "الموقع" : "Location"}
				className={cardClass}
			>
				<div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
					<div className="flex flex-col">
						<FieldLabel
							text={isArabic ? "المدينة" : "City"}
							required
							htmlFor="city"
							isArabic={isArabic}
						/>
						<input
							id="city"
							name="city"
							value={form.city}
							onChange={handleChange}
							placeholder={isArabic ? "مثال: الرياض" : "e.g. Riyadh"}
							autoComplete="address-level2"
							className={inputClass(!!errors.city)}
							aria-invalid={!!errors.city}
							aria-describedby={errors.city ? "city-error" : undefined}
						/>
						<FieldError id="city-error" messages={errors.city} />
					</div>

					<div className="flex flex-col">
						<FieldLabel
							text={isArabic ? "المنطقة" : "District"}
							required
							htmlFor="region"
							isArabic={isArabic}
						/>
						<input
							id="region"
							name="region"
							value={form.region}
							onChange={handleChange}
							placeholder={isArabic ? "مثال: الملقا" : "e.g. Al Malqa"}
							className={inputClass(!!errors.region)}
							aria-invalid={!!errors.region}
							aria-describedby={errors.region ? "region-error" : undefined}
						/>
						<FieldError id="region-error" messages={errors.region} />
					</div>
				</div>

				<div className="flex flex-col">
					<FieldLabel
						text={isArabic ? "اسم الشارع" : "Street name"}
						required
						htmlFor="street_name"
						isArabic={isArabic}
					/>
					<input
						id="street_name"
						name="street_name"
						value={form.street_name}
						onChange={handleChange}
						placeholder={
							isArabic
								? "مثال: طريق الأمير محمد بن سعد"
								: "e.g. Prince Mohammed Bin Saad Rd"
						}
						autoComplete="street-address"
						className={inputClass(!!errors.street_name)}
						aria-invalid={!!errors.street_name}
						aria-describedby={errors.street_name ? "street_name-error" : undefined}
					/>
					<FieldError id="street_name-error" messages={errors.street_name} />
				</div>
			</section>

			<section
				aria-label={isArabic ? "تفاصيل المبنى" : "Building details"}
				className={cardClass}
			>
				<div className="flex flex-col">
					<FieldLabel
						text={isArabic ? "نوع المبنى" : "Building type"}
						htmlFor="building_type"
						isArabic={isArabic}
					/>
					<select
						id="building_type"
						name="building_type"
						value={form.building_type}
						onChange={handleChange}
						className={inputClass(false)}
					>
						<option value="">
							{isArabic ? "اختر نوع المبنى" : "Select building type"}
						</option>
						{BUILDING_TYPES.map((t) => (
							<option key={t.value} value={t.value}>
								{isArabic ? t.label.ar : t.label.en}
							</option>
						))}
					</select>
				</div>

				<div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
					<div className="flex min-w-0 flex-col">
						<FieldLabel
							text={isArabic ? "رقم المبنى" : "Building no."}
							htmlFor="building_number"
							isArabic={isArabic}
						/>
						<input
							id="building_number"
							name="building_number"
							value={form.building_number}
							onChange={handleChange}
							placeholder="12"
							inputMode="numeric"
							className={`${inputClass(false)} text-center`}
						/>
					</div>
					<div className="flex min-w-0 flex-col">
						<FieldLabel
							text={isArabic ? "رقم الطابق" : "Floor"}
							htmlFor="floor_number"
							isArabic={isArabic}
						/>
						<input
							id="floor_number"
							name="floor_number"
							value={form.floor_number}
							onChange={handleChange}
							placeholder="3"
							inputMode="numeric"
							className={`${inputClass(false)} text-center`}
						/>
					</div>
					<div className="flex min-w-0 flex-col">
						<FieldLabel
							text={isArabic ? "رقم الشقة" : "Apt."}
							htmlFor="apartment_number"
							isArabic={isArabic}
						/>
						<input
							id="apartment_number"
							name="apartment_number"
							value={form.apartment_number}
							onChange={handleChange}
							placeholder="15"
							inputMode="numeric"
							className={`${inputClass(false)} text-center`}
						/>
					</div>
				</div>
			</section>

			<section
				aria-label={isArabic ? "معلومات إضافية" : "Additional info"}
				className={cardClass}
			>
				<FieldLabel
					text={isArabic ? "معلومات إضافية" : "Additional info"}
					htmlFor="additional_info"
					isArabic={isArabic}
				/>
				<textarea
					id="additional_info"
					name="additional_info"
					value={form.additional_info}
					onChange={handleChange}
					placeholder={
						isArabic ? "مثال: بالقرب من المسجد" : "e.g. Near the mosque"
					}
					rows={3}
					className={`${inputClass(false)} resize-none`}
				/>
			</section>

			<section
				aria-label={isArabic ? "تسمية العنوان" : "Address label"}
				className={cardClass}
			>
				<FieldLabel
					text={isArabic ? "تسمية العنوان" : "Address label"}
					required
					htmlFor="address_label"
					isArabic={isArabic}
				/>
				<input
					id="address_label"
					name="address_label"
					value={form.address_label}
					onChange={handleChange}
					placeholder={isArabic ? "مثال: المنزل" : "e.g. Home"}
					className={inputClass(!!errors.address_label)}
					aria-invalid={!!errors.address_label}
					aria-describedby={
						errors.address_label ? "address_label-error" : undefined
					}
				/>
				<FieldError id="address_label-error" messages={errors.address_label} />
			</section>

			{generalError && (
				<div
					role="alert"
					className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center dark:border-red-900/50 dark:bg-red-950/60"
				>
					<p className="text-sm text-red-600 dark:text-red-400">{generalError}</p>
				</div>
			)}

			<button
				type="button"
				onClick={handleSubmit}
				disabled={isPending}
				className="mt-2 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brand text-sm font-semibold text-brand-foreground transition-colors hover:brightness-95 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[56px] lg:ms-auto lg:max-w-md"
			>
				{isPending ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" aria-hidden />
						<span>{isArabic ? "جاري الحفظ..." : "Saving..."}</span>
					</>
				) : isEdit ? (
					isArabic ? "حفظ التعديلات" : "Save changes"
				) : isArabic ? (
					"حفظ العنوان"
				) : (
					"Save address"
				)}
			</button>
		</div>
	);
}

function inputClass(hasError: boolean) {
	return [
		"w-full min-h-[44px] rounded-xl border px-3 py-2.5 text-start text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/30 bg-card sm:min-h-[48px] sm:py-3",
		hasError
			? "border-red-400 bg-red-50/30 dark:border-red-500 dark:bg-red-950/30"
			: "border-border",
	].join(" ");
}

function FieldError({ id, messages }: { id?: string; messages?: string[] }) {
	if (!messages?.length) return null;
	return (
		<p id={id} role="alert" className="mt-1 text-xs text-red-500 dark:text-red-400">
			{messages[0]}
		</p>
	);
}
