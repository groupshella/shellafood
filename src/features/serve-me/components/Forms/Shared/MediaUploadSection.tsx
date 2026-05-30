"use client";
import { MEDIA_LIMITS } from "@/features/serve-me/constants/serve-me.constants";
import ImageUploadSection from "@/shared/components/forms/ImageUploadSection/ImageUploadSection";
import VideoUploadSection from "@/shared/components/forms/VideoUploadSection/VideoUploadSection";
import VoiceRecordingSection from "@/shared/components/forms/VoiceRecordingSection/VoiceRecordingSection";
import { HelpCircle, ImageIcon, Mic, Video, X, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import AttachmentGuidelinesModal from "../../Modals/AttachmentGuidelinesModal";

interface MediaUploadSectionProps {
    isArabic: boolean;
    images: string[];
    video: string | null;
    voice: string | null;
    audioURL: string | null;
    isRecording: boolean;
    recordingTime: number;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: (index: number) => void;
    removeVideo: () => void;
    removeVoice: () => void;
    startRecording: () => void;
    stopRecording: () => void;
}

export default function MediaUploadSection({
    isArabic,
    images,
    video,
    voice,
    audioURL,
    isRecording,
    recordingTime,
    handleImageUpload,
    handleVideoUpload,
    removeImage,
    removeVideo,
    removeVoice,
    startRecording,
    stopRecording,
}: MediaUploadSectionProps) {
    const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Format recording time as MM:SS
    const formattedRecordingTime = `${Math.floor(recordingTime / 60)
        .toString()
        .padStart(2, "0")}:${(recordingTime % 60).toString().padStart(2, "0")}`;

    return (
    
      <>
      <section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {isArabic ? "المرفقات" : "Attachments"}
                </h2>
                <button
                    type="button"
                    onClick={() => setShowGuidelinesModal(true)}
                    className="text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 active:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 rounded-full p-1 touch-manipulation flex-shrink-0"
                    aria-label={isArabic ? "عرض إرشادات المرفقات" : "Show attachment guidelines"}
                >
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>

            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                {/* Images Section */}
                <ImageUploadSection
                    isArabic={isArabic}
                    images={images}
                    imageInputRef={imageInputRef}
                    handleImageUpload={handleImageUpload}
                    removeImage={removeImage}
                />

                {/* Video Section */}
                <VideoUploadSection
                    isArabic={isArabic}
                    video={video}
                    videoInputRef={videoInputRef}
                    handleVideoUpload={handleVideoUpload}
                    removeVideo={removeVideo}
                />

                {/* Voice Recording Section */}
                <VoiceRecordingSection
                    isArabic={isArabic}
                    voice={voice}
                    audioURL={audioURL}
                    audioRef={audioRef}
                    isRecording={isRecording}
                    formattedRecordingTime={formattedRecordingTime}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                    removeVoice={removeVoice}
                />
            </div>
        </section>
        <AttachmentGuidelinesModal
        isOpen={showGuidelinesModal}
        onClose={() => setShowGuidelinesModal(false)}
        isArabic={isArabic}
    />
    </>
    );
}

