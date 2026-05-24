import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as forTeachersRoute } from './for-teachers';
import { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
    SchoolIcon, FolderOpenIcon, ArrowForwardIcon
} from '@/components/Icons';
import { useSEO } from '@/hooks/useSEO';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import teachersData from '@/data/teachers.json';

const iconMap: Record<string, React.ReactElement> = {
    School: <SchoolIcon sx={{ fontSize: 48, color: 'var(--color-text)' }} />,
    FolderOpen: <FolderOpenIcon sx={{ fontSize: 48, color: 'var(--color-text)' }} />,
};

const BORDER = 'var(--color-border)';
const SHADOW = 'var(--color-shadow)';

function ForTeachersIndexPage(): React.ReactElement {
    const navigate = useNavigate();

    useSEO({
        title: 'For Teachers — Teaching Resources',
        description: 'Teacher resources including TGT/PGT Maths materials, circulars, formats, and KVS teaching resources.',
        canonicalPath: '/for-teachers',
    });
    const mainCards = teachersData.mainCards;

    const handleNavigate = useCallback((path: string) => {
        navigate({ to: path });
    }, [navigate]);

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3 }}>
                <Typography component="span" sx={{ fontFamily: FONT_HEADING, fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }} aria-current="page">
                    For Teachers
                </Typography>
            </Box>

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    mb: 1,
                }}
            >
                For Teachers
            </Typography>
            <Typography
                sx={{
                    fontFamily: FONT_MONO,
                    fontSize: '0.95rem',
                    color: 'var(--color-text-secondary)',
                    mb: 4,
                }}
            >
                Teaching resources, circulars, formats, and more
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                {mainCards.map((card) => (
                    <Box
                        key={card.id}
                        onClick={() => handleNavigate(`/for-teachers/${card.id}`)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNavigate(`/for-teachers/${card.id}`); }
                        }}
                        sx={{
                            cursor: 'pointer',
                            bgcolor: card.buttonColor,
                            border: `3px solid ${BORDER}`,
                            boxShadow: `5px 5px 0px ${SHADOW}`,
                            p: { xs: 4, md: 5 },
                            textAlign: 'center',
                            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                            '&:hover': { transform: 'translate(-3px, -3px)', boxShadow: `8px 8px 0px ${SHADOW}` },
                            '&:active': { transform: 'translate(1px, 1px)', boxShadow: `3px 3px 0px ${SHADOW}` },
                        }}
                        role="button" tabIndex={0}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                p: 2,
                                mb: 2,
                                bgcolor: 'var(--color-bg)',
                                border: `3px solid ${BORDER}`,
                                boxShadow: `3px 3px 0px ${SHADOW}`,
                            }}
                        >
                            {iconMap[card.icon] || iconMap.FolderOpen}
                        </Box>
                        <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.35rem', md: '1.75rem' }, mb: 1, color: '#1A1A1A' }}>
                            {card.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.95rem', color: 'rgba(26, 26, 26, 0.75)', mb: 2 }}>
                            {card.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Typography
                                sx={{
                                    fontFamily: FONT_MONO,
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text)',
                                    bgcolor: 'var(--color-bg)',
                                    border: `2px solid ${BORDER}`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 2,
                                    py: 0.5,
                                    boxShadow: `2px 2px 0px ${SHADOW}`,
                                }}
                            >
                                {card.subCards.length} Categories
                            </Typography>
                            <ArrowForwardIcon sx={{ color: 'rgba(26,26,26,0.6)', fontSize: 20 }} />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export const Route = createRoute({
    getParentRoute: () => forTeachersRoute,
    path: '/',
    component: ForTeachersIndexPage,
});