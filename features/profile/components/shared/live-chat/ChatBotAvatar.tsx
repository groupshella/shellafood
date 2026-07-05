import Image from "next/image";
import { LIVE_CHAT_STRINGS } from "@/features/profile/constants/live-chat.strings";

export function ChatBotAvatar() {
    return (
        <div className="flex justify-end">
            <Image
                src="/profile/chat-bot-avatar.png"
                alt={LIVE_CHAT_STRINGS.botAvatarAlt}
                width={106}
                height={93}
                className="h-[93px] w-auto object-contain"
                style={{ width: "auto" }}
                priority
            />
        </div>
    );
}
