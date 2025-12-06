/**
 * Landing Page Feature Public API
 * Clean imports: import { LandingPage, MainLandingPage, HeroSection } from '@/features/landing-page'
 */

// Components
export * from './components';

// Types - export explicitly to avoid conflicts with Tile component
export type { 
	Tile as TileType,
	Statistic,
	Testimonial,
	Service,
	Step,
	ApiResponse
} from './types';

// Constants
export * from './constants/landing-page.constants';

// API
export * from './api/landing-page.api';

