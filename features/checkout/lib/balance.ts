/** Strip currency / labels and parse a display balance to a number. */
export function parseAmount(value: string | number | null | undefined): number {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (value == null || value === "") return 0;
    return Number(String(value).replace(/[^\d.]/g, "")) || 0;
}

export function isEmptyBalance(value: string | number | null | undefined): boolean {
    return parseAmount(value) <= 0;
}

export function formatSar(amount: number): string {
    return `${Number(amount || 0).toFixed(2)} ﷼`;
}
