/**
 * Search Feature Public API
 * Clean imports: import { SearchPage, SearchBar, SearchResults } from '@/features/search'
 */

// Components
export * from './components';

// Types - Export non-conflicting types with wildcard, conflicting types explicitly
export type {
	SearchQuery,
	ApiResponse,
	SearchFilters,
	ItemOrStoreSearchResponse,
	ItemOrStoreSearchItem,
	ItemOrStoreSearchStore,
	SearchRequestContext,
} from './types';

/** API payload shape (not the SearchResults UI component) */
export type { SearchResults as SearchResultsData } from './types';

// Constants
export * from './constants/search.constants';

// API
export * from './api/search.api';

// Hooks
export * from './hooks';

// Utils
export * from './lib/utils/searchUtils';

