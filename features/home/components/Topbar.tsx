"use client";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import Link from "next/link";


export default function Topbar() {
    return (<motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-5 py-3"
    >
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">مرحباً بك</h1>
        <div className="flex items-center gap-3">
            <Link
                href="/notifications"
                className="relative p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="الإشعارات"
            >
                <Bell className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
            </Link>
            <Link
                href="/search"
                className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="بحث"
            >
                <Search className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
            </Link>
        </div>

    </motion.header>
    );
}