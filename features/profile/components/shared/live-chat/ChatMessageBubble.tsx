import type { ChatMessage } from "@/features/profile/types/live-chat.types";

function formatTimestamp(date: Date): string {
	return date
		.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})
		.toLowerCase();
}

interface ChatMessageBubbleProps {
	message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
	const isUser = message.sender === "user";

	return (
		<div className={`flex flex-col gap-1 ${isUser ? "items-start" : "items-end"}`}>
			<div
				className={`max-w-[88%] break-words p-2.5 text-[14px] font-bold leading-[160%] sm:max-w-[75%] sm:px-3 sm:py-2.5 md:max-w-[68%] lg:max-w-[60%] ${
					isUser
						? "rounded-tl-[15px] rounded-tr-[15px] rounded-bl-[15px] rounded-br-none bg-brand text-brand-foreground"
						: "rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] rounded-bl-none bg-brand/15 text-brand"
				}`}
			>
				{message.text}
			</div>
			{isUser && message.timestamp && (
				<span
					className="px-1 text-[10px] font-medium leading-[160%] text-muted"
					dir="ltr"
				>
					{formatTimestamp(message.timestamp)}
				</span>
			)}
		</div>
	);
}
