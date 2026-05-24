import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { FONT_HEADING } from '@/lib/constants';
import type { LinkItem } from '@/types';
import { getUrlType } from '@/lib/urlUtils';
import ResourceCard from '@/components/ResourceCard/ResourceCard';

interface ContentBlockProps {
    id: string;
    title: string;
    description: string;
    links?: LinkItem[];
}

const ContentBlock: React.FC<ContentBlockProps> = ({ id, title, description, links }) => {
    const navigate = useNavigate();

    // Map mathematical link items to unified Resource format for ResourceCard consumption
    const mappedResources = useMemo(() => {
        if (!links) return [];
        return links.map((link) => {
            const prefix = id === 'ml-olympiad' ? 'olympiad' : id;
            const linkId = `${prefix}-${link.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
            return {
                id: linkId,
                title: link.title,
                description: `${title} - ${link.title}`,
                category: 'math-lovers',
                class: null,
                subject: 'Mathematics',
                type: 'link' as const,
                driveUrl: link.url,
                urlType: getUrlType(link.url),
                thumbnail: null,
                contributors: ['Sajhi Shiksha Team'],
                lastUpdated: new Date().toISOString().split('T')[0] || '',
            };
        });
    }, [links, title, id]);

    const handleView = (resourceId: string) => {
        navigate({ to: '/view/$id', params: { id: resourceId } });
    };

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <Box
            sx={{
                p: { xs: 3, md: 4 },
                mb: 6,
                bgcolor: 'var(--color-bg)',
                border: '3px solid var(--color-border)',
                boxShadow: '4px 4px 0px var(--color-shadow)',
            }}
        >
            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    mb: 1,
                }}
            >
                {title}
            </Typography>
            <Typography
                sx={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '1rem',
                    mb: 4,
                }}
            >
                {description}
            </Typography>

            {mappedResources.length > 0 && (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 3,
                    }}
                >
                    {mappedResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            viewMode="grid"
                            onView={handleView}
                            onDownload={handleDownload}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ContentBlock;
