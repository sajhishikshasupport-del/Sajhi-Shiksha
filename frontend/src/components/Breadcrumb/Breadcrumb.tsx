import React from 'react';
import { Box, Typography } from '@mui/material';
import { NavigateNextIcon, HomeIcon } from '@/components/Icons';
import { FONT_HEADING, FONT_MONO } from '@/lib/constants';

interface BreadcrumbItem {
    label: string;
    route?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    onNavigate?: (route: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = React.memo(({ items, onNavigate }) => {
    return (
        <Box
            component="nav"
            aria-label="Breadcrumb"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 3,
                flexWrap: 'wrap',
            }}
        >
            <Box
                component="span"
                onClick={() => onNavigate?.('/')}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onNavigate?.('/');
                    }
                }}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                    '&:hover': { color: 'var(--color-text)' },
                }}
                role="link"
                tabIndex={0}
                aria-label="Go to homepage"
            >
                <HomeIcon fontSize="small" />
                <Typography
                    component="span"
                    sx={{
                        fontFamily: FONT_MONO,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                    }}
                >
                    Home
                </Typography>
            </Box>

            {items.map((item, index) => (
                <React.Fragment key={item.label}>
                    <NavigateNextIcon
                        fontSize="small"
                        sx={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}
                        aria-hidden="true"
                    />
                    {item.route && index < items.length - 1 ? (
                        <Box
                            component="span"
                            onClick={() => onNavigate?.(item.route!)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onNavigate?.(item.route!);
                                }
                            }}
                            sx={{
                                cursor: 'pointer',
                                color: 'var(--color-text-secondary)',
                                '&:hover': { color: 'var(--color-text)' },
                            }}
                            role="link"
                            tabIndex={0}
                            aria-label={`Navigate to ${item.label}`}
                        >
                            <Typography
                                component="span"
                                sx={{
                                    fontFamily: FONT_MONO,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography
                            component="span"
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: index === items.length - 1 ? 'var(--color-text)' : 'var(--color-text-secondary)',
                            }}
                            aria-current={index === items.length - 1 ? 'page' : undefined}
                        >
                            {item.label}
                        </Typography>
                    )}
                </React.Fragment>
            ))}
        </Box>
    );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
