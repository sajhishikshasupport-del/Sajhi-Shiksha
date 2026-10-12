import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { ArrowBackIcon, ArrowForwardIcon, WhatsAppIcon } from '@/components/Icons';
import { useSEO, breadcrumbSchema, hreflangAlternates } from '@/hooks/useSEO';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import careerManifest from '@/data/career-website-content.json';
import siteData from '@/data/site.json';
import { trackEvent } from '@/hooks/useAnalytics';
import { careerIcon } from '@/features/career/careerIcons';
import {
    getCareerPage,
    getStreamGuides,
    CAREER_GUIDES_PARENT_ID,
} from '@/features/career/careerPages';
import { useCareerLang } from '@/features/career/useCareerLang';
import { careerStrings } from '@/features/career/careerStrings';
import type { CareerStrings } from '@/features/career/careerStrings';
import type { CareerLang } from '@/features/career/useCareerLang';
import CareerLanguageToggle from '@/features/career/components/CareerLanguageToggle';
import type {
    CareerManifest,
    CareerManifestItem,
    CareerPageContent,
    CareerPageItem,
    CareerPageSection,
} from '@/features/career/types';

const BORDER = 'var(--color-border)';
const SHADOW = 'var(--color-shadow)';

const manifest = careerManifest as unknown as CareerManifest;

/** Website WhatsApp number, digits only (for wa.me links). */
const WA_NUMBER = ((siteData.site?.whatsappNumber as string) || '').replace(/[^0-9]/g, '');

/**
 * Standard end-of-page WhatsApp CTA shown on every career page (REQ-1012-15).
 * The page title is auto-filled and the heading/button are localized
 * (REQ-1012-16); a click is tracked as whatsapp_click with location
 * 'career-page' plus the page's id — tracking is unchanged.
 */
function CareerWhatsAppCTA({
    title,
    pageId,
    strings,
}: {
    title: string;
    pageId: string;
    strings: CareerStrings;
}): React.ReactElement | null {
    if (!WA_NUMBER) return null;
    const message = `Hi, I have a question about "${title}" on Sajhi Shiksha (sajhishiksha.in/career-counselling/${pageId}).`;
    const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    return (
        <Box component="section" sx={{ mt: 6, p: 3, bgcolor: 'var(--color-bg)', border: `3px solid ${BORDER}`, boxShadow: `5px 5px 0px ${SHADOW}`, maxWidth: 820 }}>
            <Typography component="h2" sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.4rem' }, mb: 1 }}>
                {strings.ctaHeading(title)}
            </Typography>
            <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, mb: 2 }}>
                {strings.ctaBody}
            </Typography>
            <Button
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsAppIcon />}
                onClick={() => trackEvent('whatsapp_click', { location: 'career-page', page_id: pageId })}
                sx={{
                    textTransform: 'none',
                    fontFamily: FONT_HEADING,
                    fontWeight: 700,
                    bgcolor: '#25D366',
                    color: '#1A1A1A',
                    border: `3px solid ${BORDER}`,
                    boxShadow: `4px 4px 0px ${SHADOW}`,
                    px: 2.5,
                    '&:hover': { bgcolor: '#1FBE5B', color: '#1A1A1A' },
                }}
            >
                {strings.ctaButton}
            </Button>
        </Box>
    );
}

function BackToSection({ strings }: { strings: CareerStrings }): React.ReactElement {
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
            {strings.sectionName}
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

/**
 * Auto-generated jump chips for a page's sections (id from sections[].heading).
 * Clicking a chip smooth-scrolls to that section (REQ-1012-14).
 */
function SectionChips({
    sections,
    strings,
}: {
    sections: CareerPageSection[];
    strings: CareerStrings;
}): React.ReactElement | null {
    if (sections.length < 2) return null;
    const jumpTo = (id: string): void => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }} aria-label={strings.jumpToSection}>
            {sections.map((section, index) => (
                <Chip
                    key={`chip-${section.heading}-${index}`}
                    label={section.heading}
                    onClick={() => jumpTo(`career-section-${index}`)}
                    clickable
                    sx={{
                        height: 'auto',
                        py: 0.5,
                        fontFamily: FONT_HEADING,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        bgcolor: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        border: `2px solid ${BORDER}`,
                        boxShadow: `2px 2px 0px ${SHADOW}`,
                        '&:hover': { bgcolor: 'var(--color-yellow)', color: '#1A1A1A' },
                    }}
                />
            ))}
        </Box>
    );
}

