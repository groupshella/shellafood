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

const ELECTRONIC_OPTIONS = [
    { id: "visa-master" as const, label: "VISA / MASTER" },
    { id: "mada" as const, label: "Mada Card" },
    { id: "apple-pay" as const, label: "Apple Pay" },
    { id: "stc-pay" as const, label: "Debit Card" },
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
                            <div className="flex h-8 w-full items-center justify-center text-[10px] font-bold text-gray-400">
                                {option.id === "visa-master" && "VISA / MC"}
                                {option.id === "mada" && "mada"}
                                {option.id === "apple-pay" && " Pay"}
                                {option.id === "stc-pay" && "stc pay"}
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
