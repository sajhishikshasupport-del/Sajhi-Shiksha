import React, { useState, useCallback, createContext, useContext } from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface SnackbarMessage {
    id: number;
    text: string;
    severity: AlertColor;
}

interface SnackbarContextType {
    showSnackbar: (text: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<SnackbarMessage[]>([]);
    const [open, setOpen] = useState<boolean>(false);

    const showSnackbar = useCallback((text: string, severity: AlertColor = 'success') => {
        setMessages((prev) => [...prev, { id: Date.now(), text, severity }]);
        setOpen(true);
    }, []);

    const handleClose = useCallback((): void => {
        setOpen(false);
        setTimeout(() => {
            setMessages((prev) => prev.slice(1));
        }, 300);
    }, []);

    const current = messages[0];

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <MuiSnackbar
                open={open && !!current}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{
                    pb: { xs: 10, md: 4 },
                    '& .MuiSnackbarContent-root': {
                        animation: 'snackbar-slide-in 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                    },
                }}
            >
                {current && (
                    <Alert
                        onClose={handleClose}
                        severity={current.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {current.text}
                    </Alert>
                )}
            </MuiSnackbar>
        </SnackbarContext.Provider>
    );
};
