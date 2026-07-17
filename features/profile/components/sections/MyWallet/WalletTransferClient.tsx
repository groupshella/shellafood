"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
	addWalletRecipient,
	deleteWalletRecipient,
	getWalletRecipients,
	transferWalletFunds,
	validateWalletRecipient,
} from "@/features/profile/api/wallet-client";
import { refreshCustomerInfo } from "@/features/profile/actions/profile.actions";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { normalizeSaudiPhone } from "@/features/profile/lib/wallet-validation";
import type {
	WalletRecipient,
	WalletTransferSource,
} from "@/features/profile/types/wallet.types";
import { useNotification } from "@/shared/components/NotificationToast";

interface TransferSnapshot {
	recipientPhone: string;
	recipientLabel: string;
	amount: number;
	source: WalletTransferSource;
	saveRecipient: boolean;
	nickname?: string;
	message?: string;
}

function recipientPhone(recipient: WalletRecipient) {
	return recipient.recipient_phone ?? recipient.phone ?? "";
}

function recipientName(recipient: WalletRecipient) {
	return recipient.recipient_name ?? recipient.name ?? recipientPhone(recipient);
}

function recipientId(recipient: WalletRecipient) {
	return recipient.id ?? recipient.recipient_id;
}

export function WalletTransferClient({
	isArabic,
	walletBalance,
	qidhaBalance,
	ownPhone,
}: {
	isArabic: boolean;
	walletBalance: number;
	qidhaBalance: number;
	ownPhone: string;
}) {
	const lang = isArabic ? "ar" : "en";
	const router = useRouter();
	const { success, error } = useNotification();
	const [recipients, setRecipients] = useState<WalletRecipient[]>([]);
	const [loadingRecipients, setLoadingRecipients] = useState(true);
	const [recipientError, setRecipientError] = useState(false);
	const [phone, setPhone] = useState("");
	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	const [message, setMessage] = useState("");
	const [source, setSource] = useState<WalletTransferSource>("wallet");
	const [saveRecipient, setSaveRecipient] = useState(false);
	const [validatedName, setValidatedName] = useState("");
	const [isValidated, setIsValidated] = useState(false);
	const [transferSnapshot, setTransferSnapshot] = useState<TransferSnapshot | null>(
		null,
	);
	const [busy, setBusy] = useState(false);

	async function loadRecipients() {
		setLoadingRecipients(true);
		setRecipientError(false);
		try {
			const data = await getWalletRecipients(lang);
			setRecipients(Array.isArray(data) ? data : []);
		} catch (cause) {
			setRecipientError(true);
			error(cause instanceof Error ? cause.message : isArabic ? "تعذر تحميل المستلمين" : "Could not load recipients");
		} finally {
			setLoadingRecipients(false);
		}
	}

	useEffect(() => {
		void loadRecipients();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function chooseRecipient(recipient: WalletRecipient) {
		const savedPhone = normalizeSaudiPhone(recipientPhone(recipient));
		setPhone(savedPhone ?? recipientPhone(recipient));
		setValidatedName(recipientName(recipient));
		setIsValidated(savedPhone != null);
	}

	async function validateRecipient() {
		const normalized = normalizeSaudiPhone(phone);
		if (!normalized) {
			error(isArabic ? "أدخل رقم جوال سعودي صحيح" : "Enter a valid Saudi mobile number");
			return;
		}
		if (normalized === normalizeSaudiPhone(ownPhone)) {
			error(
				isArabic
					? "لا يمكنك التحويل إلى رقمك"
					: "You cannot transfer to your own number",
			);
			return;
		}
		setBusy(true);
		try {
			const data = await validateWalletRecipient({ phone: normalized }, lang);
			const resolvedName =
				data.name ??
				data.recipient?.recipient_name ??
				data.recipient?.name ??
				name.trim();
			setPhone(normalized);
			setValidatedName(resolvedName || normalized);
			setIsValidated(true);
			success(isArabic ? "تم التحقق من المستلم" : "Recipient verified");
		} catch (cause) {
			setIsValidated(false);
			error(cause instanceof Error ? cause.message : isArabic ? "فشل التحقق" : "Validation failed");
		} finally {
			setBusy(false);
		}
	}

	async function addRecipient() {
		const normalized = normalizeSaudiPhone(phone);
		if (!normalized || !name.trim()) {
			error(isArabic ? "أدخل الاسم ورقم جوال سعودي صحيح" : "Enter a name and valid Saudi mobile number");
			return;
		}
		setBusy(true);
		try {
			await addWalletRecipient(
				{ recipient_phone: normalized, recipient_name: name.trim() },
				lang,
			);
			success(isArabic ? "تمت إضافة المستلم" : "Recipient added");
			setName("");
			await loadRecipients();
		} catch (cause) {
			error(cause instanceof Error ? cause.message : isArabic ? "تعذرت الإضافة" : "Could not add recipient");
		} finally {
			setBusy(false);
		}
	}

	async function removeRecipient(recipient: WalletRecipient) {
		const id = recipientId(recipient);
		if (id == null) {
			error(isArabic ? "معرّف المستلم غير صالح" : "Invalid recipient identifier");
			return;
		}
		setBusy(true);
		try {
			await deleteWalletRecipient(id, lang);
			setRecipients((current) => current.filter((item) => recipientId(item) !== id));
			success(isArabic ? "تم حذف المستلم" : "Recipient deleted");
		} catch (cause) {
			error(cause instanceof Error ? cause.message : isArabic ? "تعذر الحذف" : "Could not delete recipient");
		} finally {
			setBusy(false);
		}
	}

	function requestConfirmation() {
		const normalizedPhone = normalizeSaudiPhone(phone);
		const parsedAmount = Number(amount);
		const balance = source === "wallet" ? walletBalance : qidhaBalance;
		if (!isValidated || !normalizedPhone) {
			error(isArabic ? "تحقق من المستلم أولاً" : "Verify the recipient first");
			return;
		}
		if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
			error(isArabic ? "أدخل مبلغًا صحيحًا" : "Enter a valid amount");
			return;
		}
		if (parsedAmount > balance) {
			error(isArabic ? "الرصيد غير كافٍ" : "Insufficient balance");
			return;
		}
		setTransferSnapshot({
			recipientPhone: normalizedPhone,
			recipientLabel: validatedName || normalizedPhone,
			amount: parsedAmount,
			source,
			saveRecipient,
			nickname: name.trim() || undefined,
			message: message.trim() || undefined,
		});
	}

	async function confirmTransfer() {
		if (!transferSnapshot) return;
		setBusy(true);
		try {
			await transferWalletFunds(
				{
					recipient_phone: transferSnapshot.recipientPhone,
					amount: transferSnapshot.amount,
					payment_source: transferSnapshot.source,
					save_recipient: transferSnapshot.saveRecipient,
					recipient_nickname: transferSnapshot.nickname,
					message: transferSnapshot.message,
				},
				lang,
			);
			await refreshCustomerInfo(lang);
			success(isArabic ? "تم التحويل بنجاح" : "Transfer completed");
			router.push("/profile/wallet");
			router.refresh();
		} catch (cause) {
			error(cause instanceof Error ? cause.message : isArabic ? "فشل التحويل" : "Transfer failed");
		} finally {
			setBusy(false);
			setTransferSnapshot(null);
		}
	}

	return (
		<ProfileSubpageShell title={isArabic ? "تحويل رصيد" : "Transfer funds"} isArabic={isArabic}>
			<div className="mx-auto flex w-full max-w-lg flex-col gap-5">
				<section className="rounded-xl border p-4">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="font-bold">{isArabic ? "المستلمون المحفوظون" : "Saved recipients"}</h2>
						{recipientError && <button type="button" onClick={() => void loadRecipients()} className="text-sm font-bold text-brand">{isArabic ? "إعادة المحاولة" : "Retry"}</button>}
					</div>
					{loadingRecipients ? (
						<p className="text-sm text-muted-foreground">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
					) : recipients.length === 0 ? (
						<p className="text-sm text-muted-foreground">{isArabic ? "لا يوجد مستلمون محفوظون" : "No saved recipients"}</p>
					) : (
						<div className="flex flex-col gap-2">
							{recipients.map((recipient, index) => (
								<div key={recipientId(recipient) ?? `${recipientPhone(recipient)}-${index}`} className="flex items-center gap-2 rounded-lg bg-muted p-3">
									<button type="button" onClick={() => chooseRecipient(recipient)} className="min-w-0 flex-1 text-start">
										<span className="block font-bold">{recipientName(recipient)}</span>
										<span className="block text-xs text-muted-foreground">{recipientPhone(recipient)}</span>
									</button>
									<button type="button" disabled={busy} onClick={() => void removeRecipient(recipient)} className="text-sm text-red-600">{isArabic ? "حذف" : "Delete"}</button>
								</div>
							))}
						</div>
					)}
				</section>

				<section className="flex flex-col gap-3 rounded-xl border p-4">
					<label className="text-sm font-bold">{isArabic ? "رقم جوال المستلم" : "Recipient mobile"}</label>
					<input value={phone} onChange={(event) => { setPhone(event.target.value); setIsValidated(false); setValidatedName(""); setTransferSnapshot(null); }} inputMode="tel" placeholder="05xxxxxxxx" className="h-12 rounded-lg border bg-background px-3" />
					<div className="flex gap-2">
						<input value={name} onChange={(event) => setName(event.target.value)} placeholder={isArabic ? "اسم للحفظ" : "Name to save"} className="h-11 min-w-0 flex-1 rounded-lg border bg-background px-3" />
						<button type="button" disabled={busy} onClick={() => void addRecipient()} className="rounded-lg border px-3 text-sm font-bold">{isArabic ? "حفظ" : "Add"}</button>
					</div>
					<button type="button" disabled={busy} onClick={() => void validateRecipient()} className="h-11 rounded-lg bg-brand font-bold text-brand-foreground">
						{busy ? (isArabic ? "جاري التحقق..." : "Verifying...") : (isArabic ? "تحقق من المستلم" : "Verify recipient")}
					</button>
					{isValidated && <p className="text-sm font-bold text-brand">✓ {validatedName}</p>}
				</section>

				<section className="flex flex-col gap-3 rounded-xl border p-4">
					<label className="text-sm font-bold">{isArabic ? "مصدر الرصيد" : "Balance source"}</label>
					<div className="grid grid-cols-2 gap-2">
						{([
							["wallet", walletBalance, isArabic ? "المحفظة" : "Wallet"],
							["wallet_qidha", qidhaBalance, isArabic ? "محفظة قيدها" : "Qidha wallet"],
						] as const).map(([value, balance, label]) => (
							<button key={value} type="button" onClick={() => setSource(value)} className={`rounded-lg border p-3 text-start ${source === value ? "border-brand bg-brand/5" : ""}`}>
								<span className="block font-bold">{label}</span>
								<span className="text-xs text-muted-foreground">{balance.toFixed(2)} SAR</span>
							</button>
						))}
					</div>
					<label className="text-sm font-bold">{isArabic ? "المبلغ" : "Amount"}</label>
					<input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0.01" step="0.01" inputMode="decimal" className="h-12 rounded-lg border bg-background px-3" />
					<label className="text-sm font-bold">
						{isArabic ? "رسالة اختيارية" : "Optional message"}
					</label>
					<textarea
						value={message}
						onChange={(event) => setMessage(event.target.value.slice(0, 200))}
						maxLength={200}
						rows={3}
						className="rounded-lg border bg-background px-3 py-2"
					/>
					<label className="flex items-center gap-2 text-sm">
						<input type="checkbox" checked={saveRecipient} onChange={(event) => setSaveRecipient(event.target.checked)} />
						{isArabic ? "حفظ المستلم بعد التحويل" : "Save recipient after transfer"}
					</label>
					<button type="button" disabled={busy} onClick={requestConfirmation} className="h-12 rounded-lg bg-brand font-bold text-brand-foreground">{isArabic ? "مراجعة التحويل" : "Review transfer"}</button>
				</section>

				{transferSnapshot && (
					<section role="dialog" aria-modal="true" className="rounded-xl border-2 border-brand bg-background p-4 shadow-lg">
						<h2 className="mb-3 text-lg font-bold">{isArabic ? "تأكيد التحويل" : "Confirm transfer"}</h2>
						<p>{transferSnapshot.recipientLabel}</p>
						<p className="my-2 text-xl font-bold">{transferSnapshot.amount.toFixed(2)} SAR</p>
						<p className="text-sm text-muted-foreground">{transferSnapshot.source === "wallet" ? (isArabic ? "من المحفظة" : "From wallet") : (isArabic ? "من محفظة قيدها" : "From Qidha wallet")}</p>
						<div className="mt-4 grid grid-cols-2 gap-2">
							<button type="button" disabled={busy} onClick={() => setTransferSnapshot(null)} className="h-11 rounded-lg border font-bold">{isArabic ? "إلغاء" : "Cancel"}</button>
							<button type="button" disabled={busy} onClick={() => void confirmTransfer()} className="h-11 rounded-lg bg-brand font-bold text-brand-foreground">{busy ? (isArabic ? "جاري التحويل..." : "Transferring...") : (isArabic ? "تأكيد" : "Confirm")}</button>
						</div>
					</section>
				)}
			</div>
		</ProfileSubpageShell>
	);
}
