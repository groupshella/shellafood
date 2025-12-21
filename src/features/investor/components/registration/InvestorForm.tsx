"use client";

import { useLanguage } from "@/providers";
import React from "react";
import { FormInput, FormSelect, SectionHeader, NotificationDialog, CheckBoxInput } from "@/shared/components";
import { PhoneInput } from "@/shared/components";
import { CheckCircle2 } from "lucide-react";
import ContractModal from "../modals/ContractModal";
import { useInvestorRegistration } from "../../hooks/useInvestorRegistration";
import { INVESTOR_CONSTANTS } from "../../constants/investor.constants";

export default function InvestorForm() {
	const { language } = useLanguage();
	const {
		formData,
		setFormData,
		currentStep,
		isLoading,
		nafathCode,
		pollingAttempts,
		contractPdfUrl,
		signedContractUrl,
		showPdfModal,
		setShowPdfModal,
		investorId,
		signedContractData,
		notification,
		setNotification,
		handleChange,
		handleSubmit,
		handleReset,
		previewContract,
		cancelVerification,
		t,
		isArabic,
	} = useInvestorRegistration(language);

	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className="mb-6 bg-white dark:bg-gray-900 p-3 md:mb-8 md:p-12" dir={direction}>
			<div className="mx-auto max-w-5xl">
				{/* Progress Indicator */}
				<div className="mb-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 shadow-sm sm:mb-8 sm:p-6">
					<div className="flex items-center justify-between">
						{[
							{ key: 'form', label: t('formStep') },
							{ key: 'verification', label: t('verificationStep') },
							{ key: 'complete', label: t('completeStep') }
						].map((step, index) => {
							const isCompleted = 
								(currentStep === 'verification' && step.key === 'form') ||
								(currentStep === 'complete' && step.key !== 'complete');
							const isCurrent = 
								(currentStep === 'form' && step.key === 'form') ||
								(currentStep === 'verification' && step.key === 'verification') ||
								(currentStep === 'complete' && step.key === 'complete');
							const isActive = isCompleted || isCurrent;

							return (
								<div key={step.key} className="flex items-center flex-1">
									<div className="flex flex-col items-center flex-1">
										<div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
											isCompleted
												? 'bg-green-600 dark:bg-green-500 text-white'
												: isCurrent
												? 'bg-green-600 dark:bg-green-500 text-white border-2 border-green-700 dark:border-green-400'
												: 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-600'
										}`}>
											{isCompleted ? (
												<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
											) : (
												<span className="text-sm sm:text-base font-semibold">{index + 1}</span>
											)}
										</div>
										<span className={`mt-2 sm:mt-3 text-xs sm:text-sm font-medium transition-colors duration-300 ${
											isActive
												? 'text-green-600 dark:text-green-400'
												: 'text-gray-500 dark:text-gray-400'
										}`}>
											{step.label}
										</span>
									</div>
									{index < 2 && (
										<div className={`h-0.5 flex-1 mx-2 sm:mx-3 transition-all duration-300 ${
											isCompleted
												? 'bg-green-600 dark:bg-green-500'
												: 'bg-gray-200 dark:bg-gray-700'
										}`}></div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Step 1: Form */}
				{currentStep === 'form' && (
					<div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 md:p-8">
						<div className={`mb-6 sm:mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
							<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
								{t('formTitle')}
							</h2>
							<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
								{t('formSubtitle')}
							</p>
						</div>
						
						<div className="space-y-6 sm:space-y-8">
							{/* Personal Information */}
							<div>
								<SectionHeader title={t('personalInfo')} isArabic={isArabic} />
								<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
									<FormInput
										label={t('firstName')}
										name="first_name"
										value={formData.first_name}
										onChange={handleChange}
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
									<FormInput
										label={t('fatherName')}
										name="father_name"
										value={formData.father_name}
										onChange={handleChange}
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
									<FormInput
										label={t('grandfatherName')}
										name="grandfather_name"
										value={formData.grandfather_name}
										onChange={handleChange}
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
									<FormInput
										label={t('familyName')}
										name="family_name"
										value={formData.family_name}
										onChange={handleChange}
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
									<FormInput
										label={t('birthDate')}
										name="birth_date"
										type="date"
										value={formData.birth_date}
										onChange={handleChange}
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
									<FormInput
										label={t('nationalId')}
										name="national_id"
										value={formData.national_id}
										onChange={(e) => {
											const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
											setFormData(prev => ({ ...prev, national_id: numericValue }));
										}}
										placeholder="1234567890"
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
								</div>
							</div>

							{/* Contact Information */}
							<div>
								<SectionHeader title={t('contactInfo')} isArabic={isArabic} />
								<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
									<FormInput
										label={t('email')}
										name="email"
										type="email"
										value={formData.email}
										onChange={handleChange}
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
									<PhoneInput
										label={t('phone')}
										value={formData.phone}
										onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
										isArabic={isArabic}
										required
										name="phone"
										disabled={isLoading}
									/>
									<FormInput
										label={t('nationalAddressEmail')}
										name="national_address_email"
										type="email"
										value={formData.national_address_email}
										onChange={handleChange}
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
									<FormSelect
										label={t('region')}
										name="region"
										value={formData.region}
										onChange={handleChange}
										required
										isArabic={isArabic}
										disabled={isLoading}
										placeholder={isArabic ? 'اختر المنطقة' : 'Select Region'}
										options={INVESTOR_CONSTANTS.REGIONS.map((region) => ({
											value: region.value,
											label: isArabic ? region.label : region.labelEn,
										}))}
									/>
								</div>
							</div>

							{/* Banking Information */}
							<div>
								<SectionHeader title={t('bankingInfo')} isArabic={isArabic} />
								<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
									<FormInput
										label={t('iban')}
										name="iban"
										value={formData.iban}
										onChange={handleChange}
										placeholder="SA1234567890123456789012"
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
									<FormInput
										label={t('bankName')}
										name="bank_name"
										value={formData.bank_name}
										onChange={handleChange}
										placeholder={isArabic ? 'مصرف الراجحي' : 'Al Rajhi Bank'}
										required
										isArabic={isArabic}
										disabled={isLoading}
									/>
									<div className="md:col-span-2">
										<FormInput
											label={t('amount')}
											name="amount"
											type="number"
											value={formData.amount}
											onChange={handleChange}
											placeholder="50000"
											required
											isArabic={isArabic}
											disabled={isLoading}
										/>
									</div>
								</div>
							</div>

							{/* Terms */}
							<div className="mb-8">
								<CheckBoxInput
									checked={formData.agreed}
									onChange={handleChange}
									label={t('agreeTerms')}
									isArabic={isArabic}
									name="agreed"
									required
								/>
							</div>

							{/* Contract Preview Section (if already loaded) */}
							{contractPdfUrl && currentStep === 'form' && (
								<div className="mt-6 p-4 sm:p-5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
									<div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
										<span className={`font-semibold text-gray-800 dark:text-gray-200 ${isArabic ? 'text-right' : 'text-left'}`}>
											{t('contractLoaded')}
										</span>
										<button
											onClick={() => setShowPdfModal(true)}
											className="px-3 sm:px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-all text-xs sm:text-sm"
										>
											{t('viewContract')}
										</button>
									</div>
									<p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 ${isArabic ? 'text-right' : 'text-left'}`}>
										{t('contractPreviewMessage')}
									</p>
								</div>
							)}

							{/* Actions */}
							<div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
								<button
									onClick={previewContract}
									disabled={isLoading}
									className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
								>
									{t('previewContract')}
								</button>
								<button
									onClick={handleSubmit}
									disabled={isLoading}
									className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<div className="flex items-center justify-center gap-2">
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
											<span>{t('processing')}</span>
										</div>
									) : (
										t('submit')
									)}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Step 2: Nafath Verification */}
				{currentStep === 'verification' && (
					<div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 md:p-8 text-center">
						<div className={`mb-6 sm:mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
							<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
								{t('nafathTitle')}
							</h2>
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
								{t('nafathInstructions')}
							</p>
						</div>

						{nafathCode && (
							<div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 sm:p-10 md:p-12 mb-6 sm:mb-8 border-2 border-green-200 dark:border-green-800/50 shadow-xl dark:shadow-2xl overflow-hidden">
								{/* Decorative background pattern */}
								<div className="absolute inset-0 opacity-5 dark:opacity-10">
									<div className="absolute inset-0" style={{
										backgroundImage: `radial-gradient(circle at 2px 2px, rgb(34, 197, 94) 1px, transparent 0)`,
										backgroundSize: '24px 24px'
									}}></div>
								</div>
								
								{/* Top accent bar */}
								<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500"></div>
								
								<div className="relative z-10">
									{/* Label */}
									<div className={`flex items-center gap-2 mb-4 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
										<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
										<p className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
											{t('nafathCode')}
										</p>
									</div>
									
									{/* Code Display */}
									<div className={`relative ${isArabic ? 'text-right' : 'text-left'}`}>
										<div className="inline-block bg-white dark:bg-gray-800/80 px-6 py-4 rounded-lg border-2 border-green-100 dark:border-green-900/50 shadow-lg backdrop-blur-sm">
											<div className={`text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent tracking-[0.2em] font-mono ${isArabic ? 'text-right' : 'text-left'}`}>
												{nafathCode}
											</div>
										</div>
									</div>
									
									{/* Status indicator */}
									<div className="flex items-center justify-center gap-2 mt-6">
										<div className="flex items-center gap-1.5">
											<div className="relative">
												<div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
												<div className="w-2 h-2 bg-green-500 rounded-full relative"></div>
											</div>
											<span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
												{t('waitingApproval')}
											</span>
										</div>
									</div>
								</div>
							</div>
						)}

						<div className="flex flex-col items-center gap-4">
							<div className={`flex items-center gap-3 text-gray-600 dark:text-gray-400 `}>
								<div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-green-600"></div>
								<span className="font-medium text-sm sm:text-base">{t('waitingApproval')}</span>
								<span className="text-xs sm:text-sm bg-green-100 dark:bg-green-900/30 px-2 sm:px-3 py-1 rounded-full font-semibold">
									{pollingAttempts}/40
								</span>
							</div>
							
							<button
								onClick={cancelVerification}
								className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600 text-sm sm:text-base"
							>
								{t('cancelVerification')}
							</button>
						</div>
					</div>
				)}

				{/* Step 3: Complete */}
				{currentStep === 'complete' && (
					<div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 md:p-8">
						<div className={`mb-6 sm:mb-8 text-center ${isArabic ? 'text-right' : 'text-left'}`}>
							<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
								{t('successTitle')}
							</h2>
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
								{t('successMessage')}
							</p>
							
							{/* Contract Data Info */}
							{signedContractData && (
								<div className="mb-6 bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
									<div className={`space-y-3 ${isArabic ? 'text-right' : 'text-left'}`}>
										{signedContractData.full_name_ar && (
											<div>
												<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
													{t('fullName')}
												</p>
												<p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
													{signedContractData.full_name_ar}
												</p>
											</div>
										)}
										{signedContractData.national_id && (
											<div>
												<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
													{t('nationalIdLabel')}
												</p>
												<p className="text-sm sm:text-base font-mono font-semibold text-gray-800 dark:text-gray-200">
													{signedContractData.national_id}
												</p>
											</div>
										)}
										{signedContractData.request_id && (
											<div>
												<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
													{t('requestId')}
												</p>
												<p className="text-sm sm:text-base font-mono font-semibold text-gray-800 dark:text-gray-200">
													{signedContractData.request_id}
												</p>
											</div>
										)}
										{signedContractData.status && (
											<div>
												<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
													{t('status')}
												</p>
												<p className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400">
													{signedContractData.status === 'approved' ? t('approved') : signedContractData.status}
												</p>
											</div>
										)}
									</div>
								</div>
							)}

							{investorId && (
								<div className="inline-block bg-white dark:bg-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm mb-6">
									<p className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 ${isArabic ? 'text-right' : 'text-left'}`}>
										{t('investorId')}
									</p>
									<p className="text-base sm:text-lg font-mono font-bold text-green-600 dark:text-green-400">
										{investorId}
									</p>
								</div>
							)}
						</div>

						{/* Signed Contract Display */}
						{signedContractUrl && (
							<div className="mb-6 bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-600 shadow-sm">
								<div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
									<span className={`font-semibold text-gray-800 dark:text-gray-200 ${isArabic ? 'text-right' : 'text-left'}`}>
										{t('signedContract')}
									</span>
									<button
										onClick={() => {
											setShowPdfModal(true);
										}}
										className="px-3 sm:px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-all text-xs sm:text-sm"
									>
										{t('viewContract')}
									</button>
								</div>
								<p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 ${isArabic ? 'text-right' : 'text-left'}`}>
									{t('signedContractMessage')}
								</p>
								<div className={`flex flex-col sm:flex-row gap-3 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
									<button
										onClick={() => setShowPdfModal(true)}
										className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-all shadow-md hover:shadow-lg"
									>
										{t('viewContract')}
									</button>
									<a
										href={signedContractUrl}
										download="signed-investment-contract.pdf"
										className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-center shadow-sm hover:shadow-md"
									>
										{t('downloadContract')}
									</a>
								</div>
							</div>
						)}

						<div className="text-center">
							<button
								onClick={handleReset}
								className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
							>
								{t('startNew')}
							</button>
						</div>
					</div>
				)}

				{/* PDF Preview Modal */}
				{(contractPdfUrl || signedContractUrl) && (
					<ContractModal
						isOpen={true}
						onClose={() => setShowPdfModal(false)}
						fileUrl={signedContractUrl || contractPdfUrl || ''}
					/>
				)}
				

				{/* Notification */}
				<NotificationDialog
					isArabic={isArabic}
					message={notification.message}
					type={notification.type}
					isVisible={notification.isVisible}
					onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
				/>
			</div>
		</section>
	);
}
