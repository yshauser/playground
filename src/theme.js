// src/theme.js
import { createTheme } from '@mui/material/styles';

// Create a custom theme with primary and secondary colors
const theme = createTheme({
    direction: 'rtl', // Default to RTL for Hebrew
    palette: {
        primary: {
            main: '#059669', // Green shade
            light: '#34d399', //
            dark: '#047857', //
            contrastText: '#fff',
        },
        secondary: {
            main: '#f59e0b', // Orange shade
            light: '#fbbf24',
            dark: '#d97706',
            contrastText: '#fff',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: [
            'Assistant',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
            },
        },
    },
});

export default theme;