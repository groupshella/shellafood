import { useLanguage } from "@/providers";
import { ServiceCard } from "./ServiceCard";
interface MainServiceInterface
{
    mainServices:Array<{ slug: string; title: string; image: string; path: string,description: string }>;
}
const MainServiceSection=({mainServices}:MainServiceInterface)=>{
    const {language,t}=useLanguage();
    const isArabic=language==='ar';

    return 	<div className="bg-gray-50 dark:bg-gray-800 py-12 lg:py-14">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
            {t("serviceDetail.mainServicesTitle")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {mainServices?.map((service) => {
            
                return (
                    <ServiceCard
                        key={service.slug}
                        title={service.title}
                        image={service.image}
                        serviceSlugPath={service.path}
                        buttonText={t("serviceDetail.requestButton")}
                        isArabic={isArabic}
                        serviceSlug={service.slug}
                        icon={null}
                        description={service.description}
                    />
                );
            })}
        </div>
    </div>
</div>
}
export default MainServiceSection;