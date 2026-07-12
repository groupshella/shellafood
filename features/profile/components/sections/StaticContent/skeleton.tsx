export default function StaticContentSkeleton() {
    return (
        <div className="flex min-h-dvh animate-pulse flex-col bg-white dark:bg-gray-950">
            <header className="grid grid-cols-[auto_1fr_auto] items-center border-b border-gray-100 px-4 py-5 dark:border-gray-800 sm:px-5 md:px-6">
                <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="mx-auto h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="w-9" />
            </header>

            <main className="flex-1 px-4 py-4 sm:px-6">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 lg:max-w-4xl">
                    <div className="h-5 w-2/3 self-start rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-11/12 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="mt-2 h-4 w-1/3 self-start rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-10/12 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="mt-2 h-4 w-2/5 self-start rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-11/12 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
            </main>
        </div>
    );
}
