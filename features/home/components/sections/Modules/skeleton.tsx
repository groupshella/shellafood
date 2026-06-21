export default function ModuleSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-2.5 px-4">
            <div className="grid h-[168px] grid-cols-2 grid-rows-2 gap-2.5" dir="ltr">
                <div className="animate-pulse rounded-2xl bg-gray-100" />
                <div className="animate-pulse rounded-2xl bg-gray-100" />
                <div className="col-start-2 row-span-2 row-start-1 animate-pulse rounded-2xl bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
                <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            </div>
        </div>
    );
}
