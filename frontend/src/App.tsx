import React from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { RouterProvider } from '@tanstack/react-router';
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
            <CssBaseline />
            <ErrorBoundary>
                <SnackbarProvider>
                    <RouterProvider router={router} />
                </SnackbarProvider>
            </ErrorBoundary>
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
