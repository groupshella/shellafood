"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageDirection } from "@/shared/hooks";
import { Bell, Clock, Package, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Notification } from "../types/notifications.types";
import useSWR from "swr";

interface NotificationsPageProps {
	initialNotifications?: Notification[] | null;
}

const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) throw new Error('Failed to fetch notifications');
	return res.json();
};

export default function NotificationsPage({ initialNotifications }: NotificationsPageProps) {
	const { isArabic, direction } = useLanguageDirection();
	const [notifications, setNotifications] = useState<Notification[]>(initialNotifications || []);

	// SWR for fetching notifications
	const { data, error, isLoading, mutate } = useSWR<Notification[]>(
		'/api/notifications?zoneId=2',
		fetcher,
		{
			fallbackData: initialNotifications || [],
			revalidateOnFocus: true,
			revalidateOnMount: true,
			refreshInterval: 30000, // Refresh every 30 seconds
		}
	);

	useEffect(() => {
		if (data) {
			// Handle both array and object responses
			const notificationsList = Array.isArray(data) ? data : (data as any).notifications || [];
			setNotifications(notificationsList);
		}
	}, [data]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return isArabic ? 'الآن' : 'Just now';
		if (diffMins < 60) return isArabic ? `منذ ${diffMins} دقيقة` : `${diffMins} minutes ago`;
		if (diffHours < 24) return isArabic ? `منذ ${diffHours} ساعة` : `${diffHours} hours ago`;
		if (diffDays < 7) return isArabic ? `منذ ${diffDays} يوم` : `${diffDays} days ago`;
		
		return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'order_status':
				return <Package className="w-5 h-5" />;
			case 'success':
				return <CheckCircle className="w-5 h-5 text-green-500" />;
			case 'error':
				return <XCircle className="w-5 h-5 text-red-500" />;
			default:
				return <AlertCircle className="w-5 h-5" />;
		}
	};

	const sortedNotifications = useMemo(() => {
		return [...notifications].sort((a, b) => {
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
		});
	}, [notifications]);

	const unreadCount = useMemo(() => {
		return notifications.filter(n => n.status === 1).length;
	}, [notifications]);

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
				<div className="container mx-auto px-4 py-8">
					<div className="text-center">
						<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							{isArabic ? 'خطأ في تحميل الإشعارات' : 'Error loading notifications'}
						</h2>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							{isArabic ? 'حدث خطأ أثناء تحميل الإشعارات. يرجى المحاولة مرة أخرى.' : 'An error occurred while loading notifications. Please try again.'}
						</p>
						<button
							onClick={() => mutate()}
							className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
						>
							{isArabic ? 'إعادة المحاولة' : 'Retry'}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
				{/* Header */}
				<div className="mb-6 sm:mb-8">
					<div className="flex items-center justify-between mb-2">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
							<Bell className="w-6 h-6 sm:w-7 sm:h-7" />
							{isArabic ? 'الإشعارات' : 'Notifications'}
						</h1>
						{unreadCount > 0 && (
							<span className="px-3 py-1 bg-green-600 text-white text-xs sm:text-sm font-semibold rounded-full">
								{unreadCount}
							</span>
						)}
					</div>
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
						{isArabic 
							? 'ابق على اطلاع بآخر التحديثات والطلبات' 
							: 'Stay updated with the latest updates and orders'}
					</p>
				</div>

				{/* Notifications List */}
				{isLoading && notifications.length === 0 ? (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 animate-pulse"
							>
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
								<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
							</div>
						))}
					</div>
				) : sortedNotifications.length === 0 ? (
					<div className="text-center py-12 sm:py-16">
						<Bell className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
						<h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
							{isArabic ? 'لا توجد إشعارات' : 'No notifications'}
						</h3>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
							{isArabic 
								? 'لم تتلق أي إشعارات حتى الآن' 
								: 'You haven\'t received any notifications yet'}
						</p>
					</div>
				) : (
					<AnimatePresence>
						<div className="space-y-3 sm:space-y-4">
							{sortedNotifications.map((notification, index) => (
								<motion.div
									key={notification.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ delay: index * 0.05, duration: 0.3 }}
									className={`bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border ${
										notification.status === 1
											? 'border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10'
											: 'border-gray-200 dark:border-gray-700'
									}`}
								>
									<div className="flex items-start gap-3 sm:gap-4">
										{/* Icon */}
										<div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
											notification.status === 1
												? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
												: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
										}`}>
											{getNotificationIcon(notification.data.type)}
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2 mb-1">
												<h3 className={`text-sm sm:text-base font-semibold ${
													notification.status === 1
														? 'text-gray-900 dark:text-white'
														: 'text-gray-700 dark:text-gray-300'
												}`}>
													{notification.data.title}
												</h3>
												{notification.status === 1 && (
													<span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5"></span>
												)}
											</div>
											<p className={`text-sm sm:text-base mb-2 ${
												notification.status === 1
													? 'text-gray-700 dark:text-gray-300'
													: 'text-gray-600 dark:text-gray-400'
											}`}>
												{notification.data.description}
											</p>
											<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
												<Clock className="w-3 h-3 sm:w-4 sm:h-4" />
												<span>{formatDate(notification.created_at)}</span>
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}

