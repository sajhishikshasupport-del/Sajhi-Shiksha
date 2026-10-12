import { createRoute, Outlet } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

/**
 * Career Counselling — section parent layout.
 *
 * Renders only an <Outlet /> so the index route (`career-counselling.index.tsx`)
 * and the dynamic page route (`career-counselling.$slug.tsx`) render inside it.
 * Follows the same parent/Outlet pattern as `for-teachers.tsx`.
 */
export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'career-counselling',
    component: () => <Outlet />,
});
