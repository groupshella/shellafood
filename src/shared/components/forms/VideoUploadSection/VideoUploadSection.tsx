"use client";
import { MEDIA_LIMITS } from "@/features/(services)/serve-me";
import { Video, X } from "lucide-react";

export default function VideoUploadSection({
    isArabic,
    video,
    videoInputRef,
    handleVideoUpload,
    removeVideo,
}: {
    isArabic: boolean;
    video: string | null;
    videoInputRef: React.RefObject<HTMLInputElement>;
    handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeVideo: () => void;
}) {
    return (
        <div className="border-b border-gray-100 dark:border-gray-700 pb-6 sm:pb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                    {isArabic ? "فيديو" : "Video"}{" "}
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">
                        {isArabic
                            ? `(حد أقصى ${MEDIA_LIMITS.MAX_VIDEO_DURATION} ثانية)`
                            : `(max ${MEDIA_LIMITS.MAX_VIDEO_DURATION} seconds)`}
                    </span>
                </label>
            </div>
            <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                onChange={handleVideoUpload}
                className="hidden"
                aria-label={isArabic ? "رفع فيديو" : "Upload video"}
            />
            {video ? (
                <div className="relative rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="relative aspect-video bg-gray-900">
                        <video src={video} controls className="w-full h-full object-contain" />
                    </div>
                    <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 active:bg-red-600 transition-colors touch-manipulation"
                        aria-label={isArabic ? "حذف الفيديو" : "Remove video"}
                    >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full p-6 sm:p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 touch-manipulation"
                    aria-label={isArabic ? "رفع فيديو" : "Upload video"}
                >
                    <Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                        {isArabic ? "رفع فيديو" : "Upload Video"}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center px-2">
                        {isArabic
                            ? `MP4, MOV, أو WEBM - حد أقصى ${MEDIA_LIMITS.MAX_VIDEO_DURATION} ثانية و 50 ميجابايت`
                            : `MP4, MOV, or WEBM - max ${MEDIA_LIMITS.MAX_VIDEO_DURATION} seconds and 50MB`}
                    </span>
                </button>
            )}
        </div>
    );
}