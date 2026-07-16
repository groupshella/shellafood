"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface NumericKeypadProps {
	isArabic: boolean;
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

const NumericKeypad = memo(function NumericKeypad({
	isArabic,
	onPress,
	onBackspace,
}: NumericKeypadProps) {
	return (
		<div
			dir="ltr"
			className="rounded-t-3xl border-t border-border bg-card/90 p-4 pb-8 backdrop-blur-sm md:p-5 md:pb-10"
		>
			<div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-3 md:max-w-md md:gap-4 lg:max-w-lg">
				{keys.flat().map((key, idx) => (
					<motion.button
						key={idx}
						type="button"
						whileTap={{ scale: 0.92 }}
						onClick={() => (key.isBackspace ? onBackspace() : onPress(key.main))}
						className={[
							"flex h-14 flex-col items-center justify-center rounded-xl border md:h-16",
							"border-[#C6C8CE] bg-background text-foreground shadow-sm",
							"transition-colors active:bg-card",
							"focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-background",
							key.isBackspace ? "text-muted" : "",
						]
							.filter(Boolean)
							.join(" ")}
						aria-label={
							key.isBackspace
								? isArabic
									? "مسح"
									: "Backspace"
								: key.main
						}
					>
						{key.isBackspace ? (
							<BackspaceIcon />
						) : (
							<>
								<span
									className={`font-semibold leading-tight ${key.main === "0" ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}
								>
									{key.main}
								</span>
								{key.sub && (
									<span className="mt-0.5 text-[9px] font-bold tracking-wider text-muted uppercase md:text-[10px]">
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
