import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@/components/Skeleton/Skeleton';
import { MAX_CONTENT_WIDTH } from '@/lib/constants';

const ResourcePageSkeleton: React.FC = () => {
    return (
        <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                <Skeleton variant="text" height={40} width="50%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={24} width="70%" sx={{ mb: 3 }} />

                {/* Filter/Sort Bar Skeleton */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <Skeleton variant="rectangular" height={40} width={120} sx={{ borderRadius: 9999 }} />
                    <Skeleton variant="rectangular" height={40} width={100} sx={{ borderRadius: 9999 }} />
                    <Skeleton variant="rectangular" height={40} width={80} sx={{ borderRadius: 9999 }} />
                </Box>

                {/* Resource Cards Grid Skeleton */}
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
                                p: 2,
                                border: '3px solid var(--color-border)',
                                boxShadow: '4px 4px 0px var(--color-shadow)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                <Skeleton variant="circular" width={36} height={36} />
                                <Skeleton variant="text" height={24} width="70%" />
                            </Box>
                            <Skeleton variant="text" height={20} width="90%" sx={{ mb: 0.5 }} />
                            <Skeleton variant="text" height={16} width="60%" sx={{ mb: 1.5 }} />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Skeleton variant="rectangular" height={28} width={80} sx={{ borderRadius: 9999 }} />
                                <Skeleton variant="rectangular" height={28} width={60} sx={{ borderRadius: 9999 }} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default React.memo(ResourcePageSkeleton);
