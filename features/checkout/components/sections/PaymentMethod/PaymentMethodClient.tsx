"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { useBottomSheet } from "@/features/checkout/components/shared/useBottomSheet";
import { useCheckout } from "@/features/checkout/context/CheckoutContext";
import { isEmptyBalance, parseAmount } from "@/features/checkout/lib/balance";
import type {
	ElectronicPaymentType,
	PaymentMethodType,
} from "@/features/checkout/types/checkout.types";

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
			aria-pressed={selected}
			className={[
				"flex min-h-[5.5rem] min-w-[6.5rem] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border p-3 transition-all sm:min-h-24 sm:min-w-[7rem] sm:p-3.5 md:min-w-0 md:w-full",
				selected ? "border-brand bg-brand/10" : "border-border bg-card",
			].join(" ")}
		>
			<span className={selected ? "text-brand" : "text-muted"}>{icon}</span>
			<span
				className={[
					"text-center text-xs font-medium sm:text-[13px]",
					selected ? "text-brand" : "text-foreground",
				].join(" ")}
			>
				{label}
			</span>
			{subValue !== undefined && (
				<span className="text-[11px] text-muted sm:text-xs">{subValue}</span>
			)}
		</button>
	);
}

function VisaMasterIcon() {
	return (
		<svg viewBox="0 0 72 24" fill="none" className="h-6 w-full" aria-hidden>
			<text
				x="0"
				y="17"
				fill="#1A1F71"
				fontSize="14"
				fontWeight="700"
				fontFamily="Arial, sans-serif"
			>
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
			<text
				x="36"
				y="17"
				fill="#00A651"
				fontSize="16"
				fontWeight="700"
				fontFamily="Arial, sans-serif"
				textAnchor="middle"
			>
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
				fill="currentColor"
				className="text-foreground"
			/>
			<text
				x="24"
				y="17"
				fill="currentColor"
				fontSize="14"
				fontWeight="600"
				fontFamily="Arial, sans-serif"
				className="fill-foreground"
			>
				Pay
			</text>
		</svg>
	);
}

