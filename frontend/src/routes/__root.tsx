import { createRootRoute, Outlet, type ErrorComponentProps } from '@tanstack/react-router';
import { Box, Button, Typography } from '@mui/material';
import React, { Suspense, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BottomTabBar from '@/components/BottomTabBar/BottomTabBar';
import PageTransition from '@/components/PageTransition/PageTransition';
import CookieConsent from '@/components/CookieConsent/CookieConsent';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAdSense } from '@/hooks/useAdSense';

export const Route = createRootRoute({
    component: RootComponent,
    errorComponent: RouteErrorComponent,
});

/**
 * Route-level error screen.
 * "Failed to fetch dynamically imported module" happens when a visitor's
 * cached (old) build tries to load JS chunks that a newer deployment has
 * replaced — fix is a single automatic hard reload (guarded so it can't loop).
 */
function RouteErrorComponent({ error }: ErrorComponentProps): React.ReactElement {
    const isChunkError: boolean =
        /failed to fetch dynamically imported module|importing a module script failed|error loading dynamically imported module/i.test(
            error?.message ?? ''
        );

    useEffect(() => {
        if (!isChunkError) return;
        const KEY = 'ss-chunk-reload-at';
        const last = Number(sessionStorage.getItem(KEY) || 0);
        if (Date.now() - last > 10000) {
            sessionStorage.setItem(KEY, String(Date.now()));
            window.location.reload();
        }
    }, [isChunkError]);

    return (
        <Box
            sx={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {isChunkError ? 'Website updated' : 'Something went wrong'}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 460 }}>
                {isChunkError
                    ? 'The website was recently updated. Loading the latest version...'
                    : (error?.message ?? 'An unexpected error occurred')}
            </Typography>
            <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{ fontWeight: 700 }}
            >
                Reload Page
            </Button>
        </Box>
    );
}

function RootComponent(): React.ReactElement {
    useAnalytics();
    useAdSense();

    const isDev = import.meta.env.DEV;
    const Devtools = isDev
        ? React.lazy(() => import('@tanstack/router-devtools').then(m => ({ default: m.TanStackRouterDevtools })))
        : null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Header />
            <Box
                id="main-content"
                sx={{
                    flex: 1,
                    pb: { xs: 8, md: 0 },
                }}
            >
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </Box>
            <Footer />
            <WhatsAppButton />
            <BottomTabBar />
            <CookieConsent />
            {isDev && Devtools && (
                <Suspense fallback={null}>
                    <Devtools />
                </Suspense>
            )}
        </Box>
    );
}
