import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

interface ThemeContextValue {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): boolean {
    try {
        const stored = localStorage.getItem('theme');
        if (stored !== null) return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
        return false;
    }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch {
            // localStorage not available
        }
    }, [isDark]);

    const toggleTheme = useCallback(() => {
        setIsDark((prev) => !prev);
    }, []);

    const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme(): [boolean, () => void] {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return [context.isDark, context.toggleTheme];
}
