import { useLanguage } from "@/providers";
import Image from "next/image";
import Link from "next/link";
interface WorkshopsInterface
{
    availableWorkshops:Array<{ 
        name: string; 
        image: string; 
        rating: number; 
        distance: string; 
        availableHours: string;
    }>;
    handleBookAppointment:(workshopName: string)=>void;
}
export default function WorkshopsSection({availableWorkshops,handleBookAppointment}:WorkshopsInterface)
{
    const {t,language}=useLanguage();
    const isArabic=language==='ar';
    return <div className="bg-gray-50 dark:bg-gray-800 py-12 lg:py-14">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
            {t("serviceDetail.availableWorkshopsTitle")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {availableWorkshops?.map((workshop, index) => (
                <div
                    key={`workshop-${workshop.name}-${index}`}
                    className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                    <div className="relative w-full h-48 sm:h-52 lg:h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                            src={workshop.image}
                            alt={workshop.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className={`text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 ${isArabic ? "text-right" : "text-left"}`}>
                            {workshop.name}
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                            {/* Rating */}
                            <div className={`flex items-center gap-2 `}>
                                <span className="text-yellow-500">⭐</span>
                                <span className="text-gray-900 dark:text-gray-100 font-semibold">{workshop.rating}</span>
                            </div>

                            {/* Distance */}
                            <div className={`flex items-center gap-2 `}>
                                <span className="text-green-600 dark:text-green-400">📍</span>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">{workshop.distance}</span>
                            </div>

                            {/* Available Hours */}
                            <div className={`flex items-center gap-2 `}>
                                <span className="text-gray-600 dark:text-gray-400">🕐</span>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">{workshop.availableHours}</span>
                            </div>
                        </div>

                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleBookAppointment(workshop.name);
                            }}
                            prefetch={true}
                            className="block w-full text-center rounded-md bg-green-600 dark:bg-green-500 text-white py-2.5 px-4 font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
                        >
                            {t("serviceDetail.bookAppointment")}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>
}