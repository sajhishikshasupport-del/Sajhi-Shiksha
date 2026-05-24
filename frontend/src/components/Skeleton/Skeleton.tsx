import React from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

interface SkeletonProps extends Omit<BoxProps, 'children'> {
    variant?: 'rectangular' | 'circular' | 'text';
    width?: string | number;
    height?: string | number;
    lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'rectangular',
    width = '100%',
    height = 20,
    lines = 1,
    sx,
    ...rest
}) => {
    if (variant === 'text') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    width,
                    ...sx,
                }}
                {...rest}
            >
                {Array.from({ length: lines }).map((_, i) => (
                    <Box
                        key={i}
                        className="skeleton-shimmer"
                        sx={{
                            height: typeof height === 'number' ? `${height}px` : height,
                            width: i === lines - 1 ? '75%' : '100%',
                        }}
                    />
                ))}
            </Box>
        );
    }

    return (
        <Box
            className="skeleton-shimmer"
            sx={{
                width,
                height: typeof height === 'number' ? `${height}px` : height,
                borderRadius: variant === 'circular' ? '50%' : 'var(--radius-md)',
                ...sx,
            }}
            {...rest}
        />
    );
};

export default React.memo(Skeleton);
