import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@/components/Skeleton/Skeleton';
import { MAX_CONTENT_WIDTH } from '@/lib/constants';

const HomePageSkeleton: React.FC = () => {
    return (
        <Box component="main" aria-label="Loading homepage">
            {/* Hero Section Skeleton */}
            <Box
                sx={{
                    py: { xs: 6, md: 10 },
                    px: { xs: 2, md: 4 },
                    bgcolor: 'var(--color-bg)',
                }}
            >
                <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                    <Skeleton variant="text" height={48} width="70%" sx={{ mb: 2 }} />
                    <Skeleton variant="text" height={32} width="50%" sx={{ mb: 4 }} />
                    <Skeleton variant="rectangular" height={56} width="100%" sx={{ mb: 3, borderRadius: 0, maxWidth: '480px' }} />
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} variant="rectangular" height={32} width={80} sx={{ borderRadius: 9999 }} />
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Category Grid Skeleton */}
            <Box sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 4 } }}>
                <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                    <Skeleton variant="text" height={36} width="40%" sx={{ mb: 4 }} />
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                            gap: 3,
                        }}
                    >
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: 3,
                                    border: '3px solid var(--color-border)',
                                    boxShadow: '4px 4px 0px var(--color-shadow)',
                                    textAlign: 'center',
                                }}
                            >
                                <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 2 }} />
                                <Skeleton variant="text" height={28} width="80%" sx={{ mx: 'auto', mb: 1 }} />
                                <Skeleton variant="text" height={20} width="90%" sx={{ mx: 'auto', mb: 1 }} />
                                <Skeleton variant="rectangular" height={24} width={100} sx={{ mx: 'auto', borderRadius: 9999 }} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Class Spotlight Skeleton */}
            <Box
                sx={{
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, md: 4 },
                    bgcolor: 'var(--color-bg-secondary)',
                    borderTop: '3px solid var(--color-border)',
                    borderBottom: '3px solid var(--color-border)',
                }}
            >
                <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', textAlign: 'center' }}>
                    <Skeleton variant="text" height={36} width="50%" sx={{ mx: 'auto', mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} variant="rectangular" height={40} width={80} sx={{ borderRadius: 9999 }} />
                        ))}
                    </Box>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(5, 1fr)' },
                            gap: 2,
                        }}
                    >
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: 2,
                                    border: '3px solid var(--color-border)',
                                    boxShadow: '3px 3px 0px var(--color-shadow)',
                                    textAlign: 'center',
                                }}
                            >
                                <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
                                <Skeleton variant="text" height={24} width="80%" sx={{ mx: 'auto', mb: 0.5 }} />
                                <Skeleton variant="text" height={16} width="60%" sx={{ mx: 'auto' }} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Quick Links Skeleton */}
            <Box
                sx={{
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, md: 4 },
                    bgcolor: 'var(--color-bg-secondary)',
                    borderTop: '3px solid var(--color-border)',
                    borderBottom: '3px solid var(--color-border)',
                }}
            >
                <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                    <Skeleton variant="text" height={36} width="40%" sx={{ mx: 'auto', mb: 4, textAlign: 'center' }} />
                    <Box
                        sx={{
                            border: '3px solid var(--color-border)',
                            boxShadow: '4px 4px 0px var(--color-shadow)',
                        }}
                    >
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    px: 2,
                                    py: 1.5,
                                    borderBottom: i < 5 ? '2px solid var(--color-border)' : 'none',
                                }}
                            >
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="text" height={24} width="70%" />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Contribute CTA Skeleton */}
            <Box sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 4 } }}>
                <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', textAlign: 'center' }}>
                    <Skeleton variant="text" height={36} width="60%" sx={{ mx: 'auto', mb: 2 }} />
                    <Skeleton variant="text" height={24} width="80%" sx={{ mx: 'auto', mb: 3 }} />
                    <Skeleton variant="rectangular" height={48} width={180} sx={{ mx: 'auto', borderRadius: 9999 }} />
                </Box>
            </Box>
        </Box>
    );
};

export default React.memo(HomePageSkeleton);
