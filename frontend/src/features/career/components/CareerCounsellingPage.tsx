import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { ArrowForwardIcon, OpenInNewIcon } from '@/components/Icons';
import PageIntro from '@/components/PageIntro';
import { useSEO, breadcrumbSchema } from '@/hooks/useSEO';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import careerManifest from '@/data/career-website-content.json';
import { careerIcon } from '@/features/career/careerIcons';
import type { CareerManifest, CareerManifestItem } from '@/features/career/types';

const BORDER = 'var(--color-border)';
const SHADOW = 'var(--color-shadow)';

const manifest = careerManifest as unknown as CareerManifest;

/** Visible items, ordered by phase then order. */
function visibleItems(): CareerManifestItem[] {
    return manifest.items
        .filter((item) => item.visible !== false)
        .sort((a, b) => a.phase - b.phase || a.order - b.order);
}

function AccessChip({ access }: { access?: string }): React.ReactElement {
    const paid = access === 'paid';
    return (
        <Chip
            label={paid ? 'Paid' : 'Free'}
            size="small"
            sx={{
                height: 22,
                fontFamily: FONT_MONO,
                fontWeight: 700,
                fontSize: '0.7rem',
                bgcolor: paid ? 'var(--color-pink)' : 'var(--color-bg)',
                color: 'var(--color-text)',
                border: `2px solid ${BORDER}`,
            }}
        />
    );
}

const cardSx = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    p: { xs: 3, md: 3.5 },
    bgcolor: 'var(--color-bg)',
    border: `3px solid ${BORDER}`,
    boxShadow: `5px 5px 0px ${SHADOW}`,
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    '&:hover': { transform: 'translate(-3px, -3px)', boxShadow: `8px 8px 0px ${SHADOW}` },
    '&:active': { transform: 'translate(1px, 1px)', boxShadow: `3px 3px 0px ${SHADOW}` },
} as const;

function CareerCard({ item }: { item: CareerManifestItem }): React.ReactElement {
    const isLink = item.type === 'link' && !!item.url;
    const inner = (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        p: 1,
                        bgcolor: 'var(--color-bg)',
                        border: `3px solid ${BORDER}`,
                        boxShadow: `3px 3px 0px ${SHADOW}`,
                    }}
                >
                    {careerIcon(item.icon, 30)}
                </Box>
                <AccessChip access={item.access} />
            </Box>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.4rem' }, mb: 1 }}>
                {item.title}
            </Typography>
            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, flex: 1 }}>
                {item.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 2 }}>
                <Typography sx={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                    {isLink ? 'Open Explorer' : 'Read more'}
                </Typography>
                {isLink ? <OpenInNewIcon sx={{ fontSize: 18 }} /> : <ArrowForwardIcon sx={{ fontSize: 18 }} />}
            </Box>
        </>
    );

    if (isLink) {
        return (
            <Box component="a" href={item.url} target="_blank" rel="noopener noreferrer" sx={cardSx}>
                {inner}
            </Box>
        );
    }

    return (
        <Link to="/career-counselling/$slug" params={{ slug: item.id }} style={{ display: 'flex', textDecoration: 'none', color: 'inherit' }}>
            <Box sx={cardSx}>{inner}</Box>
        </Link>
    );
}

/**
 * Career Counselling section index.
 *
 * Lists every visible manifest item as a card. `type=link` items open their
 * external url (the Career Explorer); `type=page` items link to their
 * `/career-counselling/<id>` sub-route.
 */
function CareerCounsellingPage(): React.ReactElement {
    useSEO({
        title: 'Career Counselling — Free Career Guidance for Students',
        description:
            'Free, research-backed career guidance for Indian students and parents — an interactive career explorer, stream selection, entrance exams, colleges, scholarships and more.',
        canonicalPath: '/career-counselling',
        jsonLd: breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Career Counselling', path: '/career-counselling' },
        ]),
    });

    const items = visibleItems();
    const freeVsPaid = manifest.free_vs_paid;

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Typography
                component="span"
                sx={{ fontFamily: FONT_HEADING, fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}
                aria-current="page"
            >
                {manifest.section.title}
            </Typography>

            <Typography
                sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mt: 1, mb: 1 }}
            >
                {manifest.section.title}
            </Typography>
            <Typography
                sx={{ fontFamily: FONT_MONO, fontSize: '0.95rem', color: 'var(--color-text-secondary)', mb: 4 }}
            >
                {manifest.section.subtitle}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                {items.map((item) => (
                    <CareerCard key={item.id} item={item} />
                ))}
            </Box>

            {freeVsPaid && (freeVsPaid.free_area || freeVsPaid.paid_area) && (
                <Box sx={{ mt: 5 }}>
                    <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.35rem', mb: 2 }}>
                        Free and paid, clearly separated
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        {freeVsPaid.free_area && (
                            <Box sx={{ p: 3, bgcolor: 'var(--color-bg)', border: `3px solid ${BORDER}`, boxShadow: `4px 4px 0px ${SHADOW}` }}>
                                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, mb: 1 }}>Free</Typography>
                                <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                    {freeVsPaid.free_area}
                                </Typography>
                            </Box>
                        )}
                        {freeVsPaid.paid_area && (
                            <Box sx={{ p: 3, bgcolor: 'var(--color-bg)', border: `3px solid ${BORDER}`, boxShadow: `4px 4px 0px ${SHADOW}` }}>
                                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, mb: 1 }}>Paid</Typography>
                                <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                    {freeVsPaid.paid_area}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    {freeVsPaid.boundary_rule && (
                        <Typography sx={{ mt: 2, fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                            {freeVsPaid.boundary_rule}
                        </Typography>
                    )}
                </Box>
            )}

            <Box sx={{ mt: 5 }}>
                <PageIntro page="career-counselling" />
            </Box>
        </Box>
    );
}

export default CareerCounsellingPage;
