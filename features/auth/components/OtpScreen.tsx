"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NumericKeypad from "./NumericKeypad";

interface OtpScreenProps {
	phone: string;
	onBack: () => void;
	onVerify: (code: string) => void;
	onResend: () => void;
}

function formatPhone(phone: string) {
	let digits = phone.replace(/\D/g, "");
	const local = digits.slice(0, 9);
	return `+966 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 9)}`;
}

const OtpScreen = memo(function OtpScreen({ phone, onBack, onVerify, onResend }: OtpScreenProps) {
	const [code, setCode] = useState("");
	const [timer, setTimer] = useState(20);

	useEffect(() => {
		if (timer <= 0) return;
		const t = setInterval(() => setTimer((s) => s - 1), 1000);
		return () => clearInterval(t);
	}, [timer]);

	const handleKeyPress = useCallback((key: string) => {
		setCode((prev) => (prev.length < 6 ? prev + key : prev));
	}, []);

	const handleBackspace = useCallback(() => {
		setCode((prev) => prev.slice(0, -1));
	}, []);

	const formattedPhone = formatPhone(phone);

	return (
		<div dir="rtl" lang="ar" className="relative flex min-h-dvh w-full flex-col bg-white">
			<div className="px-6 pt-16 pb-4">
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

				<motion.h1
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="text-[28px] font-bold text-gray-900"
				>
					ادخل رمز التفعيل
				</motion.h1>

				<motion.p
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.4 }}
					className="mt-3 text-sm leading-relaxed text-gray-500"
				>
					لقد أرسلنا رسالة نصية قصيرة تحتوي على رمز التفعيل إلى هاتفك{" "}
					<span dir="ltr" className="inline-block font-medium text-gray-700">
						{formattedPhone}
					</span>
				</motion.p>

				<motion.div
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="mt-8"
					dir="ltr"
				>
					<div className="flex justify-center gap-2">
						{[0, 1, 2, 3, 4, 5].map((i) => {
							const isActive = i === code.length;
							const isFilled = i < code.length;
							return (
								<div
									key={i}
									className={`flex h-14 w-12 items-center justify-center rounded-xl border-2 text-xl font-semibold transition-all duration-200 ${isActive
										? "border-[#30913F] text-gray-900"
										: isFilled
											? "border-gray-400 text-gray-900"
											: "border-gray-200 text-gray-900"
										}`}
								>
									<AnimatePresence mode="popLayout">
										{isFilled && (
											<motion.span
												key="digit"
												initial={{ scale: 0.5, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												exit={{ scale: 0.5, opacity: 0 }}
											>
												{code[i]}
											</motion.span>
										)}
									</AnimatePresence>
								</div>
							);
						})}
					</div>
				</motion.div>

				<motion.button
					type="button"
					initial={{ y: 15, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => onVerify(code)}
					disabled={code.length !== 6}
					className="mt-8 w-full disabled:cursor-not-allowed disabled:bg-gray-400 rounded-2xl bg-[#30913F] py-4 text-lg font-semibold text-white shadow-lg shadow-[#30913F]/20 transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
				>
					المتابعة
				</motion.button>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="mt-6 text-center"
				>
					{timer > 0 ? (
						<p className="text-sm text-gray-500">
							<span className="text-sm font-semibold text-gray-500">أرسل الرمز مرة أخرى</span>
							{"  "}
							<span className="font-medium text-gray-700">
								00:{timer.toString().padStart(2, "0")}
							</span>
						</p>
					) : (
						<button
							type="button"
							onClick={() => {
								onResend();
								setTimer(20);
							}}
							className="text-sm font-semibold text-[#30913F] transition-colors hover:text-[#2a8036]"
						>
							<span className="text-sm font-semibold text-gray-500">لم تستلم رمزاً؟</span>
							{"  "}
							إعادة الإرسال
						</button>
					)}
				</motion.div>
			</div>

			<div className="mt-auto">
				<NumericKeypad onPress={handleKeyPress} onBackspace={handleBackspace} />
			</div>
		</div>
	);
});

export default OtpScreen;
