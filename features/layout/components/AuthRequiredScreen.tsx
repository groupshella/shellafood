import Image from "next/image";
import Link from "next/link";
import { Tajawal } from "next/font/google";
import Navbar from "@/features/layout/components/Navbar";

const tajawal = Tajawal({
	subsets: ["arabic", "latin"],
	weight: ["400", "700"],
});

export type AuthRequiredPage = "cart" | "favorites" | "orders";

const PAGE_TITLES: Record<AuthRequiredPage, string> = {
	cart: "السلة",
	favorites: "مفضلاتي",
	orders: "طلباتي",
};

interface AuthRequiredScreenProps {
	page: AuthRequiredPage;
}

export function AuthRequiredScreen({ page }: AuthRequiredScreenProps) {
	return (
		<div
			dir="rtl"
			lang="ar"
			className={`${tajawal.className} relative mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-white text-[#111B18] pb-[calc(68px+env(safe-area-inset-bottom))] dark:bg-gray-900 dark:text-gray-100 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl`}
		>
			<header className="flex items-center justify-center px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
				<h1 className="text-lg font-bold leading-[1.6] sm:text-xl md:text-2xl">{PAGE_TITLES[page]}</h1>
			</header>

			<div className="flex flex-1 flex-col items-center justify-center gap-7 px-4 sm:gap-10 sm:px-6">
				<Image
					src="/layout/auth-required.png"
					alt=""
					width={242}
					height={231}
					priority
					className="h-auto w-full max-w-[190px] object-contain sm:max-w-[242px] md:max-w-[270px]"
				/>

				<div className="flex max-w-xs flex-col items-center gap-1 text-center sm:max-w-sm">
					<p className="text-base font-bold leading-[1.6] sm:text-lg">
						يجب تسجيل دخول أولاً
					</p>
					<p className="text-sm font-medium leading-relaxed text-[#555555] dark:text-gray-400 sm:text-base">
						الرجاء تسجيل الدخول للمتابعة
					</p>
				</div>
			</div>

			<div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-40 mx-auto w-full max-w-lg px-4 pb-4 sm:bottom-[calc(68px+env(safe-area-inset-bottom))] sm:max-w-xl sm:px-6 md:max-w-2xl lg:max-w-md">
				<Link
					href="/auth"
					className={[
						"flex min-h-12 w-full items-center justify-center rounded-xl",
						"bg-[#30913F] px-4 text-base font-bold text-white",
						"transition-colors hover:bg-[#2a8036] active:bg-[#267332]",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
						"dark:focus-visible:ring-offset-gray-900",
					].join(" ")}
				>
					تسجيل دخول
				</Link>
			</div>

			<Navbar />
		</div>
	);
}
