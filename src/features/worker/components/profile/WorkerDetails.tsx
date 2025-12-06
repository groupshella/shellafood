"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers";
import { Star, MapPin, MessageCircle, CheckCircle, Award } from "lucide-react";
import { useWorkerProfile } from "../../hooks/useWorkerProfile";
import { MOCK_REVIEWS } from "../../constants/worker.constants";

interface WorkerDetailsProps {
	workerId: string;
}

/**
 * Worker Details Component
 * Displays detailed information about a specific worker
 */
const WorkerDetails: React.FC<WorkerDetailsProps> = ({ workerId }) => {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	const [selectedTab, setSelectedTab] = useState("about");

	// Get worker data from hook
	const { worker, isLoading, error } = useWorkerProfile(workerId);

	// Map mock reviews with language-specific content
	const reviews = MOCK_REVIEWS.map((review) => ({
		id: review.id,
		userName: isArabic ? review.userName.ar : review.userName.en,
		userAvatar: review.userAvatar,
		rating: review.rating,
		comment: isArabic ? review.comment.ar : review.comment.en,
		date: review.date
	}));


	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-[#31A342] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">
						{isArabic ? "جاري تحميل ملف الفني..." : "Loading worker profile..."}
					</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !worker) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
						{error || (isArabic ? "الفني غير موجود" : "Worker not found")}
					</p>
					<button
						onClick={() => router.back()}
						className="px-6 py-3 bg-[#31A342] hover:bg-[#2a8f38] text-white font-semibold rounded-lg transition-colors"
					>
						{isArabic ? "رجوع" : "Go Back"}
					</button>
				</div>
			</div>
		);
	}

	const workerName = isArabic ? (worker.nameAr || worker.name || "Worker") : (worker.name || worker.nameAr || "Worker");
	const workerAbout = isArabic ? (worker.aboutAr || worker.about || "") : (worker.about || worker.aboutAr || "");
	const workerEducation = worker.education || [];
	const workerCertifications = worker.certifications || [];
	const workerSkills = worker.skills || [];

	const handleContactWorker = () => {
		// Navigate to chat page using new route
		router.push(`/worker/${worker.id}/chat`);
	};

	return (
		<div className={`min-h-screen bg-white dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			{/* Header */}
			<div className="relative bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200/80 dark:border-gray-700/80 overflow-hidden">
				{/* Decorative background elements */}
				<div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-emerald-50/20 dark:from-green-900/10 dark:via-transparent dark:to-emerald-900/10"></div>
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#31A342]/20 to-transparent"></div>
				
				<div className="relative px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-center py-6 sm:py-7">
						<div className="flex flex-col items-center gap-3 max-w-2xl">
							{/* Title with decorative elements */}
							<div className="flex items-center gap-4">
								<div className="hidden sm:flex items-center gap-2">
									<div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-[#31A342] rounded-full"></div>
									<div className="w-2 h-2 bg-[#31A342] rounded-full"></div>
								</div>
								<h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight ${isArabic ? "text-right" : "text-left"}`}>
									<span className="relative">
										{isArabic ? "تفاصيل الفني" : "Worker Details"}
										<span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#31A342] via-emerald-400 to-[#31A342] rounded-full opacity-60"></span>
									</span>
								</h1>
								<div className="hidden sm:flex items-center gap-2">
									<div className="w-2 h-2 bg-[#31A342] rounded-full"></div>
									<div className="h-0.5 w-8 bg-gradient-to-l from-transparent to-[#31A342] rounded-full"></div>
								</div>
							</div>
							
							{/* Subtitle */}
							<p className={`text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium px-4 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "معلومات شاملة عن الفني المحترف" : "Comprehensive professional information"}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				
				{/* Worker Profile Section */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
					<div className="flex flex-col md:flex-row gap-6">
						{/* Worker Avatar */}
						<div className="flex-shrink-0">
							<Image
								src={worker.avatar}
								alt={workerName}
								width={128}
								height={128}
								className="w-32 h-32 rounded-full object-cover"
							/>
						</div>

						{/* Worker Info */}
						<div className="flex-1">
							<h2 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 ${isArabic ? "text-right" : "text-left"}`}>
								{workerName}
							</h2>
							<p className={`text-[#FA9D2B] dark:text-orange-400 text-lg font-medium mb-2 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "خبرة" : "Experience"} {worker.experience}
							</p>
							<div className="flex items-center gap-2 mb-4">
								<MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
								<span className="text-gray-600 dark:text-gray-400">{worker.location}</span>
							</div>
							
							{/* Rating */}
							<div className="flex items-center gap-2 mb-4">
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-5 h-5 ${
												i < Math.floor(worker.rating)
													? "text-yellow-400 fill-yellow-400"
													: "text-gray-300 dark:text-gray-600"
											}`}
										/>
									))}
								</div>
								<span className="text-gray-600 dark:text-gray-400 font-medium">
									{worker.rating} ({worker.reviewsCount} {isArabic ? "تقييم" : "reviews"})
								</span>
							</div>

						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
					<div className="flex gap-4 mb-6">
						{[
							{ key: "about", label: isArabic ? "نبذة عني" : "About Me" },
							{ key: "skills", label: isArabic ? "المهارات" : "Skills" },
							{ key: "reviews", label: isArabic ? "التقييمات" : "Reviews" }
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setSelectedTab(tab.key)}
								className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
									selectedTab === tab.key
										? "bg-[#31A342] dark:bg-green-600 text-white"
										: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>

					{/* Tab Content */}
					{selectedTab === "about" && (
						<div className="space-y-6">
							{workerAbout && (
								<div>
									<h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic ? "نبذة عني" : "About Me"}
									</h3>
									<p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${isArabic ? "text-right" : "text-left"}`}>
										{workerAbout}
									</p>
								</div>
							)}

							{workerEducation.length > 0 && (
								<div>
									<h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic ? "التعليم" : "Education"}
									</h3>
									<ul className={`space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
										{workerEducation.map((edu, index) => (
											<li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
												<Award className="w-4 h-4 text-[#FA9D2B] dark:text-orange-400 flex-shrink-0" />
												{edu}
											</li>
										))}
									</ul>
								</div>
							)}

							{workerCertifications.length > 0 && (
								<div>
									<h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic ? "الشهادات" : "Certifications"}
									</h3>
									<ul className={`space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
										{workerCertifications.map((cert, index) => (
											<li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
												<CheckCircle className="w-4 h-4 text-[#31A342] dark:text-green-400 flex-shrink-0" />
												{cert}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}

					{selectedTab === "skills" && (
						<div>
							<h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "المهارات والخبرات" : "Skills & Expertise"}
							</h3>
							{workerSkills.length > 0 ? (
								<div className="flex flex-wrap gap-3">
									{workerSkills.map((skill, index) => (
										<span
											key={index}
											className="px-4 py-2 bg-[#31A342] dark:bg-green-600 text-white rounded-full text-sm font-medium"
										>
											{skill}
										</span>
									))}
								</div>
							) : (
								<p className={`text-gray-500 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "لا توجد مهارات متاحة" : "No skills available"}
								</p>
							)}
						</div>
					)}

					{selectedTab === "reviews" && (
						<div>
							<h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "آراء العملاء" : "Customer Reviews"}
							</h3>
							<div className="space-y-6">
								{reviews.map((review) => (
									<div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
										<div className="flex items-center gap-4 mb-3">
											<Image
												src={review.userAvatar}
												alt={review.userName}
												width={48}
												height={48}
												className="w-12 h-12 rounded-full object-cover"
											/>
											<div className="flex-1">
												<h4 className={`font-semibold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
													{review.userName}
												</h4>
												<div className="flex items-center gap-2">
													<div className="flex items-center gap-1">
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`w-4 h-4 ${
																	i < review.rating
																		? "text-yellow-400 fill-yellow-400"
																		: "text-gray-300 dark:text-gray-600"
																}`}
															/>
														))}
													</div>
													<span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
												</div>
											</div>
										</div>
										<p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${isArabic ? "text-right" : "text-left"}`}>
											{review.comment}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Action Button */}
				<div className="flex flex-col gap-4">
					<button
						onClick={handleContactWorker}
						className="w-full border-2 border-[#FA9D2B] text-[#FA9D2B] hover:bg-[#FA9D2B] hover:text-white active:bg-[#FA9D2B] active:text-white py-4 px-6 rounded-xl font-bold text-lg transition-colors duration-200 flex items-center justify-center gap-2 touch-manipulation"
					>
						<MessageCircle className="w-5 h-5" />
						{isArabic ? "تواصل معي" : "Contact Me"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default WorkerDetails;
