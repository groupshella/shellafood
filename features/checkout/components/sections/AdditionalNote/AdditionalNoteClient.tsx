"use client";

import { useState } from "react";

export function AdditionalNoteClient() {
    const [note, setNote] = useState("");
    const maxLength = 300;

    return (
        <div dir="rtl">
            <h2 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">ملاحظة إضافية</h2>

            <div className="relative">
                <textarea
                    dir="rtl"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={maxLength}
                    placeholder="مثال : يرجى إضافة منديل إضافي"
                    aria-label="ملاحظة إضافية"
                    className="min-h-[6.5rem] w-full resize-none rounded-xl px-3 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30913F] dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:ring-[#30913F] sm:min-h-28 sm:px-4 sm:py-3.5 sm:text-[15px] lg:min-h-32"
                />
                {note.length > 0 && (
                    <span className="absolute bottom-2 start-3 text-[11px] text-gray-400 dark:text-gray-500 sm:text-xs">
                        {note.length}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
}
