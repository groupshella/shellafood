"use client";
import { Mic, X } from "lucide-react";

export default function VoiceRecordingSection({
    isArabic,
    voice,
    audioURL,
    audioRef,
    isRecording,
    formattedRecordingTime,
    startRecording,
    stopRecording,
    removeVoice,
}: {
    isArabic: boolean;
    voice: string | null;
    audioURL: string | null;
    audioRef: React.RefObject<HTMLAudioElement>;
    isRecording: boolean;
    formattedRecordingTime: string;
    startRecording: () => void;
    stopRecording: () => void;
    removeVoice: () => void;
}) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                    {isArabic ? "تسجيل صوتي" : "Voice Recording"}
                </label>
            </div>
            {voice && audioURL ? (
                <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
                        <audio ref={audioRef} src={audioURL} controls className="w-full" />
                    </div>
                    <button
                        type="button"
                        onClick={removeVoice}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 active:text-red-700 transition-colors touch-manipulation"
                        aria-label={isArabic ? "حذف التسجيل الصوتي" : "Delete voice recording"}
                    >
                        <X className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium">
                            {isArabic ? "حذف التسجيل" : "Delete Recording"}
                        </span>
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-full p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all flex items-center justify-center gap-2 sm:gap-3 touch-manipulation ${
                        isRecording
                            ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 active:bg-red-100 animate-pulse"
                            : "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50"
                    }`}
                    aria-label={
                        isRecording
                            ? isArabic
                                ? "إيقاف التسجيل"
                                : "Stop recording"
                            : isArabic
                              ? "بدء التسجيل"
                              : "Start recording"
                    }
                >
                    <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isRecording
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                    >
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                        {isRecording
                            ? isArabic
                                ? "إيقاف التسجيل"
                                : "Stop Recording"
                            : isArabic
                              ? "بدء التسجيل"
                              : "Start Recording"}
                    </span>
                    {isRecording && (
                        <span className="text-xs sm:text-sm font-mono text-red-600 dark:text-red-400">
                            {formattedRecordingTime}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}