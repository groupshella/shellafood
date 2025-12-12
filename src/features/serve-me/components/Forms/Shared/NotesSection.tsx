"use client";
interface NotesSectionProps
{
    isArabic:boolean;
    notes:string;
    placeholder:string;
    handleNotesInputChange:(e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
export default function NotesSection({isArabic,notes,placeholder,handleNotesInputChange}:NotesSectionProps)
{
    return <section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
        {isArabic ? "ملاحظات إضافية" : "Additional Notes"}
    </h2>
    <textarea
        name="notes"
        value={notes}
        onChange={handleNotesInputChange}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/20 focus:ring-offset-0 focus:outline-none resize-none text-sm sm:text-base transition-all touch-manipulation placeholder-gray-400 dark:placeholder-gray-500 ${
            isArabic ? "text-right" : "text-left"
        }`}
        dir={isArabic ? "rtl" : "ltr"}
    />
</section>;
}