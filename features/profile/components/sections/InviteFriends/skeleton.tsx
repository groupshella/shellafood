export default function InviteFriendsSkeleton() {
    return (
        <div className="flex min-h-dvh animate-pulse flex-col bg-white dark:bg-gray-950" dir="rtl">
            <header className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-5 sm:px-5 md:px-6">
                <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="mx-auto h-5 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="w-9" />
            </header>

            <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pt-6 sm:max-w-2xl sm:px-5 lg:max-w-3xl lg:px-6">
                <div className="flex h-12 w-full rounded-2xl bg-gray-100 p-1 dark:bg-gray-800">
                    <div className="h-full flex-1 rounded-xl bg-gray-200 dark:bg-gray-700" />
                    <div className="h-full flex-1 rounded-xl bg-gray-100 dark:bg-gray-800" />
                </div>

                <div className="mx-auto aspect-[241/210] w-full max-w-[241px] rounded-2xl bg-gray-100 dark:bg-gray-800 sm:max-w-[280px] md:max-w-[320px]" />
                <div className="mx-auto h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-11/12 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-24 w-full rounded-2xl bg-gray-100 dark:bg-gray-800" />
            </main>
        </div>
    );
}
