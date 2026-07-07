"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WalletStepper } from "../../shared/wallet/WalletStepper";
import type { WalletStep } from "../../shared/wallet/WalletStepper";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { IncomeStep } from "./steps/IncomeStep";
import { ContractStep } from "./steps/ContractStep";
import { PendingStep } from "./steps/PendingStep";
import type { WalletFormData } from "./types";

const initialFormData: WalletFormData = {
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    familyName: "",
    birthDate: "",
    nationality: "",
    maritalStatus: "",
    familyCount: "",
    idNumber: "",
    idExpiryDate: "",
    phone: "",
    homeType: "",
    city: "",
    neighborhood: "",
    incomeSource: "",
    employerName: "",
    monthlyIncome: "",
    salaryDay: "",
    hasInstallments: "",
    uploadedDoc: null,
};

const STEP_TITLES: Record<WalletStep, string> = {
    "personal-info": "الاشتراك قيدها",
    income: "الاشتراك قيدها",
    contract: "الاشتراك قيدها",
    pending: "",
};

export function WalletSubscriptionClient() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<WalletStep>("personal-info");
    const [formData, setFormData] = useState<WalletFormData>(initialFormData);

    const handleUpdate = (updates: Partial<WalletFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const handleBack = () => {
        if (currentStep === "personal-info") {
            router.back();
        } else if (currentStep === "income") {
            setCurrentStep("personal-info");
        } else if (currentStep === "contract") {
            setCurrentStep("income");
        } else {
            router.back();
        }
    };

    const showStepper = currentStep !== "pending";
    const stepperLabel = STEP_TITLES[currentStep];

    return (
        <div className="flex min-h-dvh flex-col overflow-x-hidden bg-white dark:bg-gray-950" dir="rtl">
            <header className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center border-b border-[#F6F5F8] bg-white px-4 py-5 shadow-[0px_6px_25.1px_rgba(0,0,0,0.05)] dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0px_6px_25.1px_rgba(0,0,0,0.25)] sm:px-5 md:px-6">
                <button
                    type="button"
                    onClick={handleBack}
                    aria-label="رجوع"
                    className="-me-1 flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-gray-100 dark:active:bg-gray-800"
                >
                    <ChevronRight
                        className="h-6 w-6 text-[#111B18] dark:text-gray-100"
                        strokeWidth={1.5}
                    />
                </button>
                <h1 className="truncate text-center text-[18px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100">
                    محفظة قيدها
                </h1>
                <div className="w-9" aria-hidden />
            </header>

            {showStepper && (
                <div className="border-b border-[#F6F5F8] bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900 sm:px-5 md:px-6">
                    <div className="mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-3xl">
                    {stepperLabel && (
                        <p className="mb-3 text-center text-[14px] font-bold text-[#111B18] dark:text-gray-100">
                            {stepperLabel}
                        </p>
                    )}
                    <WalletStepper currentStep={currentStep} variant="form" />
                    </div>
                </div>
            )}

            <main className="mx-auto w-full max-w-lg flex-1 overflow-y-auto px-4 pt-4 sm:max-w-2xl sm:px-5 lg:max-w-3xl lg:px-6">
                {currentStep === "personal-info" && (
                    <PersonalInfoStep
                        data={formData}
                        onChange={handleUpdate}
                        onNext={() => setCurrentStep("income")}
                        onViewContract={() => {
                            // TODO: navigate to contract preview
                        }}
                    />
                )}
                {currentStep === "income" && (
                    <IncomeStep
                        data={formData}
                        onChange={handleUpdate}
                        onNext={() => setCurrentStep("contract")}
                    />
                )}
                {currentStep === "contract" && (
                    <ContractStep
                        onViewContract={() => {
                            // TODO: open contract preview
                        }}
                        onCheckStatus={() => {
                            // TODO: check Nafath status
                        }}
                        onVerify={() => setCurrentStep("pending")}
                    />
                )}
                {currentStep === "pending" && (
                    <PendingStep
                        onViewContract={() => {
                            // TODO: open contract preview
                        }}
                        onContactSupport={() => {
                            // TODO: open customer support
                        }}
                    />
                )}
            </main>
        </div>
    );
}
