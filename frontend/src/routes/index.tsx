import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy } from 'react';
import { HomePageSkeleton } from '@/components/Skeletons';
import { useSEO, websiteSchema, organizationSchema } from '@/hooks/useSEO';

const HomePage = lazy(() => import('@/features/home/HomePage'));

function IndexComponent(): React.ReactElement {
    useSEO({
        title: 'Sajhi Shiksha — Free Study Materials for Students & Teachers',
        description: 'Free study materials, question papers, and formats for all students and teachers (Classes 1-12). No login required. Sharing Knowledge — From You, For You.',
        canonicalPath: '/',
        jsonLd: {
            '@context': 'https://schema.org',
            '@graph': [websiteSchema, organizationSchema],
        },
    });

    return (
        <Suspense fallback={<HomePageSkeleton />}>
            <HomePage />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: IndexComponent,
});
