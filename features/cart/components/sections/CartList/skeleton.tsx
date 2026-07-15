const CONTENT_PADDING =
  "px-3 pb-40 pt-4 sm:px-4 sm:pb-44 sm:pt-5 md:px-5 lg:px-6 lg:pb-8 lg:pt-6";
const FOOTER_PADDING =
  "px-3 pb-6 pt-3 sm:px-4 md:px-5";

export default function CartListSkeleton() {
  return (
    <div className={`animate-pulse ${CONTENT_PADDING}`} dir="rtl">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 xl:gap-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col divide-y divide-gray-100 dark:divide-gray-800 lg:mx-0 lg:max-w-none lg:flex-1 lg:rounded-2xl lg:px-4 lg:ring-1 lg:ring-black/[0.06] dark:lg:ring-white/[0.08] xl:px-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2.5 py-4 first:pt-0 last:pb-0 sm:gap-3 sm:py-5 lg:first:pt-4 lg:last:pb-4">
              <div className="h-20 w-20 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-800 sm:h-[88px] sm:w-[88px]" />
              <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
                <div className="h-4 w-2/3 rounded-md bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-1/2 rounded-md bg-gray-100 dark:bg-gray-700" />
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="h-4 w-16 rounded-md bg-gray-200 dark:bg-gray-800" />
                  <div className="h-9 w-24 rounded-full bg-gray-100 dark:bg-gray-800 sm:h-10 sm:w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden w-full shrink-0 lg:sticky lg:top-20 lg:block lg:w-[18.5rem] xl:w-[20.5rem]">
          <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/[0.05] dark:bg-gray-800/60 dark:ring-white/[0.06]">
            <div className="mb-4 h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-14 rounded-2xl bg-white dark:bg-gray-900" />
            <div className="h-12 rounded-2xl bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-900 lg:hidden">
        <div className={`mx-auto max-w-lg sm:max-w-2xl md:max-w-3xl ${FOOTER_PADDING}`}>
          <div className="mb-3 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 sm:h-14" />
          <div className="h-12 rounded-2xl bg-gray-200 dark:bg-gray-700 sm:h-14" />
        </div>
      </div>
    </div>
  );
}
