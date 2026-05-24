import { createRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy } from 'react';
import { SearchPageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';
import { searchParamsToFilters, sanitizeString, VALID_CLASSES, VALID_SUBJECTS, VALID_TYPES } from '@/lib/filterUtils';

const SearchPage = lazy(() => import('@/features/search/components/SearchPage'));

function SearchRouteComponent(): React.ReactElement {
    const navigate = useNavigate();
    const search = useSearch({ from: Route.id });

    const filters = searchParamsToFilters(new URLSearchParams(
        `class=${search.class || ''}&subject=${search.subject || ''}&type=${search.type || ''}&q=${search.q || ''}`
    ));

    const hasFilters = search.class || search.subject || search.type || search.q;

    useSEO({
        title: filters.search ? `Search: ${filters.search}` : hasFilters ? 'Filtered Resources' : 'Search Resources',
        description: filters.search
            ? `Search results for "${filters.search}" across all KVS study materials.`
            : 'Search across all study materials, question papers, and resources for KVS students.',
        canonicalPath: hasFilters
            ? `/search?${new URLSearchParams({
                ...(search.q ? { q: String(search.q) } : {}),
                ...(search.class ? { class: String(search.class) } : {}),
                ...(search.subject ? { subject: String(search.subject) } : {}),
                ...(search.type ? { type: String(search.type) } : {}),
            }).toString()}`
            : '/search',
    });

    const handleViewResource = (id: string): void => {
        navigate({ to: '/view/$id', params: { id } });
    };

    const handleNavigate = (route: string): void => {
        navigate({ to: route });
    };

    return (
        <Suspense fallback={<SearchPageSkeleton />}>
            <SearchPage
                initialFilters={filters}
                onViewResource={handleViewResource}
                onNavigate={handleNavigate}
            />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'search',
    validateSearch: (search: Record<string, unknown>): { q?: string; class?: string; subject?: string; type?: string } => ({
        q: typeof search.q === 'string' ? sanitizeString(search.q) : undefined,
        class: typeof search.class === 'string' && VALID_CLASSES.includes(search.class) ? search.class : undefined,
        subject: typeof search.subject === 'string' && VALID_SUBJECTS.includes(search.subject) ? search.subject : undefined,
        type: typeof search.type === 'string' && VALID_TYPES.includes(search.type) ? search.type : undefined,
    }),
    component: SearchRouteComponent,
});
