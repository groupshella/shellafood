import { useLanguage } from "@/providers";
import Image from "next/image";
import { AnimatePresence,motion } from "framer-motion";
import {  useState } from "react";
interface GallerySectionInterface
{
    title:string;
    galleryImages:string[];
}
const GallerySection=({title,galleryImages}:GallerySectionInterface)=>{
    const {language}=useLanguage();
    const isArabic="ar"===language;
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	
    return<section className="mb-16 sm:mb-20">
    <h2 className={`text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 ${isArabic ? "text-right" : "text-left"}`}>
            {isArabic ? "معرض أعمالنا" : "Our Work Gallery"}
        </h2>
        
        {/* Main Image Display */}
        <div className="relative mb-6 overflow-hidden bg-gray-100 rounded-lg">
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-64 sm:h-80 md:h-96"
                >
                    <Image
                        src={galleryImages[selectedImageIndex]}
                        alt={`${title} - ${selectedImageIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover"
                        priority={selectedImageIndex === 0}
                    />
                </motion.div>
            </AnimatePresence>
            
            {/* Image Counter Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-semibold text-white">
                    {selectedImageIndex + 1} / {galleryImages.length}
                </span>
            </div>
        </div>
    
        {/* Thumbnail Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
            {galleryImages.map((image, index) => (
                <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 sm:h-24 md:h-28 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === index
                            ? "border-[#10b981] shadow-lg shadow-[#10b981]/30 ring-2 ring-[#10b981]/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    aria-label={`View image ${index + 1}`}
                >
                    <Image
                        src={image}
                        alt={`${title} thumbnail ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 25vw, 150px"
                        className="object-cover"
                    />
                    {selectedImageIndex === index && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-[#10b981]/20"
                        />
                    )}
                </motion.button>
            ))}
        </div>
    </section>
}
export default GallerySection;