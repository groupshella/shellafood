"use client";

/**
 * Hook for driver chat functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/providers';
import { sendChatMessage, getChatMessages } from '../api/driver.api';
import type { Message } from '../types/driver.types';

export interface UseDriverChatReturn {
	messages: Message[];
	newMessage: string;
	setNewMessage: (message: string) => void;
	isTyping: boolean;
	isSending: boolean;
	handleSend: () => void;
	handleKeyPress: (e: React.KeyboardEvent) => void;
	messagesEndRef: React.RefObject<HTMLDivElement>;
	scrollToBottom: () => void;
}

/**
 * Hook to manage driver chat messages and interactions
 */
export function useDriverChat(driverId: string): UseDriverChatReturn {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			senderId: driverId,
			text: isArabic
				? "مرحباً! أنا جاهز لتوصيل طلبك. كيف يمكنني مساعدتك؟"
				: "Hello! I'm ready to deliver your order. How can I help you?",
			timestamp: new Date(Date.now() - 10000),
			status: "read",
		},
	]);

	const [newMessage, setNewMessage] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [isSending, setIsSending] = useState(false);

	// Auto scroll to bottom
	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	// Mock typing indicator
	useEffect(() => {
		if (isTyping) {
			const timer = setTimeout(() => setIsTyping(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [isTyping]);

	// Load chat messages on mount
	useEffect(() => {
		const loadMessages = async () => {
			try {
				const result = await getChatMessages(driverId, language);
				if (result.data && result.data.length > 0) {
					setMessages(result.data);
				}
			} catch (error) {
				console.error('Error loading chat messages:', error);
				// Keep default welcome message if API fails
			}
		};

		loadMessages();
	}, [driverId, language]);

	const handleSend = useCallback(async () => {
		if (!newMessage.trim() || isSending) return;

		const messageText = newMessage.trim();
		setNewMessage("");
		setIsSending(true);

		const message: Message = {
			id: Date.now().toString(),
			senderId: "me",
			text: messageText,
			timestamp: new Date(),
			status: "sent",
		};

		setMessages((prev) => [...prev, message]);

		try {
			// Send message via API
			const result = await sendChatMessage(driverId, messageText, language);
			
			if (result.data) {
				// Update message status to delivered
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === message.id ? { ...msg, status: "delivered" } : msg
					)
				);

				// Simulate driver typing
				setTimeout(() => setIsTyping(true), 1000);

				// Simulate driver response (or use real response from API)
				setTimeout(() => {
					setIsTyping(false);
					const response: Message = {
						id: (Date.now() + 1).toString(),
						senderId: driverId,
						text: result.data?.response || (isArabic
							? "فهمت! سأكون هناك في الوقت المحدد."
							: "Got it! I'll be there on time."),
						timestamp: new Date(),
						status: "delivered",
					};
					setMessages((prev) => [...prev, response]);

					// Update message status to read
					setTimeout(() => {
						setMessages((prev) =>
							prev.map((msg) =>
								msg.id === message.id ? { ...msg, status: "read" } : msg
							)
						);
					}, 1000);
				}, 3000);
			} else {
				// If API fails, still simulate the flow for demo
				setTimeout(() => {
					setMessages((prev) =>
						prev.map((msg) =>
							msg.id === message.id ? { ...msg, status: "delivered" } : msg
						)
					);
				}, 1000);

				setTimeout(() => setIsTyping(true), 1000);

				setTimeout(() => {
					setIsTyping(false);
					const response: Message = {
						id: (Date.now() + 1).toString(),
						senderId: driverId,
						text: isArabic
							? "فهمت! سأكون هناك في الوقت المحدد."
							: "Got it! I'll be there on time.",
						timestamp: new Date(),
						status: "delivered",
					};
					setMessages((prev) => [...prev, response]);
				}, 3000);

				setTimeout(() => {
					setMessages((prev) =>
						prev.map((msg) =>
							msg.id === message.id ? { ...msg, status: "read" } : msg
						)
					);
				}, 2000);
			}
		} catch (error) {
			console.error('Error sending message:', error);
			// Update message status to delivered even on error for UX
			setTimeout(() => {
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === message.id ? { ...msg, status: "delivered" } : msg
					)
				);
			}, 1000);
		} finally {
			setIsSending(false);
		}
	}, [newMessage, driverId, isArabic, isSending, language]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend]
	);

	return {
		messages,
		newMessage,
		setNewMessage,
		isTyping,
		isSending,
		handleSend,
		handleKeyPress,
		messagesEndRef,
		scrollToBottom,
	};
}

