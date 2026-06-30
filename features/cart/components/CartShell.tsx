"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface CartShellProps {
  title: string;
  children: React.ReactNode;
}

export function CartShell({ title, children }: CartShellProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50" dir="rtl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors active:bg-gray-200"
          aria-label="رجوع"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>

        <h1 className="text-base font-semibold text-gray-900">{title}</h1>

        <div className="w-9" />
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
