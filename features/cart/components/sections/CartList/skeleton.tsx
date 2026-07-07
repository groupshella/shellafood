const CONTENT_PADDING = "px-3 pb-40 pt-4 sm:px-4 sm:pb-44 sm:pt-5 md:px-5 lg:px-6";
const FOOTER_PADDING = "px-3 pb-6 pt-3 sm:px-4 md:px-5 lg:px-6";

export default function CartListSkeleton() {
  return (
    <div className={`animate-pulse bg-white dark:bg-gray-900 ${CONTENT_PADDING}`} dir="rtl">
      <div className="mx-auto flex w-full max-w-3xl flex-col divide-y divide-gray-100 dark:divide-gray-800 lg:max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-2.5 py-4 first:pt-0 last:pb-0 sm:gap-3 sm:py-5">
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

      <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-900">
        <div className={`mx-auto max-w-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl ${FOOTER_PADDING}`}>
          <div className="mb-3 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 sm:h-14 lg:rounded-3xl" />
          <div className="h-12 rounded-2xl bg-gray-200 dark:bg-gray-700 sm:h-14 lg:max-w-md lg:ms-auto" />
        </div>
      </div>
    </div>
  );
}
