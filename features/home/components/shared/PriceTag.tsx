export function formatPrice(price: number): string {
	return price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function CurrencyIcon({ size = 18 }: { size?: number }) {
	return (
		<svg
			className="ms-0.5 inline-block"
			width={size}
			height={size}
			viewBox="0 0 17 17"
			fill="none"
			style={{ verticalAlign: size >= 18 ? "-2px" : "-1px" }}
			aria-hidden
		>
			<path
				d="M16.0557 13.835C15.9558 14.6423 15.9119 14.9924 15.5391 15.7793L9.8125 16.9619C9.94413 16.1112 10.1191 15.4552 10.4043 15.0615L16.0557 13.835ZM8.0791 8.26465L9.79004 7.89355V2.4873C10.4276 1.7717 10.8195 1.4501 11.5889 1.04395V7.50391L16.0557 6.53418C15.9558 7.34162 15.9118 7.69164 15.5391 8.47852L11.5889 9.31348V11.1299L16.0557 10.1846C15.9558 10.9922 15.9121 11.3426 15.5391 12.1299L11.5889 12.9443V12.9619L9.79004 13.334V9.69336L8.0791 10.0547V12.3496L8.04883 12.3555C7.65527 13.0455 7.09989 13.8744 6.56445 14.5361L0.944336 15.6064C0.994737 14.8834 1.09981 14.4763 1.42676 13.748L6.2793 12.6953V10.4355L1.78125 11.3877C1.83165 10.6645 1.93761 10.2568 2.26465 9.52832L6.2793 8.65527V1.48145C6.91693 0.765707 7.30944 0.444342 8.0791 0.0380859V8.26465Z"
				fill="currentColor"
			/>
		</svg>
	);
}

interface PriceTagProps {
	amount: number;
	size?: "sm" | "lg";
	className?: string;
}

export function PriceTag({ amount, size = "lg", className }: PriceTagProps) {
	const isLarge = size === "lg";

	return (
		<span
			className={[
				isLarge
					? "text-lg font-bold leading-none tracking-tight text-gray-900 dark:text-gray-100 sm:text-xl md:text-[22px]"
					: "text-xs text-gray-400 dark:text-gray-500 sm:text-[13px]",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{formatPrice(amount)}
			<CurrencyIcon size={isLarge ? 18 : 13} />
		</span>
	);
}
