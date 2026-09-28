import { Box, Typography, Button, Grid, Link } from '@mui/material';
import { VolunteerActivismIcon, EmailIcon, DescriptionIcon, ArticleIcon, InsertDriveFileIcon, LinkIcon, FavoriteIcon, CheckCircleIcon, WhatsAppIcon, CloudUploadIcon, PublicIcon, ErrorOutlineOutlinedIcon } from '@/components/Icons';
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
        description: 'Gather your study materials, notes, or resources in PDF, document, or image format.',
    },
    {
        number: 2,
        icon: <CloudUploadIcon sx={{ fontSize: 32 }} />,
        title: 'Send',
        description: 'Upload via the form, send on WhatsApp, or drop files in our shared Drive folder.',
    },
    {
        number: 3,
        icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
        title: 'Reviewed & Published',
        description: 'We review every submission and publish it on the website for everyone to use.'
    },
];

const SHARE_TYPES = [
    { icon: <DescriptionIcon />, title: 'Study materials and notes', description: 'Chapter-wise notes, practice questions, and study guides.' },
    { icon: <ArticleIcon />, title: 'Question papers and answer keys', description: 'Board exam papers, unit tests, and solved papers.' },
    { icon: <InsertDriveFileIcon />, title: 'Formats and templates', description: 'Official formats, timetables, and administrative templates.' },
    { icon: <LinkIcon />, title: 'Useful educational links', description: 'Links to helpful websites, videos, and online resources.' },
    { icon: <FavoriteIcon />, title: 'Monetary contributions', description: 'Support the platform to keep it free for everyone.' },
];

const ALLOWED = [
    'Question papers, worksheets, and lesson plans you have created',
    'School-made notes, assignments, and activity ideas',
    'Official circulars and government education resources',
    'PDF, Word, PowerPoint, Excel, and image files',
];

const NOT_ALLOWED = [
    'Copyrighted publisher books or guides (e.g. private guide books)',
    'Videos and very large files',
    'ZIP, EXE, or other executable files',
    'Content from other websites that you do not have rights to share',
];

export default function ContributePage({ onNavigate }: ContributePageProps) {
    const [isDark] = useTheme();
    const email = contributorsData.email;
    const mailtoLink = `mailto:${email}?subject=Resource Contribution to Sajhi Shiksha`;
    const whatsappLink = contributorsData.whatsappLink;
    const formLink = contributorsData.formUrl;
    const driveFolderLink = contributorsData.driveFolderUrl;
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    const cardButtonSx = {
        px: 3,
        py: 1,
        fontSize: '0.95rem',
        fontWeight: 700,
        bgcolor: 'var(--color-bg)',
        color: 'var(--color-text)',
        border: `2px solid ${borderColor}`,
        boxShadow: `3px 3px 0px ${shadowColor}`,
        '&:hover': {
            bgcolor: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            transform: 'none',
            boxShadow: `3px 3px 0px ${shadowColor}`,
        },
    } as const;

    const WAYS = [
        {
            icon: <CloudUploadIcon sx={{ fontSize: 40 }} />,
            title: 'Upload via Form',
            description: 'Fill a short form and upload up to 10 files at once — quick and simple.',
            action: 'Open Form',
            href: formLink,
        },
        {
            icon: <WhatsAppIcon sx={{ fontSize: 40 }} />,
            title: 'WhatsApp Us',
            description: 'The quickest way — click, attach your files, and send. Great for photos of question papers.',
            action: 'Message on WhatsApp',
            href: whatsappLink,
        },
        {
            icon: <PublicIcon sx={{ fontSize: 40 }} />,
            title: 'Shared Drive Folder',
            description: 'For teachers with many files — drop everything directly into our Google Drive folder.',
            action: 'Open Folder',
            href: driveFolderLink,
        },
    ];

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
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        size="large"
                        href={formLink}
                        target="_blank"
                        startIcon={<CloudUploadIcon />}
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
                        Upload Files
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        href={whatsappLink}
                        target="_blank"
                        startIcon={<WhatsAppIcon />}
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
                        WhatsApp
                    </Button>
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
            </Box>

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 4,
                }}
            >
                3 Easy Ways to Share
            </Typography>
            <Grid container spacing={4} sx={{ mb: 8 }}>
                {WAYS.map((way) => (
                    <Grid size={{ xs: 12, md: 4 }} key={way.title}>
                        <Box
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: 'var(--color-bg)',
                                border: `3px solid ${borderColor}`,
                                boxShadow: `4px 4px 0px ${shadowColor}`,
                                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                '&:hover': {
                                    transform: 'translate(-2px, -2px)',
                                    boxShadow: `6px 6px 0px ${shadowColor}`,
                                },
                            }}
                        >
                            <Box sx={{ color: 'var(--color-text)', mb: 2 }}>{way.icon}</Box>
                            <Typography
                                sx={{
                                    fontFamily: FONT_HEADING,
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    mb: 1,
                                }}
                            >
                                {way.title}
                            </Typography>
                            <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', mb: 3, flexGrow: 1 }}>
                                {way.description}
                            </Typography>
                            <Button
                                variant="contained"
                                href={way.href}
                                target="_blank"
                                sx={cardButtonSx}
                            >
                                {way.action}
                            </Button>
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
                Submission Guidelines
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
                <Grid container spacing={{ xs: 4, md: 6 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontWeight: 700,
                                mb: 2,
                                color: 'var(--color-text)',
                            }}
                        >
                            ✓ What we accept
                        </Typography>
                        {ALLOWED.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
                                <CheckCircleIcon sx={{ color: 'var(--color-text)', fontSize: 20, mt: 0.25, flexShrink: 0 }} />
                                <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                                    {item}
                                </Typography>
                            </Box>
                        ))}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontWeight: 700,
                                mb: 2,
                                color: 'var(--color-text)',
                            }}
                        >
                            ✗ What we cannot accept
                        </Typography>
                        {NOT_ALLOWED.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
                                <ErrorOutlineOutlinedIcon sx={{ color: 'var(--color-text)', fontSize: 20, mt: 0.25, flexShrink: 0 }} />
                                <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                                    {item}
                                </Typography>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
                <Typography
                    sx={{
                        mt: 3,
                        pt: 3,
                        borderTop: `2px dashed ${borderColor}`,
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                    }}
                >
                    Note: Every submission is reviewed by our team before it is published. This keeps the content safe, relevant, and useful for everyone.
                </Typography>
            </Box>

            <Box
                sx={{
                    p: 4,
                    mb: 8,
                    textAlign: 'center',
                    bgcolor: isDark ? 'var(--color-bg-secondary)' : 'var(--color-yellow)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '1.3rem', md: '1.6rem' },
                        mb: 1,
                    }}
                >
                    Can't Find Something?
                </Typography>
                <Typography
                    sx={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1rem',
                        mb: 3,
                        maxWidth: 600,
                        mx: 'auto',
                    }}
                >
                    Looking for a question paper, notes, or any resource that is not on the website yet? Just message us on WhatsApp — we will arrange it and publish it for everyone.
                </Typography>
                <Button
                    variant="contained"
                    href={whatsappLink}
                    target="_blank"
                    startIcon={<WhatsAppIcon />}
                    sx={cardButtonSx}
                >
                    Request on WhatsApp
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
                            <Link
                                href={whatsappLink}
                                target="_blank"
                                sx={{ fontWeight: 700, color: 'var(--color-text)', fontFamily: FONT_MONO }}
                            >
                                {contributorsData.whatsapp}
                            </Link>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
