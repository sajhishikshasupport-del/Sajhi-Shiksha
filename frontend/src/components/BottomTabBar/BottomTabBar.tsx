import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box, IconButton } from '@mui/material';
import { HomeIcon, SchoolIcon, MenuBookIcon, FavoriteIcon, MenuIcon, WhatsAppIcon } from '@/components/Icons';
import { useLocation, useNavigate } from '@tanstack/react-router';
import siteContent from '@/data/site.json';
import { FONT_MONO, COLOR_TEXT_LIGHT } from '@/lib/constants';

interface TabConfig {
    label: string;
    route: string;
    icon: React.ReactElement;
}

const tabs: TabConfig[] = [
    { label: 'Home', route: '/', icon: <HomeIcon /> },
    { label: 'Students', route: '/for-students', icon: <SchoolIcon /> },
    { label: 'Teachers', route: '/for-teachers', icon: <MenuBookIcon /> },
    { label: 'Math', route: '/for-math-lovers', icon: <FavoriteIcon /> },
    { label: 'Menu', route: '/search', icon: <MenuIcon /> },
];

const BottomTabBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const borderColor = 'var(--color-border)';

    const activeIndex = tabs.findIndex((tab) => {
        if (tab.route === '/') return location.pathname === '/';
        return location.pathname.startsWith(tab.route);
    });

    const whatsappUrl = siteContent.site.whatsappGroupUrl;

    return (
        <Box
            component="nav"
            sx={{
                display: { xs: 'flex', md: 'none' },
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1100,
                bgcolor: 'var(--color-bg)',
                borderTop: `3px solid ${borderColor}`,
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
            aria-label="Mobile navigation"
        >
            {whatsappUrl && (
                <IconButton
                    component="a"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Join WhatsApp group"
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: '#25D366',
                        border: `2px solid ${borderColor}`,
                        boxShadow: `2px 2px 0px var(--color-shadow)`,
                        color: '#FFFFFF',
                        alignSelf: 'center',
                        ml: 1,
                        '&:hover': {
                            bgcolor: '#25D366',
                            transform: 'translateY(-1px)',
                        },
                    }}
                >
                    <WhatsAppIcon sx={{ fontSize: 20 }} />
                </IconButton>
            )}
            <BottomNavigation
                value={activeIndex >= 0 ? activeIndex : false}
                onChange={(_event: React.SyntheticEvent, newValue: number): void => {
                    const tab = tabs[newValue];
                    if (tab) navigate({ to: tab.route });
                }}
                sx={{
                    width: '100%',
                    maxWidth: '100%',
                    '& .MuiBottomNavigationAction-root': {
                        minHeight: '48px',
                        minWidth: 0,
                        padding: '6px 4px 8px',
                        color: 'var(--color-text)',
                        '&.Mui-selected': {
                            color: COLOR_TEXT_LIGHT,
                            bgcolor: 'var(--color-yellow)',
                            border: `2px solid ${borderColor}`,
                            borderRadius: 0,
                            boxShadow: `2px 2px 0px var(--color-shadow)`,
                        },
                        '&:active': {
                            color: 'var(--color-text)',
                        },
                        '& .MuiBottomNavigationAction-label': {
                            fontSize: '0.675rem',
                            lineHeight: 1.2,
                            fontFamily: FONT_MONO,
                        },
                        '& .MuiSvgIcon-root': {
                            fontSize: '1.3rem',
                            color: 'inherit',
                        },
                    },
                }}
            >
                {tabs.map((tab, index) => (
                    <BottomNavigationAction
                        key={tab.route}
                        label={tab.label}
                        icon={tab.icon}
                        aria-label={tab.label}
                        aria-current={index === activeIndex ? 'page' : undefined}
                    />
                ))}
            </BottomNavigation>
        </Box>
    );
};

export default React.memo(BottomTabBar);
