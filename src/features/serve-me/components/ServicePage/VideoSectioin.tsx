import { useLanguage } from "@/providers";
import Image from "next/image"
import { useCallback } from "react";
import { experimental_UTRegion } from "uploadthing/next";
interface VideoSectionInterface
{
    videoThumbnail:string;
}
const VideoSection=({videoThumbnail}:VideoSectionInterface)=>{
    const {t}=useLanguage();
    const handlePlayVideo = useCallback(() => {
		console.log("Play video");
		// TODO: Implement video playback
	}, []);
    return <div className="bg-gray-50 dark:bg-gray-800 py-12 lg:py-14 pb-16">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
            {t("serviceDetail.howItWorksTitle")}
        </h2>

        <div className="relative w-full">
            <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[480px] rounded-lg overflow-hidden shadow-lg">
                <Image
                    src={videoThumbnail || "/ac-condition.jpg"}
                    alt={t("serviceDetail.howItWorksTitle")}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1536px) 90vw, 1400px"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button
                        onClick={handlePlayVideo}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 dark:hover:bg-green-500 group transition-colors duration-200 shadow-xl"
                        aria-label="Play video"
                    >
                        <svg className="w-7 h-7 sm:w-9 sm:h-9 text-green-600 dark:text-green-400 group-hover:text-white ml-1 transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
}
export default VideoSection;