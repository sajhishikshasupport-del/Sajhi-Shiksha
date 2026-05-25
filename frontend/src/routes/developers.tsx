import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';

const DevelopersPage = lazy(() => import('@/features/developers/components/DevelopersPage'));

function DevelopersRouteComponent(): React.ReactElement {
    useSEO({
        title: 'Developers',
        description: 'Meet the developers behind Sajhi Shiksha — the team that built this free educational platform for KVS students and teachers.',
        canonicalPath: '/developers',
    });

    const navigate = useNavigate();

    const handleNavigate = (route: string): void => {
        navigate({ to: route });
    };

    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <DevelopersPage onNavigate={handleNavigate} />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'developers',
    component: DevelopersRouteComponent,
});
