"use client";
import { MEDIA_LIMITS } from "@/features/(services)/serve-me";
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";

export default function ImageUploadSection({
    isArabic,
    images,
    imageInputRef,
    handleImageUpload,
    removeImage,
}: {
    isArabic: boolean;
    images: string[];
    imageInputRef: React.RefObject<HTMLInputElement>;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: (index: number) => void;
}) {
    return (
        <div className="border-b border-gray-100 dark:border-gray-700 pb-6 sm:pb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                    {isArabic ? "الصور" : "Images"} ({images.length}/{MEDIA_LIMITS.MAX_IMAGES})
                </label>
            </div>
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                aria-label={isArabic ? "رفع صور" : "Upload images"}
            />
            {images.length === 0 ? (
                <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full p-6 sm:p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 touch-manipulation"
                    aria-label={isArabic ? "رفع صور" : "Upload images"}
                >
                    <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                        {isArabic ? "رفع صور" : "Upload Images"}
                    </span>
                </button>
            ) : (
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group">
                            <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                <Image
                                    src={img}
                                    alt={`Upload ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 active:bg-red-600 touch-manipulation"
                                aria-label={isArabic ? `حذف الصورة ${index + 1}` : `Remove image ${index + 1}`}
                            >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    ))}
                    {images.length < MEDIA_LIMITS.MAX_IMAGES && (
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="aspect-square rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50 transition-all flex items-center justify-center touch-manipulation"
                            aria-label={isArabic ? "إضافة صور إضافية" : "Add more images"}
                        >
                            <Upload className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}