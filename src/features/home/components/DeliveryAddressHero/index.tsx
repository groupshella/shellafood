"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import AddressSelector from "./AddressSelector";

interface DeliveryAddressHeroProps {
	onAddressChange?: (address: any) => void;
	token: string;
}

export default function DeliveryAddressHero({ onAddressChange, token }: DeliveryAddressHeroProps) {
	return (
		<section className="relative py-8 sm:py-10">
			{/* Faint background accent */}
			<div
				className="absolute inset-0 rounded-3xl opacity-40 dark:opacity-20 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 70%)",
				}}
			/>

			<div className="relative z-10 max-w-3xl mx-auto">


				{/* Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
					className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
					style={{
						background: "rgba(255,255,255,0.92)",
						boxShadow:
							"0 2px 0 0 rgba(16,185,129,0.08) inset, 0 20px 60px -12px rgba(16,185,129,0.18), 0 4px 20px -4px rgba(0,0,0,0.06)",
						border: "1px solid rgba(16,185,129,0.14)",
					}}
				>
					{/* Top accent line */}
					<div
						className="absolute top-0 inset-x-0 h-[2.5px]"
						style={{
							background:
								"linear-gradient(90deg, transparent, #10b981 30%, #34d399 60%, transparent)",
						}}
					/>

					<div className="p-4 sm:p-6 dark:bg-gray-900/90 dark:border-gray-700/50">
						<AddressSelector onAddressChange={onAddressChange} token={token} />
					</div>
				</motion.div>


			</div>
		</section>
	);
}