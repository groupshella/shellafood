import { useLanguage } from "@/providers";

interface WhyChooseUsInterface
{
    whyChooseUs:Array<{ title: string; description: string; icon: React.ReactNode }>;
}
const WhyChooseUsSection=({whyChooseUs}:WhyChooseUsInterface)=>{

    const {t}=useLanguage()
    return <div className="bg-white dark:bg-gray-900 py-12 lg:py-14">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
            {t("serviceDetail.whyChooseUsTitle")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10">
            {whyChooseUs?.map((item, index) => (
                <div
                    key={`why-choose-${item.title}-${index}`}
                    className="flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <div className="text-green-600 dark:text-green-400">
                            {item.icon}
                        </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {item.title}
                    </h3>
                    {item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.description}
                        </p>
                    )}
                </div>
            ))}
        </div>
    </div>
</div>
}
export default WhyChooseUsSection;