import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import { LinkedInIcon, GitHubIcon, CodeIcon } from '@/components/Icons';
import { StarDoodle } from '@/components/Doodles';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import developersData from '@/data/developers.json';

interface Developer {
    name: string;
    role: string;
    initials: string;
    color: string;
    bio: string;
    linkedin: string;
    github: string;
}

interface DevelopersPageProps {
    onNavigate: (route: string) => void;
}

const SocialButton: React.FC<{
    href: string;
    label: string;
    icon: React.ReactNode;
    hoverColor: string;
}> = ({ href, label, icon, hoverColor }) => {
    const borderColor = 'var(--color-border)';

    return (
        <Box
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                bgcolor: 'var(--color-bg)',
                border: `2px solid ${borderColor}`,
                boxShadow: `2px 2px 0px ${borderColor}`,
                color: 'var(--color-text)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                textDecoration: 'none',
                '&:hover': {
                    bgcolor: hoverColor,
                    color: '#FFFFFF',
                    transform: 'translateY(-3px)',
                    boxShadow: `4px 4px 0px ${borderColor}`,
                },
                '&:active': {
                    transform: 'translateY(0px)',
                    boxShadow: `1px 1px 0px ${borderColor}`,
                },
            }}
        >
            {icon}
        </Box>
    );
};

const DeveloperCard: React.FC<{ dev: Developer; index: number }> = ({ dev, index }) => {
    const [isDark] = useTheme();
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    // Alternate card accent colors for visual variety
    const cardBg = index === 0
        ? (isDark ? 'var(--color-bg-secondary)' : 'var(--color-blue)')
        : (isDark ? 'var(--color-bg-secondary)' : 'var(--color-purple)');

    return (
        <Box
            sx={{
                p: { xs: 3, md: 4 },
                bgcolor: cardBg,
                border: `3px solid ${borderColor}`,
                boxShadow: `6px 6px 0px ${shadowColor}`,
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translate(-2px, -2px) rotate(-0.5deg)',
                    boxShadow: `8px 8px 0px ${shadowColor}`,
                },
            }}
        >
            {/* Decorative doodle */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 12,
                    right: 16,
                    opacity: 0.3,
                    display: { xs: 'none', sm: 'block' },
                }}
                aria-hidden="true"
            >
                <StarDoodle size={32} rotation={index === 0 ? 15 : -12} />
            </Box>

            {/* Initials Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: dev.color,
                        border: `3px solid ${borderColor}`,
                        boxShadow: `3px 3px 0px ${shadowColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        '&:hover': {
                            transform: 'scale(1.08) rotate(3deg)',
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 800,
                            fontSize: '1.25rem',
                            color: '#1A1A1A',
                            userSelect: 'none',
                        }}
                    >
                        {dev.initials}
                    </Typography>
                </Box>

                <Box>
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 800,
                            fontSize: { xs: '1.25rem', md: '1.4rem' },
                            lineHeight: 1.2,
                        }}
                    >
                        {dev.name}
                    </Typography>
                    <Box
                        sx={{
                            display: 'inline-block',
                            mt: 0.5,
                            px: 1.5,
                            py: 0.3,
                            bgcolor: 'var(--color-bg)',
                            border: `2px solid ${borderColor}`,
                            boxShadow: `2px 2px 0px ${shadowColor}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: FONT_MONO,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}
                        >
                            {dev.role}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Bio */}
            <Typography
                sx={{
                    fontSize: '0.95rem',
                    color: isDark ? 'var(--color-text-secondary)' : 'var(--color-text)',
                    lineHeight: 1.6,
                    mb: 3,
                    opacity: isDark ? 1 : 0.85,
                }}
            >
                {dev.bio}
            </Typography>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                {dev.linkedin && (
                    <SocialButton
                        href={dev.linkedin}
                        label={`${dev.name} on LinkedIn`}
                        icon={<LinkedInIcon sx={{ fontSize: 20 }} />}
                        hoverColor="#0077B5"
                    />
                )}
                {dev.github && (
                    <SocialButton
                        href={dev.github}
                        label={`${dev.name} on GitHub`}
                        icon={<GitHubIcon sx={{ fontSize: 20 }} />}
                        hoverColor={isDark ? '#F0F0F0' : '#333333'}
                    />
                )}
            </Box>
        </Box>
    );
};

export default function DevelopersPage({ onNavigate }: DevelopersPageProps) {
    const [isDark] = useTheme();
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';
    const developers: Developer[] = developersData.developers;

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Breadcrumb
                items={[{ label: 'Developers' }]}
                onNavigate={onNavigate}
            />

            {/* Hero Section */}
            <Box
                sx={{
                    p: { xs: 4, md: 6 },
                    textAlign: 'center',
                    bgcolor: isDark ? 'var(--color-bg-secondary)' : 'var(--color-yellow)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `6px 6px 0px ${shadowColor}`,
                    mb: 6,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative icon */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        bgcolor: 'var(--color-bg)',
                        border: `3px solid ${borderColor}`,
                        boxShadow: `3px 3px 0px ${shadowColor}`,
                        mb: 2,
                        transform: 'rotate(-3deg)',
                    }}
                    aria-hidden="true"
                >
                    <CodeIcon sx={{ fontSize: 28, color: 'var(--color-text)' }} />
                </Box>

                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                        mb: 1.5,
                    }}
                >
                    Built by Developers
                </Typography>
                <Typography
                    sx={{
                        fontSize: '1.05rem',
                        color: 'var(--color-text-secondary)',
                        maxWidth: 550,
                        mx: 'auto',
                        lineHeight: 1.6,
                    }}
                >
                    {developersData.tagline}
                </Typography>
            </Box>

            {/* Developer Cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: { xs: 3, md: 4 },
                    mb: 6,
                }}
            >
                {developers.map((dev, index) => (
                    <DeveloperCard key={dev.name} dev={dev} index={index} />
                ))}
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    bgcolor: 'var(--color-bg)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                        mb: 1,
                    }}
                >
                    Want a website like this?
                </Typography>
                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        color: 'var(--color-text-secondary)',
                        mb: 2.5,
                        maxWidth: 450,
                        mx: 'auto',
                        lineHeight: 1.5,
                    }}
                >
                    Connect with us on LinkedIn — we'd love to help bring your idea to life.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {developers.map((dev) => (
                        <Box
                            key={dev.name}
                            component="a"
                            href={dev.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2.5,
                                py: 1.2,
                                bgcolor: isDark ? 'var(--color-bg-secondary)' : 'var(--color-yellow)',
                                border: `2px solid ${borderColor}`,
                                boxShadow: `3px 3px 0px ${shadowColor}`,
                                fontFamily: FONT_HEADING,
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: 'var(--color-text)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                '&:hover': {
                                    transform: 'translate(-2px, -2px)',
                                    boxShadow: `5px 5px 0px ${shadowColor}`,
                                    bgcolor: '#0077B5',
                                    color: '#FFFFFF',
                                },
                                '&:active': {
                                    transform: 'translate(1px, 1px)',
                                    boxShadow: `1px 1px 0px ${shadowColor}`,
                                },
                            }}
                        >
                            <LinkedInIcon sx={{ fontSize: 18 }} />
                            {dev.name.split(' ')[0]}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
