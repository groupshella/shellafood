import Image from "next/image";

export function NotificationsEmpty({ isArabic }: { isArabic: boolean }) {
    return (
        <div className="flex min-h-[calc(100dvh-8.5rem)] flex-col items-center justify-center px-4 text-center sm:min-h-[calc(100dvh-9.5rem)] sm:px-6">
            <div className="relative mb-6 aspect-square w-full max-w-[12rem] sm:mb-8 sm:max-w-[14rem] md:max-w-[16rem]">
                <Image
                    src="/notifications/notifications-empty.png"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                    priority
                />
            </div>

            <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 sm:text-xl">
                    {isArabic ? "لا يوجد لديك إشعارات" : "No notifications"}
                </h2>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {isArabic ? "في الوقت الحالي" : "At the current time"}
                </h2>
            </div>
        </div>
    );
}
