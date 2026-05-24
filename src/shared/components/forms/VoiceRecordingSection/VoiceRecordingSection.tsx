"use client";
import { Mic, X } from "lucide-react";
import { useRef } from "react";
import { formatTime } from "../../../lib/utils";

export default function VoiceRecordingSection({
    voice,
    audioURL,
    recordingTime,
    isRecording,
    startRecording,
    stopRecording,
    removeVoice,
}: {
    voice: string | null;
    audioURL: string | null;
    recordingTime: number;
    isRecording: boolean;
    startRecording: () => void;
    stopRecording: () => void;
    removeVoice: () => void;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);
    return (
        <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0" />
                <label className="text-sm sm:text-base font-medium text-gray-700 ">
                    {"تسجيل صوتي"}
                </label>
            </div>
            {voice && audioURL ? (
                <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 ">
                        <audio ref={audioRef} src={audioURL} controls className="w-full" />
                    </div>
                    <button
                        type="button"
                        onClick={removeVoice}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-red-600  hover:text-red-700  active:text-red-700 transition-colors touch-manipulation"
                        aria-label="حذف التسجيل الصوتي"
                    >
                        <X className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium">
                            {"حذف التسجيل"}
                        </span>
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-full p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all flex items-center justify-center gap-2 sm:gap-3 touch-manipulation ${isRecording
                        ? "border-red-500  bg-red-50  hover:bg-red-100  active:bg-red-100 animate-pulse"
                        : "border-dashed border-gray-300  bg-gray-50/60  hover:border-green-600  hover:bg-green-50  active:bg-green-50"
                        }`}
                    aria-label={
                        isRecording
                            ? "إيقاف التسجيل"
                            : "بدء التسجيل"
                    }
                >
                    <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isRecording
                            ? "bg-red-500 text-white"
                            : "bg-gray-200  text-gray-600 "
                            }`}
                    >
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-gray-700 ">
                        {isRecording
                            ? "إيقاف التسجيل"
                            : "بدء التسجيل"}
                    </span>
                    {isRecording && (
                        <span className="text-xs sm:text-sm font-mono text-red-600 ">
                            {formatTime(recordingTime)}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}