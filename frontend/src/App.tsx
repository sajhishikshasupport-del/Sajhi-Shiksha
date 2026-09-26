import React from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { RouterProvider } from '@tanstack/react-router';
import { MotionConfig } from 'framer-motion';
import createAppTheme from '@/config/theme';
import { useTheme, ThemeProvider } from '@/context/ThemeContext';
import { createRouter } from './router';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { SnackbarProvider } from '@/components/Snackbar/Snackbar';

const router = createRouter();

const AppContent: React.FC = () => {
    const [isDark] = useTheme();
    const theme = createAppTheme(isDark ? 'dark' : 'light');

    return (
        <MuiThemeProvider theme={theme}>
            {/* Respect the OS-level "reduce motion" setting for all
                framer-motion animations (scroll reveals, card entrances,
                hovers). CSS animations are already handled by the
                prefers-reduced-motion media queries in index.css. */}
            <MotionConfig reducedMotion="user">
                <CssBaseline />
                <ErrorBoundary>
                    <SnackbarProvider>
                        <RouterProvider router={router} />
                    </SnackbarProvider>
                </ErrorBoundary>
            </MotionConfig>
        </MuiThemeProvider>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
