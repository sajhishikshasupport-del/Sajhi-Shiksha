import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { AutoAwesomeIcon, ChevronRightIcon, FavoriteIcon, LightModeIcon, SchoolIcon } from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import { SquiggleDoodle, StarDoodle } from '@/components/Doodles';

interface BrainBoostItem {
    icon: React.ReactNode;
    title: string;
    tip: string;
    color: string;
}

const brainBoosts: BrainBoostItem[] = [
    {
        icon: <AutoAwesomeIcon sx={{ fontSize: 28 }} />,
        title: 'Did You Know?',
        tip: 'The brain can process images in as little as 13 milliseconds — that is faster than the blink of an eye!',
        color: 'var(--color-pink)',
    },
    {
        icon: <FavoriteIcon sx={{ fontSize: 28 }} />,
        title: 'Study Tip',
        tip: 'The Pomodoro technique: study for 25 minutes, take a 5-minute break. Four cycles = a longer break. Your brain retains more!',
        color: 'var(--color-purple)',
    },
    {
        icon: <LightModeIcon sx={{ fontSize: 28 }} />,
        title: 'Mindful Moment',
        tip: 'Take three deep breaths before starting a new chapter. Oxygen boosts brain function and reduces study anxiety.',
        color: 'var(--color-yellow)',
    },
    {
        icon: <SchoolIcon sx={{ fontSize: 28 }} />,
        title: 'Fun Fact',
        tip: 'The word "school" comes from the ancient Greek word "skholē" which means "leisure" or "free time." Learning was a luxury!',
        color: 'var(--color-green)',
    },
    {
        icon: <AutoAwesomeIcon sx={{ fontSize: 28 }} />,
        title: 'Math Magic',
        tip: 'Multiply any two-digit number by 11: just add the two digits and put the result in the middle. Example: 23 × 11 = 2(2+3)3 = 253!',
        color: 'var(--color-blue)',
    },
    {
        icon: <FavoriteIcon sx={{ fontSize: 28 }} />,
        title: 'Motivation',
        tip: '"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela',
        color: 'var(--color-orange)',
    },
];

const BrainBoost: React.FC = React.memo(() => {
    const [current, setCurrent] = useState(0);
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % brainBoosts.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(next, 8000);
        return () => clearInterval(timer);
    }, [next]);

    const item = brainBoosts[current]!;

    return (
        <Box
            sx={{
                py: { xs: 6, md: 8 },
                px: { xs: 2, md: 4 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ position: 'absolute', bottom: 16, right: 16, opacity: 0.3, transform: 'rotate(12deg)' }}>
                <StarDoodle size={32} color="var(--color-yellow)" />
            </Box>
            <Box sx={{ position: 'absolute', top: 16, left: 16, opacity: 0.2, transform: 'rotate(-8deg)' }}>
                <StarDoodle size={24} color="var(--color-pink)" />
            </Box>

            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        textAlign: 'center',
                        mb: 2,
                    }}
                >
                    Daily Brain Boost
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <SquiggleDoodle width={80} />
                </Box>

                <Box
                    sx={{
                        maxWidth: 700,
                        mx: 'auto',
                        position: 'relative',
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        >
                            <Box
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    bgcolor: 'var(--color-bg)',
                                    border: `3px solid ${borderColor}`,
                                    boxShadow: `4px 4px 0px ${shadowColor}`,
                                    display: 'flex',
                                    gap: 3,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        flexShrink: 0,
                                        bgcolor: item.color,
                                        border: `2px solid ${borderColor}`,
                                        boxShadow: `2px 2px 0px ${shadowColor}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#1A1A1A',
                                        transform: 'rotate(-2deg)',
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: FONT_MONO,
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            color: item.color,
                                            mb: 0.5,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: FONT_HEADING,
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', md: '1.1rem' },
                                            lineHeight: 1.6,
                                            color: 'var(--color-text)',
                                        }}
                                    >
                                        {item.tip}
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </AnimatePresence>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mt: 3,
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {brainBoosts.map((_, i) => (
                                <Box
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: i === current ? 'var(--color-yellow)' : 'var(--color-border)',
                                        border: `1.5px solid ${borderColor}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: 'var(--color-yellow)',
                                            transform: 'scale(1.3)',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                        <IconButton
                            onClick={next}
                            size="small"
                            aria-label="Next tip"
                            sx={{
                                border: `2px solid ${borderColor}`,
                                borderRadius: 0,
                                color: 'var(--color-text)',
                                '&:hover': {
                                    bgcolor: 'var(--color-bg-secondary)',
                                },
                            }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});

BrainBoost.displayName = 'BrainBoost';

export default BrainBoost;
