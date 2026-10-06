import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';

const CareerCounsellingPage = lazy(() => import('@/features/career/components/CareerCounsellingPage'));

function CareerCounsellingRouteComponent(): React.ReactElement {
    useSEO({
        title: 'Career Counselling — Free Career Guidance for Students',
        description: 'Free, research-backed career guidance for Indian students and parents: an interactive career explorer, stream selection, entrance exams, colleges and more.',
        canonicalPath: '/career-counselling',
    });

    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <CareerCounsellingPage />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'career-counselling',
    component: CareerCounsellingRouteComponent,
});
