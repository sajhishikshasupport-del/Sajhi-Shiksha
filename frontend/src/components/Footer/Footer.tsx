import React, { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useTheme } from '@/context/ThemeContext';
import siteContent from '@/data/site.json';
import navigationData from '@/data/navigation.json';
import { StarDoodle, SquiggleDoodle } from '@/components/Doodles';
import { FacebookIcon, TwitterIcon, LinkedInIcon, TelegramIcon, WhatsAppIcon } from '@/components/Icons';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';

interface FooterLinkSectionProps {
    title: string;
    items: { label: string; route: string }[];
}

const FooterLinkSection: React.FC<FooterLinkSectionProps> = React.memo(({ title, items }) => {
    const navigate = useNavigate();
    const borderColor = 'var(--color-border)';

    const handleNavigate = useCallback((route: string) => {
        navigate({ to: route });
    }, [navigate]);

    return (
        <Box sx={{ mb: { xs: 3, md: 0 } }} aria-label={title}>
            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    mb: 2,
                    pb: 1,
                    borderBottom: `3px solid ${borderColor}`,
                    display: 'inline-block',
                }}
            >
                {title}
            </Typography>
            {items.map((item) => (
                <Box
                    key={item.label}
                    component="button"
                    onClick={() => handleNavigate(item.route)}
                    sx={{
                        display: 'block',
                        width: '100%',
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        mb: 1,
                        fontSize: '1rem',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textAlign: 'left',
                        position: 'relative',
                        outline: 'none',
                        '&:focus-visible': {
                            outline: '2px solid var(--color-yellow)',
                            outlineOffset: '2px',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -2,
                            left: 0,
                            width: 0,
                            height: '3px',
                            bgcolor: borderColor,
                            transition: 'width 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        },
                        '&:hover': {
                            color: 'var(--color-text)',
                        },
                        '&:hover::after': {
                            width: '100%',
                        },
                    }}
                >
                    {item.label}
                </Box>
            ))}
        </Box>
    );
});

FooterLinkSection.displayName = 'FooterLinkSection';

const Footer: React.FC = () => {
    const [isDark] = useTheme();
    const footerGroups = navigationData.footerGroups;
    const borderColor = 'var(--color-border)';

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.sajhishiksha.in';
    const shareText = 'Sajhi Shiksha — Free Study Materials, Notes, Question Papers & Formats for Students and Teachers! Open for all education boards (KVS, CBSE, State Boards) completely free.';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const sharePlatforms = [
        {
            name: 'Facebook',
            icon: <FacebookIcon sx={{ fontSize: 20 }} />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            hoverColor: '#1877F2',
        },
        {
            name: 'Twitter',
            icon: <TwitterIcon sx={{ fontSize: 20 }} />,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            hoverColor: '#1DA1F2',
        },
        {
            name: 'LinkedIn',
            icon: <LinkedInIcon sx={{ fontSize: 20 }} />,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            hoverColor: '#0077B5',
        },
        {
            name: 'WhatsApp',
            icon: <WhatsAppIcon sx={{ fontSize: 20 }} />,
            url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
            hoverColor: '#25D366',
        },
        {
            name: 'Telegram',
            icon: <TelegramIcon sx={{ fontSize: 20 }} />,
            url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            hoverColor: '#229ED9',
        },
    ];

    return (
        <Box
            component="footer"
            role="contentinfo"
            aria-label="Site footer"
            sx={{
                bgcolor: isDark ? 'var(--color-bg-secondary)' : 'var(--color-yellow)',
                borderTop: `3px solid ${borderColor}`,
                py: { xs: 6, md: 8 },
                pb: { xs: 10, md: 8 },
                px: { xs: 2, md: 4 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 24,
                    opacity: 0.6,
                    display: { xs: 'none', md: 'block' },
                }}
                aria-hidden="true"
            >
                <StarDoodle size={48} rotation={15} />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 48,
                    left: 16,
                    opacity: 0.4,
                    display: { xs: 'none', md: 'block' },
                }}
                aria-hidden="true"
            >
                <StarDoodle size={32} rotation={-10} />
            </Box>

            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 4, md: 6 },
                        mb: 6,
                    }}
                >
                    <Box sx={{ flex: { xs: 'unset', md: '1.2' } }}>
                        <Typography
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontWeight: 800,
                                fontSize: '1.5rem',
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            {siteContent.site.name}
                        </Typography>
                        <Typography
                            sx={{
                            fontFamily: FONT_MONO,
                            fontSize: '0.9rem',
                            color: 'var(--color-text-secondary)',
                            mb: 2,
                            }}
                        >
                            {siteContent.site.tagline}
                        </Typography>
                        <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }} aria-hidden="true">
                            <SquiggleDoodle width={120} />
                        </Box>

                        {/* Premium Sharing Widget */}
                        <Box sx={{ mt: 3 }}>
                            <Typography
                                sx={{
                                    fontFamily: FONT_MONO,
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: 'var(--color-text-secondary)',
                                    mb: 1.5,
                                    letterSpacing: '0.5px',
                                }}
                            >
                                Share This Platform
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                {sharePlatforms.map((platform) => (
                                    <Box
                                        key={platform.name}
                                        component="a"
                                        href={platform.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Share on ${platform.name}`}
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
                                            '&:hover': {
                                                bgcolor: platform.hoverColor,
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
                                        {platform.icon}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' },
                            gap: { xs: 3, md: 4 },
                        }}
                    >
                        {footerGroups.map((group) => (
                            <Box key={group.heading}>
                                <FooterLinkSection title={group.heading} items={group.links} />
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box
                    sx={{
                        borderTop: `3px solid ${borderColor}`,
                        pt: 4,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: FONT_MONO,
                            fontSize: '0.8rem',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        &copy; {new Date().getFullYear()} {siteContent.site.name}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: FONT_MONO,
                            fontSize: '0.8rem',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        {siteContent.site.footerTagline}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;
