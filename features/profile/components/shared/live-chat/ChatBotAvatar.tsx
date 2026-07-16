import Image from "next/image";

export function ChatBotAvatar({ isArabic }: { isArabic: boolean }) {
	return (
		<div className="flex justify-end">
			<Image
				src="/profile/chat-bot-avatar.png"
				alt={isArabic ? "مساعد شلة" : "Shella assistant"}
				width={106}
				height={93}
				className="h-[93px] w-auto object-contain sm:h-[110px] md:h-[120px]"
				style={{ width: "auto" }}
				priority
			/>
		</div>
	);
}
