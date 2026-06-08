"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface CreateAccountScreenProps {
	phone: string;
	isLoading?: boolean;
	error?: string | null;
	onBack: () => void;
	onCreate: (data: {
		name: string;
		email?: string;
	}) => void;
}

function formatPhone(phone: string) {
	const digits = phone.replace(/\D/g, "");
	const local = digits.slice(0, 9);
	return `${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 9)}`;
}

const CreateAccountScreen = memo(function CreateAccountScreen({
	phone,
	isLoading = false,
	error,
	onBack,
	onCreate,
}: CreateAccountScreenProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [agreed, setAgreed] = useState(false);

	const handleSubmit = useCallback(() => {
		if (!name.trim() || !agreed) return;
		onCreate({
			name: name.trim(),
			...(email.trim() && { email: email.trim() }),
		});
	}, [name, email, agreed, onCreate]);

	const isValid = name.trim().length > 0 && agreed;

	return (
		<div
			dir="rtl"
			lang="ar"
			className="relative flex min-h-dvh w-full flex-col bg-white px-6 pt-16 pb-8"
		>
			<motion.button
				type="button"
				initial={{ opacity: 0, x: 10 }}
				animate={{ opacity: 1, x: 0 }}
				onClick={onBack}
				disabled={isLoading}
				className="absolute top-6 left-3 rounded-full p-2 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-50"
				aria-label="رجوع"
			>
				<ChevronLeft className="h-6 w-6 text-gray-700" />
			</motion.button>

			<div className="mt-10">
				<motion.h1
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="text-[28px] font-bold text-gray-900"
				>
					إنشاء حساب
				</motion.h1>

				<motion.div
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.4 }}
					className="mt-8 space-y-5"
				>
					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							اسم المستخدم <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="ادخل اسم المستخدم"
							disabled={isLoading}
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-right text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#30913F] focus:ring-1 focus:ring-[#30913F] disabled:opacity-50"
							aria-label="اسم المستخدم"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							البريد الالكتروني <span className="text-gray-400">(اختياري)</span>
						</label>

						<input
							type="email"
							inputMode="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="اكتب البريد الالكتروني"
							disabled={isLoading}
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-right text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#30913F] focus:ring-1 focus:ring-[#30913F] disabled:opacity-50"
							aria-label="البريد الالكتروني"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							رقم الهاتف
						</label>
						<div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5">
							<span dir="ltr" className="flex-1 text-left text-lg text-gray-400">
								{formatPhone(phone)}
							</span>
							<div className="mx-3 h-6 w-px bg-gray-300" />
							<span className="text-lg font-medium text-gray-500">966+</span>
						</div>
					</div>



					<motion.label
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="flex cursor-pointer items-center gap-3 pt-2 select-none"
					>
						<input
							type="checkbox"
							checked={agreed}
							onChange={(e) => setAgreed(e.target.checked)}
							disabled={isLoading}
							className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 bg-white text-[#30913F] transition-all focus:ring-2 focus:ring-[#30913F] focus:ring-offset-0 disabled:opacity-50"
						/>
						<span className="text-sm text-gray-600">أوافق على الشروط وسياسة الخصوصية</span>
					</motion.label>
				</motion.div>
			</div>

			<div className="mt-auto pt-8">
				<motion.button
					type="button"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.35 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleSubmit}
					disabled={!isValid || isLoading}
					className="w-full rounded-2xl bg-[#30913F] disabled:bg-[#30913F]/50 py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
				</motion.button>
			</div>
		</div>
	);
});

export default CreateAccountScreen;
