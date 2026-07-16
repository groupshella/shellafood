export default function BannerSkeleton() {
    return (
        <div className="w-full px-3 sm:px-5 lg:px-6">
            <div className="aspect-[21/8] w-full animate-pulse overflow-hidden rounded-2xl bg-card sm:aspect-[21/7] md:aspect-[21/6] xl:aspect-[21/5.5]">
                <div className="h-full w-full bg-gradient-to-r from-card via-border to-card" />
            </div>
        </div>
    );
}
