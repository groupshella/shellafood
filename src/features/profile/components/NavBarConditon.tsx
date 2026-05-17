"use client";

import {
	Bell,
	ClipboardList,
	Globe,
	Home,
	List,
	LogOut,
	Search,
	ShoppingBag,
	User,
	X,
	ChevronDown,
	Menu,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { useToast } from "@/shared/components/ui";
import HelpAndSupport from "./Support/HelpAndSupport";
import { removeAuthToken, removeUser } from "@/features/auth/lib/utils/auth.utils";
import { useCartCount } from "@/shared/hooks/useCartCount";
import FloatingCart from "@/features/home/components/FloatingCart";

// ─── Types ────────────────────────────────────────────────────────────────────

type LucideIcon = React.ComponentType<
	React.SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string }
>;

interface NavItem {
	id: string;
	label: string;
	icon: LucideIcon;
	href: string;
	desktop: boolean;
	mobile: boolean;
	badge?: boolean;
	action?: boolean;
}

// ─── Navigation Config ────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
	{ id: "my-orders", label: "طلباتي", icon: ClipboardList, href: "/my-orders", desktop: true, mobile: true },
	{ id: "cart", label: "السلة", icon: ShoppingBag, href: "/cart", desktop: true, mobile: true, badge: true },
	{ id: "profile", label: "الملف الشخصي", icon: User, href: "/profile", desktop: true, mobile: true },
	{ id: "categories", label: "الفئات", icon: List, href: "/categories", desktop: false, mobile: true },
	{ id: "notifications", label: "الإشعارات", icon: Bell, href: "/notifications", desktop: true, mobile: true },
	{ id: "logout", label: "تسجيل الخروج", icon: LogOut, href: "#", desktop: true, mobile: true, action: true },
];

// ─── Spring configs ───────────────────────────────────────────────────────────

const SPRING = { type: "spring", damping: 28, stiffness: 320 } as const;
const FADE = { duration: 0.18 } as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface LanguageSelectorProps {
	language: string;
	setLanguage: (lang: "ar" | "en") => void;
	t: (key: string) => string;
	dropdownRef: React.RefObject<HTMLDivElement>;
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
}

