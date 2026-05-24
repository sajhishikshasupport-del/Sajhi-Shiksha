import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';
import { useSEO, educationalOrgSchema } from '@/hooks/useSEO';

const AboutPage = lazy(() => import('@/features/about/components/AboutPage'));

function AboutRouteComponent(): React.ReactElement {
    useSEO({
        title: 'About Us',
        description: 'Learn about Sajhi Shiksha mission to provide free educational resources for KVS students and teachers. Meet our team.',
        canonicalPath: '/about',
        jsonLd: educationalOrgSchema,
    });

    const navigate = useNavigate();

    const handleNavigate = (route: string): void => {
        navigate({ to: route });
    };

    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <AboutPage onNavigate={handleNavigate} />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'about',
    component: AboutRouteComponent,
});
