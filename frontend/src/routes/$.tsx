import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Box, Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useSEO } from '@/hooks/useSEO';
import { ArrowDoodle, StarDoodle, SquiggleDoodle } from '@/components/Doodles';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';

function NotFoundPage(): React.ReactElement {
    const navigate = useNavigate();

    useSEO({
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist. Return to the homepage to browse study materials.',
        canonicalPath: '/404',
        noIndex: true,
    });

    const shadowColor = 'var(--color-shadow)';
    const borderColor = 'var(--color-border)';

    const quickLinks = [
        { label: 'Students', route: '/for-students' },
        { label: 'Search', route: '/search' },
        { label: 'Teachers', route: '/for-teachers' },
        { label: 'Math Lovers', route: '/for-math-lovers' },
    ];

    return (
        <Box
            sx={{
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                position: 'relative',
                overflow: 'hidden',
                maxWidth: MAX_CONTENT_WIDTH,
                mx: 'auto',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 40,
                    right: '10%',
                    opacity: 0.3,
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <StarDoodle size={64} rotation={15} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: 60,
                    left: '8%',
                    opacity: 0.3,
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <ArrowDoodle size={48} direction="up" />
            </Box>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '5rem', md: '8rem' },
                        lineHeight: 1,
                        color: 'var(--color-yellow)',
                        textShadow: `4px 4px 0px ${shadowColor}`,
                        textAlign: 'center',
                    }}
                >
                    404
                </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            >
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        textAlign: 'center',
                        mt: 2,
                        mb: 1,
                    }}
                >
                    Oops! This page took a different path
                </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            >
                <Typography
                    sx={{
                        fontFamily: FONT_MONO,
                        fontSize: '1rem',
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                        mb: 2,
                        maxWidth: '450px',
                    }}
                >
                    The page you are looking for might have been removed, the link is broken, or you entered the wrong address.
                </Typography>
            </motion.div>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <SquiggleDoodle width={100} />
            </Box>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
            >
                <Typography
                    sx={{
                        fontFamily: FONT_MONO,
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                        mb: 2,
                    }}
                >
                    Try one of these instead:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
                    {quickLinks.map((link) => (
                        <Chip
                            key={link.route}
                            label={link.label}
                            onClick={() => navigate({ to: link.route })}
                            clickable
                            sx={{
                                border: `2px solid ${borderColor}`,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                                fontFamily: FONT_MONO,
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                bgcolor: 'var(--color-bg)',
                                color: 'var(--color-text)',
                                '&:hover': {
                                    bgcolor: 'var(--color-yellow)',
                                    color: '#1A1A1A',
                                    transform: 'translate(-1px, -1px)',
                                    boxShadow: `3px 3px 0px ${shadowColor}`,
                                },
                            }}
                        />
                    ))}
                </Box>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
            >
                <Button
                    variant="contained"
                    onClick={() => navigate({ to: '/' })}
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        px: 4,
                        py: 1.5,
                        bgcolor: 'var(--color-yellow)',
                        color: '#1A1A1A',
                        border: `3px solid ${borderColor}`,
                        boxShadow: `3px 3px 0px ${shadowColor}`,
                        '&:hover': {
                            bgcolor: 'var(--color-bg-secondary)',
                            transform: 'translate(-2px, -2px)',
                            boxShadow: `5px 5px 0px ${shadowColor}`,
                        },
                    }}
                >
                    Go Back Home
                </Button>
            </motion.div>
        </Box>
    );
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: NotFoundPage,
});
