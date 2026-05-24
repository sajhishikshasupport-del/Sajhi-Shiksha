import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FONT_HEADING, FONT_MONO, COLOR_TEXT_LIGHT } from '@/lib/constants';

const CONSENT_KEY = 'cookie-consent';

interface CookieConsentProps {
    onAccept?: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
    const [visible, setVisible] = useState(false);
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    useEffect(() => {
        try {
            const stored = localStorage.getItem(CONSENT_KEY);
            if (!stored) {
                setVisible(true);
            }
        } catch {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem(CONSENT_KEY, 'accepted');
        } catch {
            // Storage unavailable
        }
        setVisible(false);
        onAccept?.();
    };

    const handleDecline = () => {
        try {
            localStorage.setItem(CONSENT_KEY, 'declined');
        } catch {
            // Storage unavailable
        }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <Box
            role="dialog"
            aria-label="Cookie consent"
            aria-describedby="cookie-consent-desc"
            sx={{
                position: 'fixed',
                bottom: { xs: 80, md: 24 },
                left: { xs: 2, md: 24 },
                right: { xs: 2, md: 'auto' },
                maxWidth: { xs: '100%', md: 480 },
                p: { xs: 3, md: 4 },
                bgcolor: 'var(--color-bg)',
                border: `3px solid ${borderColor}`,
                boxShadow: `6px 6px 0px ${shadowColor}`,
                zIndex: 9999,
            }}
        >
            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    mb: 1,
                }}
            >
                We use cookies and local caching
            </Typography>
            <Typography
                id="cookie-consent-desc"
                sx={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    mb: 3,
                    lineHeight: 1.5,
                }}
            >
                This site uses Google Analytics to understand visitor usage and browser runtime caching to make pages and resources load faster on subsequent visits. No personal data is collected.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    onClick={handleAccept}
                    sx={{
                        bgcolor: 'var(--color-yellow)',
                        color: COLOR_TEXT_LIGHT,
                        border: `2px solid ${borderColor}`,
                        boxShadow: `2px 2px 0px ${shadowColor}`,
                        fontFamily: FONT_HEADING,
                        fontWeight: 700,
                        '&:hover': {
                            bgcolor: 'var(--color-bg-secondary)',
                            color: COLOR_TEXT_LIGHT,
                            transform: 'translate(-1px, -1px)',
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                        },
                    }}
                >
                    Accept
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleDecline}
                    sx={{
                        border: `2px solid ${borderColor}`,
                        color: 'var(--color-text)',
                        fontFamily: FONT_MONO,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                    }}
                >
                    Decline
                </Button>
            </Box>
        </Box>
    );
};

export default CookieConsent;
