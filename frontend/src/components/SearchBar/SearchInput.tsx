import { useRef, useEffect, useCallback } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { SearchIcon, ClearIcon } from '@/components/Icons';
import { useDebounceCallback } from '@/hooks/useDebounce';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    debounceMs?: number;
}

export default function SearchInput({
    value,
    onChange,
    onSearch,
    placeholder = 'Search for study materials, question papers...',
    autoFocus = false,
    size = 'medium',
    fullWidth = true,
    debounceMs = 300,
}: SearchInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const debouncedSearch = useDebounceCallback((v: string) => onSearch(v), debounceMs);

    const handleChange = useCallback((newValue: string) => {
        onChange(newValue);
        debouncedSearch(newValue);
    }, [onChange, debouncedSearch]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch(value);
        }
    }, [onSearch, value]);

    const handleClear = useCallback(() => {
        onChange('');
        onSearch('');
    }, [onChange, onSearch]);

    return (
        <TextField
            inputRef={inputRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search resources"
            size={size}
            fullWidth={fullWidth}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" aria-hidden="true" />
                        </InputAdornment>
                    ),
                    endAdornment: value && (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                aria-label="Clear search"
                                onClick={handleClear}
                            >
                                <ClearIcon fontSize="small" aria-hidden="true" />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                },
            }}
        />
    );
}
