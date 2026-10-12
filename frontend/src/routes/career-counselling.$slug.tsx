import { createRoute } from '@tanstack/react-router';
import { Route as careerCounsellingRoute } from './career-counselling';
import { Suspense, lazy } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';

const CareerPageView = lazy(() => import('@/features/career/components/CareerPageView'));

function CareerPageRouteComponent(): React.ReactElement {
    const { slug } = Route.useParams();
    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <CareerPageView slug={slug} />
        </Suspense>
    );
}

/**
 * Dynamic sub-page route: `/career-counselling/<slug>`.
 * The slug matches a manifest item id / career-pages JSON filename.
 */
export const Route = createRoute({
    getParentRoute: () => careerCounsellingRoute,
    path: '$slug',
    component: CareerPageRouteComponent,
    // Preserve ?lang=hi (REQ-1012-16). Without a validateSearch, TanStack Router
    // drops unknown search params on load, so the language toggle never sees it.
    validateSearch: (search: Record<string, unknown>): { lang?: string } => ({
        lang: typeof search.lang === 'string' ? search.lang : undefined,
    }),
});
