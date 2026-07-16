"use client";

import { Send } from "lucide-react";

interface ChatInputBarProps {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	isArabic: boolean;
}

export function ChatInputBar({
	value,
	onChange,
	onSend,
	isArabic,
}: ChatInputBarProps) {
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			onSend();
		}
	};

	return (
		<div className="mx-auto flex min-h-14 w-full max-w-lg items-center gap-2 sm:max-w-2xl sm:gap-3 md:max-w-3xl lg:max-w-4xl">
			<button
				type="button"
				onClick={onSend}
				disabled={!value.trim()}
				aria-label={isArabic ? "إرسال الرسالة" : "Send message"}
				className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand py-3 pe-3 ps-[9px] text-brand-foreground transition-opacity disabled:opacity-40 active:opacity-80 sm:h-[52px] sm:w-[52px]"
			>
				<Send
					className="h-5 w-5 -rotate-45 text-brand-foreground"
					strokeWidth={1.5}
				/>
			</button>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={
					isArabic ? "اكتب رسالتك هنا" : "Type your message here"
				}
				dir={isArabic ? "rtl" : "ltr"}
				className="h-14 min-w-0 flex-1 rounded-xl bg-card px-3 text-[14px] font-bold leading-[160%] text-foreground outline-none placeholder:text-[14px] placeholder:font-bold placeholder:leading-[160%] placeholder:text-muted focus-visible:ring-2 focus-visible:ring-brand/40 sm:px-4 sm:text-[15px]"
			/>
		</div>
	);
}
