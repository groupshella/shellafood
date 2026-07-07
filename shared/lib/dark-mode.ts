export const DARK_MODE_KEY = "shellafood-dark-mode";

export function readDarkModePreference(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(DARK_MODE_KEY) === "true";
}

export function applyDarkMode(enabled: boolean): void {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", enabled);
}

export function setDarkModePreference(enabled: boolean): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(DARK_MODE_KEY, String(enabled));
    applyDarkMode(enabled);
}
