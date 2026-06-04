"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface NumericKeypadProps {
	onPress: (key: string) => void;
	onBackspace: () => void;
}

const keys = [
	[{ main: "1", sub: "" }, { main: "2", sub: "ABC" }, { main: "3", sub: "DEF" }],
	[{ main: "4", sub: "GHI" }, { main: "5", sub: "JKL" }, { main: "6", sub: "MNO" }],
	[{ main: "7", sub: "PQRS" }, { main: "8", sub: "TUV" }, { main: "9", sub: "WXYZ" }],
	[{ main: "+*#", sub: "" }, { main: "0", sub: "" }, { main: "", sub: "", isBackspace: true }],
];

const BackspaceIcon = memo(function BackspaceIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
			<line x1="18" y1="9" x2="12" y2="15" />
			<line x1="12" y1="9" x2="18" y2="15" />
		</svg>
	);
});

const NumericKeypad = memo(function NumericKeypad({ onPress, onBackspace }: NumericKeypadProps) {
	return (
		<div
			dir="ltr"
			className="rounded-t-3xl border-t border-gray-200/50 bg-gray-100/80 p-4 pb-8 backdrop-blur-sm"
		>
			<div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
				{keys.flat().map((key, idx) => (
					<motion.button
						key={idx}
						type="button"
						whileTap={{ scale: 0.92, backgroundColor: "#e5e7eb" }}
						onClick={() => (key.isBackspace ? onBackspace() : onPress(key.main))}
						className={`flex h-14 flex-col items-center justify-center rounded-xl border border-gray-200/80 bg-white text-gray-900 shadow-sm transition-colors active:bg-gray-100 ${key.isBackspace ? "text-gray-500" : ""
							}`}
						aria-label={key.isBackspace ? "مسح" : key.main}
					>
						{key.isBackspace ? (
							<BackspaceIcon />
						) : (
							<>
								<span
									className={`font-semibold ${key.main === "0" ? "text-xl" : "text-lg"}`}
								>
									{key.main}
								</span>
								{key.sub && (
									<span className="-mt-0.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase">
										{key.sub}
									</span>
								)}
							</>
						)}
					</motion.button>
				))}
			</div>
		</div>
	);
});

export default NumericKeypad;
