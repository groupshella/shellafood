import Image from "next/image";
import Link from "next/link";

export type AuthRequiredPage = "cart" | "favorites" | "orders" | "notifications" | "checkout";

const PAGE_TITLES: Record<AuthRequiredPage, string> = {
	cart: "السلة",
	favorites: "مفضلاتي",
	orders: "طلباتي",
	notifications: "الإشعارات",
	checkout: "الدفع",
};

interface AuthRequiredScreenProps {
	page: AuthRequiredPage;
}

export function AuthRequiredScreen({ page }: AuthRequiredScreenProps) {
	return (
		<div
			className="mx-auto flex min-h-dvh w-full max-w-lg flex-col overflow-x-hidden bg-white pb-[calc(58px+env(safe-area-inset-bottom))] dark:bg-gray-900 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
			dir="rtl"
			lang="ar"
		>
			<header className="flex items-center justify-center px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 lg:px-6">
				<h1 className="text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-lg lg:text-xl">
					{PAGE_TITLES[page]}
				</h1>
			</header>

			<div className="flex flex-1 flex-col items-center px-4 text-center sm:px-6">
				<div className="mx-auto mt-12 flex w-full max-w-xs flex-col items-center sm:mt-20 md:mt-24 lg:mt-28">
					<div className="relative aspect-[242/231] w-full max-w-[13rem] shrink-0 sm:max-w-[15rem] md:max-w-[16rem]">
						<Image
							src="/layout/auth-required.png"
							alt=""
							fill
							className="object-contain"
							sizes="(min-width: 768px) 256px, (min-width: 640px) 240px, 208px"
							priority
						/>
					</div>

					<h2 className="mt-5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-6 sm:text-xl">
						يجب تسجيل دخول أولاً
					</h2>

					<p className="mt-2 max-w-[260px] text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:max-w-sm sm:text-[15px]">
						الرجاء تسجيل الدخول للمتابعة
					</p>

					<Link
						href="/auth"
						className={[
							"mt-6 flex min-h-12 w-full items-center justify-center rounded-xl sm:mt-8",
							"bg-[#30913F] px-4 text-base font-bold text-white",
							"transition-colors hover:bg-[#2a8036] active:bg-[#267332]",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
							"dark:focus-visible:ring-offset-gray-900",
						].join(" ")}
					>
						تسجيل دخول
					</Link>
				</div>
			</div>
		</div>
	);
}
