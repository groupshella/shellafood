export default function BannerSkeleton() {
    return (
        <div className="w-full px-4 sm:px-5">
            <div className="aspect-[21/7] w-full animate-pulse overflow-hidden rounded-2xl bg-gray-100 sm:aspect-[21/6]">
                <div className="h-full w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
            </div>
        </div>
    );
}
