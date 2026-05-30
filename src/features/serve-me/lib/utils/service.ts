import { useMemo } from "react";

export const GenerateYearOptions = ()=> {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 51 }, (_, i) => {
        const year = currentYear - i + 1;
        return { value: year.toString(), label: year.toString() };
    });
}