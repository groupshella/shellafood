/**
 * Search Feature Public API
 * Clean imports: import { SearchPage, SearchBar, SearchResults } from '@/features/search'
 */

// Components
export * from './components';

// Types - Export non-conflicting types with wildcard, conflicting types explicitly
export type {
	SearchTab,
	SearchQuery,
	Store,
	Product,
	ApiResponse,
} from './types';

// Export conflicting types with explicit type exports to avoid component/type name conflicts
export type { SearchFilters } from './types';
export type { SearchResults } from './types';

// Constants
export * from './constants/search.constants';

// API
export * from './api/search.api';

// Hooks
export * from './hooks';

// Utils
export * from './lib/utils/searchUtils';

