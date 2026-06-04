"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CreateAccountScreenProps {
	onBack: () => void;
	onCreate: (data: {
		username: string;
		email: string;
		phone: string;
		agreed: boolean;
	}) => void;
}

const CreateAccountScreen = memo(function CreateAccountScreen({
	onBack,
	onCreate,
}: CreateAccountScreenProps) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [agreed, setAgreed] = useState(false);

	const handleSubmit = useCallback(() => {
		if (!username.trim() || !email.trim() || phone.length < 9 || !agreed) return;
		onCreate({ username, email, phone, agreed });
	}, [username, email, phone, agreed, onCreate]);

	const isValid =
		username.trim().length > 0 && email.trim().length > 0 && phone.length >= 9 && agreed;

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
				className="absolute top-6 left-3 rounded-full p-2 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
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
							اسم المستخدم
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="ادخل اسم المستخدم"
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-right text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
							aria-label="اسم المستخدم"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							البريد الالكتروني
						</label>
						<input
							type="email"
							inputMode="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="اكتب البريد الالكتروني"
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-right text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
							aria-label="البريد الالكتروني"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-900">
							رقم الهاتف
						</label>
						<div className="flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
							<input
								type="tel"
								inputMode="numeric"
								value={phone}
								onChange={(e) =>
									setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
								}
								placeholder="00 000 0000"
								className="flex-1 bg-transparent text-left text-lg text-gray-900 outline-none placeholder:text-gray-400"
								aria-label="رقم الهاتف"
							/>
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
							className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 bg-white text-[#30913F] transition-all focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
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
					disabled={!isValid}
					className="w-full rounded-2xl bg-[#30913F] disabled:bg-[#30913F]/50 py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					إنشاء حساب
				</motion.button>
			</div>
		</div>
	);
});

export default CreateAccountScreen;
