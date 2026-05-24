import { createRoute, useNavigate, useParams } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy, useMemo } from 'react';
import { ViewPageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';
import { getResourceById } from '@/lib/resourceAggregator';

const ResourceViewPage = lazy(() => import('@/features/viewer/components/ResourceViewPage'));

function ViewResourcePage(): React.ReactElement {
    const navigate = useNavigate();
    const { id } = useParams({ from: Route.id });

    const resource = useMemo(() => getResourceById(id), [id]);

    useSEO({
        title: resource ? resource.title : 'Resource Not Found',
        description: resource ? `View and download ${resource.title}. ${resource.description}` : 'The requested resource could not be found.',
        canonicalPath: `/view/${id}`,
    });

    const handleBack = (): void => {
        navigate({ to: '/' });
    };

    const handleNavigate = (route: string): void => {
        navigate({ to: route });
    };

    return (
        <Suspense fallback={<ViewPageSkeleton />}>
            <ResourceViewPage
                resource={resource}
                onBack={handleBack}
                onNavigate={handleNavigate}
            />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'view/$id',
    component: ViewResourcePage,
});
