import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DescriptionIcon, PictureAsPdfIcon, LinkIcon, InsertDriveFileIcon, DownloadIcon, VisibilityIcon, PublicIcon, OpenInNewIcon } from '@/components/Icons';
import { useTheme } from '@/context/ThemeContext';
import type { Resource } from '@/types';
import { FONT_HEADING, FONT_MONO, COLOR_TEXT_LIGHT, BORDER_RADIUS_PILL } from '@/lib/constants';

interface ResourceCardProps {
    resource: Resource;
    viewMode?: 'grid' | 'list';
    onView: (id: string) => void;
    onDownload: (url: string) => void;
}

const typeIconMap: Record<string, React.ElementType> = {
    pdf: PictureAsPdfIcon,
    document: DescriptionIcon,
    link: LinkIcon,
    format: InsertDriveFileIcon,
};

const typeColorMap: Record<string, string> = {
    pdf: 'var(--color-red)',
    document: 'var(--color-blue)',
    link: 'var(--color-green)',
    format: 'var(--color-purple)',
};

const subjectColorMap: Record<string, string> = {
    Mathematics: 'var(--subject-math)',
    English: 'var(--subject-english)',
    Hindi: 'var(--subject-hindi)',
    Science: 'var(--subject-science)',
    'Social Science': 'var(--subject-social)',
    Sanskrit: 'var(--subject-general)',
    Physics: 'var(--subject-science)',
    Biology: 'var(--subject-science)',
    'CS/IP': 'var(--subject-math)',
    Accountancy: 'var(--subject-math)',
    EVS: 'var(--subject-science)',
    General: 'var(--subject-general)',
};

const ResourceCardTags: React.FC<{ resource: Resource }> = React.memo(({ resource }) => {
    const borderColor = 'var(--color-border)';
    const shadowColor = 'var(--color-shadow)';
    const subjectColor = resource.subject ? (subjectColorMap[resource.subject] ?? 'var(--color-text-secondary)') : 'var(--color-text-secondary)';

    return (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {resource.class && (
                <Box
                    sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: 'var(--color-yellow)',
                        border: `2px solid ${borderColor}`,
                        borderRadius: BORDER_RADIUS_PILL,
                        fontFamily: FONT_MONO,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: COLOR_TEXT_LIGHT,
                        boxShadow: `2px 2px 0px ${shadowColor}`,
                    }}
                >
                    Class {resource.class}
                </Box>
            )}
            {resource.subject && (
                <Box
                    sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: `${subjectColor}30`,
                        border: `2px solid ${borderColor}`,
                        borderRadius: BORDER_RADIUS_PILL,
                        fontFamily: FONT_MONO,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: subjectColor,
                        boxShadow: `2px 2px 0px ${shadowColor}`,
                    }}
                >
                    {resource.subject}
                </Box>
            )}
        </Box>
    );
});

ResourceCardTags.displayName = 'ResourceCardTags';