function StcPayIcon() {
	return (
		<svg viewBox="0 0 72 24" fill="none" className="h-6 w-full" aria-hidden>
			<rect x="4" y="4" width="16" height="16" rx="4" fill="#4F008C" />
			<text
				x="12"
				y="15.5"
				fill="#FFFFFF"
				fontSize="9"
				fontWeight="700"
				fontFamily="Arial, sans-serif"
				textAnchor="middle"
			>
				stc
			</text>
			<text
				x="42"
				y="17"
				fill="#4F008C"
				fontSize="13"
				fontWeight="700"
				fontFamily="Arial, sans-serif"
				textAnchor="middle"
			>
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

const PAYMENT_METHOD_LABELS: Record<
	Exclude<PaymentMethodType, null>,
	{ ar: string; en: string }
> = {
	"my-wallet": { ar: "محفظتي", en: "My wallet" },
	"qidha-wallet": { ar: "محفظة قيدها", en: "Qidha wallet" },
	electronic: { ar: "دفع الكتروني", en: "Electronic payment" },
};

type BalanceWalletKind = "my-wallet" | "qidha-wallet";

const EMPTY_BALANCE_SHEETS: Record<
	BalanceWalletKind,
	{
		ariaLabel: { ar: string; en: string };
		title: { ar: string; en: string };
		description: { ar: string; en: string };
		actionLabel: { ar: string; en: string };
		href: string;
	}
> = {
	"my-wallet": {
		ariaLabel: {
			ar: "المحفظة فارغة من الرصيد",
			en: "Wallet has no balance",
		},
		title: {
			ar: "المحفظة فارغة من الرصيد",
			en: "Wallet has no balance",
		},
		description: {
			ar: "يمكنك إضافة رصيد في المحفظة لتتمكن من إكمال مرحلة الدفع",
			en: "Add balance to your wallet to complete payment",
		},
		actionLabel: { ar: "إضافة رصيد", en: "Add balance" },
		href: "/profile/wallet/add",
	},
	"qidha-wallet": {
		ariaLabel: {
			ar: "الاشتراك في قيدها المطلوب",
			en: "Qidha subscription required",
		},
		title: {
			ar: "الاشتراك في قيدها المطلوب",
			en: "Qidha subscription required",
		},
		description: {
			ar: "لاستخدام محفظة قيدها، يجب الاشتراك وتفعيل المحفظة أولاً",
			en: "To use Qidha wallet, subscribe and activate it first",
		},
		actionLabel: { ar: "اشترك الآن", en: "Subscribe now" },
		href: "/profile/wallet-subscription",
	},
};

function getSelectedPaymentLabel(
	selected: PaymentMethodType,
	electronicMethod: ElectronicPaymentType,
	isArabic: boolean,
): string | null {
	if (!selected) return null;
	const methodLabel = isArabic
		? PAYMENT_METHOD_LABELS[selected].ar
		: PAYMENT_METHOD_LABELS[selected].en;
	if (selected === "electronic") {
		return methodLabel;
	}
	return methodLabel;
}

function WalletSheetContent({
	title,
	description,
	actionLabel,
	onAction,
}: {
	title: string;
	description: string;
	actionLabel: string;
	onAction: () => void;
}) {
	return (
		<div className="px-1 pb-4 pt-2 text-center sm:px-2">
			<h3 className="mb-3 text-base font-bold text-foreground sm:text-lg">{title}</h3>
			<p className="mb-6 text-sm leading-relaxed text-muted sm:text-[15px]">
				{description}
			</p>
			<button
				type="button"
				onClick={onAction}
				className="w-full rounded-xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground transition-colors active:brightness-95 sm:py-4 sm:text-[15px]"
			>
				{actionLabel}
			</button>
		</div>
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
	isArabic: boolean;
}

function ElectronicPaymentSheet({
	isOpen,
	isVisible,
	onClose,
	onConfirm,
	total,
	selected,
	onSelect,
	isArabic,
}: ElectronicPaymentSheetProps) {
	return (
		<CheckoutBottomSheet
			isOpen={isOpen}
			isVisible={isVisible}
			onClose={onClose}
			ariaLabel={
				isArabic
					? "اختر طريقة الدفع الالكتروني"
					: "Choose electronic payment method"
			}
			title={
				isArabic
					? "اختر طريقة الدفع الالكتروني"
					: "Choose electronic payment method"
			}
			showCloseButton
			isArabic={isArabic}
		>
			<p className="mb-5 text-center text-2xl font-bold text-brand sm:text-3xl">{total}</p>

			<div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
				{ELECTRONIC_OPTIONS.map((option) => {
					const isSelected = selected === option.id;

					return (
						<button
							key={option.id}
							type="button"
							onClick={() => onSelect(option.id)}
							aria-pressed={isSelected}
							className={[
								"flex aspect-square min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-xl border p-2 transition-colors sm:min-h-24 sm:p-2.5",
								isSelected
									? "border-brand bg-brand/10"
									: "border-border bg-card",
							].join(" ")}
						>
							<div className="flex h-8 w-full items-center justify-center">
								{option.icon}
							</div>
							<span className="text-center text-[11px] font-medium text-foreground">
								{option.label}
							</span>
						</button>
					);
				})}
			</div>

			<button
				type="button"
				onClick={onConfirm}
				className="w-full rounded-xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground transition-colors active:brightness-95 sm:py-4 sm:text-[15px]"
			>
				{isArabic ? "اختيار طريقة الدفع" : "Select payment method"}
			</button>
		</CheckoutBottomSheet>
	);
}

function getWalletBalance(
	id: BalanceWalletKind,
	balances: { myWalletBalance: string; walletBalance: string },
): string {
	return id === "my-wallet" ? balances.myWalletBalance : balances.walletBalance;
}

export function PaymentMethodClient({ isArabic }: { isArabic: boolean }) {
	const {
		data,
		invoice,
		selected,
		electronicMethod,
		showPaymentWarning,
		setSelected,
		setElectronicMethod,
	} = useCheckout();
	const router = useRouter();

	const emptyBalanceSheet = useBottomSheet();
	const electronicSheet = useBottomSheet();
	const [emptySheetKind, setEmptySheetKind] = useState<BalanceWalletKind | null>(null);
	const [balanceIssue, setBalanceIssue] = useState<"empty" | "insufficient">("empty");

	const handleSelectPayment = (id: PaymentMethodType) => {
		if (id === "my-wallet" || id === "qidha-wallet") {
			const balance = getWalletBalance(id, data);
			if (isEmptyBalance(balance) || parseAmount(balance) < parseAmount(invoice.total)) {
				setBalanceIssue(isEmptyBalance(balance) ? "empty" : "insufficient");
				setEmptySheetKind(id);
				emptyBalanceSheet.open();
				return;
			}
		}

		setSelected(id);

		if (id === "electronic") {
			setElectronicMethod("apple-pay");
		}
	};

	const emptySheet = emptySheetKind ? EMPTY_BALANCE_SHEETS[emptySheetKind] : null;
	const selectedLabel = getSelectedPaymentLabel(selected, electronicMethod, isArabic);

	return (
		<div dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"}>
			<h2 className="mb-3 text-sm font-bold text-foreground sm:text-[15px]">
				{isArabic ? "طريقة الدفع" : "Payment method"}
			</h2>

			<div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:gap-2.5 md:mx-0 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
				<PaymentTab
					selected={selected === "my-wallet"}
					onSelect={() => handleSelectPayment("my-wallet")}
					icon={<Wallet className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />}
					label={isArabic ? "محفظتي" : "My wallet"}
					subValue={data.myWalletBalance}
				/>
				<PaymentTab
					selected={selected === "qidha-wallet"}
					onSelect={() => handleSelectPayment("qidha-wallet")}
					icon={<CreditCard className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />}
					label={isArabic ? "محفظة قيدها" : "Qidha wallet"}
					subValue={data.walletBalance}
				/>
				<PaymentTab
					selected={selected === "electronic"}
					onSelect={() => handleSelectPayment("electronic")}
					icon={<CreditCard className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />}
					label={isArabic ? "دفع الكتروني" : "Electronic"}
				/>
			</div>

			{selectedLabel ? (
				<div className="mt-3 flex items-center gap-2 rounded-xl bg-brand/10 p-3 ring-1 ring-brand/20 sm:mt-4 sm:p-3.5">
					<CheckCircle2
						className="h-4 w-4 shrink-0 text-brand sm:h-[18px] sm:w-[18px]"
						strokeWidth={2}
					/>
					<p className="flex-1 text-xs font-medium text-brand sm:text-[13px]">
						{selectedLabel}
					</p>
				</div>
			) : (
				showPaymentWarning && (
					<div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500/10 p-3 ring-1 ring-amber-500/20 sm:mt-4 sm:p-3.5">
						<AlertCircle
							className="h-4 w-4 shrink-0 text-amber-500 sm:h-[18px] sm:w-[18px]"
							strokeWidth={2}
						/>
						<p className="flex-1 text-xs text-amber-500 sm:text-[13px]">
							{isArabic
								? "بالرجاء تحديد طريقة الدفع"
								: "Please select a payment method"}
						</p>
					</div>
				)
			)}

			<CheckoutBottomSheet
				isOpen={emptyBalanceSheet.isOpen}
				isVisible={emptyBalanceSheet.isVisible}
				onClose={emptyBalanceSheet.close}
				ariaLabel={
					emptySheet
						? isArabic
							? emptySheet.ariaLabel.ar
							: emptySheet.ariaLabel.en
						: isArabic
							? "رصيد غير كافٍ"
							: "Insufficient balance"
				}
				isArabic={isArabic}
			>
				{emptySheet && (
					<WalletSheetContent
						title={
							balanceIssue === "insufficient"
								? isArabic
									? "الرصيد غير كافٍ"
									: "Insufficient balance"
								: isArabic
									? emptySheet.title.ar
									: emptySheet.title.en
						}
						description={
							balanceIssue === "insufficient"
								? isArabic
									? "الرصيد الحالي لا يغطي إجمالي الطلب. أضف رصيدًا ثم حاول مرة أخرى."
									: "Your current balance does not cover the order total. Add funds and try again."
								: isArabic
									? emptySheet.description.ar
									: emptySheet.description.en
						}
						actionLabel={
							isArabic ? emptySheet.actionLabel.ar : emptySheet.actionLabel.en
						}
						onAction={() => {
							emptyBalanceSheet.close();
							router.push(emptySheet.href);
						}}
					/>
				)}
			</CheckoutBottomSheet>

			<ElectronicPaymentSheet
				isOpen={electronicSheet.isOpen}
				isVisible={electronicSheet.isVisible}
				onClose={electronicSheet.close}
				onConfirm={electronicSheet.close}
				total={invoice.total}
				selected={electronicMethod}
				onSelect={setElectronicMethod}
				isArabic={isArabic}
			/>
		</div>
	);
}
