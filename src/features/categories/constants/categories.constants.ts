import type { DailyNeededItem } from "../types/category.types";

// ============================================================================
// Daily Needed Items Constants
// ============================================================================

export const DAILY_NEEDED_ITEMS: DailyNeededItem[] = [
	{
		id: "1",
		name: "Fruits & Vegetables",
		nameAr: "خضار وفواكه",
		image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop",
		emoji: "🥬",
	},
	{
		id: "2",
		name: "Dairy Products",
		nameAr: "منتجات ألبان",
		image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
		emoji: "🥛",
	},
	{
		id: "3",
		name: "Meat & Poultry",
		nameAr: "لحوم ودواجن",
		image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
		emoji: "🍗",
	},
	{
		id: "4",
		name: "Bakery",
		nameAr: "مخبوزات",
		image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
		emoji: "🍞",
	},
	{
		id: "5",
		name: "Beverages",
		nameAr: "مشروبات",
		image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
		emoji: "🥤",
	},
	{
		id: "6",
		name: "Snacks",
		nameAr: "وجبات خفيفة",
		image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=300&fit=crop",
		emoji: "🍿",
	},
	{
		id: "7",
		name: "Cleaning Supplies",
		nameAr: "مواد تنظيف",
		image: "https://images.unsplash.com/photo-1584487227103-5d8b5e9a5c5b?w=400&h=300&fit=crop",
		emoji: "🧹",
	},
	{
		id: "8",
		name: "Personal Care",
		nameAr: "العناية الشخصية",
		image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
		emoji: "🧴",
	},
	{
		id: "9",
		name: "Frozen Foods",
		nameAr: "أطعمة مجمدة",
		image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop",
		emoji: "🧊",
	},
	{
		id: "10",
		name: "Canned Goods",
		nameAr: "معلبات",
		image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
		emoji: "🥫",
	},
	{
		id: "11",
		name: "Spices & Herbs",
		nameAr: "بهارات وأعشاب",
		image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
		emoji: "🌿",
	},
	{
		id: "12",
		name: "Rice & Grains",
		nameAr: "أرز وحبوب",
		image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
		emoji: "🌾",
	},
] as const;

