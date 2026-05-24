import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { WhatsAppIcon, EmailIcon } from '@/components/Icons';
import siteContent from '@/data/site.json';
import { StarDoodle } from '@/components/Doodles';
import { MAX_CONTENT_WIDTH, FONT_HEADING, FONT_MONO } from '@/lib/constants';
import { useTheme } from '@/context/ThemeContext';

const ContactSection: React.FC = React.memo(() => {
    const [isDark] = useTheme();
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';
    const { contactEmail, whatsappGroupUrl } = siteContent.site;

    return (
        <Box
            sx={{
                py: { xs: 6, md: 8 },
                px: { xs: 2, md: 4 },
                bgcolor: 'var(--color-bg)',
                borderTop: `3px solid ${borderColor}`,
                borderBottom: `3px solid ${borderColor}`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 32,
                    opacity: 0.4,
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <StarDoodle size={36} color="var(--color-purple)" rotation={-12} />
            </Box>

            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        textAlign: 'center',
                        mb: 1,
                    }}
                >
                    Get In Touch
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
                    <Typography
                        sx={{
                            fontFamily: FONT_MONO,
                            fontSize: '1rem',
                            color: 'var(--color-text-secondary)',
                            textAlign: 'center',
                        }}
                    >
                        We'd love to hear from you
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 4,
                        maxWidth: '800px',
                        mx: 'auto',
                    }}
                >
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            bgcolor: isDark ? 'var(--color-bg-secondary)' : '#25D366',
                            border: `3px solid ${borderColor}`,
                            boxShadow: `6px 6px 0px ${shadowColor}`,
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `8px 8px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        <WhatsAppIcon
                            sx={{
                                fontSize: 48,
                                mb: 2,
                                color: isDark ? '#25D366' : '#1A1A1A',
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontWeight: 800,
                                fontSize: '1.5rem',
                                color: isDark ? 'var(--color-text)' : '#1A1A1A',
                                mb: 1,
                            }}
                        >
                            WhatsApp
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: FONT_MONO,
                                fontSize: '0.85rem',
                                color: isDark ? 'var(--color-text-secondary)' : '#1A1A1A',
                                mb: 3,
                                opacity: 0.8,
                            }}
                        >
                            Join our channel for updates
                        </Typography>
                        <Button
                            variant="contained"
                            href={whatsappGroupUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                bgcolor: isDark ? '#25D366' : 'var(--color-bg)',
                                color: isDark ? '#FFFFFF' : 'var(--color-text)',
                                border: `3px solid ${borderColor}`,
                                boxShadow: `4px 4px 0px ${shadowColor}`,
                                fontFamily: FONT_HEADING,
                                fontWeight: 800,
                                fontSize: '1rem',
                                px: 4,
                                py: 1.5,
                                '&:hover': {
                                    bgcolor: isDark ? '#20BD5A' : 'var(--color-bg-secondary)',
                                    transform: 'none',
                                    boxShadow: `4px 4px 0px ${shadowColor}`,
                                },
                            }}
                        >
                            Message Us
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            bgcolor: 'var(--color-blue)',
                            border: `3px solid ${borderColor}`,
                            boxShadow: `6px 6px 0px ${shadowColor}`,
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `8px 8px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        <EmailIcon
                            sx={{
                                fontSize: 48,
                                mb: 2,
                                color: '#1A1A1A',
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontWeight: 800,
                                fontSize: '1.5rem',
                                color: '#1A1A1A',
                                mb: 1,
                            }}
                        >
                            Email
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: FONT_MONO,
                                fontSize: '0.85rem',
                                color: '#1A1A1A',
                                mb: 3,
                                opacity: 0.8,
                            }}
                        >
                            Send us your queries
                        </Typography>
                        <Button
                            variant="contained"
                            href={`mailto:${contactEmail}`}
                            sx={{
                                bgcolor: 'var(--color-bg)',
                                color: 'var(--color-text)',
                                border: `3px solid ${borderColor}`,
                                boxShadow: `4px 4px 0px ${shadowColor}`,
                                fontFamily: FONT_HEADING,
                                fontWeight: 800,
                                fontSize: '1rem',
                                px: 4,
                                py: 1.5,
                                '&:hover': {
                                    bgcolor: 'var(--color-bg-secondary)',
                                    transform: 'none',
                                    boxShadow: `4px 4px 0px ${shadowColor}`,
                                },
                            }}
                        >
                            Email Us
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
