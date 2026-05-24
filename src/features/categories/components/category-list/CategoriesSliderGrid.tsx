"use client";

import { memo } from "react";
import { useLanguage } from "@/providers";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaStore } from "react-icons/fa";
import { ZoneDataModule } from "../../types/module.types";
import Link from "next/link";
interface CategoriesSliderGridProps {
  modules: ZoneDataModule[];
  className?: string;
  id?: string;
}
const services = [
  {
    id: "serve-me",
    name: "Serve Me",
    nameAr: "اخدمني",
    description: "Professional services at your doorstep",
    descriptionAr: "خدمات احترافية توصل إلى باب منزلك",
    image: "/serveme-hero.png",
    path: "/serve-me",
  },
  {
    id: "pickandorder",
    name: "Pick & Order",
    nameAr: "استلام وتوصيل",
    description: "Fast and reliable delivery service",
    descriptionAr: "خدمة توصيل سريعة وموثوقة",
    image: "/driver.png",
    path: "/pickandorder",
  },
];
function CategoriesSliderGrid({
  modules,
  className = "",
  id,
}: CategoriesSliderGridProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const router = useRouter();

  const handleClick = (module: ZoneDataModule) => {
    const path = `/categories/${module.id}?moduleName=${module.module_name}`;
    router.push(path);
  };

  return (
    <div
      id={id || "categories-scroll-container"}
      dir={isArabic ? "rtl" : "ltr"}
      className={`scrollbar-hide flex gap-6 overflow-x-auto px-4 pb-2 ${className}`}
    >
      {modules.map((module) => (
        <button
          key={module.id}
          onClick={() => handleClick(module)}
          className="flex w-[100px] flex-shrink-0 flex-col items-center text-center transition-transform duration-300 hover:scale-105"
        >
          {/* Image */}
          <div className="relative h-[90px] w-[90px] overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            {module.thumbnail ? (
              <Image
                src={`https://shellafood.com/storage/module/${module.thumbnail}`}
                alt={module.module_name}
                fill
                sizes="90px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FaStore className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Name */}
          <p className="mt-2 line-clamp-2 text-xs font-medium text-gray-700 dark:text-gray-300">
            {module.module_name}
          </p>
        </button>
      ))}
      {
        services.map((service) => (
          <Link
            key={service.id}
            href={service.path}
            className="flex w-[100px] flex-shrink-0 flex-col items-center text-center transition-transform duration-300 hover:scale-105"
          >
            {/* Image */}
            <div className="relative h-[90px] w-[90px] overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="90px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FaStore className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Name */}
            <p className="mt-2 line-clamp-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              {service.nameAr}
            </p>
          </Link>)
        )
      }
    </div>
  );
}

export default memo(CategoriesSliderGrid);
