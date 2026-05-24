import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@/components/Skeleton/Skeleton';
import { MAX_CONTENT_WIDTH } from '@/lib/constants';

const ViewPageSkeleton: React.FC = () => {
    return (
        <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto' }}>
                {/* Breadcrumb Skeleton */}
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Skeleton variant="text" height={20} width={60} />
                    <Skeleton variant="text" height={20} width={80} />
                    <Skeleton variant="text" height={20} width={100} />
                </Box>

                {/* Title Skeleton */}
                <Skeleton variant="text" height={40} width="70%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={24} width="50%" sx={{ mb: 3 }} />

                {/* Action Buttons Skeleton */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <Skeleton variant="rectangular" height={40} width={140} sx={{ borderRadius: 0 }} />
                    <Skeleton variant="rectangular" height={40} width={120} sx={{ borderRadius: 0 }} />
                    <Skeleton variant="rectangular" height={40} width={100} sx={{ borderRadius: 0 }} />
                </Box>

                {/* Document Viewer Skeleton */}
                <Box
                    sx={{
                        border: '3px solid var(--color-border)',
                        boxShadow: '6px 6px 0px var(--color-shadow)',
                        minHeight: '500px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{ p: 4, textAlign: 'center', width: '80%' }}>
                        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2 }} />
                        <Skeleton variant="text" height={24} width="60%" sx={{ mx: 'auto' }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default React.memo(ViewPageSkeleton);
