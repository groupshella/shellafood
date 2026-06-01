"use client";

/**
 * Hook for Driver Chat Page logic
 * Handles chat messages, driver data, and chat interactions
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { Driver, Message } from "../types/pick-and-order.types";
import {
	DRIVER_STORAGE_KEYS,
	DEFAULT_DRIVER_VALUES,
	MESSAGE_STATUS_DELAYS,
} from "../constants/pick-and-order.constants";

interface UseDriverChatProps {
	driverId: string;
	isArabic: boolean;
}

export function useDriverChat({ driverId, isArabic }: UseDriverChatProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [driver, setDriver] = useState<Driver>({
		id: driverId,
		name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
		nameAr: "أحمد محمد",
		avatar: DEFAULT_DRIVER_VALUES.AVATAR,
		rating: 4.9,
		reviewsCount: 234,
		pricePerKm: DEFAULT_DRIVER_VALUES.PRICE_PER_KM_TRUCK,
		experience: isArabic ? "8 سنوات" : "8 years",
		vehicleType: "truck",
		vehicleModel: "Isuzu D-Max 2022",
		licensePlate: "ABC 1234",
		phone: "+966500000000",
		completedOrders: 1250,
		joinDate: DEFAULT_DRIVER_VALUES.JOIN_DATE,
		specialties: [],
		verified: true,
		online: true,
		lastSeen: new Date(),
	});

	// Load driver data from sessionStorage
	useEffect(() => {
		const storedDriverData = sessionStorage.getItem(
			`${DRIVER_STORAGE_KEYS.DRIVER_PREFIX}${driverId}`
		);

		if (storedDriverData) {
			try {
				const parsedDriver = JSON.parse(storedDriverData);
				setDriver({
					id: parsedDriver.id || driverId,
					name: isArabic
						? parsedDriver.nameAr || parsedDriver.name
						: parsedDriver.name || parsedDriver.nameAr,
					nameAr: parsedDriver.nameAr || parsedDriver.name || "سائق",
					avatar: parsedDriver.avatar || DEFAULT_DRIVER_VALUES.AVATAR,
					rating: parsedDriver.rating || 4.9,
					reviewsCount: parsedDriver.reviewsCount || 234,
					pricePerKm: parsedDriver.pricePerKm || DEFAULT_DRIVER_VALUES.PRICE_PER_KM_TRUCK,
					experience: parsedDriver.experience || (isArabic ? "8 سنوات" : "8 years"),
					vehicleType:
						parsedDriver.vehicleType === "motorbike" ? "motorbike" : "truck",
					vehicleModel: parsedDriver.vehicleModel || "Isuzu D-Max 2022",
					licensePlate: parsedDriver.licensePlate || "ABC 1234",
					phone: parsedDriver.phone || "+966500000000",
					completedOrders: parsedDriver.completedOrders || 1250,
					joinDate: parsedDriver.joinDate || DEFAULT_DRIVER_VALUES.JOIN_DATE,
					specialties: parsedDriver.specialties || [],
					verified: parsedDriver.verified ?? true,
					online: true,
					lastSeen: new Date(),
				});
			} catch (error) {
				console.error("Error parsing stored driver data:", error);
			}
		}
	}, [driverId, isArabic]);

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
			const timer = setTimeout(
				() => setIsTyping(false),
				MESSAGE_STATUS_DELAYS.TYPING_INDICATOR
			);
			return () => clearTimeout(timer);
		}
	}, [isTyping]);

	const handleSend = useCallback(() => {
		if (!newMessage.trim()) return;

		const message: Message = {
			id: Date.now().toString(),
			senderId: "me",
			text: newMessage,
			timestamp: new Date(),
			status: "sent",
		};

		setMessages((prev) => [...prev, message]);
		setNewMessage("");

		// Simulate driver typing
		setTimeout(() => setIsTyping(true), 1000);

		// Simulate driver response
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
		}, MESSAGE_STATUS_DELAYS.DRIVER_RESPONSE);

		// Update message status
		setTimeout(() => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === message.id ? { ...msg, status: "delivered" } : msg
				)
			);
		}, MESSAGE_STATUS_DELAYS.DELIVERED);

		setTimeout(() => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === message.id ? { ...msg, status: "read" } : msg
				)
			);
		}, MESSAGE_STATUS_DELAYS.READ);
	}, [newMessage, driverId, isArabic]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend]
	);

	const handleCall = useCallback(() => {
		if (driver.phone) {
			window.location.href = `tel:${driver.phone}`;
		}
	}, [driver]);

	const vehicleIcon = driver.vehicleType === "truck" ? "truck" : "bike";
	const vehicleColor = driver.vehicleType === "truck" ? "#31A342" : "#FA9D2B";

	return {
		// State
		driver,
		messages,
		newMessage,
		setNewMessage,
		isTyping,

		// Refs
		messagesEndRef,
		inputRef,

		// Actions
		handleSend,
		handleKeyPress,
		handleCall,

		// Computed
		vehicleIcon,
		vehicleColor,
	};
}

