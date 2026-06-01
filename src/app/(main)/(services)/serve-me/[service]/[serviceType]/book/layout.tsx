"use client";

import { BookingProvider } from "@/providers";

export default function BookLayout({ children }: { children: React.ReactNode }) {
	return <BookingProvider>{children}</BookingProvider>;
}

