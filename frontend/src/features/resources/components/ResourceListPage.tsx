import { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import { ViewListIcon, GridViewIcon, SearchOffIcon } from '@/components/Icons';
import { useNavigate } from '@tanstack/react-router';
import { getAllResources } from '@/lib/resourceAggregator';
import FilterBar, { type FilterState } from '@/components/FilterBar/FilterBar';
import ResourceCard from '@/components/ResourceCard/ResourceCard';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH, COLOR_TEXT_LIGHT } from '@/lib/constants';
import { filtersToSearchParams, DEFAULT_FILTERS } from '@/lib/filterUtils';

interface ResourceListPageProps {
    category: string;
    title: string;
    description: string;
    initialFilters?: FilterState;
    onViewResource: (id: string) => void;
    onNavigate: (route: string) => void;
}

export default function ResourceListPage({
    category,
    title,
    description,
    initialFilters = DEFAULT_FILTERS,
    onViewResource,
    onNavigate,
}: ResourceListPageProps) {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const categoryResources = useMemo(() => {
        return getAllResources().filter((r) => r.category === category);
    }, [category]);

    const filteredResources = useMemo(() => {
        let result = categoryResources;

        if (filters.class !== 'all') {
            result = result.filter((r) => r.class === parseInt(filters.class, 10));
        }
        if (filters.subject !== 'all') {
            result = result.filter((r) => r.subject === filters.subject);
        }
        if (filters.type !== 'all') {
            result = result.filter((r) => r.type === filters.type);
        }
        if (filters.search) {
            const query = filters.search.toLowerCase();
            result = result.filter(
                (r) =>
                    r.title.toLowerCase().includes(query) ||
                    r.description.toLowerCase().includes(query)
            );
        }

        return result;
    }, [categoryResources, filters]);

    const syncFiltersToUrl = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        const params = filtersToSearchParams(newFilters);
        const paramString = params.toString();
        navigate({
            to: window.location.pathname as any,
            search: paramString ? Object.fromEntries(params) as any : undefined,
            replace: true,
        });
    }, [navigate]);

    const handleFilterChange = useCallback((newFilters: FilterState | ((prev: FilterState) => FilterState)) => {
        const resolved = typeof newFilters === 'function' ? newFilters(filters) : newFilters;
        syncFiltersToUrl(resolved);
    }, [filters, syncFiltersToUrl]);

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Breadcrumb
                items={[{ label: title }]}
                onNavigate={onNavigate}
            />

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    mb: 1,
                }}
            >
                {title}
            </Typography>
            <Typography sx={{ color: 'var(--color-text-secondary)', mb: 4, fontSize: '1rem' }}>
                {description}
            </Typography>

            <FilterBar filters={filters} onFilterChange={handleFilterChange} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
                <Typography
                    sx={{
                        fontFamily: FONT_MONO,
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    {filteredResources.length === categoryResources.length
                        ? `${categoryResources.length} resources`
                        : `Showing ${filteredResources.length} of ${categoryResources.length} resources`}
                </Typography>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, val) => val && setViewMode(val)}
                    size="small"
                    sx={{
                        '& .MuiToggleButton-root': {
                            border: `2px solid ${borderColor}`,
                            color: 'var(--color-text)',
                            bgcolor: 'var(--color-bg)',
                            '&.Mui-selected': {
                                bgcolor: 'var(--color-yellow)',
                                color: COLOR_TEXT_LIGHT,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                            },
                        },
                    }}
                >
                    <ToggleButton value="grid">
                        <GridViewIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="list">
                        <ViewListIcon fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {filteredResources.length === 0 ? (
                <Box
                    sx={{
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        bgcolor: 'var(--color-bg)',
                        border: `3px solid ${borderColor}`,
                        boxShadow: `4px 4px 0px ${shadowColor}`,
                    }}
                    role="status"
                    aria-live="polite"
                >
                    <SearchOffIcon sx={{ fontSize: 64, color: 'var(--color-text-secondary)', mb: 2 }} />
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            mb: 1,
                        }}
                    >
                        No resources found
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', mb: 3 }}>
                        Try adjusting your filters or search terms to find what you&apos;re looking for.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => handleFilterChange(DEFAULT_FILTERS)}
                        sx={{
                            bgcolor: 'var(--color-yellow)',
                            color: COLOR_TEXT_LIGHT,
                            border: `3px solid ${borderColor}`,
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            '&:hover': {
                                bgcolor: 'var(--color-bg-secondary)',
                                color: COLOR_TEXT_LIGHT,
                                transform: 'translate(-1px, -1px)',
                                boxShadow: `4px 4px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        Clear All Filters
                    </Button>
                </Box>
            ) : viewMode === 'grid' ? (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 3,
                    }}
                >
                    {filteredResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            viewMode="grid"
                            onView={onViewResource}
                            onDownload={handleDownload}
                        />
                    ))}
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            viewMode="list"
                            onView={onViewResource}
                            onDownload={handleDownload}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}
