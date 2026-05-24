import { createTheme } from '@mui/material/styles';

const lightPalette = {
    mode: 'light' as const,
    primary: { main: '#FFD600', light: '#FFE066', dark: '#E6C200' },
    secondary: { main: '#FF6B9D', light: '#FF8FAB', dark: '#E05588' },
    accent: { main: '#4ECDC4', light: '#7EDDD6', dark: '#3BB5AD' },
    background: { default: '#FFFDF7', paper: '#FFF8E7' },
    text: { primary: '#1A1A1A', secondary: '#4A4A4A' },
    success: { main: '#95E45C' },
    warning: { main: '#FF8C42' },
    error: { main: '#FF6B6B' },
    divider: '#1A1A1A',
};

const darkPalette = {
    mode: 'dark' as const,
    primary: { main: '#FFE066', light: '#FFEB99', dark: '#FFD600' },
    secondary: { main: '#FF8FAB', light: '#FFB0C8', dark: '#FF6B9D' },
    accent: { main: '#7EDDD6', light: '#A5EAE5', dark: '#4ECDC4' },
    background: { default: '#1A1A2E', paper: '#222240' },
    text: { primary: '#FFFFFF', secondary: '#B0B0C0' },
    success: { main: '#B0F090' },
    warning: { main: '#FFB07A' },
    error: { main: '#FF9999' },
    divider: '#FFFFFF',
};

const brutalistBorder = '3px solid';
const hardShadow = (color: string) => `4px 4px 0px ${color}`;

const createAppTheme = (mode: 'light' | 'dark') => {
    const palette = mode === 'light' ? lightPalette : darkPalette;
    const borderColor = mode === 'light' ? '#1A1A1A' : '#FFFFFF';
    const shadowColor = mode === 'light' ? '#1A1A1A' : '#000000';

    return createTheme({
        palette,
        typography: {
            fontFamily: "'Inter', system-ui, sans-serif",
            h1: { fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 800, fontSize: '2.5rem', lineHeight: 1.1 },
            h2: { fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 800, fontSize: '2rem', lineHeight: 1.1 },
            h3: { fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.1 },
            h4: { fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: '1.25rem' },
            h5: { fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: '1.125rem' },
            h6: { fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700 },
            body1: { fontSize: '1.125rem' },
            button: { fontWeight: 700, textTransform: 'none' as const, fontFamily: "'Space Grotesk', system-ui, sans-serif" },
        },
        shape: { borderRadius: 0 },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                        padding: '10px 24px',
                        border: brutalistBorder,
                        borderColor,
                        boxShadow: hardShadow(shadowColor),
                        fontWeight: 700,
                        transition: 'transform 100ms ease, box-shadow 100ms ease',
                        '&:active': {
                            transform: 'translate(2px, 2px)',
                            boxShadow: `1px 1px 0px ${shadowColor}`,
                        },
                    },
                    contained: {
                        '&:hover': {
                            transform: 'translate(-2px, -2px)',
                            boxShadow: `6px 6px 0px ${shadowColor}`,
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                        border: brutalistBorder,
                        borderColor,
                        boxShadow: hardShadow(shadowColor),
                        transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                        '&:hover': {
                            transform: 'translate(-2px, -2px) rotate(-0.5deg)',
                            boxShadow: `6px 6px 0px ${shadowColor}`,
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 9999,
                        fontWeight: 600,
                        fontFamily: "'Space Mono', monospace",
                        border: `2px solid ${borderColor}`,
                        boxShadow: `2px 2px 0px ${shadowColor}`,
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        borderBottom: `3px solid ${borderColor}`,
                        boxShadow: 'none',
                        backgroundColor: mode === 'light' ? '#FFFDF7' : '#1A1A2E',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            border: brutalistBorder,
                            borderColor,
                            '& fieldset': { display: 'none' },
                            '&:hover': {
                                borderColor: '#FFD600',
                            },
                            '&.Mui-focused': {
                                borderColor: '#FFD600',
                                borderWidth: '4px',
                            },
                        },
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        border: 'none',
                        borderRadius: 0,
                    },
                },
            },
        },
    });
};

export default createAppTheme;

declare module '@mui/material/styles' {
    interface Palette {
        accent: Palette['primary'];
    }
    interface PaletteOptions {
        accent?: PaletteOptions['primary'];
    }
}
