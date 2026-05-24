import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Button, IconButton, Typography, Drawer, List, ListItem } from '@mui/material';
import { MenuIcon, LightModeIcon, DarkModeIcon } from '@/components/Icons';
import { useNavigate } from '@tanstack/react-router';
import { useTheme } from '@/context/ThemeContext';
import siteContent from '@/data/site.json';
import navigationData from '@/data/navigation.json';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH, COLOR_TEXT_LIGHT, BORDER_RADIUS_PILL } from '@/lib/constants';
const logoSrc = '/image.png';

const Header: React.FC = () => {
    const [isDark, toggleTheme] = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavClick = useCallback((route: string) => {
        navigate({ to: route });
        setMobileOpen(false);
    }, [navigate]);

    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mobileOpen || !drawerRef.current) return;

        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        firstElement?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileOpen]);

    const navItems = navigationData.headerLinks.slice(0, 5);
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    const drawerContent = (
        <Box
            ref={drawerRef}
            sx={{
                width: 280,
                height: '100%',
                bgcolor: 'var(--color-bg)',
                borderRight: `3px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
            }}
            role="presentation"
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: `3px solid ${borderColor}`,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        color: 'var(--color-text)',
                    }}
                >
                    {siteContent.site.name}
                </Typography>
            </Box>
            <List sx={{ flex: 1, p: 2 }}>
                {navigationData.headerLinks.map((item) => (
                    <ListItem
                        key={item.label}
                        onClick={() => handleNavClick(item.route)}
                        sx={{
                            cursor: 'pointer',
                            borderRadius: 0,
                            mb: 1,
                            '&:hover': {
                                bgcolor: 'var(--color-yellow)',
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontWeight: 700,
                                color: 'var(--color-text)',
                            }}
                        >
                            {item.label}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <Box
                component="header"
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                    bgcolor: 'var(--color-bg)',
                    borderBottom: `3px solid ${borderColor}`,
                    py: 1.5,
                    px: { xs: 2, md: 4 },
                }}
            >
                <Box
                    sx={{
                        maxWidth: MAX_CONTENT_WIDTH,
                        mx: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                        }}
                        onClick={() => handleNavClick('/')}
                    >
                        <Box
                            component="img"
                            src={logoSrc}
                            alt="Sajhi Shiksha"
                            sx={{ height: 40, width: 40, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <Typography
                            sx={{
                                fontFamily: FONT_HEADING,
                                fontWeight: 800,
                                fontSize: { xs: '1.25rem', md: '1.5rem' },
                                lineHeight: 1,
                                color: 'var(--color-text)',
                            }}
                        >
                            {siteContent.site.name}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 2,
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                onClick={() => handleNavClick(item.route)}
                                sx={{
                                    color: 'var(--color-text)',
                                    fontFamily: FONT_HEADING,
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    border: 'none',
                                    boxShadow: 'none',
                                    borderRadius: 0,
                                    px: 2,
                                    py: 1,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '50%',
                                        width: 0,
                                        height: '3px',
                                        bgcolor: borderColor,
                                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        transform: 'translateX(-50%)',
                                    },
                                    '&:hover::after': {
                                        width: '100%',
                                    },
                                    '&:hover': {
                                        bgcolor: 'transparent',
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    onClick={toggleTheme}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    sx={{
                        border: `2px solid ${borderColor}`,
                        borderRadius: BORDER_RADIUS_PILL,
                        boxShadow: `2px 2px 0px ${shadowColor}`,
                                bgcolor: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        transition: 'transform 100ms ease, box-shadow 100ms ease',
                        '&:active': {
                            transform: 'translate(2px, 2px)',
                            boxShadow: `1px 1px 0px ${shadowColor}`,
                        },
                    }}
                >
                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>

                        <Button
                            onClick={() => setMobileOpen(true)}
                            startIcon={<MenuIcon />}
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                border: `2px solid ${borderColor}`,
                                borderRadius: 0,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                                bgcolor: 'var(--color-yellow)',
                                color: COLOR_TEXT_LIGHT,
                                fontFamily: FONT_MONO,
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                px: 2,
                                '& .MuiButton-startIcon': {
                                    color: COLOR_TEXT_LIGHT,
                                },
                                '&:active': {
                                    transform: 'translate(2px, 2px)',
                                    boxShadow: `1px 1px 0px ${shadowColor}`,
                                },
                            }}
                        >
                            MENU
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{
                    keepMounted: true,
                    role: 'dialog',
                    'aria-modal': true,
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Header;
