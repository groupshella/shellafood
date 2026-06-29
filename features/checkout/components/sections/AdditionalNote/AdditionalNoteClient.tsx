"use client";

import { useState } from "react";

export function AdditionalNoteClient() {
    const [note, setNote] = useState("");

    return (
        <div dir="rtl">
            <h2 className="mb-3 text-[15px] font-bold text-gray-900">ملاحظة إضافية</h2>

            <textarea
                dir="rtl"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="مثال : يرجى إضافة منديل إضافي"
                className="w-full resize-none rounded-xl bg-[#F6F5F8] px-4 py-3 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30913F]"
            />
        </div>
    );
}
