interface ScrollContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function ScrollContainer({ children, className }: ScrollContainerProps) {
    return (
        <div
            className={[
                "flex gap-3 overflow-x-auto pb-1",
                "snap-x snap-mandatory scroll-smooth",
                "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                className,
            ].filter(Boolean).join(" ")}
        >
            {children}
        </div>
    );
}
