import Image from "next/image";
import Link from "next/link";

export function PromoBanner() {
    return (
        <section aria-label="عرض ترويجي" className="mx-auto w-full">
            <Link
                href="https://www.shellaksa.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <div className="relative mx-auto aspect-[343/96] w-full overflow-hidden rounded-2xl bg-gray-100 transition-transform duration-300 hover:scale-[1.02]">
                    <Image
                        src="/home/banner.png"
                        alt="عرض ترويجي"
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 375px) calc(100vw - 32px), 343px"
                        loading="lazy"
                    />
                </div>
            </Link>
        </section>
    );
}