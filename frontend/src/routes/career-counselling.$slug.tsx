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
});
