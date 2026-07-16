interface StaticContentBodyProps {
	content: string;
}

const PROSE_CLASS = [
	"static-content-prose mx-auto w-full max-w-3xl text-start lg:max-w-4xl",
	"text-[14px] font-normal leading-[170%] text-foreground sm:text-[15px]",
	"[&_p]:mb-4 sm:[&_p]:mb-5 [&_p:last-child]:mb-0",
	"[&_p:first-child]:text-[15px] [&_p:first-child]:font-bold [&_p:first-child]:text-foreground sm:[&_p:first-child]:text-[16px]",
	"[&_a]:text-brand [&_a]:underline-offset-2 [&_a]:hover:underline",
	"[&_strong]:font-bold [&_b]:font-bold",
	"[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:ps-5",
	"[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:ps-5",
	"[&_li]:mb-1",
].join(" ");

export function StaticContentBody({ content }: StaticContentBodyProps) {
	return (
		<article
			className={PROSE_CLASS}
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
}
