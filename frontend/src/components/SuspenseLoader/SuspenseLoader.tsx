import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface SuspenseLoaderProps {
    message?: string;
}

const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ message = 'Loading...' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                gap: 2,
            }}
        >
            <CircularProgress size={32} color="primary" />
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
};

export default SuspenseLoader;
