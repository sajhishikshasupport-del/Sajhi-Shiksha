import React from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowBackIcon, ArrowForwardIcon } from '@/components/Icons';
import siteContent from '@/data/sections.json';
import ContentBlock from './components/ContentBlock';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';

const BORDER = 'var(--color-border)';
const SHADOW = 'var(--color-shadow)';

interface SectionCard {
    id: string;
    title: string;
    description: string;
    links: { title: string; url: string }[];
}

const cardColors = [
    'var(--color-purple)',
    'var(--color-yellow)',
    'var(--color-pink)',
    'var(--color-blue)',
    'var(--color-green)',
    'var(--color-orange)',
];

function SectionCardView({ section, index, onClick }: { section: SectionCard; index: number; onClick: () => void }): React.ReactElement {
    const bgColor = cardColors[index % cardColors.length];
    return (
        <Box
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            sx={{
                cursor: 'pointer',
                bgcolor: bgColor,
                border: `3px solid ${BORDER}`,
                boxShadow: `5px 5px 0px ${SHADOW}`,
                p: { xs: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                '&:hover': {
                    transform: 'translate(-3px, -3px)',
                    boxShadow: `8px 8px 0px ${SHADOW}`,
                },
                '&:active': {
                    transform: 'translate(1px, 1px)',
                    boxShadow: `3px 3px 0px ${SHADOW}`,
                },
            }}
            role="button"
            tabIndex={0}
            aria-label={`Explore ${section.title}`}
        >
            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '1.8rem' },
                    mb: 1.5,
                    color: 'var(--color-text)',
                }}
            >
                {section.title}
            </Typography>
            <Typography
                sx={{
                    fontSize: '0.95rem',
                    color: 'rgba(26, 26, 26, 0.75)',
                    mb: 3,
                    maxWidth: 600,
                    mx: 'auto',
                }}
            >
                {section.description}
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
                    {section.links.length} Resources
                </Typography>
                <ArrowForwardIcon sx={{ color: 'rgba(26,26,26,0.6)', fontSize: 20 }} />
            </Box>
        </Box>
    );
}

function ExpandedSectionView({ section, onBack }: { section: SectionCard; onBack: () => void }): React.ReactElement {
    return (
        <Box>
            <Box
                onClick={onBack}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onBack();
                    }
                }}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    mb: 3,
                    fontFamily: FONT_MONO,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    bgcolor: 'var(--color-bg)',
                    border: `2px solid ${BORDER}`,
                    px: 2,
                    py: 0.5,
                    boxShadow: `2px 2px 0px ${SHADOW}`,
                    '&:hover': {
                        boxShadow: `3px 3px 0px ${SHADOW}`,
                        transform: 'translate(-1px, -1px)',
                    },
                }}
                role="button"
                tabIndex={0}
            >
                <ArrowBackIcon sx={{ fontSize: 16 }} />
                Back
            </Box>
            <ContentBlock
                id={section.id}
                title={section.title}
                description={section.description}
                links={section.links}
            />
        </Box>
    );
}

interface MathLoversPageProps {
    activeSection?: string;
    onSectionChange: (id: string | null) => void;
}

const MathLoversPage: React.FC<MathLoversPageProps> = ({ activeSection: activeSectionId, onSectionChange }) => {
    const { mathLovers } = siteContent;
    const blocks = mathLovers.blocks || [];
    const olympiadSection = (mathLovers as unknown as Record<string, SectionCard | undefined>).olympiadSection;

    const allSections: SectionCard[] = [
        ...(olympiadSection ? [olympiadSection] : []),
        ...blocks.map((b) => ({
            id: b.id,
            title: b.title,
            description: b.description,
            links: (b.links || []).map((l) => ({ title: l.title, url: l.url })),
        })),
    ];

    const activeId = activeSectionId ?? null;

    const activeSection = activeId ? allSections.find((s) => s.id === activeId) ?? null : null;

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    mb: 1,
                }}
            >
                {mathLovers.title}
            </Typography>
            <Typography
                sx={{
                    fontFamily: FONT_MONO,
                    fontSize: '1rem',
                    color: 'var(--color-text-secondary)',
                    mb: 6,
                }}
            >
                {mathLovers.subtitle}
            </Typography>

            {activeSection ? (
                <ExpandedSectionView section={activeSection} onBack={() => onSectionChange(null)} />
            ) : allSections.length === 0 ? (
                <Box
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        bgcolor: 'var(--color-bg)',
                        border: `3px solid var(--color-border)`,
                        boxShadow: `4px 4px 0px var(--color-shadow)`,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            mb: 1,
                        }}
                    >
                        No content blocks yet
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                        Content will appear here once added to the configuration.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {allSections.map((section, index) => (
                        <SectionCardView
                            key={section.id}
                            section={section}
                            index={index}
                            onClick={() => onSectionChange(section.id)}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default MathLoversPage;
