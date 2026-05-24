import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import { useTheme } from '@/context/ThemeContext';
import { StarDoodle, PencilDoodle } from '@/components/Doodles';

const SEOContentSection: React.FC = React.memo(() => {
    const [isDark] = useTheme();
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    const features = [
        {
            title: '100% Free & Open Access',
            description: 'Access textbooks, subject reference notes, and exam formats without spending a single rupee. No subscription fees, paywalls, or premium tiers. Education is a birthright, and we keep it that way.',
            color: 'var(--color-pink)',
        },
        {
            title: 'No Login or Registration',
            description: 'Start learning or teaching instantly without the hassle of creating an account or sharing personal details. Click on any resource link and enjoy direct, high-speed downloads from secure drives.',
            color: 'var(--color-blue)',
        },
        {
            title: 'For All Boards & Schools',
            description: 'While initially designed with KVS (Kendriya Vidyalaya Sangathan) guidelines in mind, our comprehensive study materials align beautifully with CBSE, national curricula, and various state boards.',
            color: 'var(--color-green)',
        },
        {
            title: 'Peer-to-Peer Knowledge Sharing',
            description: 'Sajhi Shiksha lives by the powerful philosophy: "From You, For You." Educators and student peers from across India contribute their own curated files to expand this shared archive.',
            color: 'var(--color-yellow)',
        },
    ];

    return (
        <Box
            component="section"
            aria-label="About Sajhi Shiksha educational resources"
            sx={{
                py: { xs: 8, md: 10 },
                px: { xs: 2, md: 4 },
                bgcolor: 'var(--color-bg)',
                borderBottom: `3px solid ${borderColor}`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Dynamic decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 40,
                    right: 48,
                    opacity: 0.3,
                    display: { xs: 'none', lg: 'block' },
                }}
                aria-hidden="true"
            >
                <PencilDoodle size={56} />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: 48,
                    opacity: 0.4,
                    display: { xs: 'none', lg: 'block' },
                }}
                aria-hidden="true"
            >
                <StarDoodle size={40} color="var(--color-purple)" rotation={20} />
            </Box>

            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                <Typography
                    component="h2"
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.75rem' },
                        textAlign: 'center',
                        mb: 2,
                        color: 'var(--color-text)',
                    }}
                >
                    Free Study Materials For All Students & Teachers
                </Typography>

                <Typography
                    sx={{
                        fontFamily: FONT_MONO,
                        fontSize: '1rem',
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                        mb: 6,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}
                >
                    Learn. Share. Grow. — An Open Portal for Everyone
                </Typography>

                <Grid container spacing={4} sx={{ mb: 8 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                p: { xs: 4, md: 5 },
                                height: '100%',
                                bgcolor: isDark ? 'var(--color-bg-secondary)' : '#FFFDF7',
                                border: `3px solid ${borderColor}`,
                                boxShadow: `6px 6px 0px ${shadowColor}`,
                            }}
                        >
                            <Typography
                                component="h3"
                                sx={{
                                    fontFamily: FONT_HEADING,
                                    fontWeight: 800,
                                    fontSize: '1.5rem',
                                    mb: 2.5,
                                    color: 'var(--color-text)',
                                    display: 'inline-block',
                                    borderBottom: `3px solid var(--color-pink)`,
                                    pb: 0.5,
                                }}
                            >
                                Empowering India's Education Ecosystem
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '1.05rem',
                                    lineHeight: 1.75,
                                    color: 'var(--color-text-secondary)',
                                    mb: 3,
                                }}
                            >
                                <strong>Sajhi Shiksha</strong> is an open-access, community-centric repository built with a singular, powerful vision: 
                                to make premium educational resources, reference tools, and academic aids entirely open and available to every 
                                student and teacher in India. We believe that financial or technical barriers should never prevent a student 
                                from practicing mathematics or a teacher from downloading high-quality administrative formats.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '1.05rem',
                                    lineHeight: 1.75,
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                Our platform offers direct, login-free downloads of curated study materials, KVS-aligned files, CBSE syllabus resources, 
                                and chapter-wise study notes. By removing the need for registrations, we ensure that pupils from Classes 6 to 12 
                                can safely and immediately access the academic material they need to excel, while educators can discover 
                                time-saving templates and teaching guidelines.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                p: { xs: 4, md: 5 },
                                height: '100%',
                                bgcolor: isDark ? 'var(--color-bg-secondary)' : '#FFFDF7',
                                border: `3px solid ${borderColor}`,
                                boxShadow: `6px 6px 0px ${shadowColor}`,
                            }}
                        >
                            <Typography
                                component="h3"
                                sx={{
                                    fontFamily: FONT_HEADING,
                                    fontWeight: 800,
                                    fontSize: '1.5rem',
                                    mb: 2.5,
                                    color: 'var(--color-text)',
                                    display: 'inline-block',
                                    borderBottom: `3px solid var(--color-blue)`,
                                    pb: 0.5,
                                }}
                            >
                                Shared Knowledge, Shared Growth
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '1.05rem',
                                    lineHeight: 1.75,
                                    color: 'var(--color-text-secondary)',
                                    mb: 3,
                                }}
                            >
                                The spirit of Sajhi Shiksha centers around <strong>"Sharing Knowledge — From You, For You."</strong> 
                                This means the notes and sheets you find here are not generic web scrapes; they are shared directly by 
                                dedicated teachers, TGT and PGT subject matter experts, and brilliant students who want to make learning 
                                a cooperative journey. From exam preparation booklets to Olympiad worksheets, the database keeps expanding.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '1.05rem',
                                    lineHeight: 1.75,
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                Whether you are a student preparing for board exams, a parent looking for practice worksheets, or a teacher looking 
                                to share your worksheets and rules formats, this platform is open to all. By distributing useful and structured 
                                files, we are building a national study pool that empowers government school systems (like Kendriya Vidyalaya), 
                                private CBSE academies, and rural state-board schools alike.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Typography
                    component="h3"
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: '1.75rem',
                        textAlign: 'center',
                        mb: 5,
                        color: 'var(--color-text)',
                    }}
                >
                    Why Students & Educators Choose Sajhi Shiksha
                </Typography>

                <Grid container spacing={3}>
                    {features.map((feature, idx) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                            <Box
                                sx={{
                                    p: 3.5,
                                    height: '100%',
                                    bgcolor: feature.color,
                                    border: `3px solid ${borderColor}`,
                                    boxShadow: `4px 4px 0px ${shadowColor}`,
                                    color: '#1A1A1A',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transform: `rotate(${idx % 2 === 0 ? '-0.5deg' : '0.5deg'})`,
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px) scale(1.01)',
                                        boxShadow: `6px 6px 0px ${shadowColor}`,
                                    },
                                }}
                            >
                                <Typography
                                    component="h4"
                                    sx={{
                                        fontFamily: FONT_HEADING,
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        mb: 1.5,
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.925rem',
                                        lineHeight: 1.6,
                                        opacity: 0.9,
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
});

SEOContentSection.displayName = 'SEOContentSection';

export default SEOContentSection;
