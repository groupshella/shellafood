/** Scroll the first invalid / empty marked field into view and focus it. */
export function scrollToFirstFormIssue(container: HTMLElement | null) {
    if (!container) return;

    requestAnimationFrame(() => {
        const target =
            container.querySelector<HTMLElement>("[aria-invalid='true']") ??
            container.querySelector<HTMLElement>("[data-error='true']") ??
            container.querySelector<HTMLElement>("[data-field-error]");

        if (!target) return;

        target.scrollIntoView({ behavior: "smooth", block: "center" });

        const focusable =
            target.matches("input,textarea,select,button")
                ? target
                : target.querySelector<HTMLElement>("input,textarea,select,button");

        focusable?.focus({ preventScroll: true });
    });
}
