import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy, useCallback } from 'react';
import { ResourcePageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';

const MathLoversPage = lazy(() => import('@/features/mathLovers/MathLoversPage'));

function ForMathLoversPage(): React.ReactElement {
    const navigate = useNavigate();
    const { section } = Route.useSearch();

    useSEO({
        title: 'For Math Lovers — Explore the Beauty of Mathematics',
        description: 'Interesting math facts, puzzles, and blog posts about the beauty of mathematics.',
        canonicalPath: '/for-math-lovers',
    });

    const handleSectionChange = useCallback((id: string | null) => {
        navigate({
            to: '/for-math-lovers',
            search: id ? { section: id } : {},
        });
    }, [navigate]);

    return (
        <Suspense fallback={<ResourcePageSkeleton />}>
            <MathLoversPage
                activeSection={section}
                onSectionChange={handleSectionChange}
            />
        </Suspense>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'for-math-lovers',
    component: ForMathLoversPage,
    validateSearch: (search: Record<string, unknown>): { section?: string } => ({
        section: typeof search.section === 'string' ? search.section : undefined,
    }),
});
