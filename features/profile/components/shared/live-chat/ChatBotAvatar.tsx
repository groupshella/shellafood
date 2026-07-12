import Image from "next/image";
import { useLanguage } from "@/features/language/useLanguage";

export function ChatBotAvatar() {
    const { isArabic } = useLanguage();

    return (
        <div className="flex justify-end">
            <Image
                src="/profile/chat-bot-avatar.png"
                alt={isArabic ? "مساعد شلة" : "Shella assistant"}
                width={106}
                height={93}
                className="h-[93px] w-auto object-contain"
                style={{ width: "auto" }}
                priority
            />
        </div>
    );
}
