"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";

interface AddressesShellProps {
  title: string;
  showAddButton?: boolean;
  children: React.ReactNode;
}

export function AddressesShell({
  title,
  showAddButton = false,
  children,
}: AddressesShellProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="رجوع"
        >
          <ArrowRight className="w-5 h-5 text-gray-700" />
        </button>

        <h1 className="text-base font-semibold text-gray-900">{title}</h1>

        {showAddButton ? (
          <button
            onClick={() => router.push("/addresses/add")}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#30913F]/10 active:bg-[#30913F]/20 transition-colors"
            aria-label="إضافة عنوان"
          >
            <Plus className="w-5 h-5 text-[#30913F]" />
          </button>
        ) : (
          <div className="w-9" />
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
