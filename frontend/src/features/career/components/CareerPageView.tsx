import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { ArrowBackIcon, ArrowForwardIcon } from '@/components/Icons';
import { useSEO, breadcrumbSchema } from '@/hooks/useSEO';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import careerManifest from '@/data/career-website-content.json';
import { careerIcon } from '@/features/career/careerIcons';
import {
    getCareerPage,
    getStreamGuides,
    CAREER_GUIDES_PARENT_ID,
} from '@/features/career/careerPages';
import type {
    CareerManifest,
    CareerManifestItem,
    CareerPageContent,
    CareerPageItem,
} from '@/features/career/types';

const BORDER = 'var(--color-border)';
const SHADOW = 'var(--color-shadow)';

const manifest = careerManifest as unknown as CareerManifest;

function BackToSection(): React.ReactElement {
    return (
        <Button
            component={Link}
            to="/career-counselling"
            startIcon={<ArrowBackIcon />}
            sx={{
                mb: 3,
                textTransform: 'none',
                fontFamily: FONT_HEADING,
                fontWeight: 700,
                color: 'var(--color-text)',
                border: `2px solid ${BORDER}`,
                bgcolor: 'var(--color-bg)',
                boxShadow: `2px 2px 0px ${SHADOW}`,
                px: 2,
                '&:hover': { bgcolor: 'var(--color-yellow)', color: '#1A1A1A' },
            }}
        >
            Career Counselling
        </Button>
    );
}

function PageItemCard({ item }: { item: CareerPageItem }): React.ReactElement {
    return (
        <Box sx={{ p: 3, bgcolor: 'var(--color-bg)', border: `3px solid ${BORDER}`, boxShadow: `4px 4px 0px ${SHADOW}`, height: '100%' }}>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.1rem', mb: 1 }}>
                {item.title}
            </Typography>
            {item.body && (
                <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                    {item.body}
                </Typography>
            )}
            {item.meta && (
                <Typography
                    sx={{
                        mt: 1.5,
                        fontFamily: FONT_MONO,
                        fontSize: '0.78rem',
                        color: 'var(--color-text)',
                        bgcolor: 'var(--color-bg)',
                        border: `2px solid ${BORDER}`,
                        display: 'inline-block',
                        px: 1,
                        py: 0.25,
                    }}
                >
                    {item.meta}
                </Typography>
            )}
        </Box>
    );
}

/** Render one page's finalized content: title, intro, then each section. */
function CareerContentPage({ content }: { content: CareerPageContent }): React.ReactElement {
    return (
        <>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                {content.title}
            </Typography>
            <Typography sx={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, mb: 4, maxWidth: 820 }}>
                {content.intro_full}
            </Typography>

            {content.sections.map((section, index) => (
                <Box key={`${section.heading}-${index}`} component="section" sx={{ mb: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        {section.icon && (
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    p: 0.75,
                                    bgcolor: 'var(--color-bg)',
                                    border: `3px solid ${BORDER}`,
                                    boxShadow: `3px 3px 0px ${SHADOW}`,
                                }}
                            >
                                {careerIcon(section.icon, 26)}
                            </Box>
                        )}
                        <Typography component="h2" sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.55rem' } }}>
                            {section.heading}
                        </Typography>
                    </Box>
                    {section.body && (
                        <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, mb: section.items?.length ? 3 : 0, maxWidth: 860 }}>
                            {section.body}
                        </Typography>
                    )}
                    {section.items && section.items.length > 0 && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                            {section.items.map((item, itemIndex) => (
                                <PageItemCard key={`${item.title}-${itemIndex}`} item={item} />
                            ))}
                        </Box>
                    )}
                </Box>
            ))}
        </>
    );
}

