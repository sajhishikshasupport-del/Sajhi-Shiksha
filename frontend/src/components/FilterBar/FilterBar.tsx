import { useState, useMemo, useCallback, memo } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    IconButton,
    Drawer,
    Typography,
    useMediaQuery,
    useTheme as useMuiTheme,
} from '@mui/material';
import { FilterListIcon, CloseIcon, ClearAllIcon } from '@/components/Icons';
import { FONT_HEADING, FONT_MONO, BORDER_RADIUS_PILL, COLOR_TEXT_LIGHT } from '@/lib/constants';

export interface FilterState {
    class: string;
    subject: string;
    type: string;
    search: string;
}

interface FilterBarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
    classes?: string[];
    subjects?: string[];
    types?: string[];
}

const CLASS_OPTIONS = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SUBJECT_OPTIONS = ['all', 'Mathematics', 'English', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Physics', 'Biology', 'CS/IP', 'Accountancy', 'General'];
const TYPE_OPTIONS = ['all', 'pdf', 'document', 'link', 'format'];

interface FilterChipsProps {
    chips: { label: string; key: keyof FilterState }[];
    onRemove: (key: keyof FilterState) => void;
    onClearAll: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = memo(({ chips, onRemove, onClearAll }) => {
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    if (chips.length === 0) return null;

    return (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {chips.map((chip) => (
                <Box
                    key={chip.key}
                    onClick={() => onRemove(chip.key)}
                    sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: 'var(--color-pink)',
                        border: `2px solid ${borderColor}`,
                        borderRadius: BORDER_RADIUS_PILL,
                        fontFamily: FONT_MONO,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        boxShadow: `2px 2px 0px ${shadowColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': {
                            transform: 'translate(-1px, -1px)',
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                        },
                        '&::after': {
                            content: '"\u2715"',
                            fontSize: '0.6rem',
                        },
                    }}
                >
                    {chip.label}
                </Box>
            ))}
            <Box
                onClick={onClearAll}
                sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: 'var(--color-bg)',
                    border: `2px solid var(--color-red)`,
                    borderRadius: BORDER_RADIUS_PILL,
                    fontFamily: FONT_MONO,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    color: 'var(--color-red)',
                }}
            >
                Clear All
            </Box>
        </Box>
    );
});

interface FilterControlsProps {
    filters: FilterState;
    updateFilter: (key: keyof FilterState, value: string) => void;
    handleClearAll: () => void;
    hasActiveFilters: boolean;
    classOptions: string[];
    subjectOptions: string[];
    typeOptions: string[];
}

const FilterControls: React.FC<FilterControlsProps> = memo(({
    filters,
    updateFilter,
    handleClearAll,
    hasActiveFilters,
    classOptions,
    subjectOptions,
    typeOptions,
}) => {
    const borderColor = 'var(--color-border)';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                }}
            >
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: 'var(--color-text-secondary)' }}>Class</InputLabel>
                    <Select
                        value={filters.class}
                        label="Class"
                        onChange={(e) => updateFilter('class', e.target.value)}
                        sx={{
                            bgcolor: 'var(--color-bg)',
                            color: 'var(--color-text)',
                            '& .MuiSelect-select': { color: 'var(--color-text)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-yellow)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: 'var(--color-yellow)' },
                        }}
                    >
                        {classOptions.map((cls) => (
                            <MenuItem key={cls} value={cls} sx={{ color: 'var(--color-text)' }}>
                                {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel sx={{ color: 'var(--color-text-secondary)' }}>Subject</InputLabel>
                    <Select
                        value={filters.subject}
                        label="Subject"
                        onChange={(e) => updateFilter('subject', e.target.value)}
                        sx={{
                            bgcolor: 'var(--color-bg)',
                            color: 'var(--color-text)',
                            '& .MuiSelect-select': { color: 'var(--color-text)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-yellow)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: 'var(--color-yellow)' },
                        }}
                    >
                        {subjectOptions.map((sub) => (
                            <MenuItem key={sub} value={sub} sx={{ color: 'var(--color-text)' }}>
                                {sub === 'all' ? 'All Subjects' : sub}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: 'var(--color-text-secondary)' }}>Type</InputLabel>
                    <Select
                        value={filters.type}
                        label="Type"
                        onChange={(e) => updateFilter('type', e.target.value)}
                        sx={{
                            bgcolor: 'var(--color-bg)',
                            color: 'var(--color-text)',
                            '& .MuiSelect-select': { color: 'var(--color-text)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-yellow)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: 'var(--color-yellow)' },
                        }}
                    >
                        {typeOptions.map((type) => (
                            <MenuItem key={type} value={type} sx={{ color: 'var(--color-text)' }}>
                                {type === 'all' ? 'All Types' : type.toUpperCase()}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    size="small"
                    placeholder="Search within results..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    sx={{
                        minWidth: 200,
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'var(--color-bg)',
                            '& input': { color: 'var(--color-text)' },
                            '& fieldset': { borderColor },
                            '&:hover fieldset': { borderColor: 'var(--color-yellow)' },
                            '&.Mui-focused fieldset': { borderWidth: 2, borderColor: 'var(--color-yellow)' },
                        },
                    }}
                />

                {hasActiveFilters && (
                    <Button
                        size="small"
                        startIcon={<ClearAllIcon />}
                        onClick={handleClearAll}
                        sx={{
                            color: 'var(--color-red)',
                            border: `2px solid var(--color-red)`,
                            '&:hover': { bgcolor: 'var(--color-red)', color: 'var(--color-bg)' },
                        }}
                    >
                        Clear All
                    </Button>
                )}
            </Box>
        </Box>
    );
});

export default function FilterBar({
    filters,
    onFilterChange,
    classes: classOptions = CLASS_OPTIONS,
    subjects: subjectOptions = SUBJECT_OPTIONS,
    types: typeOptions = TYPE_OPTIONS,
}: FilterBarProps) {
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';

    const hasActiveFilters =
        filters.class !== 'all' ||
        filters.subject !== 'all' ||
        filters.type !== 'all' ||
        filters.search !== '';

    const handleClearAll = useCallback(() => {
        onFilterChange({ class: 'all', subject: 'all', type: 'all', search: '' });
    }, [onFilterChange]);

    const updateFilter = useCallback((key: keyof FilterState, value: string) => {
        onFilterChange((prev: FilterState) => ({ ...prev, [key]: value }));
    }, [onFilterChange]);

    const activeFilterChips = useMemo(() => [
        filters.class !== 'all' && { label: `Class ${filters.class}`, key: 'class' as const },
        filters.subject !== 'all' && { label: filters.subject, key: 'subject' as const },
        filters.type !== 'all' && { label: filters.type.toUpperCase(), key: 'type' as const },
    ].filter(Boolean) as { label: string; key: keyof FilterState }[], [filters]);

    const handleRemoveFilter = useCallback((key: keyof FilterState) => {
        onFilterChange((prev: FilterState) => ({ ...prev, [key]: 'all' }));
    }, [onFilterChange]);

    if (isMobile) {
        return (
            <>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={() => setDrawerOpen(true)}
                        fullWidth
                        sx={{
                            border: `3px solid ${borderColor}`,
                            boxShadow: `3px 3px 0px ${shadowColor}`,
                            bgcolor: 'var(--color-bg)',
                            color: 'var(--color-text)',
                            '&:hover': {
                                bgcolor: 'var(--color-bg-secondary)',
                                transform: 'translate(-1px, -1px)',
                                boxShadow: `4px 4px 0px ${shadowColor}`,
                            },
                        }}
                    >
                        Filters {hasActiveFilters && `(${activeFilterChips.length})`}
                    </Button>
                </Box>

                <FilterChips chips={activeFilterChips} onRemove={handleRemoveFilter} onClearAll={handleClearAll} />

                <Drawer
                    anchor="bottom"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <Box sx={{ bgcolor: 'var(--color-bg)', borderTop: `3px solid ${borderColor}`, p: 3, maxWidth: 500, mx: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.25rem' }}>Filters</Typography>
                        <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close filters" sx={{ border: `2px solid ${borderColor}`, borderRadius: 0 }}>
                            <CloseIcon aria-hidden="true" />
                        </IconButton>
                    </Box>
                    <FilterControls
                        filters={filters}
                        updateFilter={updateFilter}
                        handleClearAll={handleClearAll}
                        hasActiveFilters={hasActiveFilters}
                        classOptions={classOptions}
                        subjectOptions={subjectOptions}
                        typeOptions={typeOptions}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setDrawerOpen(false)}
                            sx={{
                                bgcolor: 'var(--color-yellow)',
                                color: COLOR_TEXT_LIGHT,
                                border: `3px solid ${borderColor}`,
                                boxShadow: `3px 3px 0px ${shadowColor}`,
                            }}
                        >
                            Apply Filters
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleClearAll}
                            sx={{
                                border: `3px solid ${borderColor}`,
                                color: 'var(--color-text)',
                            }}
                        >
                            Clear All
                        </Button>
                    </Box>
                    </Box>
                </Drawer>
            </>
        );
    }

    return (
        <>
            <FilterControls
                filters={filters}
                updateFilter={updateFilter}
                handleClearAll={handleClearAll}
                hasActiveFilters={hasActiveFilters}
                classOptions={classOptions}
                subjectOptions={subjectOptions}
                typeOptions={typeOptions}
            />
            <Box sx={{ mt: 2 }}>
                <FilterChips chips={activeFilterChips} onRemove={handleRemoveFilter} onClearAll={handleClearAll} />
            </Box>
        </>
    );
}
