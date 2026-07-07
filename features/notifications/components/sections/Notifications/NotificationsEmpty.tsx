import Image from "next/image";

export function NotificationsEmpty() {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
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

            <div className="space-y-1.5 text-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 sm:text-xl">
                    لا يوجد لديك إشعارات
                </h2>
                <p className="text-base font-medium text-gray-500 dark:text-gray-400 sm:text-[17px]">
                    في الوقت الحالي
                </p>
            </div>
        </div>
    );
}
