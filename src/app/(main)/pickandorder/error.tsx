'use client';
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
      <div className="text-center max-w-md">

        <div className="mb-6 flex justify-center">
          <div className="rounded-full p-4 bg-green-100">
            <AlertCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          حدث خطأ ما
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          عذراً، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 rounded-lg p-4 text-right bg-green-50">
            <p className="text-sm font-mono text-green-800">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-green-600">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50"
          >
            حاول مرة أخرى
          </button>
          <Link
            href="/home"
            className="px-6 py-3 font-semibold rounded-xl border-2 border-green-500 text-green-600 bg-transparent hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50 text-center"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>

      </div>
    </div>
  );
}