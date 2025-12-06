"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/providers";
import { 
	Send, 
	Paperclip, 
	Smile, 
	Phone, 
	Video, 
	MoreVertical,
	FileText
} from "lucide-react";
import type { Message } from "../../types/worker.types";
import { useWorkerProfile } from "../../hooks/useWorkerProfile";
import { useWorkerChat } from "../../hooks/useWorkerChat";
import { formatTime, getStatusIcon } from "../../lib/utils/chat.utils";

interface ChatInterfaceProps {
	workerId: string;
}

/**
 * Chat Interface Component
 * Comprehensive chat interface with RTL/LTR support and responsive design
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({ workerId }) => {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Get worker data from hook
	const { worker, isLoading: isLoadingWorker } = useWorkerProfile(workerId);

	// Get chat functionality from hook
	const {
		messages,
		newMessage,
		setNewMessage,
		isTyping,
		isSending,
		handleSend,
		handleKeyPress,
		messagesEndRef,
	} = useWorkerChat(workerId);

	// Loading state
	if (isLoadingWorker || !worker) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-[#31A342] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">
						{isArabic ? "جاري التحميل..." : "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	const workerName = isArabic 
		? (worker.nameAr || worker.name || "Worker") 
		: (worker.name || worker.nameAr || "Worker");
	const workerStatus = worker.online 
		? (isArabic ? "متاح الآن" : "Available Now")
		: worker.lastSeen 
		? (isArabic ? `آخر ظهور ${worker.lastSeen.toLocaleTimeString(isArabic ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" })}` : `Last seen ${worker.lastSeen.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`)
		: (isArabic ? "آخر ظهور منذ دقيقتين" : "Last seen 2 minutes ago");
	const workerResponseTime = isArabic 
		? `متوسط وقت الاستجابة: ${worker.responseTime || "5 دقائق"}` 
		: `Average response time: ${worker.responseTime || "5 minutes"}`;

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// For file uploads, we can add the file name to the message
			// In a real implementation, you would upload the file first and then send a message
			const fileMessage = isArabic ? `تم إرسال الملف: ${file.name}` : `File sent: ${file.name}`;
			setNewMessage(fileMessage);
			// Optionally trigger send automatically for files
			// handleSend();
		}
	};

	return (
		<div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			{/* Header */}
			<div className="relative bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200/80 dark:border-gray-700/80 overflow-hidden sticky top-0 z-10">
				{/* Decorative background elements */}
				<div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-emerald-50/20 dark:from-green-900/10 dark:via-transparent dark:to-emerald-900/10"></div>
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#31A342]/20 to-transparent"></div>
				
				<div className="relative px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between py-5 sm:py-6">
						<div className="flex items-center gap-3 sm:gap-4">
							<div className="relative">
							<Image
								src={worker.avatar}
								alt={workerName}
								width={48}
								height={48}
								className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-[#31A342]/20 dark:ring-[#31A342]/30 shadow-md"
							/>
								<div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
							</div>
							<div>
								<h1 className={`text-lg sm:text-xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight ${isArabic ? "text-right" : "text-left"}`}>
									{workerName}
								</h1>
								<div className="flex items-center gap-2 mt-0.5">
									{worker.online && (
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
									)}
									<p className={`text-sm font-medium text-[#31A342] dark:text-green-400 ${isArabic ? "text-right" : "text-left"}`}>
										{workerStatus}
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-1.5 sm:gap-2">
							<button 
								className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation group"
								aria-label={isArabic ? "اتصال" : "Call"}
							>
								<Phone className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-[#31A342] dark:group-hover:text-green-400 transition-colors" />
							</button>
							<button 
								className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation group"
								aria-label={isArabic ? "فيديو" : "Video"}
							>
								<Video className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-[#31A342] dark:group-hover:text-green-400 transition-colors" />
							</button>
							<button 
								className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation group"
								aria-label={isArabic ? "المزيد" : "More"}
							>
								<MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-[#31A342] dark:group-hover:text-green-400 transition-colors" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Chat Container */}
			<div className="flex flex-col h-[calc(100vh-80px)]">
				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="max-w-4xl mx-auto">
						{/* Service Info Banner */}
						<div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between">
								<div className={`${isArabic ? "text-right" : "text-left"}`}>
									<p className="text-sm text-gray-600 dark:text-gray-400">{workerResponseTime}</p>
								</div>
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<div
											key={i}
											className={`w-4 h-4 ${
												i < Math.floor(worker.rating)
													? "text-yellow-400"
													: "text-gray-300"
											}`}
										>
											★
										</div>
									))}
									<span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{worker.rating}</span>
								</div>
							</div>
						</div>

						{/* Messages */}
						<div className="space-y-4">
							{messages.map((msg) => (
								<div
									key={msg.id}
									className={`flex ${msg.sender === 'user' ? (isArabic ? "justify-start" : "justify-end") : (isArabic ? "justify-end" : "justify-start")}`}
								>
									<div className={`flex items-end gap-2 max-w-xs sm:max-w-md ${msg.sender === 'user' ? (isArabic ? "flex-row-reverse" : "flex-row") : (isArabic ? "flex-row-reverse" : "flex-row")}`}>
										{msg.sender === 'worker' && (
											<Image
												src={worker.avatar}
												alt={workerName}
												width={32}
												height={32}
												className="w-8 h-8 rounded-full object-cover flex-shrink-0"
											/>
										)}
										<div className={`${msg.sender === 'user' ? "bg-[#31A342] dark:bg-green-600" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"} rounded-2xl px-4 py-2 shadow-sm`}>
											{msg.type === 'text' && (
												<p className={`text-sm ${msg.sender === 'user' ? "text-white" : "text-gray-900 dark:text-gray-100"} ${isArabic ? "text-right" : "text-left"}`}>
													{msg.text}
												</p>
											)}
											{msg.type === 'file' && (
												<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
													<FileText className={`w-4 h-4 ${msg.sender === 'user' ? "text-white" : "text-gray-600 dark:text-gray-400"}`} />
													<span className={`text-sm ${msg.sender === 'user' ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
														{msg.fileName}
													</span>
												</div>
											)}
											<div className={`flex items-center gap-1 mt-1 ${isArabic ? "justify-end" : "justify-start"}`}>
												<span className={`text-xs ${msg.sender === 'user' ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
													{formatTime(msg.timestamp, isArabic)}
												</span>
												{msg.sender === 'user' && getStatusIcon(msg.status)}
											</div>
										</div>
									</div>
								</div>
							))}

							{/* Typing Indicator */}
							{isTyping && (
								<div className={`flex ${isArabic ? "justify-end" : "justify-start"}`}>
									<div className={`flex items-end gap-2 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
										<Image
											src={worker.avatar}
											alt={workerName}
											width={32}
											height={32}
											className="w-8 h-8 rounded-full object-cover flex-shrink-0"
										/>
										<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 shadow-sm">
											<div className="flex items-center gap-1">
												<div className="flex gap-1">
													<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
													<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
													<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
												</div>
												<span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
													{isArabic ? "يكتب..." : "typing..."}
												</span>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
						<div ref={messagesEndRef} />
					</div>
				</div>

				{/* Message Input */}
				<div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
					<div className="max-w-4xl mx-auto">
						<div className="flex items-end gap-3">
							{/* File Upload Button */}
							<button
								onClick={() => fileInputRef.current?.click()}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
							>
								<Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>
							<input
								ref={fileInputRef}
								type="file"
								className="hidden"
								onChange={handleFileUpload}
								accept="image/*,.pdf,.doc,.docx"
							/>

							{/* Message Input */}
							<div className="flex-1 relative">
								<textarea
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder={isArabic ? "اكتب رسالتك..." : "Type your message..."}
									className={`w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl resize-none focus:ring-2 focus:ring-[#31A342] dark:focus:ring-green-500 focus:border-transparent ${isArabic ? "text-right" : "text-left"}`}
									rows={1}
									style={{ minHeight: '48px', maxHeight: '120px' }}
									disabled={isSending}
								/>
								<button className="absolute top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200" style={{ [isArabic ? 'left' : 'right']: '8px' }}>
									<Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
								</button>
							</div>

							{/* Send Button */}
							<button
								onClick={handleSend}
								disabled={!newMessage.trim() || isSending}
								className="p-3 bg-[#31A342] hover:bg-[#2a8f3a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200 flex-shrink-0"
							>
								{isSending ? (
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								) : (
									<Send className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInterface;