/** Render one page's finalized content: title, intro, section chips, then each section. */
function CareerContentPage({
    content,
    slug,
    strings,
}: {
    content: CareerPageContent;
    slug: string;
    strings: CareerStrings;
}): React.ReactElement {
    return (
        <>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                {content.title}
            </Typography>
            <Typography sx={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, mb: 4, maxWidth: 820 }}>
                {content.intro_full}
            </Typography>

            <SectionChips sections={content.sections} strings={strings} />

            {content.sections.map((section, index) => (
                <Box key={`${section.heading}-${index}`} id={`career-section-${index}`} component="section" sx={{ mb: 5, scrollMarginTop: '90px' }}>
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

            <CareerWhatsAppCTA title={content.title} pageId={slug} strings={strings} />
        </>
    );
}

/** Listing page for the four stream guides (manifest id `career-guides-by-stream`). */
function StreamGuidesListing({
    item,
    strings,
    lang,
}: {
    item: CareerManifestItem | undefined;
    strings: CareerStrings;
    lang: CareerLang;
}): React.ReactElement {
    const guides = getStreamGuides(lang);
    const heading = item?.title ?? strings.guidesByStreamFallback;
    return (
        <>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                {heading}
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
                                    {strings.readTheGuide}
                                </Typography>
                                <ArrowForwardIcon sx={{ fontSize: 18 }} />
                            </Box>
                        </Box>
                    </Link>
                ))}
            </Box>

            <CareerWhatsAppCTA title={heading} pageId={CAREER_GUIDES_PARENT_ID} strings={strings} />
        </>
    );
}

/** Shown for a visible manifest page item whose content has not been delivered yet. */
function PendingPage({
    item,
    strings,
}: {
    item: CareerManifestItem;
    strings: CareerStrings;
}): React.ReactElement {
    return (
        <>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                {item.title}
            </Typography>
            <Box sx={{ p: 3, bgcolor: 'var(--color-bg)', border: `3px solid ${BORDER}`, boxShadow: `4px 4px 0px ${SHADOW}`, maxWidth: 820 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Chip
                        label={strings.comingSoon}
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

function NotFoundPage({ strings }: { strings: CareerStrings }): React.ReactElement {
    return (
        <>
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                {strings.notFoundTitle}
            </Typography>
            <Typography sx={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, mb: 3, maxWidth: 820 }}>
                {strings.notFoundBody}
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
                {strings.backToCareer}
            </Button>
        </>
    );
}

/**
 * Generic renderer for `/career-counselling/<slug>`.
 *
 * Resolves the slug against the finalized page content in the active language
 * (English by default, Hindi when `?lang=hi` is set — falling back to English
 * when a Hindi file is missing). Unknown slugs render a not-found state; the
 * `career-guides-by-stream` parent id renders a listing of the four stream
 * guides; a visible manifest page item without content yet renders a
 * "coming soon" state.
 */
function CareerPageView({ slug }: { slug: string }): React.ReactElement {
    const { lang, setLang } = useCareerLang();
    const strings = careerStrings(lang);

    const content = getCareerPage(slug, lang);
    const isGuidesParent = slug === CAREER_GUIDES_PARENT_ID;
    const manifestItem = manifest.items.find((item) => item.id === slug);

    const title = content?.title ?? manifestItem?.title ?? strings.sectionName;
    const description = content?.intro_short ?? manifestItem?.description ?? manifest.section.subtitle;

    useSEO({
        title: `${title} — ${strings.sectionName}`,
        description,
        canonicalPath: `/career-counselling/${slug}`,
        noIndex: !content && !isGuidesParent,
        alternates: hreflangAlternates(`/career-counselling/${slug}`),
        jsonLd: breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Career Counselling', path: '/career-counselling' },
            { name: title, path: `/career-counselling/${slug}` },
        ]),
    });

    let body: React.ReactElement;
    if (isGuidesParent) {
        body = <StreamGuidesListing item={manifestItem} strings={strings} lang={lang} />;
    } else if (content) {
        body = <CareerContentPage content={content} slug={slug} strings={strings} />;
    } else if (manifestItem) {
        body = <PendingPage item={manifestItem} strings={strings} />;
    } else {
        body = <NotFoundPage strings={strings} />;
    }

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <CareerLanguageToggle lang={lang} onChange={setLang} />
            <BackToSection strings={strings} />
            {body}
        </Box>
    );
}

export default CareerPageView;
