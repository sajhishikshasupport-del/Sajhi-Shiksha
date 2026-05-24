import { Box, Typography, Button } from '@mui/material';
import { ArrowBackIcon, DownloadIcon, ShareIcon, OpenInNewIcon } from '@/components/Icons';
import { useTheme } from '@/context/ThemeContext';
import { useSnackbar } from '@/components/Snackbar/Snackbar';
import IframeViewer from '@/components/IframeViewer/IframeViewer';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import type { Resource } from '@/types';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH, COLOR_TEXT_LIGHT, BORDER_RADIUS_PILL } from '@/lib/constants';

interface ResourceViewPageProps {
    resource: Resource | null;
    onBack: () => void;
    onNavigate: (route: string) => void;
}

export default function ResourceViewPage({ resource, onBack, onNavigate }: ResourceViewPageProps) {
    const [_isDark] = useTheme();
    const { showSnackbar } = useSnackbar();
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    if (!resource) {
        return (
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 8, textAlign: 'center' }}>
                <Box
                    sx={{
                        p: 6,
                        bgcolor: 'var(--color-bg)',
                        border: `3px solid ${borderColor}`,
                        boxShadow: `4px 4px 0px ${shadowColor}`,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 800,
                            fontSize: '1.75rem',
                            mb: 2,
                        }}
                    >
                        Resource not found
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        sx={{
                            bgcolor: 'var(--color-yellow)',
                            color: COLOR_TEXT_LIGHT,
                            border: `3px solid ${borderColor}`,
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                        }}
                    >
                        Go Back
                    </Button>
                </Box>
            </Box>
        );
    }

    const handleDownload = () => {
        window.open(resource.driveUrl, '_blank');
    };

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: resource.title,
            text: resource.description,
            url,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                showSnackbar('Shared successfully!', 'success');
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    await navigator.clipboard.writeText(url);
                    showSnackbar('Link copied to clipboard!', 'info');
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                showSnackbar('Link copied to clipboard!', 'success');
            } catch {
                showSnackbar('Failed to copy link', 'error');
            }
        }
    };

    const handleOpenInTab = () => {
        window.open(resource.driveUrl, '_blank');
    };

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Breadcrumb
                items={[
                    { label: 'Resources', route: '/' },
                    { label: resource.title },
                ]}
                onNavigate={onNavigate}
            />

            <Box sx={{ mb: 4 }}>
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        mb: 1,
                    }}
                >
                    {resource.title}
                </Typography>
                <Typography sx={{ color: 'var(--color-text-secondary)', mb: 2, fontSize: '1rem' }}>
                    {resource.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                    {resource.class && (
                        <Box
                            sx={{
                                px: 2,
                                py: 0.5,
                                bgcolor: 'var(--color-yellow)',
                                border: `2px solid ${borderColor}`,
                                borderRadius: BORDER_RADIUS_PILL,
                                fontFamily: FONT_MONO,
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                color: COLOR_TEXT_LIGHT,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                            }}
                        >
                            Class {resource.class}
                        </Box>
                    )}
                    {resource.subject && (
                        <Box
                            sx={{
                                px: 2,
                                py: 0.5,
                                bgcolor: 'var(--color-bg)',
                                border: `2px solid ${borderColor}`,
                                borderRadius: BORDER_RADIUS_PILL,
                                fontFamily: FONT_MONO,
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                            }}
                        >
                            {resource.subject}
                        </Box>
                    )}
                    <Box
                        sx={{
                            px: 2,
                            py: 0.5,
                            bgcolor: 'var(--color-pink)',
                            border: `2px solid ${borderColor}`,
                            borderRadius: BORDER_RADIUS_PILL,
                            fontFamily: FONT_MONO,
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            boxShadow: `2px 2px 0px ${shadowColor}`,
                        }}
                    >
                        {resource.type ? resource.type.toUpperCase() : 'RESOURCE'}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {resource.driveUrl && (
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            sx={{
                                bgcolor: 'var(--color-yellow)',
                                color: COLOR_TEXT_LIGHT,
                                border: `3px solid ${borderColor}`,
                                boxShadow: `3px 3px 0px ${shadowColor}`,
                                '&:hover': {
                                    bgcolor: 'var(--color-bg-secondary)',
                                    color: COLOR_TEXT_LIGHT,
                                    transform: 'translate(-2px, -2px)',
                                    boxShadow: `5px 5px 0px ${shadowColor}`,
                                },
                            }}
                        >
                            Download
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<ShareIcon />}
                        onClick={handleShare}
                        sx={{
                            border: `3px solid ${borderColor}`,
                            color: 'var(--color-text)',
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                            '&:hover': {
                                bgcolor: 'var(--color-bg-secondary)',
                                transform: 'translate(-2px, -2px)',
                                boxShadow: `5px 5px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        Share
                    </Button>
                    {resource.driveUrl && (
                        <Button
                            startIcon={<OpenInNewIcon />}
                            onClick={handleOpenInTab}
                            sx={{
                                bgcolor: 'transparent',
                                color: 'var(--color-text)',
                                border: 'none',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: 'transparent' },
                            }}
                        >
                            Open in New Tab
                        </Button>
                    )}
                </Box>
            </Box>

            {resource.driveUrl ? (
                <IframeViewer
                    driveUrl={resource.driveUrl}
                    title={resource.title}
                />
            ) : (
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: `3px solid ${borderColor}`,
                        boxShadow: `4px 4px 0px ${shadowColor}`,
                    }}
                >
                    <Box
                        component="span"
                        sx={{ fontSize: 48, display: 'block', mb: 2 }}
                    >
                        📄
                    </Box>
                    <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 700, mb: 1 }}>
                        Content Coming Soon
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontFamily: FONT_MONO, fontSize: '0.85rem' }}>
                        The document URL will be added soon.
                    </Typography>
                </Box>
            )}

            <Box
                sx={{
                    my: 4,
                    borderTop: `2px solid ${borderColor}`,
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography
                        sx={{
                            fontFamily: FONT_MONO,
                            fontSize: '0.8rem',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Contributors: {resource.contributors?.join(', ') || 'Sajhi Shiksha Team'}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: FONT_MONO,
                            fontSize: '0.8rem',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Last Updated: {resource.lastUpdated ? new Date(resource.lastUpdated).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                        }) : 'Recently'}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{
                        border: `3px solid ${borderColor}`,
                        color: 'var(--color-text)',
                        boxShadow: `3px 3px 0px ${shadowColor}`,
                    }}
                >
                    Back to Resources
                </Button>
            </Box>
        </Box>
    );
}
