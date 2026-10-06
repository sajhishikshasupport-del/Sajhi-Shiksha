import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { OpenInNewIcon, ExploreIcon } from '@/components/Icons';
import careerData from '@/data/career-counselling.json';
import PageIntro from '@/components/PageIntro';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';

const BORDER = 'var(--color-border)';
const SHADOW = 'var(--color-shadow)';

interface CareerItem {
    id: string;
    title: string;
    description: string;
    type: string;
    url?: string;
    phase: number;
    order: number;
    access?: string;
}

/**
 * Career Counselling section page.
 * Phase 1 = the interactive Career Explorer (hosted as a static page at
 * /career-explorer.html). Phase 2/3 items are shown as "Coming soon" so the
 * page also carries real, original content for AdSense.
 * Content comes from career-counselling.json (synced from the Career Agent).
 */
function CareerCounsellingPage(): React.ReactElement {
    const items = careerData.items as CareerItem[];
    const live = items.filter((i) => i.phase === 1);
    // Items held back until the CEO finalises them with the Career Agent.
    const HIDDEN = new Set([
        'free-career-aptitude-test',
        'one-to-one-counselling-session',
        'career-ladders',
        'business-ideas-after-courses',
        'coaching-and-competition-reality',
    ]);
    const upcoming = items
        .filter((i) => i.phase > 1 && !HIDDEN.has(i.id))
        .sort((a, b) => a.phase - b.phase || a.order - b.order);
    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Typography
                sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 1 }}
            >
                {careerData.section.title}
            </Typography>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '1rem', color: 'var(--color-text-secondary)', mb: 4 }}>
                {careerData.section.subtitle}
            </Typography>

            {/* Phase 1 — live item(s) */}
            {live.map((it) => (
                <Box
                    key={it.id}
                    sx={{
                        p: { xs: 3, md: 4 },
                        mb: 4,
                        bgcolor: 'var(--color-orange)',
                        border: `3px solid ${BORDER}`,
                        boxShadow: `6px 6px 0px ${SHADOW}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <ExploreIcon sx={{ fontSize: 30, color: '#1A1A1A' }} />
                        <Chip
                            label="Free"
                            size="small"
                            sx={{
                                height: 22, fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.7rem',
                                bgcolor: 'var(--color-bg)', color: 'var(--color-text)', border: `2px solid ${BORDER}`,
                            }}
                        />
                    </Box>
                    <Typography
                        sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.35rem', md: '1.6rem' }, color: '#1A1A1A', mb: 1 }}
                    >
                        {it.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.95rem', color: '#1A1A1A', mb: 3, maxWidth: 780, lineHeight: 1.7 }}>
                        {it.description}
                    </Typography>
                    <Button
                        component="a"
                        href="/career-explorer.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="large"
                        sx={{
                            fontFamily: FONT_HEADING, fontWeight: 700, textTransform: 'none',
                            bgcolor: 'var(--color-bg)', color: 'var(--color-text)',
                            border: `3px solid ${BORDER}`, boxShadow: `4px 4px 0px ${SHADOW}`,
                            '&:hover': { bgcolor: 'var(--color-yellow)', color: '#1A1A1A' },
                        }}
                    >
                        <OpenInNewIcon sx={{ mr: 1.5 }} /> Open Career Explorer
                    </Button>
                </Box>
            ))}

            {/* Free vs Paid boxes are held back until the CEO finalises the
                free/paid boundary with the Career Agent. */}

            {/* Upcoming (Phase 2/3) */}
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.35rem', mb: 2 }}>
                Coming soon
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {upcoming.map((it) => (
                    <Box
                        key={it.id}
                        sx={{ p: 3, bgcolor: 'var(--color-bg)', border: `2px solid ${BORDER}`, opacity: 0.85 }}
                    >
                        <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 700, mb: 0.5 }}>
                            {it.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                            {it.description}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{ mt: 5 }}>
                <PageIntro page="career-counselling" />
            </Box>
        </Box>
    );
}

export default CareerCounsellingPage;
