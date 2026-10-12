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
});
