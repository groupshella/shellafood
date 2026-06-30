"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AddressListItem } from "@/features/addresses/types/address.types";
import { deleteAddress } from "@/features/addresses/actions/delete-address";
import { AddressCard } from "./AddressCard";
import { DeleteConfirmSheet } from "../../shared/DeleteConfirmSheet";

interface AddressListClientProps {
  addresses: AddressListItem[];
}

export function AddressListClient({ addresses }: AddressListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const showDelete = addresses.length > 1;

  function handleDeleteRequest(id: number) {
    setPendingDeleteId(id);
  }

  function handleCancelDelete() {
    setPendingDeleteId(null);
  }

  function handleConfirmDelete() {
    if (pendingDeleteId === null) return;
    const idToDelete = pendingDeleteId;
    setPendingDeleteId(null);

    startTransition(async () => {
      await deleteAddress(idToDelete);
    });
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-6">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          showDelete={showDelete}
          onClick={() => router.push(`/addresses/${address.id}`)}
          onEdit={() => router.push(`/addresses/${address.id}/edit`)}
          onDelete={() => handleDeleteRequest(address.id)}
          isDeleting={isPending && pendingDeleteId === null}
        />
      ))}

      <button
        onClick={() => router.push("/addresses/add")}
        className="
          w-full mt-2 flex items-center justify-center gap-2
          bg-[#30913F] text-white text-sm font-semibold
          rounded-2xl py-4
          active:bg-[#267332] transition-colors
        "
      >
        <Plus className="w-4 h-4" />
        <span>أضف عنوان آخر</span>
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
