export default function BannerSkeleton() {
    return (
        <div className="w-full px-3 sm:px-5 lg:px-6">
            <div className="aspect-[21/8] w-full animate-pulse overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 sm:aspect-[21/7] md:aspect-[21/6] xl:aspect-[21/5.5]">
                <div className="h-full w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
            </div>
        </div>
    );
}
