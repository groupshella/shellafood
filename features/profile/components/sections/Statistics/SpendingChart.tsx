"use client";

import { useEffect, useId, useMemo, useState } from "react";

import {
    CHART_MAX,
    TAJAWAL,
    Y_TICKS,
} from "@/features/profile/constants/statistics.constants";
import { buildSmoothPath } from "@/features/profile/lib/chart-path";

export function SpendingChart({
    labels,
    values,
    showLine,
    activeIndex = 4,
}: {
    labels: readonly string[];
    values: number[];
    showLine: boolean;
    activeIndex?: number;
}) {
    const gradientId = useId();
    const [animate, setAnimate] = useState(false);

    const chartGeometry = useMemo(() => {
        const width = 341.45;
        const height = 169;
        const paddingStart = 8;
        const paddingEnd = 32;
        const paddingTop = 6;
        const paddingBottom = 22;
        const plotWidth = width - paddingStart - paddingEnd;
        const plotHeight = height - paddingTop - paddingBottom;

        const safeValues = values.length > 0 ? values : [0, 0];
        const points = safeValues.map((value, index) => {
            const x =
                paddingStart + (index / Math.max(safeValues.length - 1, 1)) * plotWidth;
            const y = paddingTop + plotHeight - (value / CHART_MAX) * plotHeight;
            return { x, y };
        });

        const linePath = buildSmoothPath(points);
        const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`;

        return {
            width,
            height,
            paddingStart,
            paddingEnd,
            paddingTop,
            plotHeight,
            plotWidth,
            points,
            linePath,
            areaPath,
        };
    }, [values]);

    useEffect(() => {
        setAnimate(false);
        if (!showLine) return;
        const frame = requestAnimationFrame(() => setAnimate(true));
        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labels.join(","), values.join(","), showLine]);

    const plotOriginX = chartGeometry.width - chartGeometry.paddingEnd;

    return (
        <div className="h-[169px] w-full">
            <svg
                viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
                className="h-full w-full overflow-visible"
                role="img"
                aria-label="تحليل الإنفاق"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(48, 145, 63, 0.132)" />
                        <stop offset="100%" stopColor="rgba(48, 145, 63, 0)" />
                    </linearGradient>
                </defs>

                {Y_TICKS.map((tick) => {
                    const y =
                        chartGeometry.paddingTop +
                        chartGeometry.plotHeight -
                        (tick / CHART_MAX) * chartGeometry.plotHeight;
                    return (
                        <line
                            key={tick}
                            x1={chartGeometry.paddingStart}
                            x2={chartGeometry.width - chartGeometry.paddingEnd}
                            y1={y}
                            y2={y}
                            stroke="#F0F4F0"
                            strokeWidth="0.971671"
                            strokeDasharray="4 4"
                        />
                    );
                })}

                <g
                    style={{
                        transformOrigin: `${plotOriginX}px ${chartGeometry.paddingTop + chartGeometry.plotHeight / 2}px`,
                        transform: showLine && animate ? "scaleX(1)" : "scaleX(0)",
                        transition: "transform 800ms ease-out, opacity 200ms ease",
                        opacity: showLine ? 1 : 0,
                    }}
                >
                    <path d={chartGeometry.areaPath} fill={`url(#${gradientId})`} />
                    <path
                        d={chartGeometry.linePath}
                        fill="none"
                        stroke="#30913F"
                        strokeWidth="2.42918"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>

                {Y_TICKS.map((tick) => {
                    const y =
                        chartGeometry.paddingTop +
                        chartGeometry.plotHeight -
                        (tick / CHART_MAX) * chartGeometry.plotHeight;
                    return (
                        <text
                            key={`y-${tick}`}
                            x={chartGeometry.width - 6}
                            y={y + 4}
                            textAnchor="end"
                            fill="#555555"
                            style={{ ...TAJAWAL, fontSize: "9.72px", fontWeight: 400 }}
                        >
                            {tick}
                        </text>
                    );
                })}

                {labels.map((label, index) => {
                    const x =
                        chartGeometry.paddingStart +
                        (index / Math.max(labels.length - 1, 1)) *
                            (chartGeometry.width -
                                chartGeometry.paddingStart -
                                chartGeometry.paddingEnd);
                    const isActive = index === activeIndex;
                    return (
                        <g key={`${label}-${index}`}>
                            <text
                                x={x}
                                y={chartGeometry.height - 12}
                                textAnchor="middle"
                                fill="#111B18"
                                style={{ ...TAJAWAL, fontSize: "10px", fontWeight: 500 }}
                            >
                                {label}
                            </text>
                            {isActive && (
                                <rect
                                    x={x - 12}
                                    y={chartGeometry.height - 6}
                                    width={24}
                                    height={5}
                                    rx={4}
                                    fill="#30913F"
                                />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
