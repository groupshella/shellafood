"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AddressListItem } from "@/features/addresses/types/address.types";
import { deleteAddress } from "@/features/addresses/actions/delete-address";
import { useNotification } from "@/shared/components/NotificationToast";
import { AddressCard } from "./AddressCard";
import { DeleteConfirmSheet } from "../../shared/DeleteConfirmSheet";

interface AddressListClientProps {
	addresses: AddressListItem[];
	isArabic: boolean;
}

const primaryButtonClass =
	"mt-2 flex w-full min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-brand text-sm font-semibold text-brand-foreground transition-all duration-200 hover:brightness-95 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 sm:min-h-[56px] lg:ms-auto lg:me-0 lg:max-w-md";

export function AddressListClient({ addresses, isArabic }: AddressListClientProps) {
	const router = useRouter();
	const { success, error: notifyError } = useNotification();
	const [isPending, startTransition] = useTransition();
	const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
	const showDelete = addresses.length > 1;

	const handleSelect = useCallback(
		(id: number) => {
			router.push(`/addresses/${id}`);
		},
		[router],
	);

	const handleEdit = useCallback(
		(id: number) => {
			router.push(`/addresses/${id}/edit`);
		},
		[router],
	);

	const handleDeleteRequest = useCallback((id: number) => {
		setPendingDeleteId(id);
	}, []);

	const handleCancelDelete = useCallback(() => {
		setPendingDeleteId(null);
	}, []);

	const handleConfirmDelete = useCallback(() => {
		if (pendingDeleteId === null) return;
		const idToDelete = pendingDeleteId;
		setPendingDeleteId(null);

		startTransition(async () => {
			const result = await deleteAddress(idToDelete);
			if (result.success) {
				success(isArabic ? "تم حذف العنوان" : "Address deleted");
				router.refresh();
			} else {
				notifyError(isArabic ? "تعذّر حذف العنوان" : "Could not delete address");
			}
		});
	}, [isArabic, notifyError, pendingDeleteId, router, success]);

	const handleAddAddress = useCallback(() => {
		router.push("/addresses/add");
	}, [router]);

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className="mx-auto flex w-full max-w-lg flex-col gap-3 px-3 pb-6 pt-4 sm:max-w-xl sm:gap-4 sm:px-5 sm:pt-5 md:max-w-2xl lg:max-w-3xl lg:px-6 lg:pb-8 xl:max-w-4xl"
		>
			<ul
				className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-5"
				role="list"
				aria-label={isArabic ? "قائمة العناوين" : "Address list"}
			>
				{addresses.map((address) => (
					<li key={address.id}>
						<AddressCard
							address={address}
							showDelete={showDelete}
							isArabic={isArabic}
							onClick={handleSelect}
							onEdit={handleEdit}
							onDelete={handleDeleteRequest}
							isDeleting={isPending && pendingDeleteId === null}
						/>
					</li>
				))}
			</ul>

			<button
				type="button"
				onClick={handleAddAddress}
				className={primaryButtonClass}
			>
				<Plus className="h-4 w-4 shrink-0" aria-hidden />
				<span>{isArabic ? "أضف عنوان آخر" : "Add another address"}</span>
			</button>

			<DeleteConfirmSheet
				isOpen={pendingDeleteId !== null}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				isDeleting={isPending}
				isArabic={isArabic}
			/>
		</div>
	);
}
