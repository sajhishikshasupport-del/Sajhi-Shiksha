import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorIcon, RefreshIcon, OpenInNewIcon } from '@/components/Icons';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useTheme } from '@/context/ThemeContext';
import { getDriveEmbedUrl } from '@/lib/utils';
import { FONT_HEADING, COLOR_TEXT_LIGHT } from '@/lib/constants';

export interface IframeViewerProps {
    driveUrl: string;
    title: string;
    height?: string;
    minHeight?: string;
    maxWidth?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export default function IframeViewer({
    driveUrl,
    title,
    height = '70vh',
    minHeight = '500px',
    maxWidth = '900px',
    onLoad,
    onError,
}: IframeViewerProps) {
    const [_isDark] = useTheme();
    const cacheKey = `iframe-loaded-${driveUrl}`;
    const [loading, setLoading] = useState(() => {
        try {
            return sessionStorage.getItem(cacheKey) !== 'true';
        } catch {
            return true;
        }
    });
    const [error, setError] = useState(false);
    const embedUrl = getDriveEmbedUrl(driveUrl);
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    const handleLoad = useCallback(() => {
        setLoading(false);
        try {
            sessionStorage.setItem(cacheKey, 'true');
        } catch {
            // storage unavailable
        }
        onLoad?.();
    }, [onLoad, cacheKey]);

    const handleError = useCallback(() => {
        setLoading(false);
        setError(true);
        onError?.();
    }, [onError]);

    const handleRetry = () => {
        setLoading(true);
        setError(false);
        try {
            sessionStorage.removeItem(cacheKey);
        } catch {
            // storage unavailable
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                setLoading(false);
            }
        }, 8000);
        return () => clearTimeout(timer);
    }, [loading]);

    if (error) {
        return (
            <Box
                sx={{
                    p: 4,
                    textAlign: 'center',
                    maxWidth,
                    mx: 'auto',
                    minHeight,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    bgcolor: 'var(--color-bg)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                }}
            >
                <ErrorIcon sx={{ fontSize: 48, color: 'var(--color-red)' }} />
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 700,
                        fontSize: '1.25rem',
                    }}
                >
                    Unable to load document
                </Typography>
                <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                    The document could not be displayed in the viewer.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => window.open(driveUrl, '_blank')}
                        sx={{
                            bgcolor: 'var(--color-yellow)',
                            color: COLOR_TEXT_LIGHT,
                            border: `3px solid ${borderColor}`,
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                        }}
                    >
                        Open in New Tab
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRetry}
                        sx={{
                            border: `3px solid ${borderColor}`,
                            color: 'var(--color-text)',
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                        }}
                    >
                        Try Again
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                maxWidth,
                mx: 'auto',
                bgcolor: 'var(--color-bg)',
                border: `3px solid ${borderColor}`,
                boxShadow: `6px 6px 0px ${shadowColor}`,
            }}
        >
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'var(--color-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        zIndex: 1,
                    }}
                >
                    <Skeleton
                        variant="rectangular"
                        width="80%"
                        height="60%"
                    />
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                        Loading document...
                    </Typography>
                </Box>
            )}
            <iframe
                src={embedUrl}
                title={title}
                style={{
                    width: '100%',
                    height,
                    minHeight,
                    border: 'none',
                    display: 'block',
                    backgroundColor: '#FFFFFF',
                }}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
            />
        </Box>
    );
}
