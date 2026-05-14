"use client";

/**
 * Hook for investor registration form logic
 * Handles form state, workflow steps, Nafath verification, polling, and contract management
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { InvestorFormData, NotificationState, InvestorFormStep, NafathResponse } from "../types/investor.types";
import { investorFormSchema } from "../lib/validation/investor.validation";
import { INITIAL_INVESTOR_FORM_DATA, INVESTOR_CONSTANTS, INVESTOR_FORM_TRANSLATIONS } from "../constants/investor.constants";
import { previewContractPDF, initNafathVerification, checkNafathStatus, submitInvestorForm } from "../api/investor.api";

export function useInvestorRegistration(language: string) {
	const [formData, setFormData] = useState<InvestorFormData>(INITIAL_INVESTOR_FORM_DATA);
	const [currentStep, setCurrentStep] = useState<InvestorFormStep>('form');
	const [isLoading, setIsLoading] = useState(false);
	const [nafathCode, setNafathCode] = useState<string | null>(null);
	const [nafathRequestId, setNafathRequestId] = useState<string | null>(null);
	const [pollingAttempts, setPollingAttempts] = useState(0);
	const [contractPdfUrl, setContractPdfUrl] = useState<string | null>(null);
	const [signedContractUrl, setSignedContractUrl] = useState<string | null>(null);
	const [showPdfModal, setShowPdfModal] = useState(false);
	const [investorId, setInvestorId] = useState<string | null>(null);
	const [signedContractData, setSignedContractData] = useState<NafathResponse | null>(null);
	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});

	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const isArabic = language === 'ar';
	const translations = INVESTOR_FORM_TRANSLATIONS[language as keyof typeof INVESTOR_FORM_TRANSLATIONS] || INVESTOR_FORM_TRANSLATIONS.ar;
	const t = (key: string) => (translations as Record<string, string>)[key] || key;

	/**
	 * Show notification
	 */
	const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
		setNotification({ message, type, isVisible: true });
		setTimeout(() => {
			setNotification((prev) => ({ ...prev, isVisible: false }));
		}, 5000);
	}, []);

	/**
	 * Handle input changes
	 */
	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

		setFormData((prev) => ({
			...prev,
			[name]: finalValue,
		}));
	}, []);

	/**
	 * Validate form using Zod schema
	 */
	const validateForm = useCallback(() => {
		const result = investorFormSchema.safeParse(formData);
		if (!result.success) {
			return {
				isValid: false,
				message: result.error.issues[0].message,
			};
		}
		return { isValid: true, message: '' };
	}, [formData]);

	/**
	 * Stop polling
	 */
	const stopPolling = useCallback(() => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
			pollingIntervalRef.current = null;
		}
	}, []);

	/**
	 * Check Nafath Status (Polling)
	 */
	const checkNafathStatusLocal = useCallback(async () => {
		if (!nafathRequestId) return false;

		try {
			const result = await checkNafathStatus(nafathRequestId, language);

			if (result.data) {
				if (result.data.status === 'approved') {
					stopPolling();
					showNotification(
						`${t('verificationSuccess')} - ${result.data.full_name_ar || ''}`,
						'success'
					);
					await finalizeRegistration();
					return true;
				} else if (result.data.status === 'pending') {
					return false;
				} else {
					stopPolling();
					throw new Error(t('verificationFailed'));
				}
			} else {
				throw new Error(result.error || t('verificationError'));
			}
		} catch (error: any) {
			console.error('Error in checkNafathStatus:', error);
			showNotification(error.message || t('verificationError'), 'error');
			return false;
		}
	}, [nafathRequestId, language, stopPolling, showNotification, t]);

	/**
	 * Start polling for Nafath status
	 */
	const startPolling = useCallback(() => {
		stopPolling(); // Clear any existing interval

		const interval = setInterval(async () => {
			setPollingAttempts((prev) => {
				const newCount = prev + 1;

				// Timeout after max attempts
				if (newCount >= INVESTOR_CONSTANTS.POLLING.MAX_ATTEMPTS) {
					stopPolling();
					showNotification(t('verificationTimeout'), 'error');
					setCurrentStep('form');
					return 0;
				}

				return newCount;
			});

			await checkNafathStatusLocal();
		}, INVESTOR_CONSTANTS.POLLING.INTERVAL);

		pollingIntervalRef.current = interval;
	}, [checkNafathStatusLocal, stopPolling, showNotification, t]);

	/**
	 * Finalize Registration + Sign Contract
	 */
	const finalizeRegistration = useCallback(async () => {
		try {
			setIsLoading(true);
			const result = await submitInvestorForm(formData, language);

			if (result.data && result.data.id && result.data.is_completed) {
				setInvestorId(result.data.id);
				await fetchSignedContract();
			} else {
				throw new Error(result.error || t('registrationFailed'));
			}
		} catch (error: any) {
			console.error('Error in finalizeRegistration:', error);
			showNotification(error.message || t('registrationError'), 'error');
			setIsLoading(false);
		}
	}, [formData, language, showNotification, t]);

	/**
	 * Fetch signed contract after registration
	 */
	const fetchSignedContract = useCallback(async () => {
		if (!nafathRequestId) {
			setCurrentStep('complete');
			setIsLoading(false);
			return;
		}

		try {
			const result = await checkNafathStatus(nafathRequestId, language);

			if (result.data && result.data.signed_file_url) {
				setSignedContractUrl(result.data.signed_file_url);
				setSignedContractData(result.data);
				setCurrentStep('complete');
				showNotification(t('registrationSuccess'), 'success');
			} else {
				throw new Error(result.error || t('signedContractNotFound'));
			}
		} catch (error: any) {
			console.error('Error in fetchSignedContract:', error);
			showNotification(error.message || t('signedContractFetchError'), 'error');
			// Still show complete step even if contract fetch fails
			setCurrentStep('complete');
		} finally {
			setIsLoading(false);
		}
	}, [nafathRequestId, language, showNotification, t]);

	/**
	 * Preview Contract PDF (Optional)
	 */
	const previewContract = useCallback(async () => {
		try {
			setIsLoading(true);
			const result = await previewContractPDF(formData, language);

			if (result.data) {
				const url = URL.createObjectURL(result.data);
				setContractPdfUrl(url);
				setShowPdfModal(true);
				showNotification(t('contractLoadedSuccess'), 'success');
			} else {
				throw new Error(result.error || t('contractLoadFailed'));
			}
		} catch (error: any) {
			console.error('Error in previewContract:', error);
			showNotification(error.message || t('contractLoadFailed'), 'error');
		} finally {
			setIsLoading(false);
		}
	}, [formData, language, showNotification, t]);

	/**
	 * Initiate Nafath Authentication
	 */
	const initiateNafath = useCallback(async () => {
		try {
			setIsLoading(true);
			const result = await initNafathVerification(formData, language);

			if (result.data && result.data.request_id && result.data.external_response?.[0]?.random) {
				setNafathRequestId(result.data.request_id);
				setNafathCode(result.data.external_response[0].random);
				setCurrentStep('verification');
				setPollingAttempts(0);
				startPolling();
			} else {
				throw new Error(result.error || t('verificationInitFailed'));
			}
		} catch (error: any) {
			console.error('Error in initiateNafath:', error);
			showNotification(error.message || t('verificationInitError'), 'error');
		} finally {
			setIsLoading(false);
		}
	}, [formData, language, startPolling, showNotification, t]);

	/**
	 * Cancel verification
	 */
	const cancelVerification = useCallback(() => {
		stopPolling();
		setCurrentStep('form');
		setNafathCode(null);
		setNafathRequestId(null);
		setPollingAttempts(0);
	}, [stopPolling]);

	/**
	 * Form submission handler
	 */
	const handleSubmit = useCallback(() => {
		const validation = validateForm();
		if (!validation.isValid) {
			showNotification(validation.message, 'error');
			return;
		}

		initiateNafath();
	}, [validateForm, showNotification, initiateNafath]);

	/**
	 * Reset form to initial state
	 */
	const handleReset = useCallback(() => {
		setFormData(INITIAL_INVESTOR_FORM_DATA);
		setCurrentStep('form');
		setNafathCode(null);
		setNafathRequestId(null);
		setContractPdfUrl(null);
		setSignedContractUrl(null);
		setSignedContractData(null);
		setInvestorId(null);
		setPollingAttempts(0);
		stopPolling();
	}, [stopPolling]);

	// Cleanup polling on unmount
	useEffect(() => {
		return () => {
			stopPolling();
		};
	}, [stopPolling]);

	return {
		// Form state
		formData,
		setFormData,

		// Workflow state
		currentStep,
		isLoading,
		nafathCode,
		nafathRequestId,
		pollingAttempts,
		contractPdfUrl,
		signedContractUrl,
		showPdfModal,
		setShowPdfModal,
		investorId,
		signedContractData,

		// Notification
		notification,
		setNotification,

		// Handlers
		handleChange,
		handleSubmit,
		handleReset,
		previewContract,
		cancelVerification,

		// Translation helper
		t,
		isArabic,
	};
}

