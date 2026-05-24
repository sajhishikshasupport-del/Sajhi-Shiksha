import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';

const MathLoversPage = lazy(() => import('@/features/mathLovers/MathLoversPage'));

function ForMathLoversPage(): React.ReactElement {
    useSEO({
        title: 'For Math Lovers — Explore the Beauty of Mathematics',
        description: 'Interesting math facts, puzzles, and blog posts about the beauty of mathematics.',
        canonicalPath: '/for-math-lovers',
    });

    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <MathLoversPage />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'for-math-lovers',
    component: ForMathLoversPage,
});
