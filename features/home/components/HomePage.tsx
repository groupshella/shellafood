"use client";
import Topbar from "./Topbar";
import Banners from "./Banners";
import Modules from "./Modules";
import DiscountedStores from "./DiscountedStores";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen gap-4">
            <Topbar />
            <Link href="/auth/login" className="flex items-center gap-2 px-2 py-1 font-bold bg-gray-100 rounded-lg w-fit ">
                <p className="text-sm text-gray-700">انضم إلينا ، واستمتع بخدمات شلة</p>
                <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
            </Link>
            <Banners />
            <Modules />
            <DiscountedStores />
        </div>
    )
}