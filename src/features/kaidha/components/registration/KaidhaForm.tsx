"use client";

import { useLanguage } from "@/providers";
import React from "react";
import { SectionHeader, FormInput, FormSelect, PhoneInput, NotificationDialog, MapSection } from "@/shared/components";
import { DynamicListSection } from "./DynamicListSection";
import { useKaidhaRegistration } from "../../hooks/useKaidhaRegistration";
import { useKaidhaMap } from "../../hooks/useKaidhaMap";
import { KAIDHA_CONSTANTS } from "../../constants/kaidha.constants";

const DEFAULT_CENTER = KAIDHA_CONSTANTS.DEFAULT_CENTER;

/**
 * Main Kaidha Form Component
 * Clean, modular, and high-performance registration form
 */
export default function KaidhaForm() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";

	const { isLoaded, loadError } = useKaidhaMap();

	const {
		formData,
		setFormData,
		installmentsList,
		additionalIncomeList,
		isSubmitting,
		notification,
		setNotification,
		handleChange,
		handleSubmit,
		handleReset,
		handleAddInstallment,
		handleRemoveInstallment,
		handleInstallmentChange,
		handleAddAdditionalIncome,
		handleRemoveAdditionalIncome,
		handleAdditionalIncomeChange,
	} = useKaidhaRegistration(language);

	return (
		<div className="w-full" dir={isArabic ? "rtl" : "ltr"}>
			<div className="mx-auto max-w-6xl">
				<div className="overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-sm sm:shadow-md md:shadow-xl lg:shadow-2xl border border-gray-200 dark:border-gray-700 md:border-gray-300 dark:md:border-gray-600">
					{/* Header - Responsive */}
					<div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
						<h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white ${isArabic ? "text-right" : "text-left"}`}>
							{t('kaidhaForm.title')}
						</h1>
						<p className={`mt-2 text-sm sm:text-base text-green-50 dark:text-green-100 ${isArabic ? "text-right" : "text-left"}`}>
							{t('kaidhaForm.subtitle')}
						</p>
					</div>

					<form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
						{/* Personal Information Section */}
						<SectionHeader title={t('kaidhaForm.personalInfo')} isArabic={isArabic} />

						<div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
							<FormInput
								label={t('kaidhaForm.firstName')}
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								required
								isArabic={isArabic}
							/>
							<FormInput
								label={t('kaidhaForm.fatherName')}
								name="fatherName"
								value={formData.fatherName}
								onChange={handleChange}
								required
								isArabic={isArabic}
							/>
							<FormInput
								label={t('kaidhaForm.grandFatherName')}
								name="grandFatherName"
								value={formData.grandFatherName || ""}
								onChange={handleChange}
								required
								isArabic={isArabic}
							/>
							<FormInput
								label={t('kaidhaForm.lastName')}
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								required
								isArabic={isArabic}
							/>
							<FormInput
								label={t('kaidhaForm.birthDate')}
								name="birthDate"
								type="date"
								value={formData.birthDate || new Date().toISOString().split('T')[0]}
								onChange={handleChange}
								max="2007-12-31"
								required
								isArabic={isArabic}
							/>
							<FormInput
								label={t('kaidhaForm.nationality')}
								name="nationality"
								value={formData.nationality || ""}
								onChange={handleChange}
								placeholder={t('kaidhaForm.placeholder.nationality')}
								isArabic={isArabic}
							/>
							<FormSelect
								label={t('kaidhaForm.socialStatus')}
								name="socialStatus"
								options={[
									{ value: "single", label: t('kaidhaForm.option.single') },
									{ value: "married", label: t('kaidhaForm.option.married') },
								]}
								value={formData.socialStatus || ""}
								onChange={handleChange}
								required
								isArabic={isArabic}
								placeholder={t('kaidhaForm.placeholder.choose')}
							/>
							<FormSelect
								label={t('kaidhaForm.familyMembersCount')}
								name="familyMembersCount"
								options={Array.from({ length: 10 }, (_, i) => ({
									value: String(i + 1),
									label: i === 9 ? "10+" : String(i + 1),
								}))}
								value={formData.familyMembersCount || ""}
								onChange={handleChange}
								required
								isArabic={isArabic}
								placeholder={t('kaidhaForm.placeholder.choose')}
							/>
							<FormSelect
								label={t('kaidhaForm.idType')}
								name="idType"
								options={[
									{ value: "nationalId", label: t('kaidhaForm.option.nationalId') },
									{ value: "passport", label: t('kaidhaForm.option.passport') },
								]}
								value={formData.idType || ""}
								onChange={handleChange}
								isArabic={isArabic}
								placeholder={t('kaidhaForm.placeholder.choose')}
							/>
							<FormInput
								label={t('kaidhaForm.personalIdNumber')}
								name="personalIdNumber"
								value={formData.personalIdNumber}
								onChange={handleChange}
								placeholder={t('kaidhaForm.placeholder.idNumber')}
								required
								isArabic={isArabic}
							/>
							<FormInput
								label={t('kaidhaForm.idExpirationDate')}
								name="idExpirationDate"
								type="date"
								value={formData.idExpirationDate || new Date().toISOString().split('T')[0]}
								onChange={handleChange}
								required
								isArabic={isArabic}
							/>

							{/* Phone Numbers */}
							<PhoneInput
								label={t('kaidhaForm.phoneNumber')}
								value={formData.phoneNumber}
								onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
								isArabic={isArabic}
								required
								name="phoneNumber"
							/>

							<PhoneInput
								label={t('kaidhaForm.whatsappNumber')}
								value={formData.whatsappNumber || ""}
								onChange={(phone) => setFormData({ ...formData, whatsappNumber: phone })}
								isArabic={isArabic}
								name="whatsappNumber"
							/>

							<FormInput
								label={t('kaidhaForm.email')}
								name="email"
								type="email"
								value={formData.email || ""}
								onChange={handleChange}
								placeholder={t('kaidhaForm.placeholder.email')}
								isArabic={isArabic}
							/>
							<FormSelect
								label={t('kaidhaForm.homeType')}
								name="homeType"
								options={[
									{ value: "villa", label: t('kaidhaForm.option.villa') },
									{ value: "apartment", label: t('kaidhaForm.option.apartment') },
								]}
								value={formData.homeType || ""}
								onChange={handleChange}
								required
								isArabic={isArabic}
								placeholder={t('kaidhaForm.placeholder.choose')}
							/>
							<FormSelect
								label={t('kaidhaForm.homeNature')}
								name="homeNature"
								options={[
									{ value: "rent", label: t('kaidhaForm.option.rent') },
									{ value: "ownership", label: t('kaidhaForm.option.ownership') },
								]}
								value={formData.homeNature || ""}
								onChange={handleChange}
								isArabic={isArabic}
								placeholder={t('kaidhaForm.placeholder.choose')}
							/>
							<FormInput
								label={t('kaidhaForm.city')}
								name="city"
								value={formData.city}
								onChange={handleChange}
								placeholder={t('kaidhaForm.placeholder.city')}
								required
								isArabic={isArabic}
							/>
							<FormInput
								label={t('kaidhaForm.neighborhood')}
								name="neighborhood"
								value={formData.neighborhood || ""}
								onChange={handleChange}
								placeholder={t('kaidhaForm.placeholder.neighborhood')}
								required
								isArabic={isArabic}
							/>

							{/* Address Details - Full Width in New Row */}
							<FormInput
								label={t('kaidhaForm.addressDetails')}
								name="addressDetails"
								value={formData.addressDetails || ""}
								onChange={handleChange}
								placeholder={t('kaidhaForm.placeholder.address')}
								isArabic={isArabic}
								className="sm:col-span-2 lg:col-span-4"
							/>
						</div>

						{/* Home Location Map */}
						<MapSection
							title={t('kaidhaForm.homeLocation')}
							location={formData.locationHouse || ""}
							onLocationChange={(location) => setFormData({ ...formData, locationHouse: location })}
							isLoaded={isLoaded}
							loadError={loadError}
							defaultCenter={DEFAULT_CENTER}
						/>

						{/* Work Information Section */}
						<div className="mt-8 sm:mt-10 md:mt-12">
							<SectionHeader title={t('kaidhaForm.workInfo')} isArabic={isArabic} />
							<div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
								<FormInput
									label={t('kaidhaForm.companyName')}
									name="companyName"
									value={formData.companyName || ""}
									onChange={handleChange}
									required
									isArabic={isArabic}
								/>
								<FormInput
									label={t('kaidhaForm.jobTitle')}
									name="jobTitle"
									value={formData.jobTitle || ""}
									onChange={handleChange}
									isArabic={isArabic}
								/>
								<FormInput
									label={t('kaidhaForm.yearsOfExperience')}
									name="yearsOfExperience"
									type="number"
									value={formData.yearsOfExperience || ""}
									onChange={handleChange}
									isArabic={isArabic}
								/>
								<FormInput
									label={t('kaidhaForm.grossSalary')}
									name="grossSalary"
									type="number"
									value={formData.grossSalary || ""}
									onChange={handleChange}
									required
									isArabic={isArabic}
								/>
								<FormSelect
									label={(isArabic ? 'يوم الراتب' : 'Salary Day')}
									name="salaryDay"
									options={Array.from({ length: 31 }, (_, i) => (
										{
											value: String(i + 1),
											label: String(i + 1),
										}))}
									value={formData.salaryDay || ""}
									onChange={handleChange}
									required
									isArabic={isArabic}
									placeholder={t('kaidhaForm.placeholder.choose')}
								/>
								<FormInput
									label={t('kaidhaForm.incomeSource') || (isArabic ? 'مصدر الدخل' : 'Source of Income')}
									name="incomeSource"
									value={formData.incomeSource || ""}
									onChange={handleChange}
									required
									isArabic={isArabic}
									placeholder={isArabic ? 'مصدر الدخل' : 'Source of Income'}
								/>
								<FormInput
									label={t('kaidhaForm.additionalAmount') || (isArabic ? 'المبلغ الشهري' : 'Monthly Amount')}
									name="additionalAmount"
									type="number"
									value={formData.additionalAmount || ""}
									onChange={handleChange}
									required
									isArabic={isArabic}
									placeholder={isArabic ? 'المبلغ الشهري' : 'Monthly Amount'}
								/>
								<FormInput
									label={t('kaidhaForm.workAddress')}
									name="workAddress"
									value={formData.workAddress || ""}
									onChange={handleChange}
									placeholder={t('kaidhaForm.placeholder.address')}
									isArabic={isArabic}
									className="sm:col-span-2 lg:col-span-4"
								/>
							</div>
						</div>

						{/* Work Location Map */}
						<MapSection
							title={t('kaidhaForm.workLocation')}
							location={formData.locationWork || ""}
							onLocationChange={(location) => setFormData({ ...formData, locationWork: location })}
							isLoaded={isLoaded}
							loadError={loadError}

							defaultCenter={DEFAULT_CENTER}
						/>

						{/* Additional Information */}
						<div className="mt-8 sm:mt-10 md:mt-12">
							<SectionHeader title={t('kaidhaForm.additionalInfo')} isArabic={isArabic} />

							<div className="space-y-6">
								{/* Installments Section */}
								<DynamicListSection
									title={t('kaidhaForm.installments')}
									addButtonText={t('kaidhaForm.addInstallment')}
									items={installmentsList}
									onAddItem={handleAddInstallment}
									onRemoveItem={handleRemoveInstallment}
									onItemChange={handleInstallmentChange}
									fields={[
										{ name: 'commitmentAmount', label: t('kaidhaForm.commitmentAmount'), type: 'number', maxWidth: 'sm:max-w-[281px]' },
										{ name: 'entityName', label: t('kaidhaForm.entityName'), maxWidth: 'sm:max-w-[618px]' },
									]}
									isArabic={isArabic}
								/>

								{/* Additional Income Section */}
								<DynamicListSection
									title={t('kaidhaForm.additionalIncome')}
									addButtonText={isArabic ? 'إضافة دخل' : 'Add Income'}
									items={additionalIncomeList}
									onAddItem={handleAddAdditionalIncome}
									onRemoveItem={handleRemoveAdditionalIncome}
									onItemChange={handleAdditionalIncomeChange}
									fields={[
										{ name: 'amount', label: t('kaidhaForm.additionalAmount'), type: 'number', maxWidth: 'sm:max-w-[281px]' },
										{ name: 'source', label: t('kaidhaForm.incomeSource'), maxWidth: 'sm:max-w-[618px]' },
									]}
									isArabic={isArabic}
								/>
							</div>
						</div>

						{/* Action Buttons - Responsive */}
						<div className={`mt-8 sm:mt-10 md:mt-12 flex flex-col gap-3 sm:gap-4 sm:flex-row ${isArabic ? "sm:flex-row-reverse" : ""}`}>
							<button
								type="submit"
								disabled={isSubmitting}
								className={`flex-1 sm:flex-none rounded-lg bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg dark:shadow-gray-900/50 transition-all duration-200 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 hover:shadow-xl dark:hover:shadow-gray-900/70 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isArabic ? 'flex-row-reverse' : ''}`}
							>
								{isSubmitting ? (
									<span className={`flex items-center justify-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
										<svg className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
										</svg>
										<span>{t('kaidhaForm.submitting') || (isArabic ? 'جاري الإرسال...' : 'Submitting...')}</span>
									</span>
								) : (
									t('kaidhaForm.submit')
								)}
							</button>
							<button
								type="button"
								onClick={handleReset}
								disabled={isSubmitting}
								className={`flex-1 sm:flex-none rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 shadow-sm dark:shadow-gray-900/50 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
							>
								{t('kaidhaForm.reset')}
							</button>
						</div>
					</form>
				</div>
			</div>

			{/* Notification Dialog */}
			<NotificationDialog
				message={notification.message}
				type={notification.type}
				isVisible={notification.isVisible}
				onClose={() => setNotification({ ...notification, isVisible: false })}
				isArabic={isArabic}
			/>
		</div>
	);
}

