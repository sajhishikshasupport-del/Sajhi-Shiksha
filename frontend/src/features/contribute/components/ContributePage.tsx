import { Box, Typography, Button, Grid, Link } from '@mui/material';
import { VolunteerActivismIcon, EmailIcon, DescriptionIcon, ArticleIcon, InsertDriveFileIcon, LinkIcon, FavoriteIcon, CheckCircleIcon, WhatsAppIcon } from '@/components/Icons';
import { useTheme } from '@/context/ThemeContext';
import contributorsData from '@/data/contributors.json';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH, COLOR_TEXT_LIGHT } from '@/lib/constants';

interface ContributePageProps {
    onNavigate: (route: string) => void;
}

const STEPS = [
    {
        number: 1,
        icon: <DescriptionIcon sx={{ fontSize: 32 }} />,
        title: 'Prepare',
        description: 'Gather your study materials, notes, or resources in PDF or document format.',
    },
    {
        number: 2,
        icon: <EmailIcon sx={{ fontSize: 32 }} />,
        title: 'Email',
        description: 'Send us an email with the resource, subject, class, and a brief description.',
    },
    {
        number: 3,
        icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
        title: 'Credit',
        description: "We'll add it to the site with your name credited as the contributor.",
    },
];

const SHARE_TYPES = [
    { icon: <DescriptionIcon />, title: 'Study materials and notes', description: 'Chapter-wise notes, practice questions, and study guides.' },
    { icon: <ArticleIcon />, title: 'Question papers and answer keys', description: 'Board exam papers, unit tests, and solved papers.' },
    { icon: <InsertDriveFileIcon />, title: 'Formats and templates', description: 'Official formats, timetables, and administrative templates.' },
    { icon: <LinkIcon />, title: 'Useful educational links', description: 'Links to helpful websites, videos, and online resources.' },
    { icon: <FavoriteIcon />, title: 'Monetary contributions', description: 'Support the platform to keep it free for everyone.' },
];

export default function ContributePage({ onNavigate }: ContributePageProps) {
    const [isDark] = useTheme();
    const email = contributorsData.email;
    const mailtoLink = `mailto:${email}?subject=Resource Contribution to Sajhi Shiksha`;
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Breadcrumb
                items={[{ label: 'Contribute' }]}
                onNavigate={onNavigate}
            />

            <Box
                sx={{
                    p: { xs: 4, md: 8 },
                    textAlign: 'center',
                    bgcolor: isDark ? 'var(--color-bg-secondary)' : 'var(--color-yellow)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `6px 6px 0px ${shadowColor}`,
                    mb: 6,
                }}
            >
                <VolunteerActivismIcon
                    sx={{ fontSize: 64, color: 'var(--color-text)', mb: 2 }}
                />
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        mb: 2,
                    }}
                >
                    Share Your Knowledge
                </Typography>
                <Typography
                    sx={{
                        fontSize: '1.1rem',
                        color: 'var(--color-text-secondary)',
                        mb: 4,
                        maxWidth: 600,
                        mx: 'auto',
                    }}
                >
                    Help fellow teachers and students by sharing your study materials, question papers, and resources.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    href={mailtoLink}
                    startIcon={<EmailIcon />}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        bgcolor: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        border: `3px solid ${borderColor}`,
                        boxShadow: `4px 4px 0px ${shadowColor}`,
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

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 4,
                }}
            >
                How It Works
            </Typography>
            <Grid container spacing={4} sx={{ mb: 8 }}>
                {STEPS.map((step) => (
                    <Grid size={{ xs: 12, md: 4 }} key={step.number}>
                        <Box
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                height: '100%',
                                bgcolor: 'var(--color-bg)',
                                border: `3px solid ${borderColor}`,
                                boxShadow: `4px 4px 0px ${shadowColor}`,
                                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                '&:hover': {
                                    transform: 'translate(-2px, -2px)',
                                    boxShadow: `6px 6px 0px ${shadowColor}`,
                                },
                                position: 'relative',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -16,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 32,
                                    height: 32,
                                    bgcolor: 'var(--color-yellow)',
                                    border: `2px solid ${borderColor}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.875rem',
                                    fontFamily: FONT_HEADING,
                                    color: COLOR_TEXT_LIGHT,
                                }}
                            >
                                {step.number}
                            </Box>
                            <Box sx={{ color: 'var(--color-text)', mt: 1, mb: 2 }}>
                                {step.icon}
                            </Box>
                            <Typography
                                sx={{
                                    fontFamily: FONT_HEADING,
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    mb: 1,
                                }}
                            >
                                {step.title}
                            </Typography>
                            <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                                {step.description}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 4,
                }}
            >
                What You Can Share
            </Typography>
            <Box
                sx={{
                    p: 4,
                    mb: 8,
                    bgcolor: 'var(--color-bg)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                }}
            >
                <Grid container spacing={3}>
                    {SHARE_TYPES.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        color: 'var(--color-text)',
                                        flexShrink: 0,
                                        mt: 0.5,
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontFamily: FONT_HEADING,
                                            fontWeight: 700,
                                            mb: 0.5,
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                                        {item.description}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 4,
                }}
            >
                Contact Information
            </Typography>
            <Box
                sx={{
                    p: 4,
                    bgcolor: 'var(--color-bg)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <EmailIcon sx={{ color: 'var(--color-text)' }} />
                        <Link href={mailtoLink} sx={{ fontWeight: 700, color: 'var(--color-text)', fontFamily: FONT_MONO }}>
                            {email}
                        </Link>
                    </Box>
                    {contributorsData.whatsapp && (
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <WhatsAppIcon sx={{ color: 'var(--color-text)' }} />
                            <Typography sx={{ fontFamily: FONT_MONO }}>{contributorsData.whatsapp}</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
