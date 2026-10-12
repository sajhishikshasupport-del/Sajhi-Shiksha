import { createRoute } from '@tanstack/react-router';
import { Route as careerCounsellingRoute } from './career-counselling';
import { Suspense, lazy } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';

const CareerCounsellingPage = lazy(() => import('@/features/career/components/CareerCounsellingPage'));

function CareerCounsellingIndexRouteComponent(): React.ReactElement {
    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <CareerCounsellingPage />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => careerCounsellingRoute,
    path: '/',
    component: CareerCounsellingIndexRouteComponent,
    // Preserve ?lang=hi (REQ-1012-16). Without a validateSearch, TanStack Router
    // drops unknown search params on load, so the language toggle never sees it.
    validateSearch: (search: Record<string, unknown>): { lang?: string } => ({
        lang: typeof search.lang === 'string' ? search.lang : undefined,
    }),
});
