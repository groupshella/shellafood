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
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
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
			className="rounded-t-3xl border-t border-gray-200/60 bg-gray-100/90 p-4 pb-8 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/95"
		>
			<div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
				{keys.flat().map((key, idx) => (
					<motion.button
						key={idx}
						type="button"
						whileTap={{ scale: 0.92 }}
						onClick={() => (key.isBackspace ? onBackspace() : onPress(key.main))}
						className={[
							"flex h-14 flex-col items-center justify-center rounded-xl border",
							"bg-white text-gray-900 shadow-sm",
							"border-gray-200/80 transition-colors",
							"active:bg-gray-100",
							"focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1",
							"dark:border-gray-600/60 dark:bg-gray-700 dark:text-gray-100 dark:active:bg-gray-600",
							"dark:focus-visible:ring-offset-gray-800",
							key.isBackspace ? "text-gray-500 dark:text-gray-400" : "",
						]
							.filter(Boolean)
							.join(" ")}
						aria-label={key.isBackspace ? "مسح" : key.main}
					>
						{key.isBackspace ? (
							<BackspaceIcon />
						) : (
							<>
								<span
									className={`font-semibold leading-tight ${key.main === "0" ? "text-xl" : "text-lg"}`}
								>
									{key.main}
								</span>
								{key.sub && (
									<span className="mt-0.5 text-[9px] font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
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
