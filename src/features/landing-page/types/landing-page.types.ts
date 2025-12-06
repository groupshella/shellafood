/**
 * Landing Page Feature Types
 * Type definitions for landing-page related entities
 */

export interface Statistic {
	id: string;
	value: number;
	label: string;
	labelAr?: string;
	suffix?: string;
	prefix?: string;
}

export interface Testimonial {
	id: string;
	name: string;
	nameAr?: string;
	role: string;
	roleAr?: string;
	content: string;
	contentAr?: string;
	avatar?: string;
	rating: number;
}

export interface Service {
	id: string;
	title: string;
	titleAr?: string;
	description: string;
	descriptionAr?: string;
	icon?: string;
	image?: string;
	link?: string;
}

export interface Step {
	id: string;
	title: string;
	titleAr?: string;
	description: string;
	descriptionAr?: string;
	icon?: string;
	order: number;
}

export interface Tile {
	id: string;
	title: string;
	titleAr?: string;
	description: string;
	descriptionAr?: string;
	icon?: string;
	image?: string;
	link?: string;
	color?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

