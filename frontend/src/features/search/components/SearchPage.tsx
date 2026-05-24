import { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { SearchIcon } from '@/components/Icons';
import { useNavigate } from '@tanstack/react-router';
import { getAllResources } from '@/lib/resourceAggregator';
import SearchInput from '@/components/SearchBar/SearchInput';
import FilterBar, { type FilterState } from '@/components/FilterBar/FilterBar';
import ResourceCard from '@/components/ResourceCard/ResourceCard';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import type { Resource } from '@/types';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import { filtersToSearchParams } from '@/lib/filterUtils';

interface SearchPageProps {
    initialFilters: FilterState;
    onViewResource: (id: string) => void;
    onNavigate: (route: string) => void;
}

const MAX_RECENT = 5;

function getRecentSearches(): string[] {
    try {
        const stored = localStorage.getItem('recentSearches');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveRecentSearch(query: string): void {
    if (!query.trim()) return;
    const recent = getRecentSearches();
    const updated = [query, ...recent.filter((s: string) => s !== query)].slice(0, MAX_RECENT);
    try {
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
        // Storage full or unavailable
    }
}

function scoreResource(resource: Resource, query: string): number {
    const q = query.toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    let score = 0;

    for (const term of terms) {
        if (resource.title.toLowerCase().includes(term)) {
            score += resource.title.toLowerCase() === term ? 10 : 5;
        }
        if (resource.description.toLowerCase().includes(term)) {
            score += 3;
        }
        if (resource.category.toLowerCase().includes(term)) {
            score += 1;
        }
        if (resource.subject?.toLowerCase().includes(term)) {
            score += 1;
        }
    }

    return score;
}

export default function SearchPage({
    initialFilters,
    onViewResource,
    onNavigate,
}: SearchPageProps) {
    const navigate = useNavigate();

    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const hasSearched = initialFilters.search !== '' || initialFilters.class !== 'all' || initialFilters.subject !== 'all' || initialFilters.type !== 'all';

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const allResources = useMemo(() => getAllResources(), []);

    const results = useMemo(() => {
        if (!hasSearched) return [];

        let filtered = allResources;

        if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(
                (r) =>
                    r.title.toLowerCase().includes(q) ||
                    r.description.toLowerCase().includes(q) ||
                    r.category.toLowerCase().includes(q) ||
                    r.subject?.toLowerCase().includes(q)
            );

            filtered = filtered
                .map((r) => ({ resource: r, score: scoreResource(r, filters.search) }))
                .filter(({ score }) => score > 0)
                .sort((a, b) => b.score - a.score)
                .map(({ resource }) => resource);
        }

        if (filters.class !== 'all') {
            filtered = filtered.filter((r) => r.class === parseInt(filters.class, 10));
        }
        if (filters.subject !== 'all') {
            filtered = filtered.filter((r) => r.subject === filters.subject);
        }
        if (filters.type !== 'all') {
            filtered = filtered.filter((r) => r.type === filters.type);
        }

        return filtered;
    }, [allResources, filters, hasSearched]);

    const syncFiltersToUrl = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        const params = filtersToSearchParams(newFilters);
        navigate({
            to: '/search',
            search: Object.fromEntries(params),
            replace: true,
        });
    }, [navigate]);

    const handleSearch = useCallback((value: string) => {
        const newFilters = { ...filters, search: value };
        syncFiltersToUrl(newFilters);
        if (value.trim()) {
            saveRecentSearch(value.trim());
        }
    }, [filters, syncFiltersToUrl]);

    const handleFilterChange = useCallback((newFilters: FilterState | ((prev: FilterState) => FilterState)) => {
        const resolved = typeof newFilters === 'function' ? newFilters(filters) : newFilters;
        syncFiltersToUrl(resolved);
    }, [filters, syncFiltersToUrl]);

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };



    const recentSearches = getRecentSearches();

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Breadcrumb
                items={[{ label: 'Search' }]}
                onNavigate={onNavigate}
            />

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    mb: 3,
                }}
            >
                Search Resources
            </Typography>

            <Box sx={{ mb: 3 }}>
                <SearchInput
                    value={filters.search}
                    onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
                    onSearch={handleSearch}
                    autoFocus
                />
            </Box>

            {!hasSearched && recentSearches.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontFamily: FONT_MONO,
                            fontSize: '0.8rem',
                            color: 'var(--color-text-secondary)',
                            mb: 1,
                        }}
                    >
                        Recent Searches
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {recentSearches.map((search) => (
                            <Chip
                                key={search}
                                label={search}
                                onClick={() => handleSearch(search)}
                                clickable
                                sx={{
                                    border: `2px solid var(--color-border)`,
                                    boxShadow: `2px 2px 0px var(--color-shadow)`,
                                    fontFamily: FONT_MONO,
                                    fontWeight: 600,
                                    bgcolor: 'var(--color-bg)',
                                    color: 'var(--color-text)',
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {hasSearched && (
                <>
                    <FilterBar filters={filters} onFilterChange={handleFilterChange} />

                    <Box sx={{ mt: 3, mb: 2 }}>
                        {filters.search ? (
                            <Typography
                                sx={{
                                    fontFamily: FONT_MONO,
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{filters.search}&quot;
                            </Typography>
                        ) : (
                            <Typography
                                sx={{
                                    fontFamily: FONT_MONO,
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                {results.length} resource{results.length !== 1 ? 's' : ''}
                            </Typography>
                        )}
                    </Box>
                </>
            )}

            {!hasSearched ? (
                <Box
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        bgcolor: 'var(--color-bg)',
                        border: `3px solid var(--color-border)`,
                        boxShadow: `4px 4px 0px var(--color-shadow)`,
                    }}
                >
                    <SearchIcon sx={{ fontSize: 48, color: 'var(--color-text-secondary)', mb: 2 }} />
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            mb: 1,
                        }}
                    >
                        Search for study materials
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                        Type keywords like &quot;mathematics&quot;, &quot;class 3&quot;, or &quot;question papers&quot;
                    </Typography>
                </Box>
            ) : results.length === 0 ? (
                <Box
                    sx={{
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        bgcolor: 'var(--color-bg)',
                        border: `3px solid var(--color-border)`,
                        boxShadow: `4px 4px 0px var(--color-shadow)`,
                    }}
                    role="status"
                    aria-live="polite"
                >
                    <SearchIcon sx={{ fontSize: 64, color: 'var(--color-text-secondary)', mb: 2 }} />
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            mb: 1,
                        }}
                    >
                        No results found
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', mb: 3 }}>
                        Try different keywords or remove some filters
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {['Mathematics', 'Class 3', 'Question Papers'].map((term) => (
                            <Chip
                                key={term}
                                label={term}
                                onClick={() => handleSearch(term)}
                                clickable
                                sx={{
                                    border: `2px solid var(--color-border)`,
                                    boxShadow: `2px 2px 0px var(--color-shadow)`,
                                    fontFamily: FONT_MONO,
                                    fontWeight: 600,
                                    bgcolor: 'var(--color-bg)',
                                    color: 'var(--color-text)',
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 3,
                    }}
                >
                    {results.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            viewMode="grid"
                            onView={onViewResource}
                            onDownload={handleDownload}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}
