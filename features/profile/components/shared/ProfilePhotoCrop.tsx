"use client";

import { Minus, Plus } from "lucide-react";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";

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
        <div className="flex flex-col items-center gap-6">
            <div className="relative h-56 w-56 overflow-hidden rounded-full bg-[#F6F5F8] ring-1 ring-[#F6F5F8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={photoSrc}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                />
            </div>

            <div className="flex w-full max-w-xs items-center gap-3">
                <button
                    type="button"
                    onClick={() => adjustZoom(-0.1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F5F8] transition-colors active:bg-gray-200"
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
                    className="flex-1 accent-[#30913F]"
                    aria-label="تكبير الصورة"
                />
                <button
                    type="button"
                    onClick={() => adjustZoom(0.1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#30913F] text-white transition-colors active:bg-[#267332]"
                    aria-label="تكبير"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            <div className="w-full text-start">
                <p className="mb-3 text-[14px] font-bold text-[#111B18]">
                    {PROFILE_STRINGS.photoGuidanceTitle}
                </p>
                <ul className="space-y-2 text-[14px] leading-relaxed text-[#555555]">
                    <li>• {PROFILE_STRINGS.photoGuidance1}</li>
                    <li>• {PROFILE_STRINGS.photoGuidance2}</li>
                </ul>
            </div>

            {error && <p className="text-[13px] text-red-600">{error}</p>}
        </div>
    );
}
