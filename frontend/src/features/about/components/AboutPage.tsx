import { Box, Typography } from '@mui/material';
import { CheckCircleIcon, EmailIcon, WhatsAppIcon, LinkIcon } from '@/components/Icons';
import { useTheme } from '@/context/ThemeContext';
import contactData from '@/data/contact.json';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';

interface AboutPageProps {
    onNavigate: (route: string) => void;
}

const CONTACT_EMAIL = 'sajhishiksha@gmail.com';

const MISSION_POINTS = [
    'Free access for all students',
    'Teacher-contributed resources',
    'No login, no barriers',
    'Always growing, always free',
];

export default function AboutPage({ onNavigate }: AboutPageProps) {
    const [isDark] = useTheme();
    const email = contactData.email || CONTACT_EMAIL;
    const mailtoLink = `mailto:${email}?subject=Question about Sajhi Shiksha`;
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Breadcrumb
                items={[{ label: 'About' }]}
                onNavigate={onNavigate}
            />

            <Box
                sx={{
                    p: { xs: 4, md: 8 },
                    textAlign: 'center',
                    bgcolor: isDark ? 'var(--color-bg-secondary)' : 'var(--color-blue)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `6px 6px 0px ${shadowColor}`,
                    mb: 6,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        mb: 2,
                    }}
                >
                    About Sajhi Shiksha
                </Typography>
                <Typography
                    sx={{
                        fontSize: '1.1rem',
                        color: 'var(--color-text-secondary)',
                        mb: 4,
                        maxWidth: 700,
                        mx: 'auto',
                        lineHeight: 1.7,
                    }}
                >
                    Sajhi Shiksha is a free, open educational platform built for KVS students and teachers. Our mission is to make quality study materials accessible to everyone — no login, no paywalls, no barriers.
                </Typography>
                <Typography
                    sx={{
                        fontStyle: 'italic',
                        color: 'var(--color-text)',
                        fontWeight: 700,
                        fontFamily: FONT_HEADING,
                        fontSize: '1.25rem',
                    }}
                >
                    &ldquo;Sharing Knowledge — From You, For You&rdquo;
                </Typography>
            </Box>

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 4,
                }}
            >
                Our Mission
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
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    {MISSION_POINTS.map((point) => (
                        <Box key={point} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <CheckCircleIcon sx={{ color: 'var(--color-green)' }} />
                            <Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>{point}</Typography>
                        </Box>
                    ))}
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
                Get In Touch
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3,
                }}
            >
                {/* Arattai */}
                {contactData.arattai && (
                    <Box
                        onClick={() => window.open(contactData.arattai, '_blank', 'noopener,noreferrer')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                window.open(contactData.arattai, '_blank', 'noopener,noreferrer');
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        sx={{
                            p: 3,
                            bgcolor: 'var(--color-yellow)',
                            border: `3px solid ${borderColor}`,
                            boxShadow: `4px 4px 0px ${shadowColor}`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 2,
                            cursor: 'pointer',
                            transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            '&:hover': {
                                transform: 'translate(-2px, -2px)',
                                boxShadow: `6px 6px 0px ${shadowColor}`,
                            },
                            '&:active': {
                                transform: 'translate(1px, 1px)',
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Box sx={{ p: 0.8, bgcolor: 'var(--color-bg)', border: `2px solid ${borderColor}`, display: 'inline-flex' }}>
                                    <LinkIcon sx={{ color: 'var(--color-text)' }} />
                                </Box>
                                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.05rem' }}>
                                    Arattai - Message us
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(26,26,26,0.75)', mb: 1 }}>
                                Reach out directly via Arattai.
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 1.2,
                                px: 2,
                                bgcolor: 'var(--color-bg)',
                                color: 'var(--color-text)',
                                border: `2px solid ${borderColor}`,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                fontFamily: FONT_MONO,
                            }}
                        >
                            Message us @kapil_pundir
                        </Box>
                    </Box>
                )}

                {/* WhatsApp Group */}
                {contactData.whatsappGroup && (
                    <Box
                        onClick={() => window.open(contactData.whatsappGroup, '_blank', 'noopener,noreferrer')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                window.open(contactData.whatsappGroup, '_blank', 'noopener,noreferrer');
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        sx={{
                            p: 3,
                            bgcolor: 'var(--color-green)',
                            border: `3px solid ${borderColor}`,
                            boxShadow: `4px 4px 0px ${shadowColor}`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 2,
                            cursor: 'pointer',
                            transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            '&:hover': {
                                transform: 'translate(-2px, -2px)',
                                boxShadow: `6px 6px 0px ${shadowColor}`,
                            },
                            '&:active': {
                                transform: 'translate(1px, 1px)',
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Box sx={{ p: 0.8, bgcolor: 'var(--color-bg)', border: `2px solid ${borderColor}`, display: 'inline-flex' }}>
                                    <WhatsAppIcon sx={{ color: 'var(--color-text)' }} />
                                </Box>
                                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.05rem' }}>
                                    WhatsApp Group
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(26,26,26,0.75)', mb: 1 }}>
                                Request study materials and share useful content with peers.
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 1.2,
                                px: 2,
                                bgcolor: 'var(--color-bg)',
                                color: 'var(--color-text)',
                                border: `2px solid ${borderColor}`,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                fontFamily: FONT_MONO,
                            }}
                        >
                            Join WhatsApp Group
                        </Box>
                    </Box>
                )}

                {/* WhatsApp Channel */}
                {contactData.whatsappChannel && (
                    <Box
                        onClick={() => window.open(contactData.whatsappChannel, '_blank', 'noopener,noreferrer')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                window.open(contactData.whatsappChannel, '_blank', 'noopener,noreferrer');
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        sx={{
                            p: 3,
                            bgcolor: 'var(--color-blue)',
                            border: `3px solid ${borderColor}`,
                            boxShadow: `4px 4px 0px ${shadowColor}`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 2,
                            cursor: 'pointer',
                            transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            '&:hover': {
                                transform: 'translate(-2px, -2px)',
                                boxShadow: `6px 6px 0px ${shadowColor}`,
                            },
                            '&:active': {
                                transform: 'translate(1px, 1px)',
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Box sx={{ p: 0.8, bgcolor: 'var(--color-bg)', border: `2px solid ${borderColor}`, display: 'inline-flex' }}>
                                    <WhatsAppIcon sx={{ color: 'var(--color-text)' }} />
                                </Box>
                                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.05rem' }}>
                                    WhatsApp Channel
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(26,26,26,0.75)', mb: 1 }}>
                                Receive regular official updates and announcements directly.
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 1.2,
                                px: 2,
                                bgcolor: 'var(--color-bg)',
                                color: 'var(--color-text)',
                                border: `2px solid ${borderColor}`,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                fontFamily: FONT_MONO,
                            }}
                        >
                            Follow Channel
                        </Box>
                    </Box>
                )}

                {/* Email */}
                <Box
                    onClick={() => { window.location.href = mailtoLink; }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.location.href = mailtoLink;
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    sx={{
                        p: 3,
                        bgcolor: 'var(--color-pink)',
                        border: `3px solid ${borderColor}`,
                        boxShadow: `4px 4px 0px ${shadowColor}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 2,
                        cursor: 'pointer',
                        transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        '&:hover': {
                            transform: 'translate(-2px, -2px)',
                            boxShadow: `6px 6px 0px ${shadowColor}`,
                        },
                        '&:active': {
                            transform: 'translate(1px, 1px)',
                            boxShadow: `2px 2px 0px ${shadowColor}`,
                        },
                    }}
                >
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Box sx={{ p: 0.8, bgcolor: 'var(--color-bg)', border: `2px solid ${borderColor}`, display: 'inline-flex' }}>
                                <EmailIcon sx={{ color: 'var(--color-text)' }} />
                            </Box>
                            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.05rem' }}>
                                Email Support
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(26,26,26,0.75)', mb: 1 }}>
                            Write to us directly for general queries or resource sharing.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 1.2,
                            px: 2,
                            bgcolor: 'var(--color-bg)',
                            color: 'var(--color-text)',
                            border: `2px solid ${borderColor}`,
                            boxShadow: `2px 2px 0px ${shadowColor}`,
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            fontFamily: FONT_MONO,
                        }}
                    >
                        sajhishiksha@gmail.com
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
