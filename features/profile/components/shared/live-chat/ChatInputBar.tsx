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
        <div className="flex h-14 items-center gap-2">
            <button
                type="button"
                onClick={onSend}
                disabled={!value.trim()}
                aria-label={LIVE_CHAT_STRINGS.sendAriaLabel}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#30913F] ps-[9px] pe-3 py-3 text-white transition-opacity disabled:opacity-40 active:opacity-80"
            >
                <Send className="h-5 w-5 -rotate-45 text-white" strokeWidth={1.5} />
            </button>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={LIVE_CHAT_STRINGS.inputPlaceholder}
                className="h-14 min-w-0 flex-1 rounded-xl bg-[#F6F5F8] px-3 text-[14px] font-bold leading-[160%] text-[#111B18] outline-none placeholder:text-[14px] placeholder:font-bold placeholder:leading-[160%] placeholder:text-[#555555]"
            />
        </div>
    );
}
