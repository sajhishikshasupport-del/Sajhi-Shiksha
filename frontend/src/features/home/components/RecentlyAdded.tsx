import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
    AutoAwesomeIcon,
    DescriptionIcon,
    EventNoteIcon,
    LinkIcon,
    PictureAsPdfIcon,
} from '@/components/Icons';
import { getRecentlyAdded } from '@/lib/resourceAggregator';
import { trackEvent } from '@/hooks/useAnalytics';
import type { Resource } from '@/types';
import {
    BORDER_RADIUS_PILL,
    COLOR_TEXT_LIGHT,
    FONT_HEADING,
    FONT_MONO,
    MAX_CONTENT_WIDTH,
} from '@/lib/constants';

const RECENT_COUNT = 8;

const typeIconMap: Record<string, React.ElementType> = {
    pdf: PictureAsPdfIcon,
    document: DescriptionIcon,
    link: LinkIcon,
    format: DescriptionIcon,
};

const RecentlyAddedCard: React.FC<{ resource: Resource; index: number }> = ({ resource, index }) => {
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';
    const TypeIcon = typeIconMap[resource.type] ?? DescriptionIcon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: (index % 4) * 0.08,
            }}
            style={{ height: '100%' }}
        >
            <Box
                component="a"
                href={resource.driveUrl}
                onClick={() => trackEvent('document_open', {
                    document_title: resource.title,
                    document_class: resource.class,
                    source: 'recently_added',
                })}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${resource.title}`}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    p: 2.5,
                    bgcolor: 'var(--color-bg)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                    borderRadius: 1,
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `6px 6px 0px ${shadowColor}`,
                    },
                    '&:focus-visible': {
                        outline: `3px solid ${borderColor}`,
                        outlineOffset: 2,
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1.5,
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    <TypeIcon sx={{ fontSize: 20, flexShrink: 0 }} />
                    <Typography
                        component="span"
                        sx={{
                            fontFamily: FONT_MONO,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {resource.description || 'Teacher-shared document'}
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 700,
                        fontSize: '1rem',
                        lineHeight: 1.35,
                        color: 'var(--color-text)',
                        mb: 'auto',
                    }}
                >
                    {resource.title}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        mt: 2,
                    }}
                >
                    {resource.class ? (
                        <Box
                            sx={{
                                px: 1.25,
                                py: 0.25,
                                bgcolor: 'var(--color-yellow)',
                                border: `2px solid ${borderColor}`,
                                borderRadius: BORDER_RADIUS_PILL,
                                fontFamily: FONT_MONO,
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                color: COLOR_TEXT_LIGHT,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                            }}
                        >
                            Class {resource.class}
                        </Box>
                    ) : (
                        <span />
                    )}
                    {resource.lastUpdated && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                fontFamily: FONT_MONO,
                                fontSize: '0.7rem',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            <EventNoteIcon sx={{ fontSize: 14 }} />
                            {resource.lastUpdated}
                        </Box>
                    )}
                </Box>
            </Box>
        </motion.div>
    );
};

const RecentlyAdded: React.FC = () => {
    const items = React.useMemo(() => getRecentlyAdded(RECENT_COUNT), []);

    if (items.length === 0) {
        return null;
    }

    return (
        <Box
            component="section"
            aria-label="Recently added resources"
            sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 4 }, bgcolor: 'var(--color-bg)' }}
        >
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        textAlign: 'center',
                        mb: 1,
                        color: 'var(--color-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                    }}
                >
                    <AutoAwesomeIcon sx={{ fontSize: 32 }} />
                    Recently Added
                </Typography>
                <Typography
                    sx={{
                        fontFamily: FONT_MONO,
                        fontSize: '1rem',
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                        mb: 5,
                    }}
                >
                    Fresh study material, straight from our teachers' desks
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)',
                        },
                        gap: 3,
                    }}
                >
                    {items.map((resource, i) => (
                        <RecentlyAddedCard key={resource.id} resource={resource} index={i} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default RecentlyAdded;
