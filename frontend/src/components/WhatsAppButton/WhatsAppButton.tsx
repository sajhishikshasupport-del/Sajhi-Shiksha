import React, { useEffect, useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import { WhatsAppIcon } from '@/components/Icons';
import contributorsData from '@/data/contributors.json';
import { trackEvent } from '@/hooks/useAnalytics';

const WhatsAppButton: React.FC = () => {
    const [showPulse, setShowPulse] = useState(false);
    const url = contributorsData.whatsappLink;

    useEffect(() => {
        if (!url) return;
        const interval = setInterval(() => {
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 1000);
        }, 5000);
        return () => clearInterval(interval);
    }, [url]);

    if (!url) return null;

    return (
        <Tooltip title="Chat with us — share or request content" placement="left">
            <Box
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                onClick={() => trackEvent('whatsapp_click', { location: 'website-float' })}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: '#25D366',
                    border: '3px solid #1A1A1A',
                    boxShadow: '4px 4px 0px #1A1A1A',
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '6px 6px 0px #1A1A1A',
                    },
                    '&:active': {
                        transform: 'translateY(1px)',
                        boxShadow: '2px 2px 0px #1A1A1A',
                    },
                    ...(showPulse ? {
                        animation: 'whatsapp-pulse 1s ease-in-out',
                    } : {}),
                }}
            >
                <WhatsAppIcon sx={{ fontSize: 28 }} />
            </Box>
        </Tooltip>
    );
};

export default React.memo(WhatsAppButton);