/** Listing page for the four stream guides (manifest id `career-guides-by-stream`). */
function StreamGuidesListing({ item }: { item: CareerManifestItem | undefined }): React.ReactElement {
    const guides = getStreamGuides();
    return (
        <>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                {item?.title ?? 'Career Guides by Stream'}
            </Typography>
            {item?.description && (
                <Typography sx={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, mb: 4, maxWidth: 820 }}>
                    {item.description}
                </Typography>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {guides.map(({ id, content }) => (
                    <Link
                        key={id}
                        to="/career-counselling/$slug"
                        params={{ slug: id }}
                        style={{ display: 'flex', textDecoration: 'none', color: 'inherit' }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                p: 3,
                                bgcolor: 'var(--color-bg)',
                                border: `3px solid ${BORDER}`,
                                boxShadow: `5px 5px 0px ${SHADOW}`,
                                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                '&:hover': { transform: 'translate(-3px, -3px)', boxShadow: `8px 8px 0px ${SHADOW}` },
                            }}
                        >
                            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.2rem', mb: 1 }}>
                                {content.title}
                            </Typography>
                            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, flex: 1 }}>
                                {content.intro_short}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 2 }}>
                                <Typography sx={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                                    Read the guide
                                </Typography>
                                <ArrowForwardIcon sx={{ fontSize: 18 }} />
                            </Box>
                        </Box>
                    </Link>
                ))}
            </Box>
        </>
    );
}

/** Shown for a visible manifest page item whose content has not been delivered yet. */
function PendingPage({ item }: { item: CareerManifestItem }): React.ReactElement {
    return (
        <>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                {item.title}
            </Typography>
            <Box sx={{ p: 3, bgcolor: 'var(--color-bg)', border: `3px solid ${BORDER}`, boxShadow: `4px 4px 0px ${SHADOW}`, maxWidth: 820 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Chip
                        label="Coming soon"
                        size="small"
                        sx={{
                            height: 22,
                            fontFamily: FONT_MONO,
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            bgcolor: 'var(--color-yellow)',
                            color: '#1A1A1A',
                            border: `2px solid ${BORDER}`,
                        }}
                    />
                </Box>
                <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                    {item.description}
                </Typography>
            </Box>
        </>
    );
}

function NotFoundPage(): React.ReactElement {
    return (
        <>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                Page not found
            </Typography>
            <Typography sx={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, mb: 3, maxWidth: 820 }}>
                This career counselling page does not exist. Browse the section to find what you are looking for.
            </Typography>
            <Button
                component={Link}
                to="/career-counselling"
                startIcon={<ArrowBackIcon />}
                variant="contained"
                sx={{
                    textTransform: 'none',
                    fontFamily: FONT_HEADING,
                    fontWeight: 700,
                    bgcolor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: `3px solid ${BORDER}`,
                    boxShadow: `4px 4px 0px ${SHADOW}`,
                    '&:hover': { bgcolor: 'var(--color-yellow)', color: '#1A1A1A' },
                }}
            >
                Back to Career Counselling
            </Button>
        </>
    );
}

/**
 * Generic renderer for `/career-counselling/<slug>`.
 *
 * Resolves the slug against the finalized page content. Unknown slugs render a
 * not-found state; the `career-guides-by-stream` parent id renders a listing of
 * the four stream guides; a visible manifest page item without content yet
 * renders a "coming soon" state.
 */
function CareerPageView({ slug }: { slug: string }): React.ReactElement {
    const content = getCareerPage(slug);
    const isGuidesParent = slug === CAREER_GUIDES_PARENT_ID;
    const manifestItem = manifest.items.find((item) => item.id === slug);

    const title = content?.title ?? manifestItem?.title ?? 'Career Counselling';
    const description = content?.intro_short ?? manifestItem?.description ?? manifest.section.subtitle;

    useSEO({
        title: `${title} — Career Counselling`,
        description,
        canonicalPath: `/career-counselling/${slug}`,
        noIndex: !content && !isGuidesParent,
        jsonLd: breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Career Counselling', path: '/career-counselling' },
            { name: title, path: `/career-counselling/${slug}` },
        ]),
    });

    let body: React.ReactElement;
    if (isGuidesParent) {
        body = <StreamGuidesListing item={manifestItem} />;
    } else if (content) {
        body = <CareerContentPage content={content} />;
    } else if (manifestItem) {
        body = <PendingPage item={manifestItem} />;
    } else {
        body = <NotFoundPage />;
    }

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <BackToSection />
            {body}
        </Box>
    );
}

export default CareerPageView;
