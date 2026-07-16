export default function ItemInfoSkeleton() {
    return (
        <div className="animate-pulse bg-background">
            <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 md:px-5 md:pt-5 lg:gap-10 lg:px-6">
                {/* Image */}
                <div className="relative mx-3 mt-3 aspect-square overflow-hidden rounded-2xl bg-card sm:mx-5 md:mx-0 md:mt-0" />

                {/* Info */}
                <div className="space-y-3 px-3 pb-6 pt-4 sm:px-5 md:px-0 md:pb-8 md:pt-1">
                    {/* Title + wishlist */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="h-6 w-3/4 rounded-lg bg-card lg:h-7" />
                        <div className="h-10 w-10 shrink-0 rounded-full bg-card sm:h-11 sm:w-11" />
                    </div>
                    <div className="h-4 w-full rounded bg-card" />
                    <div className="h-3.5 w-2/3 rounded bg-card" />

                    {/* Price row */}
                    <div className="flex items-center justify-between pt-2 md:pt-6">
                        <div className="h-11 w-11 rounded-full bg-card" />
                        <div className="h-9 w-28 rounded-lg bg-card" />
                    </div>
                </div>
            </div>
        </div>
    );
}
