export default function ItemInfoSkeleton() {
    return (
        <div className="animate-pulse bg-white" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-2 pt-4">
                <div className="h-9 w-9 rounded-full bg-gray-100" />
                <div className="w-9" />
            </div>

            {/* Image */}
            <div className="relative mx-4 aspect-square overflow-hidden rounded-2xl bg-gray-100" />

            {/* Info */}
            <div className="px-4 pb-4 pt-4 space-y-3">
                <div className="h-6 w-3/4 rounded-lg bg-gray-200 ms-auto" />
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-3.5 w-2/3 rounded bg-gray-100 ms-auto" />

                {/* Price row */}
                <div className="flex items-center justify-between pt-1">
                    <div className="h-11 w-11 rounded-full bg-gray-200" />
                    <div className="h-8 w-28 rounded-lg bg-gray-200" />
                </div>
            </div>
        </div>
    );
}
