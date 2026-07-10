"use client";

import { Minus, Plus } from "lucide-react";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import Image from "next/image";

interface ProfilePhotoCropProps {
    photoSrc: string;
    zoom: number;
    onZoomChange: (zoom: number) => void;
    error?: string | null;
}

export function ProfilePhotoCrop({ photoSrc, zoom, onZoomChange, error }: ProfilePhotoCropProps) {
    const adjustZoom = (delta: number) => {
        onZoomChange(Math.min(3, Math.max(1, Number((zoom + delta).toFixed(1)))));
    };

    return (
        <div className="flex w-full flex-col items-center gap-6 sm:gap-8">
            <div className="relative aspect-square w-full max-w-48 overflow-hidden rounded-full bg-[#F6F5F8] ring-1 ring-[#F6F5F8] dark:bg-gray-800 dark:ring-gray-700 sm:max-w-56 md:max-w-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                    src={photoSrc}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                />
            </div>

            <div className="flex w-full max-w-sm items-center gap-3 sm:gap-4">
                <button
                    type="button"
                    onClick={() => adjustZoom(-0.1)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F6F5F8] text-[#111B18] transition-colors active:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:active:bg-gray-700 sm:h-12 sm:w-12"
                    aria-label="تصغير"
                >
                    <Minus className="h-4 w-4" />
                </button>
                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => onZoomChange(Number(e.target.value))}
                    className="min-w-0 flex-1 accent-[#30913F]"
                    aria-label="تكبير الصورة"
                />
                <button
                    type="button"
                    onClick={() => adjustZoom(0.1)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#30913F] text-white transition-colors active:bg-[#267332] sm:h-12 sm:w-12"
                    aria-label="تكبير"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            <div className="w-full max-w-2xl text-start">
                <p className="mb-3 text-[14px] font-bold text-[#111B18] dark:text-gray-100 sm:text-[15px]">
                    {PROFILE_STRINGS.photoGuidanceTitle}
                </p>
                <ul className="space-y-2 text-[14px] leading-relaxed text-[#555555] dark:text-gray-400 sm:text-[15px]">
                    <li>• {PROFILE_STRINGS.photoGuidance1}</li>
                    <li>• {PROFILE_STRINGS.photoGuidance2}</li>
                </ul>
            </div>

            {error && (
                <p className="w-full text-center text-[13px] text-red-600 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
