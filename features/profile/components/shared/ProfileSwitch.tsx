"use client";

interface ProfileSwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	ariaLabel: string;
}

export function ProfileSwitch({
	checked,
	onChange,
	ariaLabel,
}: ProfileSwitchProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={ariaLabel}
			onClick={() => onChange(!checked)}
			className={[
				"relative h-[25px] w-[50px] shrink-0 rounded-[32px] transition-colors",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				checked ? "bg-brand" : "bg-border",
			].join(" ")}
		>
			<span
				className={[
					"absolute top-[2px] h-5 w-5 rounded-full bg-background shadow-sm transition-all",
					checked ? "start-[26.5px]" : "start-[2px]",
				].join(" ")}
			/>
		</button>
	);
}