const LanguageSelector = memo(
	({ language, setLanguage, t, dropdownRef, isOpen, setIsOpen }: LanguageSelectorProps) => (
		<div className="relative" ref={dropdownRef}>
			<motion.button
				whileTap={{ scale: 0.97 }}
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				aria-label="تغيير اللغة"
				aria-expanded={isOpen}
			>
				<Image
					src={language === "ar" ? "/saudiflag.png" : "/logous.svg"}
					alt=""
					width={22}
					height={16}
					className="rounded-sm"
				/>
				<span className="hidden sm:inline">{language === "ar" ? t("navbar.arabic") : t("navbar.english")}</span>
				<ChevronDown
					size={14}
					className={`text-green-600 dark:text-green-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
				/>
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -6, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -6, scale: 0.97 }}
						transition={FADE}
						className="absolute top-full left-0 mt-1.5 min-w-[130px] rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden"
					>
						{(["ar", "en"] as const).map((lang, i) => (
							<button
								key={lang}
								onClick={() => { setLanguage(lang); setIsOpen(false); }}
								className={`flex items-center gap-2.5 px-3 py-2.5 w-full text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors ${i > 0 ? "border-t border-gray-100 dark:border-gray-700" : ""}`}
							>
								<Image src={lang === "ar" ? "/saudiflag.png" : "/logous.svg"} alt="" width={22} height={16} className="rounded-sm" />
								{lang === "ar" ? t("navbar.arabic") : t("navbar.english")}
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
);
LanguageSelector.displayName = "LanguageSelector";

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

interface MobileMenuProps {
	onClose: () => void;
	activeTab: string;
	cartCount: number;
	language: string;
	setLanguage: (lang: "ar" | "en") => void;
	t: (key: string) => string;
	islogin: boolean;
	onLogout: () => void;
	isDropdownOpen: boolean;
	setIsDropdownOpen: (v: boolean) => void;
	dropdownRef: React.RefObject<HTMLDivElement>;
}

const MobileMenu = memo(
	({ onClose, activeTab, cartCount, language, setLanguage, t, islogin, onLogout, isDropdownOpen, setIsDropdownOpen, dropdownRef }: MobileMenuProps) => {
		const router = useRouter();
		const [searchTerm, setSearchTerm] = useState("");

		const handleSearch = (e: React.FormEvent) => {
			e.preventDefault();
			const q = searchTerm.trim();
			if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); onClose(); }
		};

		const handleItemClick = useCallback((item: NavItem) => {
			if (item.action && item.id === "logout") { onLogout(); return; }
			if (item.href !== "#") router.push(item.href);
			onClose();
		}, [onLogout, onClose, router]);

		const mobileItems = NAV_ITEMS.filter(i => i.mobile);

		return (
			<>
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
					transition={FADE}
					className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
					onClick={onClose}
					aria-hidden
				/>

				{/* Drawer */}
				<motion.aside
					initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
					transition={SPRING}
					className="fixed right-0 top-0 z-50 h-full w-72 sm:w-80 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
					dir="rtl"
					role="dialog"
					aria-label="قائمة التنقل"
				>
					{/* Header */}
					<div className="border-b border-gray-200 dark:border-gray-800 px-5 py-4">
						<div className="flex items-center justify-between mb-3">
							<Link href="/" onClick={onClose}>
								<Image src="/shellalogo.png" alt="شلة فود" width={88} height={32} className="object-contain dark:opacity-90" priority />
							</Link>
							<button
								onClick={onClose}
								className="rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
								aria-label="إغلاق القائمة"
							>
								<X size={20} />
							</button>
						</div>

						<div className="flex items-center gap-2.5">
							<ThemeToggle />
							<div className="flex-1">
								<LanguageSelector
									language={language} setLanguage={setLanguage} t={t}
									dropdownRef={dropdownRef} isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen}
								/>
							</div>
						</div>
					</div>

					{/* Search */}
					<div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60">
						<form onSubmit={handleSearch} className="relative">
							<Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
							<input
								type="text" dir="rtl"
								placeholder="ابحث عن المتاجر أو المطاعم..."
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pr-9 pl-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
							/>
						</form>
					</div>

					{/* Nav Items */}
					<nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1" aria-label="روابط التنقل">
						{mobileItems.map((item, i) => {
							if (!islogin && item.id === "logout") return null;
							const Icon = item.icon;
							const isActive = activeTab === item.id;
							const isLogout = item.id === "logout";
							const badge = item.badge ? cartCount : 0;

							return (
								<motion.button
									key={item.id}
									initial={{ opacity: 0, x: 16 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.025, duration: 0.22 }}
									onClick={() => handleItemClick(item)}
									className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-right transition-colors ${isActive
										? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
										: isLogout
											? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
										}`}
								>
									{isActive && (
										<motion.div
											layoutId="mobileActiveIndicator"
											className="absolute right-0 inset-y-2 w-1 rounded-l-full bg-green-500 dark:bg-green-400"
										/>
									)}
									<span className={`flex-shrink-0 rounded-lg p-1.5 ${isActive
										? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
										: isLogout
											? "bg-red-100 dark:bg-red-900/30 text-red-500"
											: "bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-400"
										}`}>
										<Icon size={18} strokeWidth={2} />
									</span>
									<span className={`flex-1 text-sm font-semibold ${isActive ? "text-green-600 dark:text-green-400" : ""}`}>
										{item.label}
									</span>
									{badge > 0 && (
										<span className="rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
											{badge > 99 ? "99+" : badge}
										</span>
									)}
								</motion.button>
							);
						})}
					</nav>
				</motion.aside>
			</>
		);
	}
);
MobileMenu.displayName = "MobileMenu";

// ─── Logout Dialog ────────────────────────────────────────────────────────────

