import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Suspense, lazy, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { SearchPageSkeleton } from '@/components/Skeletons';
import { useSEO } from '@/hooks/useSEO';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import studentsData from '@/data/students.json';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import type { FilterState } from '@/components/FilterBar/FilterBar';
import { getUrlType } from '@/lib/urlUtils';
import ResourceCard from '@/components/ResourceCard/ResourceCard';

const SearchPage = lazy(() => import('@/features/search/components/SearchPage'));

const initialFilters: FilterState = {
    class: 'all',
    subject: 'Mathematics',
    type: 'all',
    search: '',
};

function ForStudentsPage(): React.ReactElement {
    const navigate = useNavigate();
    const officialLinks = studentsData.officialLinks;

    useSEO({
        title: 'For Students — Mathematics Resources',
        description: 'Mathematics study materials for Classes 6 to 12. Free question papers, notes, and resources for KVS students.',
        canonicalPath: '/for-students',
    });

    const handleViewResource = (id: string): void => {
        navigate({ to: '/view/$id', params: { id } });
    };

    const handleNavigate = (route: string): void => {
        navigate({ to: route });
    };

    // Map official website links to unified Resource format so we can use ResourceCard
    const mappedOfficialLinks = useMemo(() => {
        return officialLinks.map((link) => ({
            id: link.id,
            title: link.title,
            description: link.description,
            category: 'student-links',
            class: null,
            subject: 'General',
            type: 'link' as const,
            driveUrl: link.url,
            urlType: getUrlType(link.url),
            thumbnail: null,
            contributors: ['Sajhi Shiksha Team'],
            lastUpdated: new Date().toISOString().split('T')[0] || '',
        }));
    }, [officialLinks]);

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Breadcrumb
                items={[{ label: 'For Students' }]}
                onNavigate={handleNavigate}
            />

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    mb: 1,
                }}
            >
                For Students
            </Typography>
            <Typography
                sx={{
                    fontFamily: FONT_MONO,
                    fontSize: '0.95rem',
                    color: 'var(--color-text-secondary)',
                    mb: 4,
                }}
            >
                Official resources and study materials for Classes 6 to 12
            </Typography>

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 700,
                    fontSize: { xs: '1.15rem', md: '1.35rem' },
                    mb: 2,
                }}
            >
                Official Resources
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 3,
                    mb: 6,
                }}
            >
                {mappedOfficialLinks.map((link) => (
                    <ResourceCard
                        key={link.id}
                        resource={link}
                        viewMode="grid"
                        onView={handleViewResource}
                        onDownload={handleDownload}
                    />
                ))}
            </Box>

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 700,
                    fontSize: { xs: '1.15rem', md: '1.35rem' },
                    mb: 2,
                }}
            >
                Class 6-12 Mathematics Resources
            </Typography>

            <Suspense fallback={<SearchPageSkeleton />}>
                <SearchPage
                    initialFilters={initialFilters}
                    onViewResource={handleViewResource}
                    onNavigate={handleNavigate}
                />
            </Suspense>
        </Box>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'for-students',
    component: ForStudentsPage,
});