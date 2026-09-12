import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';

const TermsPage = lazy(() => import('@/features/legal/components/TermsPage'));

function TermsRouteComponent(): React.ReactElement {
    useSEO({
        title: 'Terms & Conditions',
        description: 'Terms and Conditions for using Sajhi Shiksha. Read our usage guidelines, content policies, and disclaimers.',
        canonicalPath: '/terms',
    });

    const navigate = useNavigate();

    const handleNavigate = (route: string): void => {
        navigate({ to: route });
    };

    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <TermsPage onNavigate={handleNavigate} />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'terms',
    component: TermsRouteComponent,
});