const LogoutDialog = memo(({ language, onConfirm, onCancel }: { language: string; onConfirm: () => void; onCancel: () => void }) => (
	<motion.div
		initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
		transition={FADE}
		className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
		onClick={onCancel}
	>
		<motion.div
			initial={{ opacity: 0, scale: 0.94, y: 16 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.94, y: 16 }}
			transition={SPRING}
			onClick={e => e.stopPropagation()}
			dir={language === "ar" ? "rtl" : "ltr"}
			className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl"
		>
			<button
				onClick={onCancel}
				className={`absolute top-4 ${language === "ar" ? "left-4" : "right-4"} rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
				aria-label={language === "ar" ? "إغلاق" : "Close"}
			>
				<X size={18} />
			</button>

			<div className="flex items-center gap-3 mb-3">
				<div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
					<LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
				</div>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white">
					{language === "ar" ? "تسجيل الخروج" : "Logout"}
				</h3>
			</div>

			<p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
				{language === "ar" ? "هل أنت متأكد من رغبتك في تسجيل الخروج؟" : "Are you sure you want to logout?"}
			</p>

			<div className={`flex gap-2.5 `}>
				<button
					onClick={onConfirm}
					className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow"
				>
					{language === "ar" ? "تسجيل الخروج" : "Logout"}
				</button>
				<button
					onClick={onCancel}
					className="flex-1 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-semibold transition-colors"
				>
					{language === "ar" ? "إلغاء" : "Cancel"}
				</button>
			</div>
		</motion.div>
	</motion.div>
));
LogoutDialog.displayName = "LogoutDialog";

// ─── Main NavBar ──────────────────────────────────────────────────────────────

export default function NavBarCondition({ islogin }: { islogin: boolean }) {
	const pathname = usePathname();
	const router = useRouter();
	const { language, setLanguage, t } = useLanguage();
	const { showToast } = useToast();

	const [activeTab, setActiveTab] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showAterms, setShowAterms] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const { count: cartCount } = useCartCount();

	// Sync active tab with route
	useEffect(() => {
		if (pathname.startsWith("/profile")) setActiveTab("profile");
		else if (pathname.startsWith("/cart")) setActiveTab("cart");
		else if (pathname.startsWith("/my-orders")) setActiveTab("my-orders");
		else if (pathname.startsWith("/notifications")) setActiveTab("notifications");
		else setActiveTab("home");
	}, [pathname]);

	// Close dropdown on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
				setIsDropdownOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		document.body.style.overflow = isMenuOpen ? "hidden" : "";
		return () => { document.body.style.overflow = ""; };
	}, [isMenuOpen]);

	const handleSearch = useCallback((e: React.FormEvent) => {
		e.preventDefault();
		const q = searchTerm.trim();
		if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
	}, [searchTerm, router]);

	const handleLogout = useCallback(() => setShowLogoutConfirm(true), []);

	const confirmLogout = useCallback(async () => {
		try { await fetch("/api/auth/logout", { method: "POST" }); } catch { }
		removeAuthToken();
		removeUser();
		if (typeof window !== "undefined") {
			localStorage.removeItem("cart");
			sessionStorage.clear();
		}
		showToast(language === "ar" ? "تم تسجيل الخروج بنجاح" : "Logged out successfully", "success");
		setShowLogoutConfirm(false);
		setIsMenuOpen(false);
		setTimeout(() => { router.push("/home"); router.refresh(); }, 400);
	}, [language, router, showToast]);

	const desktopItems = NAV_ITEMS.filter(i => i.desktop);

	return (
		<>
			{/* ── Navbar ── */}
			<nav className="sticky top-0 z-30 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center gap-3">

						{/* LEFT: mobile menu toggle + desktop logo/controls */}
						<div className="flex items-center gap-2 flex-shrink-0">
							{/* Mobile hamburger */}
							<button
								onClick={() => setIsMenuOpen(true)}
								className="md:hidden rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
								aria-label="فتح القائمة"
							>
								<Menu size={22} strokeWidth={2} />
							</button>

							{/* Desktop logo */}
							<Link href="/" className="hidden md:block flex-shrink-0">
								<Image
									src="/shellalogo.png" alt="شلة فود"
									width={112} height={40}
									className="object-contain dark:opacity-90 transition-opacity"
									priority
								/>
							</Link>

						</div>

						{/* RIGHT: desktop nav + mobile cart icon */}
						<div className="flex items-center gap-1 flex-shrink-0">
							{/* Desktop nav items */}
							<nav className="hidden md:flex  items-center gap-0.5" aria-label="التنقل الرئيسي">
								{desktopItems.map(item => {
									if (!islogin && item.id === "logout") return null;
									const Icon = item.icon;
									const isActive = activeTab === item.id;
									const isLogout = item.id === "logout";
									const badge = item.badge ? cartCount : 0;

									const btnClass = `relative group flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all ${isLogout
										? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
										: isActive
											? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
											: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
										}`;

									const inner = (
										<>
											{isActive && !isLogout && (
												<motion.div
													layoutId="desktopActiveIndicator"
													className="absolute bottom-0 inset-x-2 h-0.5 rounded-full bg-green-500 dark:bg-green-400"
												/>
											)}
											<Icon size={19} strokeWidth={2.2} />
											<span className="hidden lg:inline whitespace-nowrap">{item.label}</span>
											{badge > 0 && (
												<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
													{badge > 99 ? "99+" : badge}
												</span>
											)}
										</>
									);

									if (item.action) {
										return (
											<button key={item.id} onClick={handleLogout} className={btnClass} aria-label={item.label}>
												{inner}
											</button>
										);
									}
									return (
										<Link key={item.id} href={item.href} onClick={() => setActiveTab(item.id)}>
											<button className={btnClass} aria-label={item.label}>{inner}</button>
										</Link>
									);
								})}
							</nav>

							{/* Mobile cart button */}
							<Link href="/cart" className="md:hidden" onClick={() => setActiveTab("cart")}>
								<button
									className="relative rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
									aria-label="السلة"
								>
									<ShoppingBag size={22} strokeWidth={2} />
									{cartCount > 0 && (
										<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
											{cartCount > 99 ? "99+" : cartCount}
										</span>
									)}
								</button>
							</Link>
						</div>

						{/* CENTER: search */}
						<form
							onSubmit={handleSearch}
							className="relative flex flex-1 max-w-md mx-auto"
						>
							<Search
								size={16}
								className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isSearchFocused ? "text-green-500 dark:text-green-400" : "text-gray-400"
									}`}
							/>
							<input
								type="text" dir="rtl"
								placeholder="ابحث عن المتاجر أو المطاعم..."
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								onFocus={() => setIsSearchFocused(true)}
								onBlur={() => setIsSearchFocused(false)}
								className={`h-10 w-full rounded-lg border bg-gray-50 dark:bg-gray-800 pr-10 pl-4 py-2 text-sm text-right text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${isSearchFocused
									? "border-green-500 dark:border-green-400 bg-white dark:bg-gray-700 ring-green-500/20 dark:ring-green-400/20 shadow-md"
									: "border-gray-200 dark:border-gray-700 ring-transparent shadow-sm"
									}`}
							/>
						</form>


						{/* Desktop controls */}
						<div className="hidden md:flex items-center gap-2">
							<ThemeToggle />
							<LanguageSelector
								language={language} setLanguage={setLanguage} t={t}
								dropdownRef={dropdownRef}
								isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen}
							/>
						</div>

					</div>
				</div>
			</nav>

			{/* ── Mobile Menu ── */}
			<AnimatePresence>
				{isMenuOpen && (
					<MobileMenu
						onClose={() => setIsMenuOpen(false)}
						activeTab={activeTab}
						cartCount={cartCount}
						language={language}
						setLanguage={setLanguage}
						t={t}
						islogin={islogin}
						onLogout={handleLogout}
						isDropdownOpen={isDropdownOpen}
						setIsDropdownOpen={setIsDropdownOpen}
						dropdownRef={dropdownRef}
					/>
				)}
			</AnimatePresence>

			{/* ── Help Modal ── */}
			<AnimatePresence>
				{showAterms && (
					<motion.div
						initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
						transition={FADE}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
						onClick={() => setShowAterms(false)}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.94, y: 16 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.94, y: 16 }}
							transition={SPRING}
							onClick={e => e.stopPropagation()}
							className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl"
						>
							<button
								onClick={() => setShowAterms(false)}
								className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
								aria-label="إغلاق"
							>
								<X size={18} />
							</button>
							<HelpAndSupport />
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* ── Logout Dialog ── */}
			<AnimatePresence>
				{showLogoutConfirm && (
					<LogoutDialog
						language={language}
						onConfirm={confirmLogout}
						onCancel={() => setShowLogoutConfirm(false)}
					/>
				)}
			</AnimatePresence>

			<FloatingCart cartCount={pathname.startsWith("/cart") ? 0 : cartCount} />
		</>
	);
}