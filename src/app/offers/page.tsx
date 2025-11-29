import React from "react";
import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import { OffersListingClient } from "@/components/Offers";

export const metadata: Metadata = {
	title: "Special Offers & Deals - Shella Food",
	description: "Discover exclusive offers, discounts, and special deals on food delivery and transportation services. Save big with our limited-time promotions!",
	keywords: ["offers", "deals", "discounts", "food delivery", "special offers", "promotions"],
	openGraph: {
		title: "Special Offers & Deals - Shella Food",
		description: "Discover exclusive offers, discounts, and special deals on food delivery and transportation services.",
		type: "website",
		locale: "en_US",
	},
	alternates: {
		canonical: "/offers",
	},
};

export default function OffersPage() {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
			<NavBarCondition />
			<div className="flex-1">
				<OffersListingClient />
			</div>
			<ShellaFooter />
		</div>
	);
}
