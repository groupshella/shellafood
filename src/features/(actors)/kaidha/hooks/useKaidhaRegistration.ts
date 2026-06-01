"use client";

/**
 * Hook for kaidha registration form logic
 */

import { useState, useCallback } from "react";
import { submitKaidhaForm } from "../api/kaidha.api";
import type { KaidhaFormData, InstallmentItem, AdditionalIncomeItem, NotificationState } from "../types/kaidha.types";
import { kaidhaUserSchema } from "../lib/validation/kaidha.validation";
import { KAIDHA_CONSTANTS } from "../constants/kaidha.constants";

const INITIAL_FORM_DATA: KaidhaFormData = {
	firstName: "",
	lastName: "",
	fatherName: "",
	grandFatherName: "",
	birthDate: "",
	nationality: "",
	socialStatus: "",
	familyMembersCount: "",
	idType: "",
	personalIdNumber: "",
	idExpirationDate: "",
	phoneNumber: "",
	whatsappNumber: "",
	email: "",
	homeType: "",
	homeNature: "",
	city: "",
	neighborhood: "",
	addressDetails: "",
	locationHouse: "",
	agreed: false,
	companyName: "",
	jobTitle: "",
	yearsOfExperience: "",
	grossSalary: "",
	workAddress: "",
	locationWork: "",
	installments: "",
	hasAdditionalIncome: "",
	additionalAmount: "",
	incomeSource: "",
	salaryDay: "",
};

export function useKaidhaRegistration(language: string) {
	const [formData, setFormData] = useState<KaidhaFormData>(INITIAL_FORM_DATA);
	const [installmentsList, setInstallmentsList] = useState<InstallmentItem[]>([]);
	const [additionalIncomeList, setAdditionalIncomeList] = useState<AdditionalIncomeItem[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});

	const isArabic = language === 'ar';

	/**
	 * Handle input changes
	 */
	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name } = e.target;
		let value: string | boolean;

		if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
			value = e.target.checked;
		} else {
			value = e.target.value;
		}

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	}, []);

	/**
	 * Handle form submission
	 */
	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validate form data using Zod schema
		const result = kaidhaUserSchema.safeParse(formData);
		if (!result.success) {
			const firstError = result.error.issues[0];
			setNotification({
				message: firstError.message,
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Prepare form data with dynamic lists serialized as JSON
			const submitData: KaidhaFormData = {
				...formData,
				installments: JSON.stringify(installmentsList),
				hasAdditionalIncome: JSON.stringify(additionalIncomeList),
			};

			// Call API
			const apiResult = await submitKaidhaForm(submitData, language);

			if (apiResult.data) {
				setNotification({
					message: isArabic
						? "تم تقديم الطلب بنجاح! سنتواصل معك قريباً."
						: "Application submitted successfully! We will contact you soon.",
					type: "success",
					isVisible: true,
				});

				// Reset form after successful submission
				setTimeout(() => {
					handleReset();
				}, KAIDHA_CONSTANTS.RESET_DELAY);
			} else {
				setNotification({
					message: apiResult.error || (isArabic ? "حدث خطأ أثناء الإرسال" : "An error occurred during submission"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			setNotification({
				message: isArabic
					? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
					: "An unexpected error occurred. Please try again.",
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, installmentsList, additionalIncomeList, language, isArabic]);

	/**
	 * Reset form to initial state
	 */
	const handleReset = useCallback(() => {
		setFormData(INITIAL_FORM_DATA);
		setInstallmentsList([]);
		setAdditionalIncomeList([]);
	}, []);

	/**
	 * Add installment item
	 */
	const handleAddInstallment = useCallback(() => {
		setInstallmentsList((prev) => [...prev, { commitmentAmount: "", entityName: "" }]);
	}, []);

	/**
	 * Remove installment item
	 */
	const handleRemoveInstallment = useCallback((index: number) => {
		setInstallmentsList((prev) => prev.filter((_, i) => i !== index));
	}, []);

	/**
	 * Update installment item
	 */
	const handleInstallmentChange = useCallback((index: number, field: string, value: string) => {
		setInstallmentsList((prev) => {
			const newList = [...prev];
			newList[index] = { ...newList[index], [field]: value };
			return newList;
		});
	}, []);

	/**
	 * Add additional income item
	 */
	const handleAddAdditionalIncome = useCallback(() => {
		setAdditionalIncomeList((prev) => [...prev, { amount: "", source: "" }]);
	}, []);

	/**
	 * Remove additional income item
	 */
	const handleRemoveAdditionalIncome = useCallback((index: number) => {
		setAdditionalIncomeList((prev) => prev.filter((_, i) => i !== index));
	}, []);

	/**
	 * Update additional income item
	 */
	const handleAdditionalIncomeChange = useCallback((index: number, field: string, value: string) => {
		setAdditionalIncomeList((prev) => {
			const newList = [...prev];
			newList[index] = { ...newList[index], [field]: value };
			return newList;
		});
	}, []);

	return {
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
	};
}

