"use client";

import {
	Bell,
	ClipboardList,
	Globe,
	Home,
	List,
	LogOut,
	Mail,
	MenuIcon,
	Search,
	ShoppingBag,
	User,
	X,
	ChevronDown,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { useToast } from "@/shared/components/ui";
import HelpAndSupport from "./Support/HelpAndSupport";
import { getAuthToken, removeAuthToken, removeUser } from "@/features/auth/lib/utils/auth.utils";
import { useCartCount } from "@/shared/hooks/useCartCount";
import FloatingCart from "@/features/home/components/FloatingCart";

// Single source of truth for navigation items
type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string }>;

interface NavItem {
	id: string;
	label: string;
	icon: LucideIcon;
	href: string;
	showInDesktop: boolean;
	showInMobile: boolean;
	hasBadge?: boolean;
	isAction?: boolean;
}


const NAVIGATION_ITEMS: NavItem[] = [
	{ id: "home", label: "الرئيسية", icon: Home, href: "/home", showInDesktop: true, showInMobile: true },
	{ id: "my-orders", label: "طلباتي", icon: ClipboardList, href: "/my-orders", showInDesktop: true, showInMobile: true },
	{ id: "cart", label: "السلة", icon: ShoppingBag, href: "/cart", showInDesktop: true, showInMobile: true, hasBadge: true },
	{ id: "profile", label: "الملف الشخصي", icon: User, href:"/profile", showInDesktop: true, showInMobile: true },
	{ id: "categories", label: "الفئات", icon: List, href: "/categories", showInDesktop: false, showInMobile: true },
	{ id: "notifications", label: "الإشعارات", icon: Bell, href: "/notifications", showInDesktop: true, showInMobile: true },
	{ id: "language", label: "عربية", icon: Globe, href: "/", showInDesktop: false, showInMobile: false }, // Handled separately
	{ id: "logout", label: "تسجيل الخروج", icon: LogOut, href: "#", showInDesktop: true, showInMobile: true, isAction: true },
];

	const MobileMenu = ({
	onClose,
	activeTab,
	setActiveTab,
	cartCount,
	language,
	setLanguage,
	t,
	isDropdownOpen,
	setIsDropdownOpen,
	dropdownRef,
	islogin,
	handleLogout,
}: {
	onClose: () => void;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	cartCount: number;
	language: string;
	setLanguage: (lang: 'ar' | 'en') => void;
	t: (key: string) => string;
	isDropdownOpen: boolean;
	setIsDropdownOpen: (open: boolean) => void;
	dropdownRef: React.RefObject<HTMLDivElement>;
	islogin: boolean;
	handleLogout: () => void;
}): JSX.Element => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
			onClose();
		}
	};

	const handleItemClick = (item: NavItem) => {
		setActiveTab(item.id);
		if (item.isAction && item.id === "logout") {
			// Logout is handled separately with confirmation
			return;
		} else if (item.href !== "#") {
			router.push(item.href);
		}
		onClose();
	};

	const mobileItems = NAVIGATION_ITEMS.filter(item => item.showInMobile)
	console.log(islogin);

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			<motion.div
				initial={{ x: "100%" }}
				animate={{ x: 0 }}
				exit={{ x: "100%" }}
				transition={{ type: "spring", damping: 30, stiffness: 300 }}
				className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800"
				dir="rtl"
			>
				{/* Header with Logo, Theme Toggle, and Language */}
				<div className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
					{/* Logo and Close Button */}
					<div className="flex items-center justify-between px-6 py-4">
						<Link href="/" onClick={onClose}>
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer">
								<Image
									src="/shellalogo.png"
									alt="شلة فود"
									width={0}
									height={0}
									sizes="100vw"
									className="w-24 h-auto object-contain dark:opacity-90 transition-opacity"
									priority
								/>
							</motion.div>
						</Link>
						<motion.button
							whileHover={{ scale: 1.1, rotate: 90 }}
							whileTap={{ scale: 0.9 }}
							onClick={onClose}
							className="rounded-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
							aria-label="إغلاق القائمة"
						>
							<X size={22} />
						</motion.button>
					</div>

					{/* Theme Toggle and Language Selector */}
					<div className="flex items-center justify-between gap-3 px-6 pb-4">
						<ThemeToggle />
						<div className="relative flex-1 max-w-[180px]" ref={dropdownRef}>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm w-full"
							>
								<ChevronDown 
									className={`text-green-600 dark:text-green-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
									size={16}
								/>
								<span className="font-medium text-sm text-gray-800 dark:text-gray-200 flex-1 text-right">
									{language === 'ar' ? t('navbar.arabic') : t('navbar.english')}
								</span>
								<Image
									src={language === 'ar' ? "/saudiflag.png" : "/logous.svg"}
									alt={language === 'ar' ? "Saudi Flag" : "English Flag"}
									width={24}
									height={20}
									className="rounded-sm dark:opacity-90 transition-opacity"
								/>
							</motion.button>

							<AnimatePresence>
								{isDropdownOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
									>
										<motion.button
											whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
											onClick={() => {
												setLanguage('ar');
												setIsDropdownOpen(false);
											}}
											className="flex items-center gap-2.5 px-3 py-2.5 w-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
										>
											<Image src="/saudiflag.png" alt="Saudi Flag" width={24} height={20} className="rounded-sm" />
											<span className="font-medium text-sm text-gray-800 dark:text-gray-200">{t('navbar.arabic')}</span>
										</motion.button>
										<motion.button
											whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
											onClick={() => {
												setLanguage('en');
												setIsDropdownOpen(false);
											}}
											className="flex items-center gap-2.5 px-3 py-2.5 w-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border-t border-gray-200 dark:border-gray-700"
										>
											<Image src="/logous.svg" alt="English Flag" width={24} height={20} className="rounded-sm" />
											<span className="font-medium text-sm text-gray-800 dark:text-gray-200">{t('navbar.english')}</span>
										</motion.button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</div>

				{/* Search */}
				<div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900/50">
					<form onSubmit={handleSearch} className="relative">
						<Search
							size={18}
							className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
						/>
						<input
							type="text"
							placeholder="ابحث عن المتاجر أو المطاعم..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pr-10 pl-4 text-right text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none transition-all"
							dir="rtl"
						/>
					</form>
				</div>
				{/* Menu Items */}
				<div className="overflow-y-auto h-[calc(100vh-140px)] px-4 py-4">
					<div className="space-y-1.5">
						{mobileItems.map((item, index) => {
							const Icon = item.icon;
							const isActive = activeTab === item.id;
							const badge = item.hasBadge ? cartCount : undefined;
							
							if (islogin === false && item.id === "logout") return null;
							return (
								<motion.div
									key={item.id}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.03 }}
								>
									<motion.button
										whileHover={{ x: -4 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => {
											if (item.id === "logout") {
												handleLogout();
											} else {
												handleItemClick(item);
											}
										}}
										className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-right transition-all ${
											isActive
												? "bg-gradient-to-l from-green-50 to-transparent dark:from-green-900/20 text-green-600 dark:text-green-400 shadow-sm"
												: item.id === "logout"
												? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
												: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
										}`}
									>
										{isActive && (
											<motion.div
												layoutId="mobileActiveTab"
												className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-green-500 dark:bg-green-400"
											/>
										)}
										<div
											className={`rounded-lg p-2 transition-colors ${
												isActive
													? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
													: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-600 dark:group-hover:text-green-400"
											}`}
										>
											<Icon size={20} strokeWidth={2} />
										</div>
										<div className="flex flex-1 items-center justify-between min-w-0">
											<span
												className={`font-semibold text-sm ${
													isActive ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-gray-100"
												}`}
											>
												{item.label}
											</span>
											{badge !== undefined && badge > 0 && (
												<motion.span
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm"
												>
													{badge > 99 ? "99+" : badge}
												</motion.span>
											)}
										</div>
									</motion.button>
								</motion.div>
							);
						})}
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default  function NavBarCondition({ islogin }: { islogin: boolean }) {
	const pathname = usePathname();
	const router = useRouter();
	const { language, setLanguage, t } = useLanguage();
	const { showToast } = useToast();
	const [activeTab, setActiveTab] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showAterms, setShowAterms] = useState(false);
	const { count: cartCount } = useCartCount();
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (pathname.startsWith("/profile")) setActiveTab("profile");
		else if (pathname.startsWith("/cart")) setActiveTab("cart");
		else if (pathname.startsWith("/my-orders")) setActiveTab("my-orders");
		else if (pathname.startsWith("/notifications")) setActiveTab("notifications");
		else setActiveTab("home");
	}, [pathname]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
		}
	};

	const handleLogout = () => {
		setShowLogoutConfirm(true);
	};

	const confirmLogout = async () => {
		try {
			// Call logout API to remove httpOnly cookie
			await fetch('/api/auth/logout', {
				method: 'POST',
			});
		} catch (error) {
			console.error('Logout API error:', error);
		}
		
		// Remove auth data from client
		removeAuthToken();
		removeUser();
		
		// Clear cart and session storage
		if (typeof window !== 'undefined') {
			localStorage.removeItem('cart');
			sessionStorage.clear();
		}
		
		// Show success notification
		showToast(
			language === 'ar' ? "تم تسجيل الخروج بنجاح" : "Logged out successfully",
			"success"
		);
		
		// Close modals
		setShowLogoutConfirm(false);
		setIsMenuOpen(false);
		
		// Redirect to home
		setTimeout(() => {
			router.push('/home');
			router.refresh();
		}, 500);
	};

	const handleNavClick = (item: NavItem) => {
		setActiveTab(item.id);
		if(item.id==='profile') {
			router.push('/profile');
		}
		if (item.isAction && item.id === "logout") {
			handleLogout();
		}
	};

	const desktopItems = NAVIGATION_ITEMS.filter(item => item.showInDesktop);

	return (
		<>
			<nav className="sticky top-0 z-30 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-4">
						{/* Left: Mobile Menu Button (mobile only) & Desktop Controls */}
						<div className="flex items-center gap-2.5">
							{/* Mobile Menu Button - Visible only on mobile */}
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsMenuOpen(true)}
								className="md:hidden rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
								aria-label="فتح القائمة"
							>
								<MenuIcon size={22} strokeWidth={2} />
							</motion.button>

							{/* Desktop: Logo, Theme Toggle, Language Selector */}
							<div className="hidden md:flex items-center gap-2.5 lg:gap-3">
								{/* Logo */}
								<Link href="/" className="flex-shrink-0">
									<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer">
										<Image
											src="/shellalogo.png"
											alt="شلة فود"
											width={0}
											height={0}
											sizes="100vw"
											className="w-24 h-auto object-contain lg:w-32 dark:opacity-90 transition-opacity"
											priority
										/>
									</motion.div>
								</Link>

								{/* Theme Toggle */}
								<ThemeToggle />

								{/* Language Selector */}
								<div className="relative" ref={dropdownRef}>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
									>
										<ChevronDown 
											className={`text-green-600 dark:text-green-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
											size={18}
										/>
										<span className="font-medium text-sm text-gray-800 dark:text-gray-200">
											{language === 'ar' ? t('navbar.arabic') : t('navbar.english')}
										</span>
										<Image
											src={language === 'ar' ? "/saudiflag.png" : "/logous.svg"}
											alt={language === 'ar' ? "Saudi Flag" : "English Flag"}
											width={32}
											height={28}
											className="rounded-sm dark:opacity-90 transition-opacity"
										/>
									</motion.button>

									<AnimatePresence>
										{isDropdownOpen && (
											<motion.div
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
											>
												<motion.button
													whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
													onClick={() => {
														setLanguage('ar');
														setIsDropdownOpen(false);
													}}
													className="flex items-center gap-2.5 px-3 py-2.5 w-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
												>
													<Image src="/saudiflag.png" alt="Saudi Flag" width={24} height={20} className="rounded-sm" />
													<span className="font-medium text-sm text-gray-800 dark:text-gray-200">{t('navbar.arabic')}</span>
												</motion.button>
												<motion.button
													whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
													onClick={() => {
														setLanguage('en');
														setIsDropdownOpen(false);
													}}
													className="flex items-center gap-2.5 px-3 py-2.5 w-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border-t border-gray-200 dark:border-gray-700"
												>
													<Image src="/logous.svg" alt="English Flag" width={24} height={20} className="rounded-sm" />
													<span className="font-medium text-sm text-gray-800 dark:text-gray-200">{t('navbar.english')}</span>
												</motion.button>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						</div>

						{/* Center: Search */}
						<div className="flex flex-1 items-center justify-center gap-6 max-w-2xl">

							<motion.form
								onSubmit={handleSearch}
								className="relative flex flex-1 items-center max-w-md"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.1 }}
							>
								<Search
									size={18}
									className={`absolute right-3.5 text-gray-400 dark:text-gray-500 transition-colors pointer-events-none ${
										isSearchFocused ? "text-green-500 dark:text-green-400" : ""
									}`}
								/>
								<input
									type="text"
									placeholder="ابحث عن المتاجر أو المطاعم..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									onFocus={() => setIsSearchFocused(true)}
									onBlur={() => setIsSearchFocused(false)}
									className={`h-10 w-full rounded-lg border bg-gray-50 dark:bg-gray-800 py-2 pr-10 pl-4 text-right text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 ${
										isSearchFocused 
											? "shadow-md border-green-500 dark:border-green-400" 
											: "border-gray-200 dark:border-gray-700 shadow-sm"
									}`}
									dir="rtl"
								/>
							</motion.form>
						</div>

						{/* Right: Desktop Navigation & Mobile Cart */}
						<div className="flex items-center gap-2">
							<div className="hidden md:flex flex-row-reverse items-center gap-1">
								{desktopItems.map((item) => {
									const Icon = item.icon;
									const isActive = activeTab === item.id;
									const badge = item.hasBadge ? cartCount : undefined;

									// Hide logout if not logged in
									if (islogin === false && item.id === "logout") return null;

									return (
										<motion.div key={item.id} className="relative">
											{item.isAction ? (
												<motion.button
													whileHover={{ y: -2 }}
													whileTap={{ scale: 0.95 }}
													onClick={() => handleNavClick(item)}
													className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
														item.id === "logout"
															? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
															: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
													}`}
													aria-label={item.label}
												>
													<Icon size={20} strokeWidth={2.5} />
													<span className="hidden lg:inline">{item.label}</span>
												</motion.button>
											) : (
												<Link href={item.href} onClick={() => handleNavClick(item)}>
													<motion.button
														whileHover={{ y: -2 }}
														whileTap={{ scale: 0.95 }}
														className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
															isActive
																? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
																: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
														}`}
														aria-label={item.label}
													>
														{isActive && (
															<motion.div
																layoutId="activeNavIndicator"
																className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-green-500 dark:bg-green-400"
															/>
														)}
														<Icon size={20} strokeWidth={2.5} />
														<span className="hidden lg:inline">{item.label}</span>
														{badge !== undefined && badge > 0 && (
															<motion.span
																initial={{ scale: 0 }}
																animate={{ scale: 1 }}
																className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-md"
															>
																{badge > 99 ? "99+" : badge}
															</motion.span>
														)}
													</motion.button>
												</Link>
											)}
										</motion.div>
									);
								})}
							</div>

							<Link href="/cart" onClick={() => handleNavClick(NAVIGATION_ITEMS.find(i => i.id === "cart")!)}>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="relative md:hidden rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
									aria-label="السلة"
								>
									<ShoppingBag size={22} strokeWidth={2} />
									{cartCount > 0 && (
										<motion.span
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-md"
										>
											{cartCount > 99 ? "99+" : cartCount}
										</motion.span>
									)}
								</motion.button>
							</Link>
						</div>
					</div>
				</div>
			</nav>

			<AnimatePresence>
				{isMenuOpen && (
					<MobileMenu
						onClose={() => setIsMenuOpen(false)}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						cartCount={cartCount}
						language={language}
						setLanguage={setLanguage}
						t={t}
						isDropdownOpen={isDropdownOpen}
						setIsDropdownOpen={setIsDropdownOpen}
						dropdownRef={dropdownRef}
						islogin={islogin}
						handleLogout={handleLogout}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showAterms && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
							onClick={() => setShowAterms(false)}
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								transition={{ type: "spring", damping: 25, stiffness: 300 }}
								onClick={(e) => e.stopPropagation()}
								className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl md:p-8"
							>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => setShowAterms(false)}
									className="absolute top-4 right-4 rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"
									aria-label="إغلاق"
								>
									<X size={20} />
								</motion.button>
								<HelpAndSupport />
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{/* Logout Confirmation Dialog */}
			<AnimatePresence>
				{showLogoutConfirm && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
							onClick={() => setShowLogoutConfirm(false)}
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								transition={{ type: "spring", damping: 25, stiffness: 300 }}
								onClick={(e) => e.stopPropagation()}
								className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl md:p-8"
								dir={language === 'ar' ? 'rtl' : 'ltr'}
							>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => setShowLogoutConfirm(false)}
									className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors`}
									aria-label={language === 'ar' ? "إغلاق" : "Close"}
								>
									<X size={20} />
								</motion.button>

								<div className={`${language === 'ar' ? 'text-right' : 'text-left'} mt-2`}>
									<div className="flex items-center gap-3 mb-4">
										<div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
											<LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
										</div>
										<h3 className="text-xl font-bold text-gray-900 dark:text-white">
											{language === 'ar' ? "تسجيل الخروج" : "Logout"}
										</h3>
									</div>
									
									<p className="text-gray-600 dark:text-gray-400 mb-6">
										{language === 'ar' 
											? "هل أنت متأكد من رغبتك في تسجيل الخروج؟" 
											: "Are you sure you want to logout?"}
									</p>

									<div className={`flex gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={confirmLogout}
											className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
										>
											{language === 'ar' ? "تسجيل الخروج" : "Logout"}
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => setShowLogoutConfirm(false)}
											className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors"
										>
											{language === 'ar' ? "إلغاء" : "Cancel"}
										</motion.button>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			<FloatingCart cartCount={pathname.startsWith("/cart") ? 0 : cartCount} />
		</>
	);
}
