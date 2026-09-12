import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';

const PrivacyPolicyPage = lazy(() => import('@/features/legal/components/PrivacyPolicyPage'));

function PrivacyPolicyRouteComponent(): React.ReactElement {
    useSEO({
        title: 'Privacy Policy',
        description: 'Privacy Policy for Sajhi Shiksha. Learn how we handle your data, cookies, and third-party advertising including Google AdSense.',
        canonicalPath: '/privacy-policy',
    });

    const navigate = useNavigate();

    const handleNavigate = (route: string): void => {
        navigate({ to: route });
    };

    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <PrivacyPolicyPage onNavigate={handleNavigate} />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'privacy-policy',
    component: PrivacyPolicyRouteComponent,
});
