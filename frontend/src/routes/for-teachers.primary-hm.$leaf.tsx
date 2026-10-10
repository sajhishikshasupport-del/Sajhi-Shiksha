import { createRoute, useParams, useSearch } from '@tanstack/react-router';
import { Route as primaryHmRoute, PrimaryHMPage } from './for-teachers.primary-hm';

/**
 * Path-based leaf route for the Primary Teachers & HM section.
 * Renders the same page component as the section route, but takes the leaf id
 * from the URL path (`/for-teachers/primary-hm/<leaf>`) instead of `?leaf=`.
 * This gives every leaf its own URL, so link previews (WhatsApp/Facebook) and
 * search engines see the leaf's own title instead of the section's.
 */
function PrimaryHMLeafPage(): React.ReactElement {
    const { leaf } = useParams({ from: Route.id });
    const { folder } = useSearch({ from: Route.id });
    return <PrimaryHMPage folder={folder} leaf={leaf} />;
}

export const Route = createRoute({
    getParentRoute: () => primaryHmRoute,
    path: '$leaf',
    component: PrimaryHMLeafPage,
    validateSearch: (search: Record<string, unknown>): { folder?: string } => ({
        folder: typeof search.folder === 'string' ? search.folder : undefined,
    }),
});
