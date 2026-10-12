import React from 'react';
import { Box, Typography } from '@mui/material';
import { FONT_HEADING, FONT_MONO } from '@/lib/constants';
import { careerStrings } from '@/features/career/careerStrings';
import type { CareerLang } from '@/features/career/useCareerLang';

const BORDER = 'var(--color-border)';
const SHADOW = 'var(--color-shadow)';

/**
 * English / हिंदी switch shown at the top of every Career Counselling page and
 * on the section index (REQ-1012-16). Styled to match the site's neo-brutalist
 * look: 3px solid border with a hard offset shadow. The active option is
 * highlighted; clicking the other one switches language.
 */
export default function CareerLanguageToggle({
    lang,
    onChange,
}: {
    lang: CareerLang;
    onChange: (lang: CareerLang) => void;
}): React.ReactElement {
    const strings = careerStrings(lang);
    const options: Array<{ value: CareerLang; label: string }> = [
        { value: 'en', label: 'English' },
        { value: 'hi', label: 'हिंदी' },
    ];

    return (
        <Box
            role="group"
            aria-label={strings.languageLabel}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                p: 0.75,
                bgcolor: 'var(--color-bg)',
                border: `3px solid ${BORDER}`,
                boxShadow: `4px 4px 0px ${SHADOW}`,
            }}
        >
            <Typography
                component="span"
                sx={{
                    fontFamily: FONT_MONO,
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--color-text-secondary)',
                    pl: 0.5,
                }}
            >
                {strings.languageLabel}
            </Typography>
            {options.map((opt) => {
                const active = opt.value === lang;
                return (
                    <Box
                        key={opt.value}
                        component="button"
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(opt.value)}
                        sx={{
                            cursor: 'pointer',
                            fontFamily: FONT_HEADING,
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            lineHeight: 1,
                            px: 1.5,
                            py: 0.75,
                            color: '#1A1A1A',
                            bgcolor: active ? 'var(--color-yellow)' : 'var(--color-bg)',
                            border: `2px solid ${BORDER}`,
                            boxShadow: active ? `2px 2px 0px ${SHADOW}` : 'none',
                            transition: 'background-color 0.15s ease',
                            '&:hover': { bgcolor: active ? 'var(--color-yellow)' : 'var(--color-bg)' },
                        }}
                    >
                        {opt.label}
                    </Box>
                );
            })}
        </Box>
    );
}
