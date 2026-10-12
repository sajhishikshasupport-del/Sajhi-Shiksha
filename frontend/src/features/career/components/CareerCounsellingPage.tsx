import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { ArrowForwardIcon, OpenInNewIcon } from '@/components/Icons';
import PageIntro from '@/components/PageIntro';
import { useSEO, breadcrumbSchema, hreflangAlternates } from '@/hooks/useSEO';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import careerManifest from '@/data/career-website-content.json';
import { careerIcon } from '@/features/career/careerIcons';
import { getCareerPageHi } from '@/features/career/careerPages';
import { useCareerLang } from '@/features/career/useCareerLang';
import { careerStrings } from '@/features/career/careerStrings';
import type { CareerStrings } from '@/features/career/careerStrings';
import type { CareerLang } from '@/features/career/useCareerLang';
import CareerLanguageToggle from '@/features/career/components/CareerLanguageToggle';
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

/**
 * Localize a manifest item's card text for the active language. In Hindi we use
 * the item's `<id>.hi.json` title/intro_short when that file exists, otherwise
 * we fall back to the English manifest entry (REQ-1012-16).
 */
function localizedItem(
    item: CareerManifestItem,
    lang: CareerLang,
): { title: string; description: string } {
    if (lang === 'hi') {
        const hi = getCareerPageHi(item.id);
        if (hi) return { title: hi.title, description: hi.intro_short };
    }
    return { title: item.title, description: item.description };
}

function AccessChip({ access, strings }: { access?: string; strings: CareerStrings }): React.ReactElement {
    const paid = access === 'paid';
    return (
        <Chip
            label={paid ? strings.paid : strings.free}
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

function CareerCard({
    item,
    lang,
    strings,
}: {
    item: CareerManifestItem;
    lang: CareerLang;
    strings: CareerStrings;
}): React.ReactElement {
    const isLink = item.type === 'link' && !!item.url;
    const { title, description } = localizedItem(item, lang);
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
                <AccessChip access={item.access} strings={strings} />
            </Box>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.4rem' }, mb: 1 }}>
                {title}
            </Typography>
            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, flex: 1 }}>
                {description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 2 }}>
                <Typography sx={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                    {isLink ? strings.openExplorer : strings.readMore}
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
 * `/career-counselling/<id>` sub-route. The English / हिंदी toggle sits at the
 * top and, in Hindi, each card shows that item's Hindi title/description when a
 * `<id>.hi.json` file exists (REQ-1012-16).
 */
function CareerCounsellingPage(): React.ReactElement {
    const { lang, setLang } = useCareerLang();
    const strings = careerStrings(lang);

    useSEO({
        title: strings.indexTitle,
        description: strings.indexDescription,
        canonicalPath: '/career-counselling',
        alternates: hreflangAlternates('/career-counselling'),
        jsonLd: breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Career Counselling', path: '/career-counselling' },
        ]),
    });

    const items = visibleItems();
    const freeVsPaid = manifest.free_vs_paid;

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <CareerLanguageToggle lang={lang} onChange={setLang} />

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
                    <CareerCard key={item.id} item={item} lang={lang} strings={strings} />
                ))}
            </Box>

            {freeVsPaid && (freeVsPaid.free_area || freeVsPaid.paid_area) && (
                <Box sx={{ mt: 5 }}>
                    <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.35rem', mb: 2 }}>
                        {strings.freeVsPaidHeading}
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        {freeVsPaid.free_area && (
                            <Box sx={{ p: 3, bgcolor: 'var(--color-bg)', border: `3px solid ${BORDER}`, boxShadow: `4px 4px 0px ${SHADOW}` }}>
                                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, mb: 1 }}>{strings.free}</Typography>
                                <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                    {freeVsPaid.free_area}
                                </Typography>
                            </Box>
                        )}
                        {freeVsPaid.paid_area && (
                            <Box sx={{ p: 3, bgcolor: 'var(--color-bg)', border: `3px solid ${BORDER}`, boxShadow: `4px 4px 0px ${SHADOW}` }}>
                                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, mb: 1 }}>{strings.paid}</Typography>
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
