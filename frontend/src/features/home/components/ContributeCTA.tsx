import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { VolunteerActivismIcon } from '@/components/Icons';
import { useTheme } from '@/context/ThemeContext';
import siteContent from '@/data/site.json';
import { ArrowDoodle, StarDoodle } from '@/components/Doodles';
import { MAX_CONTENT_WIDTH, FONT_HEADING } from '@/lib/constants';

const ContributeCTA: React.FC = React.memo(() => {
    const [isDark] = useTheme();
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    return (
        <Box
            sx={{
                py: { xs: 6, md: 8 },
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
                    opacity: 0.5,
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <StarDoodle size={40} color="var(--color-yellow)" rotation={15} />
            </Box>

            <Box
                sx={{
                    maxWidth: MAX_CONTENT_WIDTH,
                    mx: 'auto',
                    p: { xs: 4, md: 6 },
                    textAlign: 'center',
                    bgcolor: isDark ? 'var(--color-bg-secondary)' : 'var(--color-yellow)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `6px 6px 0px ${shadowColor}`,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: -16,
                        left: { xs: '50%', md: '20%' },
                        transform: 'translateX(-50%) rotate(-10deg)',
                    }}
                >
                    <ArrowDoodle size={48} direction="down" />
                </Box>

                <VolunteerActivismIcon
                    sx={{
                        fontSize: 48,
                        mb: 2,
                        color: 'var(--color-text)',
                    }}
                />
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        mb: 2,
                    }}
                >
                    Got Resources to Share?
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        color: 'var(--color-text-secondary)',
                        mb: 3,
                        maxWidth: '600px',
                        mx: 'auto',
                    }}
                >
                    Help fellow students and teachers. Email us your study materials, notes, or formats — every contribution counts!
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    href={`mailto:${siteContent.site.contactEmail}`}
                    sx={{
                        bgcolor: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        border: `3px solid ${borderColor}`,
                        boxShadow: `4px 4px 0px ${shadowColor}`,
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                            bgcolor: 'var(--color-bg-secondary)',
                            color: 'var(--color-text)',
                            transform: 'none',
                            boxShadow: `4px 4px 0px ${shadowColor}`,
                        },
                    }}
                >
                    Email Us
                </Button>
            </Box>
        </Box>
    );
});

ContributeCTA.displayName = 'ContributeCTA';

export default ContributeCTA;
