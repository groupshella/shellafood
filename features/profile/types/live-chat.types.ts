export type ChatSender = "bot" | "user";

export interface ChatMessage {
    id: string;
    sender: ChatSender;
    text: string;
    timestamp: Date | null;
}
