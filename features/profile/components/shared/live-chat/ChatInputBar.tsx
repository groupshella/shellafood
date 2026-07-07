"use client";

import { Send } from "lucide-react";
import { LIVE_CHAT_STRINGS } from "@/features/profile/constants/live-chat.strings";

interface ChatInputBarProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
}

export function ChatInputBar({ value, onChange, onSend }: ChatInputBarProps) {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
        }
    };

    return (
        <div className="mx-auto flex min-h-14 w-full max-w-lg items-center gap-2 sm:max-w-2xl sm:gap-3 lg:max-w-3xl">
            <button
                type="button"
                onClick={onSend}
                disabled={!value.trim()}
                aria-label={LIVE_CHAT_STRINGS.sendAriaLabel}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#30913F] py-3 pe-3 ps-[9px] text-white transition-opacity disabled:opacity-40 active:opacity-80 dark:disabled:opacity-30 sm:h-[52px] sm:w-[52px]"
            >
                <Send className="h-5 w-5 -rotate-45 text-white" strokeWidth={1.5} />
            </button>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={LIVE_CHAT_STRINGS.inputPlaceholder}
                className="h-14 min-w-0 flex-1 rounded-xl bg-[#F6F5F8] px-3 text-[14px] font-bold leading-[160%] text-[#111B18] outline-none placeholder:text-[14px] placeholder:font-bold placeholder:leading-[160%] placeholder:text-[#555555] focus-visible:ring-2 focus-visible:ring-[#30913F]/40 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 sm:px-4 sm:text-[15px]"
            />
        </div>
    );
}
