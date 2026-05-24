import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { SchoolIcon, MenuBookIcon, AutoAwesomeIcon, ArrowForwardIcon } from '@/components/Icons';
import siteContent from '@/data/sections.json';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';

const ICON_MAP: Record<string, React.ReactElement> = {
    School: <SchoolIcon sx={{ fontSize: 48 }} />,
    ChalkboardTeacher: <MenuBookIcon sx={{ fontSize: 48 }} />,
    Calculator: <AutoAwesomeIcon sx={{ fontSize: 48 }} />,
};

const rotations = [-0.5, 0.8, -0.3];

const DoorwayCards: React.FC = () => {
    const navigate = useNavigate();
    const borderColor = 'var(--color-border)';
    const sections = siteContent;

    const enabledSections = [sections.students, sections.teachers, sections.mathLovers].filter(
        (s) => s.enabled
    );

    return (
        <Box
            sx={{
                py: { xs: 6, md: 8 },
                px: { xs: 2, md: 4 },
                bgcolor: 'var(--color-bg-secondary)',
                borderTop: `3px solid ${borderColor}`,
                borderBottom: `3px solid ${borderColor}`,
            }}
        >
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        textAlign: 'center',
                        mb: 1,
                        color: 'var(--color-text)',
                    }}
                >
                    Pick Your Path
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
                        Choose your doorway to learning
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 4,
                    }}
                >
                    {enabledSections.map((section, i) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 20,
                                delay: i * 0.15,
                            }}
                            style={{ perspective: '800px' }}
                        >
                            <motion.div
                                whileHover={{
                                    y: -6,
                                    rotate: rotations[i],
                                    boxShadow: `8px 8px 0px ${borderColor}`,
                                }}
                                whileTap={{
                                    y: 2,
                                    scale: 0.98,
                                    boxShadow: `2px 2px 0px ${borderColor}`,
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            >
                                <Box
                                    onClick={() => navigate({ to: section.redirectRoute })}
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        bgcolor: section.buttonColor,
                                        border: `3px solid ${borderColor}`,
                                        boxShadow: `6px 6px 0px ${borderColor}`,
                                        transform: `rotate(${rotations[i]}deg)`,
                                        transition: 'box-shadow 0.2s ease',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            bgcolor: 'var(--color-bg)',
                                            border: `2px solid ${borderColor}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2,
                                            color: 'var(--color-text)',
                                        }}
                                    >
                                        {ICON_MAP[section.icon] || <SchoolIcon sx={{ fontSize: 48 }} />}
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontFamily: FONT_HEADING,
                                            fontWeight: 800,
                                            fontSize: '1.75rem',
                                            color: '#1A1A1A',
                                            mb: 1,
                                        }}
                                    >
                                        {section.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: FONT_MONO,
                                            fontSize: '0.85rem',
                                            color: '#1A1A1A',
                                            opacity: 0.8,
                                            mb: 2,
                                        }}
                                    >
                                        {section.subtitle}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            fontFamily: FONT_MONO,
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            color: '#1A1A1A',
                                            opacity: 0.6,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        Explore <ArrowForwardIcon sx={{ fontSize: 16 }} />
                                    </Typography>
                                </Box>
                            </motion.div>
                        </motion.div>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default DoorwayCards;
