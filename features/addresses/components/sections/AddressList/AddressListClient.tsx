"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AddressListItem } from "@/features/addresses/types/address.types";
import { deleteAddress } from "@/features/addresses/actions/delete-address";
import { useLanguage } from "@/features/language/useLanguage";
import { useNotification } from "@/shared/components/NotificationToast";
import { AddressCard } from "./AddressCard";
import { DeleteConfirmSheet } from "../../shared/DeleteConfirmSheet";

interface AddressListClientProps {
	addresses: AddressListItem[];
}

const primaryButtonClass =
	"mt-2 flex w-full min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#30913F] text-sm font-semibold text-white transition-colors hover:bg-[#2a8036] active:bg-[#267332] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-gray-900 sm:min-h-[56px] lg:max-w-md lg:ms-auto lg:me-0";

export function AddressListClient({ addresses }: AddressListClientProps) {
	const router = useRouter();
	const { isArabic } = useLanguage();
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
		<div className="flex flex-col gap-3 px-3 pb-6 pt-4 sm:gap-4 sm:px-5 sm:pt-5 lg:px-6 lg:pb-8">
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
			/>
		</div>
	);
}
