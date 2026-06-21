export default function StoreDetailsSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-200 to-gray-300 sm:aspect-[16/9]" />
            <div className="relative space-y-4 bg-white px-4 pb-5 pt-10 sm:px-6 sm:pt-11">
                <div className="absolute -top-7 start-4 h-[4.5rem] w-[4.5rem] rounded-xl bg-gray-100 sm:h-20 sm:w-20" />
                <div className="flex items-start gap-3 pe-24">
                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-2/3 rounded bg-gray-100" />
                        <div className="h-4 w-full rounded bg-gray-100" />
                    </div>
                    <div className="h-8 w-14 shrink-0 rounded-lg bg-gray-100" />
                </div>
            </div>
            <div className="mt-3 space-y-3 px-3 sm:px-4">
                <div className="h-44 rounded-2xl bg-gray-200 sm:h-52" />
                <div className="h-44 rounded-2xl bg-gray-200 sm:h-52" />
            </div>
        </div>
    );
}
