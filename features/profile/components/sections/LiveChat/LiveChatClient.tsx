"use client";

import { useEffect, useRef, useState } from "react";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { ChatBotAvatar } from "@/features/profile/components/shared/live-chat/ChatBotAvatar";
import { ChatInputBar } from "@/features/profile/components/shared/live-chat/ChatInputBar";
import { ChatMessageBubble } from "@/features/profile/components/shared/live-chat/ChatMessageBubble";
import { LIVE_CHAT_STRINGS } from "@/features/profile/constants/live-chat.strings";
import type { ChatMessage } from "@/features/profile/types/live-chat.types";

function createInitialMessages(): ChatMessage[] {
    return [
        { id: "bot-1", sender: "bot", text: LIVE_CHAT_STRINGS.greeting1, timestamp: null },
        { id: "bot-2", sender: "bot", text: LIVE_CHAT_STRINGS.greeting2, timestamp: null },
    ];
}

export function LiveChatClient() {
    const [messages, setMessages] = useState<ChatMessage[]>(createInitialMessages);
    const [draft, setDraft] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        const text = draft.trim();
        if (!text) return;

        setMessages((prev) => [
            ...prev,
            {
                id: `user-${Date.now()}`,
                sender: "user",
                text,
                timestamp: new Date(),
            },
        ]);
        setDraft("");
    };

    const botMessages = messages.filter((m) => m.sender === "bot");
    const userMessages = messages.filter((m) => m.sender === "user");

    return (
        <ProfileSubpageShell
            title={LIVE_CHAT_STRINGS.pageTitle}
            elevatedHeader
            showHeaderBorder={false}
            showFooterBorder={false}
            mainClassName="flex flex-col px-0 pb-0 pt-0"
            footerClassName="pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pt-6"
            footer={<ChatInputBar value={draft} onChange={setDraft} onSend={handleSend} />}
        >
            <div className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-end gap-4 px-4 pt-4 sm:max-w-2xl sm:px-5 lg:max-w-3xl">
                <ChatBotAvatar />

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        {botMessages.map((message) => (
                            <ChatMessageBubble key={message.id} message={message} />
                        ))}
                    </div>

                    {userMessages.length > 0 && (
                        <div className="flex flex-col gap-3">
                            {userMessages.map((message) => (
                                <ChatMessageBubble key={message.id} message={message} />
                            ))}
                        </div>
                    )}
                </div>

                <div ref={bottomRef} className="-mt-4 h-0" aria-hidden />
            </div>
        </ProfileSubpageShell>
    );
}
