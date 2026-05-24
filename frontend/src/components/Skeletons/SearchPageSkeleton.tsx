import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@/components/Skeleton/Skeleton';
import { MAX_CONTENT_WIDTH } from '@/lib/constants';

const SearchPageSkeleton: React.FC = () => {
    return (
        <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                <Skeleton variant="text" height={40} width="40%" sx={{ mb: 3 }} />

                {/* Search Input Skeleton */}
                <Skeleton variant="rectangular" height={56} width="100%" sx={{ mb: 3, borderRadius: 0 }} />

                {/* Filter Chips Skeleton */}
                <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} variant="rectangular" height={32} width={80} sx={{ borderRadius: 9999 }} />
                    ))}
                </Box>

                {/* Results Skeleton */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Box
                            key={i}
                            sx={{
                                p: 2,
                                border: '3px solid var(--color-border)',
                                boxShadow: '3px 3px 0px var(--color-shadow)',
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                            }}
                        >
                            <Skeleton variant="circular" width={40} height={40} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" height={24} width="60%" sx={{ mb: 0.5 }} />
                                <Skeleton variant="text" height={16} width="40%" />
                            </Box>
                            <Skeleton variant="rectangular" height={28} width={60} sx={{ borderRadius: 9999 }} />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default React.memo(SearchPageSkeleton);
