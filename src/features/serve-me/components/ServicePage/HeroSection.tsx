import { useLanguage } from "@/providers"
import { Search } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react";
interface HeroSectionInterface
{
    title:string;
    description:string;
    heroImage:string;
}
const HeroSection=({title,description,heroImage}:HeroSectionInterface)=>{
    const {language,t}=useLanguage();
    const isArabic=language==='ar';
	const [searchQuery, setSearchQuery] = useState("");
// Event handlers
const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        console.log("Search query:", searchQuery.trim());
        // TODO: Implement search functionality
    }
}, [searchQuery]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	}, []);
    return <div className="w-full pt-6 pb-8">
    <div className="relative w-full overflow-hidden shadow-xl">
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px]">
            <Image
                src={heroImage || "/serveme-hero.png"}
                alt={title || ""}
                fill
                priority
                className="object-cover object-center !h-full !w-full"
                sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 pointer-events-none" />
            
            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 text-center drop-shadow-lg">
                    {title}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 text-center max-w-3xl drop-shadow-md">
                    {description}
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl px-4">
                    <div className="relative flex shadow-xl rounded-lg overflow-hidden">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder={t("serviceDetail.searchPlaceholder")}
                            className={`flex-1 border-0 bg-white dark:bg-gray-800 py-3 sm:py-3.5 ${
                                isArabic ? "pr-4 pl-0 text-right" : "pl-4 pr-0 text-left"
                            } text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0`}
                        />
                        <button
                            type="submit"
                            className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-6 sm:px-8 transition-colors duration-200 flex items-center justify-center"
                            aria-label={t("serviceDetail.searchPlaceholder")}
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
}
export default HeroSection;