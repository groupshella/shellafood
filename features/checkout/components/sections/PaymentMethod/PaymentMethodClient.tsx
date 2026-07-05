"use client";

import { AlertCircle, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { useBottomSheet } from "@/features/checkout/components/shared/useBottomSheet";
import { useCheckout } from "@/features/checkout/context/CheckoutContext";
import type { ElectronicPaymentType, PaymentMethodType } from "@/features/checkout/types/checkout.types";

interface PaymentTabProps {
    selected: boolean;
    onSelect: () => void;
    icon: React.ReactNode;
    label: string;
    subValue?: string;
}

function PaymentTab({ selected, onSelect, icon, label, subValue }: PaymentTabProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex min-w-[100px] shrink-0 flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                selected
                    ? "border-[#30913F] bg-[#EBFEEB]"
                    : "border-gray-200 bg-white"
            }`}
        >
            <span className={selected ? "text-[#30913F]" : "text-gray-500"}>{icon}</span>
            <span
                className={`text-center text-[12px] font-medium ${
                    selected ? "text-[#30913F]" : "text-gray-700"
                }`}
            >
                {label}
            </span>
            {subValue !== undefined && (
                <span className="text-[11px] text-gray-500">{subValue} ﷼</span>
            )}
        </button>
    );
}

const isEmptyBalance = (val: string) =>
    val === "0" || val === "00.0" || val === "0.0" || val === "0.00";

function VisaMasterIcon() {
    return (
        <svg viewBox="0 0 72 24" fill="none" className="h-6 w-full" aria-hidden>
            <text x="0" y="17" fill="#1A1F71" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">
                VISA
            </text>
            <circle cx="52" cy="12" r="8" fill="#EB001B" />
            <circle cx="62" cy="12" r="8" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
    );
}

function MadaIcon() {
    return (
        <svg viewBox="0 0 72 24" fill="none" className="h-6 w-full" aria-hidden>
            <text x="36" y="17" fill="#00A651" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif" textAnchor="middle">
                mada
            </text>
        </svg>
    );
}

function ApplePayIcon() {
    return (
        <svg viewBox="0 0 72 24" fill="none" className="h-6 w-full" aria-hidden>
            <path
                d="M14.2 6.2c-.5.6-1.3 1.1-2.1 1-.1-.8.3-1.6.8-2.1.5-.6 1.4-1 2.1-1 .1.8-.2 1.6-.8 2.1Zm-.7 1.2c-1.2-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.1 2-.9 1.5-.7 3.8.6 5.3.5.7 1.1 1.4 1.9 1.4.8 0 1.1-.5 2.1-.5 1 0 1.2.5 2.1.5.8 0 1.4-.7 1.9-1.4.6-.8.8-1.6.8-1.7-.1 0-1.6-.6-1.6-2.4 0-1.5 1.2-2.2 1.3-2.3-1.1-1.6-2.7-1.7-3.2-1.7Z"
                fill="#111B18"
            />
            <text x="24" y="17" fill="#111B18" fontSize="14" fontWeight="600" fontFamily="Arial, sans-serif">
                Pay
            </text>
        </svg>
    );
}

function StcPayIcon() {
    return (
        <svg viewBox="0 0 72 24" fill="none" className="h-6 w-full" aria-hidden>
            <rect x="4" y="4" width="16" height="16" rx="4" fill="#4F008C" />
            <text x="12" y="15.5" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif" textAnchor="middle">
                stc
            </text>
            <text x="42" y="17" fill="#4F008C" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif" textAnchor="middle">
                pay
            </text>
        </svg>
    );
}

const ELECTRONIC_OPTIONS = [
    { id: "visa-master" as const, label: "VISA / MASTER", icon: <VisaMasterIcon /> },
    { id: "mada" as const, label: "Mada Card", icon: <MadaIcon /> },
    { id: "apple-pay" as const, label: "Apple Pay", icon: <ApplePayIcon /> },
    { id: "stc-pay" as const, label: "Debit Card", icon: <StcPayIcon /> },
];

const PAYMENT_METHOD_LABELS: Record<Exclude<PaymentMethodType, null>, string> = {
    "my-wallet": "محفظتي",
    "qidha-wallet": "محفظة قيدها",
    electronic: "دفع الكتروني",
};

function getSelectedPaymentLabel(
    selected: PaymentMethodType,
    electronicMethod: ElectronicPaymentType
): string | null {
    if (!selected) return null;
    if (selected === "electronic") {
        const option = ELECTRONIC_OPTIONS.find((o) => o.id === electronicMethod);
        return option ? `${PAYMENT_METHOD_LABELS.electronic} · ${option.label}` : PAYMENT_METHOD_LABELS.electronic;
    }
    return PAYMENT_METHOD_LABELS[selected];
}

interface EmptyWalletSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
}

function EmptyWalletSheet({ isOpen, isVisible, onClose }: EmptyWalletSheetProps) {
    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel="المحفظة فارغة من الرصيد"
        >
            <div className="px-2 pb-4 pt-2 text-center">
                <h3 className="mb-3 text-[17px] font-bold text-gray-900">
                    المحفظة فارغة من الرصيد
                </h3>
                <p className="mb-6 text-[14px] leading-relaxed text-gray-600">
                    يمكنك إضافة رصيد فالمحفظة لتتمكن من إكمال مرحلة الدفع
                </p>
                <button
                    type="button"
                    className="w-full rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
                >
                    إضافة رصيد
                </button>
            </div>
        </CheckoutBottomSheet>
    );
}

interface QidhaWalletSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
}

function QidhaWalletSheet({ isOpen, isVisible, onClose }: QidhaWalletSheetProps) {
    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel="الاشتراك في قيدها المطلوب"
        >
            <div className="px-2 pb-4 pt-2 text-center">
                <h3 className="mb-3 text-[17px] font-bold text-gray-900">
                    الاشتراك في قيدها المطلوب
                </h3>
                <p className="mb-6 text-[14px] leading-relaxed text-gray-600">
                    لاستخدام محفظة قيدها ، يجب الاشتراك وتفعيل المحفظة أولاً
                </p>
                <button
                    type="button"
                    className="w-full rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
                >
                    اشترك الآن
                </button>
            </div>
        </CheckoutBottomSheet>
    );
}

interface ElectronicPaymentSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    total: string;
    selected: ElectronicPaymentType;
    onSelect: (id: ElectronicPaymentType) => void;
}

function ElectronicPaymentSheet({
    isOpen,
    isVisible,
    onClose,
    onConfirm,
    total,
    selected,
    onSelect,
}: ElectronicPaymentSheetProps) {
    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel="اختر طريقة الدفع الالكتروني"
            title="اختر طريقة الدفع الالكتروني"
            showCloseButton
        >
            <p className="mb-5 text-center text-[28px] font-bold text-[#30913F]">{total}</p>

            <div className="mb-6 grid grid-cols-3 gap-3">
                {ELECTRONIC_OPTIONS.map((option) => {
                    const isSelected = selected === option.id;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onSelect(option.id)}
                            className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border p-2 transition-colors ${
                                isSelected
                                    ? "border-[#30913F] bg-[#EBFEEB]"
                                    : "border-gray-200 bg-white"
                            }`}
                        >
                            <div className="flex h-8 w-full items-center justify-center">
                                {option.icon}
                            </div>
                            <span className="text-center text-[11px] font-medium text-gray-700">
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={onConfirm}
                className="w-full rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
            >
                اختيار طريقة الدفع
            </button>
        </CheckoutBottomSheet>
    );
}

