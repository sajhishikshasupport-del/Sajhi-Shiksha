import { createRoute, useNavigate, useParams, Navigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy, useMemo } from 'react';
import { ViewPageSkeleton } from '@/components/Skeletons';
import { useSEO, breadcrumbSchema } from '@/hooks/useSEO';
import { getResourceById, getLeafRouteForId } from '@/lib/resourceAggregator';
import { useJsonData } from '@/lib/runtimeData';

const ResourceViewPage = lazy(() => import('@/features/viewer/components/ResourceViewPage'));

function ViewResourcePage(): React.ReactElement {
    const navigate = useNavigate();
    const { id } = useParams({ from: Route.id });

    const resource = useMemo(() => getResourceById(id), [id]);
    // Leaf/subCard id par aaye to uske asli section page par bhej do (REQ-A5).
    const leafRoute = useMemo(() => getLeafRouteForId(id), [id]);
    const documentDescriptions = useJsonData<Record<string, string>>(
        '/data/document-descriptions.json',
        {}
    );

    useSEO({
        title: resource ? resource.title : 'Resource Not Found',
        description: resource
            ? `View and download ${resource.title}. ${documentDescriptions[resource.id] || resource.description}`
            : 'The requested resource could not be found.',
        canonicalPath: `/view/${id}`,
        noIndex: !resource,
        jsonLd: resource ? breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: resource.title, path: `/view/${id}` },
        ]) : undefined,
    });

    // Saare hooks ke BAAD redirect - hook order same rahe.
    if (leafRoute) {
        return <Navigate to={leafRoute} replace />;
    }

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