const ResourceCard: React.FC<ResourceCardProps> = React.memo(
    ({ resource, viewMode = 'grid', onView, onDownload }) => {
        const [_isDark] = useTheme();
        const borderColor = 'var(--color-border)';
        const shadowColor = 'var(--color-shadow)';

        const isYoutube = resource.urlType === 'youtube';
        const isWebsite = resource.urlType === 'website';


        const openExternalLink = () => {
            window.open(resource.driveUrl, '_blank', 'noopener,noreferrer');
        };

        const handleCardClick = () => {
            if (isYoutube || isWebsite) {
                openExternalLink();
            } else {
                onView(resource.id);
            }
        };

        // Determine Icon component and color
        let IconComponent = typeIconMap[resource.type] ?? DescriptionIcon;
        let iconColor = typeColorMap[resource.type] ?? 'var(--color-text-secondary)';
        let iconBg = `${iconColor}20`;

        if (isYoutube) {
            IconComponent = () => (
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                    <path d="M19.615 3.184c-1.604-.178-3.384-.32-6.615-.32-3.23 0-5.01.142-6.615.32-1.639.182-2.735.9-2.852 3.078C3.43 7.24 3.5 8.67 3.5 11.999c0 3.33-.07 4.76-.357 6.737-.117 2.18 1.013 2.896 2.852 3.078 1.604.178 3.384.32 6.615.32 3.23 0 5.01-.142 6.615-.32 1.639-.182 2.735-.9 2.852-3.078.286-1.977.357-3.407.357-6.737 0-3.33-.07-4.76-.357-6.737-.117-2.18-1.013-2.896-2.852-3.078zM9.5 16.5v-9l7 4.5-7 4.5z" fill="#FF0000"/>
                </svg>
            );
            iconColor = '#FF0000';
            iconBg = 'rgba(255, 0, 0, 0.1)';
        } else if (isWebsite) {
            IconComponent = PublicIcon;
            iconColor = '#4285F4';
            iconBg = 'rgba(66, 133, 244, 0.1)';
        }

        if (viewMode === 'list') {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1.5, sm: 2 },
                        p: { xs: 2.5, sm: 2 },
                        bgcolor: 'var(--color-bg)',
                        border: `2px solid ${borderColor}`,
                        boxShadow: `3px 3px 0px ${shadowColor}`,
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translate(-2px, -2px)',
                            boxShadow: `5px 5px 0px ${shadowColor}`,
                        },
                    }}
                    onClick={handleCardClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCardClick();
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                        <Box
                            sx={{
                                p: 1,
                                width: 44,
                                height: 44,
                                bgcolor: iconBg,
                                border: `2px solid ${borderColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            {isYoutube ? <IconComponent /> : <IconComponent sx={{ fontSize: 24, color: iconColor }} />}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                sx={{ fontWeight: 700, mb: 0.5, fontFamily: FONT_HEADING, fontSize: { xs: '1rem', sm: 'inherit' } }}
                                noWrap
                            >
                                {resource.title}
                            </Typography>
                            <Typography
                                sx={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}
                                noWrap
                            >
                                {resource.description}
                            </Typography>
                        </Box>
                    </Box>
                    <ResourceCardTags resource={resource} />
                    
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}>
                        {isYoutube ? (
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<OpenInNewIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openExternalLink();
                                }}
                                sx={{
                                    bgcolor: '#FF0000',
                                    color: '#fff',
                                    border: `2px solid ${borderColor}`,
                                    boxShadow: `2px 2px 0px ${shadowColor}`,
                                    flex: { xs: 1, sm: 'none' },
                                    justifyContent: 'center',
                                    '&:hover': {
                                        bgcolor: '#cc0000',
                                        color: '#fff',
                                        transform: 'translate(-1px, -1px)',
                                        boxShadow: `3px 3px 0px ${shadowColor}`,
                                    },
                                }}
                            >
                                Watch on YouTube
                            </Button>
                        ) : isWebsite ? (
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<OpenInNewIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openExternalLink();
                                }}
                                sx={{
                                    bgcolor: '#4285F4',
                                    color: '#fff',
                                    border: `2px solid ${borderColor}`,
                                    boxShadow: `2px 2px 0px ${shadowColor}`,
                                    flex: { xs: 1, sm: 'none' },
                                    justifyContent: 'center',
                                    '&:hover': {
                                        bgcolor: '#3367d6',
                                        color: '#fff',
                                        transform: 'translate(-1px, -1px)',
                                        boxShadow: `3px 3px 0px ${shadowColor}`,
                                    },
                                }}
                            >
                                Open Website
                            </Button>
                        ) : (
                            <>
                                <Button
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(resource.id);
                                    }}
                                    sx={{
                                        color: 'var(--color-text)',
                                        border: `2px solid ${borderColor}`,
                                        boxShadow: `2px 2px 0px ${shadowColor}`,
                                        flex: { xs: 1, sm: 'none' },
                                        justifyContent: 'center',
                                        '&:hover': {
                                            transform: 'translate(-1px, -1px)',
                                            boxShadow: `3px 3px 0px ${shadowColor}`,
                                        },
                                    }}
                                >
                                    View
                                </Button>
                                <Button
                                    size="small"
                                    startIcon={<DownloadIcon />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDownload(resource.driveUrl);
                                    }}
                                    sx={{
                                        color: 'var(--color-text)',
                                        border: `2px solid ${borderColor}`,
                                        boxShadow: `2px 2px 0px ${shadowColor}`,
                                        flex: { xs: 1, sm: 'none' },
                                        justifyContent: 'center',
                                        '&:hover': {
                                            transform: 'translate(-1px, -1px)',
                                            boxShadow: `3px 3px 0px ${shadowColor}`,
                                        },
                                    }}
                                >
                                    Download
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            );
        }

        return (
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'var(--color-bg)',
                    border: `3px solid ${borderColor}`,
                    boxShadow: `4px 4px 0px ${shadowColor}`,
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                        transform: 'translate(-2px, -2px) rotate(-0.5deg)',
                        boxShadow: `6px 6px 0px ${shadowColor}`,
                    },
                    cursor: 'pointer',
                }}
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick();
                    }
                }}
            >
                <Box sx={{ flex: 1, p: 3 }}>
                    <Box
                        sx={{
                            p: 1.5,
                            width: 56,
                            height: 56,
                            bgcolor: iconBg,
                            border: `2px solid ${borderColor}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        {isYoutube ? <IconComponent /> : <IconComponent sx={{ fontSize: 32, color: iconColor }} />}
                    </Box>
                    <Typography
                        sx={{ mb: 1, fontWeight: 800, fontFamily: FONT_HEADING, fontSize: '1.1rem' }}
                        noWrap
                    >
                        {resource.title}
                    </Typography>
                    <ResourceCardTags resource={resource} />
                    <Typography
                        sx={{
                            mt: 1.5,
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.9rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {resource.description}
                    </Typography>
                </Box>
                
                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                    {isYoutube ? (
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<OpenInNewIcon />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openExternalLink();
                            }}
                            sx={{
                                bgcolor: '#FF0000',
                                color: '#fff',
                                border: `2px solid ${borderColor}`,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                                '&:hover': {
                                    bgcolor: '#cc0000',
                                    color: '#fff',
                                    transform: 'translate(-1px, -1px)',
                                    boxShadow: `3px 3px 0px ${shadowColor}`,
                                },
                            }}
                        >
                            Watch on YouTube
                        </Button>
                    ) : isWebsite ? (
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<OpenInNewIcon />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openExternalLink();
                            }}
                            sx={{
                                bgcolor: '#4285F4',
                                color: '#fff',
                                border: `2px solid ${borderColor}`,
                                boxShadow: `2px 2px 0px ${shadowColor}`,
                                '&:hover': {
                                    bgcolor: '#3367d6',
                                    color: '#fff',
                                    transform: 'translate(-1px, -1px)',
                                    boxShadow: `3px 3px 0px ${shadowColor}`,
                                },
                            }}
                        >
                            Open Website
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<VisibilityIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView(resource.id);
                                }}
                                sx={{
                                    bgcolor: 'var(--color-yellow)',
                                    color: COLOR_TEXT_LIGHT,
                                    border: `2px solid ${borderColor}`,
                                    boxShadow: `2px 2px 0px ${shadowColor}`,
                                    '&:hover': {
                                        bgcolor: 'var(--color-bg-secondary)',
                                        color: COLOR_TEXT_LIGHT,
                                        transform: 'translate(-1px, -1px)',
                                        boxShadow: `3px 3px 0px ${shadowColor}`,
                                    },
                                }}
                            >
                                View
                            </Button>
                            <Button
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload(resource.driveUrl);
                                }}
                                sx={{
                                    bgcolor: 'var(--color-bg)',
                                    color: 'var(--color-text)',
                                    border: `2px solid ${borderColor}`,
                                    boxShadow: `2px 2px 0px ${shadowColor}`,
                                    '&:hover': {
                                        bgcolor: 'var(--color-bg-secondary)',
                                        color: 'var(--color-text)',
                                        transform: 'translate(-1px, -1px)',
                                        boxShadow: `3px 3px 0px ${shadowColor}`,
                                    },
                                }}
                            >
                                Download
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        );
    }
);

ResourceCard.displayName = 'ResourceCard';

export default ResourceCard;
