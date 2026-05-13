"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/providers";
import { ProductOrderCard } from "../OrderCards/ProductOrderCard";
import { EmptyOrdersState } from "../shared/EmptyOrdersState";
import { OrderListSkeleton } from "../shared/OrderCardSkeleton";
import { PullToRefreshIndicator } from "../shared/PullToRefreshIndicator";
import { SwipeableOrderCard } from "../shared/SwipeableOrderCard";
import { Pagination } from "../shared/Pagination";
import { usePullToRefresh } from "@/shared/hooks";
import { useRouter } from "next/navigation";
import { OrdersHeader } from "./OrdersHeader";
import type { ProductOrder, OrdersResponse } from "../../types";
import { ORDERS_CONSTANTS } from "../../constants/orders.constants";
import {
	mapRunningOrdersResponse,
	type RunningOrdersApiResponse,
} from "../../lib/mapRunningOrdersResponse";

interface MyOrdersPageProps {
	initialOrdersData?: OrdersResponse | null;
}

const ITEMS_PER_PAGE = ORDERS_CONSTANTS.DEFAULT_PAGE_SIZE;

export default function MyOrdersPage({ initialOrdersData }: MyOrdersPageProps) {
	const { language } = useLanguage();
	const router = useRouter();
	const isArabic = language === "ar";

	const [productOrders, setProductOrders] = useState<ProductOrder[]>(
		initialOrdersData?.products ?? [],
	);
	const [totalSize, setTotalSize] = useState(
		initialOrdersData?.totalSize ?? initialOrdersData?.products?.length ?? 0,
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(() => initialOrdersData == null);

	const totalPages = Math.max(1, Math.ceil(totalSize / ITEMS_PER_PAGE));

	const loadPage = useCallback(async (page: number) => {
		setIsLoading(true);
		try {
			const res = await fetch(
				`/api/orders?limit=${ITEMS_PER_PAGE}&offset=${page}`,
				{ credentials: "include", cache: "no-store" },
			);
			if (!res.ok) {
				setProductOrders([]);
				setTotalSize(0);
				return;
			}
			const raw = (await res.json()) as RunningOrdersApiResponse;
			const { products, totalSize: nextTotal } =
				mapRunningOrdersResponse(raw);
			setProductOrders(products);
			setTotalSize(nextTotal);
			setCurrentPage(page);
		} catch {
			setProductOrders([]);
			setTotalSize(0);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchOrders = useCallback(async () => {
		await loadPage(currentPage);
	}, [loadPage, currentPage]);

	const { isRefreshing, pullDistance } = usePullToRefresh({
		onRefresh: fetchOrders,
		enabled: !isLoading,
	});

	useEffect(() => {
		if (initialOrdersData != null) return;
		void loadPage(1);
	}, [initialOrdersData, loadPage]);

	const handlePageChange = useCallback(
		(page: number) => {
			void loadPage(page);
			if (typeof window !== "undefined") {
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		},
		[loadPage],
	);

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
			dir={isArabic ? "rtl" : "ltr"}
		>
			<PullToRefreshIndicator
				pullDistance={pullDistance}
				isRefreshing={isRefreshing}
			/>

			<OrdersHeader totalSize={totalSize} />

			<div className="container mx-auto px-4 py-6 md:py-8">
				{isLoading && productOrders.length === 0 ? (
					<OrderListSkeleton />
				) : (
					<AnimatePresence mode="wait">
						<motion.div
							key="running"
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							className="space-y-4 sm:space-y-6"
						>
							{productOrders.length === 0 ? (
								<EmptyOrdersState type="products" />
							) : (
								<>
									{isLoading ? (
										<OrderListSkeleton />
									) : (
										productOrders.map((order, index) => (
											<motion.div
												key={order.id}
												initial={{ opacity: 0, y: 16 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													delay: index * 0.04,
													duration: 0.25,
												}}
											>
												<SwipeableOrderCard
													onTrack={() =>
														router.push(
															`/my-orders/${order.orderNumber}/track`,
														)
													}
													canTrack
												>
													<ProductOrderCard order={order} />
												</SwipeableOrderCard>
											</motion.div>
										))
									)}
									{totalSize > ITEMS_PER_PAGE ? (
										<div className="mt-8">
											<Pagination
												currentPage={currentPage}
												totalPages={totalPages}
												onPageChange={handlePageChange}
												totalItems={totalSize}
												itemsPerPage={ITEMS_PER_PAGE}
											/>
										</div>
									) : null}
								</>
							)}
						</motion.div>
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}
