type CouponTicketIllustrationProps = {
	className?: string;
	size?: number;
};

/**
 * Decorative "no coupons" ticket illustration — a star-stamped ticket with a
 * scattering of soft blobs/dots behind it and a diagonal strike across it.
 * Pure presentational SVG, no fetch/state — safe to use in server components.
 */
export function CouponTicketIllustration({ className, size = 220 }: CouponTicketIllustrationProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 220 220"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden="true"
		>
			{/* soft background blobs */}
			<rect x="28" y="34" width="150" height="120" rx="46" transform="rotate(-8 103 94)" fill="#E4F7E6" />
			<rect x="46" y="70" width="130" height="104" rx="40" transform="rotate(10 111 122)" fill="#D9F3DC" />
			<circle cx="52" cy="150" r="20" fill="#E4F7E6" />
			<circle cx="176" cy="66" r="16" fill="#E4F7E6" />

			{/* scattered dots + plus marks */}
			<circle cx="46" cy="60" r="3" fill="#8FD39C" />
			<circle cx="150" cy="40" r="3" fill="#8FD39C" />
			<circle cx="188" cy="120" r="3" fill="#8FD39C" />
			<circle cx="70" cy="182" r="3" fill="#8FD39C" />
			<circle cx="130" cy="184" r="3" fill="#8FD39C" />
			<g stroke="#5FBE73" strokeWidth="2" strokeLinecap="round">
				<path d="M64 44v10M59 49h10" />
				<path d="M158 96v10M153 101h10" />
				<path d="M38 106v10M33 111h10" />
				<path d="M112 190v10M107 195h10" />
			</g>

			{/* ticket */}
			<g>
				<path
					d="M68 78a8 8 0 0 1 8-8h68a8 8 0 0 1 8 8v22a10 10 0 0 0 0 20v22a8 8 0 0 1-8 8H76a8 8 0 0 1-8-8v-22a10 10 0 0 0 0-20z"
					fill="#FFFFFF"
					stroke="#2F9A44"
					strokeWidth="2.5"
				/>
				{/* perforation stub */}
				<g stroke="#2F9A44" strokeWidth="2" strokeDasharray="4 4">
					<line x1="140" y1="82" x2="140" y2="140" />
				</g>
				{/* star stamp */}
				<path
					d="M100 88l6.7 13.6 15 2.2-10.9 10.6 2.6 15-13.4-7-13.4 7 2.6-15-10.9-10.6 15-2.2z"
					fill="#3AA352"
				/>
			</g>

			{/* diagonal strike */}
			<g stroke="#2F9A44" strokeWidth="2.5" strokeLinecap="round">
				<line x1="32" y1="128" x2="150" y2="188" />
				<line x1="40" y1="118" x2="158" y2="178" strokeDasharray="3 6" />
			</g>
		</svg>
	);
}