export function PaymentMethodClient() {
    const {
        data,
        selected,
        electronicMethod,
        showPaymentWarning,
        setSelected,
        setElectronicMethod,
    } = useCheckout();

    const emptyWalletSheet = useBottomSheet();
    const qidhaSheet = useBottomSheet();
    const electronicSheet = useBottomSheet();

    const handleSelectPayment = (id: PaymentMethodType) => {
        setSelected(id);

        if (id === "my-wallet" && isEmptyBalance(data.myWalletBalance)) {
            emptyWalletSheet.open();
            return;
        }

        if (id === "qidha-wallet" && isEmptyBalance(data.walletBalance)) {
            qidhaSheet.open();
            return;
        }

        if (id === "electronic") {
            electronicSheet.open();
        }
    };

    const handleConfirmElectronicMethod = () => {
        electronicSheet.close();
    };

    const selectedLabel = getSelectedPaymentLabel(selected, electronicMethod);

    return (
        <div dir="rtl">
            <h2 className="mb-3 text-[15px] font-bold text-gray-900">طريقة الدفع</h2>

            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                <PaymentTab
                    selected={selected === "my-wallet"}
                    onSelect={() => handleSelectPayment("my-wallet")}
                    icon={<Wallet className="h-6 w-6" strokeWidth={1.8} />}
                    label="محفظتي"
                    subValue={data.myWalletBalance}
                />
                <PaymentTab
                    selected={selected === "qidha-wallet"}
                    onSelect={() => handleSelectPayment("qidha-wallet")}
                    icon={<CreditCard className="h-6 w-6" strokeWidth={1.8} />}
                    label="محفظة قيدها"
                    subValue={data.walletBalance}
                />
                <PaymentTab
                    selected={selected === "electronic"}
                    onSelect={() => handleSelectPayment("electronic")}
                    icon={<CreditCard className="h-6 w-6" strokeWidth={1.8} />}
                    label="دفع الكتروني"
                />
            </div>

            {selectedLabel ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#EBFEEB] p-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#30913F]" strokeWidth={2} />
                    <p className="flex-1 text-[13px] font-medium text-[#267332]">{selectedLabel}</p>
                </div>
            ) : (
                showPaymentWarning && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#FFF8ED] p-3">
                        <AlertCircle className="h-4 w-4 shrink-0 text-gray-900" strokeWidth={2} />
                        <p className="flex-1 text-[13px] text-gray-700">بالرجاء تحديد طريقة الدفع</p>
                    </div>
                )
            )}

            <EmptyWalletSheet
                isOpen={emptyWalletSheet.isOpen}
                isVisible={emptyWalletSheet.isVisible}
                onClose={emptyWalletSheet.close}
            />
            <QidhaWalletSheet
                isOpen={qidhaSheet.isOpen}
                isVisible={qidhaSheet.isVisible}
                onClose={qidhaSheet.close}
            />
            <ElectronicPaymentSheet
                isOpen={electronicSheet.isOpen}
                isVisible={electronicSheet.isVisible}
                onClose={electronicSheet.close}
                onConfirm={handleConfirmElectronicMethod}
                total={data.invoice.total}
                selected={electronicMethod}
                onSelect={setElectronicMethod}
            />
        </div>
    );
}
