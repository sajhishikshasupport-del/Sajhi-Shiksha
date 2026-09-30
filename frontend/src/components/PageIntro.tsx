import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import pageIntros from '@/data/page-intros.json';

interface PageIntroProps {
    /** Key into page-intros.json: a page key or a teachers.json subCard id. Unknown keys render nothing. */
    page: string;
    /** Space below the intro block. Default 4. */
    mb?: number;
}

/**
 * Compact, original intro text for a page.
 * Shows `short` (2-3 lines) always; full text behind a "Read more" toggle
 * so it never blocks the path to actual content.
 * Full text stays in the DOM (visually hidden) for search engines.
 */
function PageIntro({ page, mb = 4 }: PageIntroProps): React.ReactElement {
    const [expanded, setExpanded] = useState(false);
    const intro = (pageIntros as unknown as Record<string, { short: string; full: string } | undefined>)[page];

    if (!intro) return <Box sx={{ mb }} />;

    return (
        <Box
            component="section"
            aria-label="About this section"
            sx={{
                mb,
                p: { xs: 2, md: 3 },
                bgcolor: 'var(--color-bg-secondary)',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
            }}
        >
            <Typography
                sx={{
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    mb: 0.5,
                }}
            >
                {intro.short}
                {/* Full text kept in DOM so search engines index it */}
                <Box component="span" sx={{ display: 'none' }}>{intro.full}</Box>
            </Typography>
            <Button
                size="small"
                onClick={() => setExpanded((v) => !v)}
                endIcon={
                    <ExpandMoreIcon
                        sx={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                    />
                }
                sx={{
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    p: 0,
                    minWidth: 0,
                    color: 'var(--color-text)',
                }}
            >
                {expanded ? 'Show less' : 'Read more'}
            </Button>
            {expanded && (
                <Typography
                    sx={{
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        color: 'var(--color-text-secondary)',
                        mt: 1,
                    }}
                >
                    {intro.full}
                </Typography>
            )}
        </Box>
    );
}

export default PageIntro;
