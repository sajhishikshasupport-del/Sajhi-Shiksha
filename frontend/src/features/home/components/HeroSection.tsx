import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, TextField, Typography, InputAdornment } from '@mui/material';
import { SearchIcon } from '@/components/Icons';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { MAX_CONTENT_WIDTH, FONT_HEADING, FONT_MONO, COLOR_TEXT_LIGHT, BORDER_RADIUS_PILL } from '@/lib/constants';
import filterChips from '@/data/filters.json';
import siteContent from '@/data/homepage.json';
import { StarDoodle, PencilDoodle, BookDoodle } from '@/components/Doodles';

const HeroSection: React.FC = React.memo(() => {
    const navigate = useNavigate();
    const [_isDark] = useTheme();
    const [activeFilter, setActiveFilter] = useState('all');
    const [showDecorations, setShowDecorations] = useState(false);
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    useEffect(() => {
        const id = requestAnimationFrame(() => setShowDecorations(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const handleFilterClick = useCallback((value: string) => {
        setActiveFilter(value);
        navigate({ to: '/search', search: value !== 'all' ? { q: value } as any : undefined });
    }, [navigate]);

    const chipColors = useMemo(() => [
        'var(--color-yellow)',
        'var(--color-pink)',
        'var(--color-blue)',
        'var(--color-green)',
        'var(--color-purple)',
    ], []);

    return (
        <Box
            sx={{
                position: 'relative',
                py: { xs: 6, md: 10 },
                px: { xs: 2, md: 4 },
                overflow: 'hidden',
                bgcolor: 'var(--color-bg)',
            }}
        >
            {showDecorations && (
                <>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 24,
                            right: { xs: 16, md: 48 },
                            opacity: 0.7,
                            display: { xs: 'none', md: 'block' },
                        }}
                    >
                        <StarDoodle size={48} rotation={12} />
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 32,
                            left: { xs: 16, md: 32 },
                            opacity: 0.5,
                        }}
                    >
                        <StarDoodle size={32} rotation={-8} />
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: { xs: 'auto', md: '10%' },
                            transform: 'translateY(-50%)',
                            opacity: 0.4,
                            display: { xs: 'none', lg: 'block' },
                        }}
                    >
                        <PencilDoodle size={64} />
                    </Box>
                </>
            )}

            <Box
                sx={{
                    maxWidth: MAX_CONTENT_WIDTH,
                    mx: 'auto',
                    position: 'relative',
                    zIndex: 1,
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
                    gap: { xs: 4, md: 6 },
                    alignItems: 'center',
                }}
            >
                <Box>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <Typography
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontWeight: 800,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                                lineHeight: 1.05,
                                mb: 3,
                            }}
                        >
                            {siteContent.heroTitle || 'What do you want to search today?'}
                        </Typography>
                    </motion.div>

                    <Typography
                        sx={{
                            fontSize: { xs: '1.1rem', md: '1.25rem' },
                            color: 'var(--color-text-secondary)',
                            mb: 4,
                            maxWidth: '540px',
                        }}
                    >
                        {siteContent.heroSubtitle || 'Free study materials, question papers, and resources for students and teachers. No login needed.'}
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="Search resources, subjects, classes..."
                        onClick={() => navigate({ to: '/search' })}
                        sx={{
                            maxWidth: { xs: '100%', md: '480px' },
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 0,
                                bgcolor: 'var(--color-bg)',
                                border: `3px solid ${borderColor}`,
                                boxShadow: `3px 3px 0px ${shadowColor}`,
                                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                                '&:hover': {
                                    bgcolor: 'var(--color-bg-secondary)',
                                },
                                '&.Mui-focused': {
                                    borderColor: 'var(--color-yellow)',
                                    borderWidth: '4px',
                                    boxShadow: `4px 4px 0px ${shadowColor}`,
                                },
                            },
                        }}
                        slotProps={{
                            input: {
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'var(--color-text)' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        aria-label="Search resources"
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.5,
                        }}
                    >
                        {filterChips.map((chip: { label: string; value: string }, i: number) => (
                            <button
                                key={chip.value}
                                onClick={() => handleFilterClick(chip.value)}
                                className="hero-chip"
                                style={{
                                    background: activeFilter === chip.value
                                        ? chipColors[i % chipColors.length]
                                        : 'var(--color-bg)',
                                    color: activeFilter === chip.value ? COLOR_TEXT_LIGHT : 'var(--color-text)',
                                    border: `2px solid ${borderColor}`,
                                    boxShadow: activeFilter === chip.value
                                        ? `1px 1px 0px ${shadowColor}`
                                        : `2px 2px 0px ${shadowColor}`,
                                    borderRadius: BORDER_RADIUS_PILL,
                                    padding: '6px 16px',
                                    fontFamily: FONT_MONO,
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                    transform: activeFilter === chip.value ? 'translate(1px, 1px)' : 'translate(0, 0)',
                                }}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        minHeight: { md: '200px', lg: '280px' },
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
                        style={{ position: 'relative' }}
                    >
                        <Box
                            sx={{
                                width: { md: 180, lg: 220 },
                                height: { md: 180, lg: 220 },
                                bgcolor: 'var(--color-yellow)',
                                border: `3px solid ${borderColor}`,
                                boxShadow: `6px 6px 0px ${shadowColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transform: 'rotate(3deg)',
                            }}
                        >
                            <BookDoodle size={80} />
                        </Box>
                        {showDecorations && (
                            <>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -16,
                                        right: -24,
                                        transform: 'rotate(12deg)',
                                    }}
                                >
                                    <StarDoodle size={40} color="var(--color-pink)" />
                                </Box>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: -12,
                                        left: -20,
                                        transform: 'rotate(-15deg)',
                                    }}
                                >
                                    <StarDoodle size={32} color="var(--color-blue)" />
                                </Box>
                            </>
                        )}
                    </motion.div>
                </Box>
            </Box>
        </Box>
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
