import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';

const ContributePage = lazy(() => import('@/features/contribute/components/ContributePage'));

function ContributeRouteComponent(): React.ReactElement {
    useSEO({
        title: 'Contribute',
        description: 'Share your knowledge with fellow teachers. Contribute study materials, question papers, and resources to help KVS students.',
        canonicalPath: '/contribute',
    });

    const navigate = useNavigate();

    const handleNavigate = (route: string): void => {
        navigate({ to: route });
    };

    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <ContributePage onNavigate={handleNavigate} />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'contribute',
    component: ContributeRouteComponent,
});
