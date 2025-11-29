"use client";

import React, { memo } from "react";
import {
	User,
	Star,
	Shield,
	MapPin,
	Clock,
	Phone,
	Award,
	MessageCircle,
	Bike,
	Truck,
	CheckCircle2,
} from "lucide-react";
import { OfferDriver } from "@/types/offer.types";

interface OfferDriverCardProps {
	driver: OfferDriver;
	isArabic: boolean;
	onViewProfile: () => void;
	onChat: () => void;
}

const OfferDriverCard = memo(function OfferDriverCard({
	driver,
	isArabic,
	onViewProfile,
	onChat,
}: OfferDriverCardProps) {
	const VehicleIcon = driver.vehicleType === "motorbike" ? Bike : Truck;

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
			{/* Header */}
			<div className="border-b border-gray-200 dark:border-gray-700 p-6 sm:p-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-emerald-600 rounded-xl shadow-lg">
						<CheckCircle2 className="w-7 h-7 text-white" />
					</div>
					<div className="flex-1">
						<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
							{isArabic ? "السائق المخصص لك" : "Your Assigned Driver"}
						</h2>
						<p className="text-base text-gray-700 dark:text-gray-300">
							{isArabic ? "سائق محترف معتمد ومؤمن - جاهز للخدمة الآن" : "Professional verified & insured driver - Ready to serve you now"}
						</p>
					</div>
				</div>
			</div>

			{/* Driver Info Content */}
			<div className="p-5 sm:p-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Column 1: Avatar & Basic Info */}
					<div className="lg:col-span-1">
						<div className="flex flex-col items-center text-center space-y-3">
							{/* Avatar with Badge */}
							<div className="relative">
								<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
									{driver.avatar ? (
										<img
											src={driver.avatar}
											alt={driver.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
									)}
								</div>
								{/* Verified Badge */}
								{driver.verified && (
									<div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800">
										<CheckCircle2 className="w-4 h-4 text-white" />
									</div>
								)}
							</div>

							{/* Name & Rating */}
							<div>
								<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
									{isArabic ? driver.nameAr : driver.name}
								</h3>

								{/* Rating */}
								<div className="flex items-center justify-center gap-1 text-sm">
									<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
									<span className="font-semibold text-gray-900 dark:text-white">
										{driver.rating}
									</span>
									<span className="text-gray-600 dark:text-gray-400">
										({driver.reviewsCount.toLocaleString()})
									</span>
								</div>
							</div>

							{/* Badges */}
							<div className="flex flex-wrap gap-2 justify-center">
								{driver.verified && (
									<span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded flex items-center gap-1">
										<Shield className="w-3 h-3" />
										{isArabic ? "موثق" : "Verified"}
									</span>
								)}
								{driver.insured && (
									<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded flex items-center gap-1">
										<Shield className="w-3 h-3" />
										{isArabic ? "مؤمن" : "Insured"}
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Column 2: Stats */}
					<div className="lg:col-span-1">
						<div className="space-y-3">
							{/* Vehicle Info Card */}
							<div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-2 mb-2">
									<VehicleIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
									<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
										{isArabic ? "المركبة" : "Vehicle"}
									</span>
								</div>
								<p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
									{driver.vehicleModel}
								</p>
								<p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
									{driver.licensePlate}
								</p>
							</div>

							{/* Location Card */}
							<div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-2 mb-2">
									<MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
									<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
										{isArabic ? "الموقع" : "Location"}
									</span>
								</div>
								<p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
									{driver.location}
								</p>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									{driver.distance} {isArabic ? "كم" : "km"} {isArabic ? "بعيد" : "away"}
								</p>
							</div>

							{/* Arrival Time Card */}
							<div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
								<div className="flex items-center gap-2 mb-2">
									<Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									<span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
										{isArabic ? "وقت الوصول" : "Arrival Time"}
									</span>
								</div>
								<p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
									{driver.estimatedTime} {isArabic ? "دقيقة" : "min"}
								</p>
							</div>
						</div>
					</div>

					{/* Column 3: Actions & Contact */}
					<div className="lg:col-span-1">
						<div className="space-y-3">
							{/* Experience */}
							<div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-2 mb-2">
									<Award className="w-4 h-4 text-gray-600 dark:text-gray-400" />
									<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
										{isArabic ? "الخبرة" : "Experience"}
									</span>
								</div>
								<p className="text-sm font-bold text-gray-900 dark:text-white">
									{driver.yearsOfExperience || driver.experience}
								</p>
							</div>

							{/* Phone */}
							<div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-2 mb-2">
									<Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
									<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
										{isArabic ? "الهاتف" : "Phone"}
									</span>
								</div>
								<p className="text-sm font-semibold text-gray-900 dark:text-white font-mono" dir="ltr">
									{driver.phone}
								</p>
							</div>

							{/* Action Buttons */}
							<div className="space-y-2 pt-2">
								<button
									onClick={onChat}
									className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
								>
									<MessageCircle className="w-4 h-4" />
									{isArabic ? "محادثة" : "Chat"}
								</button>

								<button
									onClick={onViewProfile}
									className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg font-semibold transition-colors"
								>
									<User className="w-4 h-4" />
									{isArabic ? "الملف الشخصي" : "Profile"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default OfferDriverCard;

