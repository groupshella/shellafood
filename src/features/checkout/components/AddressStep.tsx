'use client';

import { useState } from 'react';
import { MapPin, Bike, ShoppingBag, ChevronLeft } from 'lucide-react';
import type { DeliveryAddress, OrderType } from '../types/checkout.types';

interface AddressStepProps {
	orderType: OrderType;
	address: DeliveryAddress | null;
	onOrderTypeChange: (type: OrderType) => void;
	onAddressChange: (address: DeliveryAddress) => void;
	isLoading: boolean;
	onNext: () => void;
}

export function AddressStep({
	orderType,
	address,
	onOrderTypeChange,
	onAddressChange,
	isLoading,
	onNext,
}: AddressStepProps) {
	const [form, setForm] = useState({
		address: address?.address || '',
		latitude: address?.latitude || '',
		longitude: address?.longitude || '',
		contact_person_name: address?.contact_person_name || '',
		contact_person_number: address?.contact_person_number || '',
		floor: address?.floor || '',
		house: address?.house || '',
	});

	const setField = (key: string, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleNext = () => {
		if (orderType === 'delivery') {
			onAddressChange({
				...form,
				latitude: Number(form.latitude) || 24.5677,
				longitude: Number(form.longitude) || 46.5444,
			});
		}
		onNext();
	};

	const canProceed =
		orderType === 'take_away' ||
		(form.address.trim() && form.contact_person_number.trim());

	return (
		<div className="space-y-4">
			{/* Order type switcher */}
			<div className="bg-white rounded-3xl p-4 shadow-sm">
				<p className="text-xs text-gray-400 font-medium mb-3 text-right">نوع الطلب</p>
				<div className="grid grid-cols-2 gap-2">
					{(['delivery', 'take_away'] as const).map((type) => (
						<button
							key={type}
							onClick={() => onOrderTypeChange(type)}
							className={`flex flex-col items-center gap-2 py-4 rounded-2xl font-medium text-sm transition-all duration-200 ${
								orderType === type
									? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
									: 'bg-gray-50 text-gray-500 hover:bg-gray-100'
							}`}
						>
							{type === 'delivery' ? <Bike size={20} /> : <ShoppingBag size={20} />}
							{type === 'delivery' ? 'توصيل' : 'استلام'}
						</button>
					))}
				</div>
			</div>

			{/* Address form */}
			{orderType === 'delivery' && (
				<div className="bg-white rounded-3xl p-4 shadow-sm space-y-3">
					<div className="flex items-center gap-2 mb-1">
						<MapPin size={16} className="text-emerald-500" />
						<p className="text-sm font-bold text-gray-800">بيانات التوصيل</p>
					</div>

					<Field
						label="العنوان التفصيلي *"
						value={form.address}
						onChange={(v) => setField('address', v)}
						placeholder="الشارع، الحي..."
					/>
					<div className="grid grid-cols-2 gap-2">
						<Field
							label="الدور"
							value={form.floor}
							onChange={(v) => setField('floor', v)}
							placeholder="مثال: 3"
						/>
						<Field
							label="رقم المنزل"
							value={form.house}
							onChange={(v) => setField('house', v)}
							placeholder="مثال: 12"
						/>
					</div>

					<div className="border-t border-gray-50 pt-3">
						<p className="text-xs text-gray-400 font-medium mb-2">بيانات التواصل</p>
						<div className="space-y-2">
							<Field
								label="الاسم"
								value={form.contact_person_name}
								onChange={(v) => setField('contact_person_name', v)}
								placeholder="اسم المستلم"
							/>
							<Field
								label="رقم الجوال *"
								value={form.contact_person_number}
								onChange={(v) => setField('contact_person_number', v)}
								placeholder="05XXXXXXXX"
								type="tel"
							/>
						</div>
					</div>
				</div>
			)}

			{/* Next button */}
			<button
				onClick={handleNext}
				disabled={!canProceed || isLoading}
				className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
			>
				<ChevronLeft size={20} />
				<span>{isLoading ? 'جاري الحساب...' : 'اختيار طريقة الدفع'}</span>
				<span />
			</button>
		</div>
	);
}

function Field({
	label,
	value,
	onChange,
	placeholder,
	type = 'text',
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	type?: string;
}) {
	return (
		<div>
			<label className="text-xs text-gray-400 font-medium block mb-1 text-right">
				{label}
			</label>
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				dir="rtl"
				className="w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all"
			/>
		</div>
	);
}