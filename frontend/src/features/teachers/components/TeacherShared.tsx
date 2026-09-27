import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { ArrowBackIcon, SearchOffIcon, OpenInNewIcon, DownloadIcon, PictureAsPdfIcon, ArrowForwardIcon, ChevronRightIcon, DescriptionIcon, InsertDriveFileIcon, ErrorOutlineOutlinedIcon } from '@/components/Icons';
import IframeViewer from '@/components/IframeViewer/IframeViewer';
import ResourceCard from '@/components/ResourceCard/ResourceCard';
import { teacherCardToResource } from '@/lib/utils';
import { getUrlType } from '@/lib/urlUtils';
import { FONT_HEADING, FONT_MONO } from '@/lib/constants';
import { trackEvent } from '@/hooks/useAnalytics';

export const BORDER = 'var(--color-border)';
export const SHADOW = 'var(--color-shadow)';

export const backBtnSx = {
    display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
    color: 'var(--color-text-secondary)', fontFamily: FONT_MONO, fontSize: '0.85rem',
    fontWeight: 600, mb: 2, '&:hover': { color: 'var(--color-text)' },
};

export const breadcrumbLinkSx = {
    display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
    color: 'var(--color-text-secondary)', fontFamily: FONT_MONO, fontSize: '0.8rem',
    fontWeight: 600, '&:hover': { color: 'var(--color-text)' },
};

export const folderCardSx = {
    border: `3px solid ${BORDER}`,
    boxShadow: `4px 4px 0px ${SHADOW}`,
    p: 3,
    bgcolor: 'var(--color-bg)',
    cursor: 'pointer',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: `6px 6px 0px ${SHADOW}` },
};

export const yellowBtnSx = {
    bgcolor: 'var(--color-yellow)', color: '#1A1A1A',
    border: `3px solid ${BORDER}`, boxShadow: `3px 3px 0px ${SHADOW}`,
    fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.95rem',
    px: 3, py: 1.5,
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
    '&:hover': {
        bgcolor: 'var(--color-yellow)',
        transform: 'translate(-2px, -2px)',
        boxShadow: `5px 5px 0px ${SHADOW}`,
    },
    '&:active': {
        transform: 'translate(2px, 2px)',
        boxShadow: `1px 1px 0px ${SHADOW}`,
    },
};

export const outlineBtnSx = {
    border: `3px solid ${BORDER}`, color: 'var(--color-text)',
    boxShadow: `3px 3px 0px ${SHADOW}`,
    fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.95rem',
    px: 3, py: 1.5,
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
    '&:hover': {
        transform: 'translate(-2px, -2px)',
        boxShadow: `5px 5px 0px ${SHADOW}`,
    },
    '&:active': {
        transform: 'translate(2px, 2px)',
        boxShadow: `1px 1px 0px ${SHADOW}`,
    },
};

export const emptyBoxSx = {
    p: 4, textAlign: 'center',
    border: `3px solid ${BORDER}`,
    boxShadow: `4px 4px 0px ${SHADOW}`,
};

interface BackButtonProps {
    onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
    <Box
        component="span"
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
        sx={backBtnSx}
        role="link" tabIndex={0} aria-label="Go back"
    >
        <ArrowBackIcon fontSize="small" /> Back
    </Box>
);

interface EmptyStateProps {
    title: string;
    message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => (
    <Box sx={emptyBoxSx}>
        <SearchOffIcon sx={{ fontSize: 48, color: 'var(--color-text-secondary)', mb: 2 }} />
        <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 700, mb: 1 }}>{title}</Typography>
        <Typography sx={{ color: 'var(--color-text-secondary)', fontFamily: FONT_MONO, fontSize: '0.85rem' }}>{message}</Typography>
    </Box>
);

export interface DriveDocument {
    id: string;
    title: string;
    link: string;
    mimeType: string;
    modifiedDate?: string;
    className?: string;
}

export interface FolderContents {
    folders: { title: string; id: string }[];
    documents: DriveDocument[];
}

const formatDate = (iso?: string): string => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const docIcon = (mime: string): React.ReactElement => {
    if (mime === 'application/pdf') return <PictureAsPdfIcon sx={{ fontSize: 30, color: 'var(--color-text)' }} />;
    if (mime.startsWith('application/vnd.google-apps') || mime.includes('word') || mime.includes('document')) return <DescriptionIcon sx={{ fontSize: 30, color: 'var(--color-text)' }} />;
    return <InsertDriveFileIcon sx={{ fontSize: 30, color: 'var(--color-text)' }} />;
};

const CLASS_ORDER = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const classSlug = (name: string): string => name.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();

interface DocumentListProps {
    contents: FolderContents;
}

const DocCard: React.FC<{ doc: DriveDocument; showClass?: boolean }> = ({ doc, showClass }) => {
    const openDoc = () => {
        trackEvent('document_open', {
            document_title: doc.title,
            document_class: doc.className ?? null,
            source: 'teacher_document_list',
        });
        window.open(doc.link, '_blank', 'noopener,noreferrer');
    };

    return (
    <Box
        onClick={openDoc}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDoc(); } }}
        role="link"
        tabIndex={0}
        sx={{
            display: 'flex', alignItems: 'center', gap: 2, p: { xs: 1.5, md: 2 },
            bgcolor: 'var(--color-bg)', border: `3px solid ${BORDER}`,
            boxShadow: `4px 4px 0px ${SHADOW}`, cursor: 'pointer',
            '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: `6px 6px 0px ${SHADOW}` },
            '&:focus-visible': { outline: '3px solid var(--color-yellow)', outlineOffset: '2px' },
        }}
    >
        <Box sx={{ flexShrink: 0 }}>{docIcon(doc.mimeType)}</Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {showClass && doc.className && (
                <Chip
                    label={doc.className}
                    size="small"
                    sx={{
                        height: 20, mb: 0.5, fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.7rem',
                        bgcolor: 'var(--color-yellow)', color: '#1A1A1A', border: `2px solid ${BORDER}`,
                    }}
                />
            )}
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.3 }}>
                {doc.title}
            </Typography>
            {doc.modifiedDate && (
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', color: 'var(--color-text-secondary)', mt: 0.5 }}>
                    Updated: {formatDate(doc.modifiedDate)}
                </Typography>
            )}
        </Box>
        <OpenInNewIcon sx={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} aria-hidden="true" />
    </Box>
    );
};

export const DocumentList: React.FC<DocumentListProps> = ({ contents }) => {
    const sorted = [...contents.documents].sort(
        (a, b) => (b.modifiedDate || '').localeCompare(a.modifiedDate || '')
    );
    if (sorted.length === 0) {
        return <EmptyState title="No documents yet" message="Documents will appear here once added." />;
    }

    if (!sorted.some((d) => d.className)) {
        return (
            <Box sx={{ display: 'grid', gap: 2 }}>
                {sorted.map((doc) => (
                    <DocCard key={doc.id} doc={doc} showClass />
                ))}
            </Box>
        );
    }

    const groups = new Map<string, DriveDocument[]>();
    for (const doc of sorted) {
        const key = doc.className || 'Other';
        if (!groups.has(key)) groups.set(key, []);
        (groups.get(key) as DriveDocument[]).push(doc);
    }
    const orderedKeys = Array.from(groups.keys()).sort((a, b) => {
        const ia = CLASS_ORDER.indexOf(a);
        const ib = CLASS_ORDER.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }} role="navigation" aria-label="Jump to class">
                {orderedKeys.map((k) => (
                    <Chip
                        key={k}
                        component="a"
                        href={`#${classSlug(k)}`}
                        clickable
                        label={`${k} (${(groups.get(k) as DriveDocument[]).length})`}
                        sx={{
                            fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.8rem',
                            bgcolor: 'var(--color-bg)', color: 'var(--color-text)',
                            border: `2px solid ${BORDER}`, boxShadow: `2px 2px 0px ${SHADOW}`,
                            '&:hover': { bgcolor: 'var(--color-yellow)', color: '#1A1A1A' },
                        }}
                    />
                ))}
            </Box>
            {orderedKeys.map((k) => (
                <Box key={k} component="section" id={classSlug(k)} sx={{ mb: 4, scrollMarginTop: '16px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.45rem' } }}>
                            {k}
                        </Typography>
                        <Box
                            sx={{
                                px: 1.5, py: 0.3, bgcolor: 'var(--color-pink)', border: `2px solid ${BORDER}`,
                                fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.75rem',
                            }}
                        >
                            {(groups.get(k) as DriveDocument[]).length} papers
                        </Box>
                    </Box>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        {(groups.get(k) as DriveDocument[]).map((doc) => (
                            <DocCard key={doc.id} doc={doc} />
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

interface LeafViewProps {
    title: string;
    description: string;
    driveUrl: string;
    onBack: () => void;
    onOpenLink: (url?: string) => void;
    contents?: FolderContents;
}

export const LeafView: React.FC<LeafViewProps> = ({ title, description, driveUrl, onBack, onOpenLink, contents }) => (
    <>
        <BackButton onClick={onBack} />
        <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}>
            {title}
        </Typography>
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.9rem', color: 'var(--color-text-secondary)', mb: 4 }}>
            {description}
        </Typography>
        {contents && contents.documents && contents.documents.length > 0 ? (
            <DocumentList contents={contents} />
        ) : driveUrl ? (
            getUrlType(driveUrl) !== 'drive' ? (
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: `3px solid ${BORDER}`,
                        boxShadow: `4px 4px 0px ${SHADOW}`,
                        bgcolor: 'var(--color-bg)',
                    }}
                >
                    <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 700, mb: 2 }}>
                        External Resource
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', mb: 3 }}>
                        This resource is hosted externally. Click below to open it in a new tab.
                    </Typography>
                    <Button variant="contained" onClick={() => onOpenLink(driveUrl)} sx={yellowBtnSx}>
                        <OpenInNewIcon sx={{ mr: 1.5 }} /> Open in New Tab
                    </Button>
                </Box>
            ) : (
                <>
                    <IframeViewer driveUrl={driveUrl} title={title} height="75vh" minHeight="500px" />
                    <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                        <Button variant="contained" onClick={() => onOpenLink(driveUrl)} sx={yellowBtnSx}>
                            <OpenInNewIcon sx={{ mr: 1.5 }} /> View in New Tab
                        </Button>
                        <Button variant="outlined" onClick={() => onOpenLink(driveUrl)} sx={outlineBtnSx}>
                            <DownloadIcon sx={{ mr: 1.5 }} /> Download
                        </Button>
                    </Box>
                </>
            )
        ) : (
            <EmptyState title="Content Coming Soon" message="The document URL will be added soon." />
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
                component="a"
                href={`mailto:sajhishiksha@gmail.com?subject=${encodeURIComponent(`[Problem] ${title}`)}`}
                size="small"
                aria-label={`Report a problem with ${title}`}
                sx={{
                    fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)', bgcolor: 'var(--color-bg)',
                    border: `2px solid ${BORDER}`, py: 0.5, px: 1.5, minWidth: 0,
                    textTransform: 'none',
                    '&:hover': {
                        bgcolor: 'var(--color-yellow)', color: '#1A1A1A',
                        borderColor: BORDER,
                    },
                }}
            >
                <ErrorOutlineOutlinedIcon sx={{ mr: 0.75, fontSize: 16 }} />
                Report a problem
            </Button>
        </Box>
    </>
);

interface FolderCardProps {
    title: string;
    description: string;
    parentTitle: string;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({ title, description, parentTitle, onClick, onKeyDown }) => (
    <Box
        onClick={onClick}
        onKeyDown={onKeyDown}
        sx={folderCardSx}
        role="button" tabIndex={0}
    >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ p: 1.5, border: `2px solid ${BORDER}`, bgcolor: 'var(--color-yellow)', display: 'inline-flex', flexShrink: 0 }}>
                <PictureAsPdfIcon sx={{ fontSize: 32, color: 'var(--color-text)' }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: '1.05rem', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {title}
                </Typography>
                <Box sx={{ display: 'inline-flex', px: 1.5, py: 0.3, bgcolor: 'var(--color-pink)', border: `2px solid ${BORDER}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.75rem', mb: 1 }}>
                    {parentTitle}
                </Box>
                <Typography sx={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {description}
                </Typography>
            </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
            <Typography sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Browse <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </Typography>
        </Box>
    </Box>
);

interface ResourceCardWrapperProps {
    item: any;
    subject: string;
    onView: (id: string) => void;
    onDownload: (url: string) => void;
}

export const ResourceCardWrapper: React.FC<ResourceCardWrapperProps> = ({ item, subject, onView, onDownload }) => (
    <ResourceCard
        resource={teacherCardToResource(item, subject)}
        viewMode="grid"
        onView={onView}
        onDownload={onDownload}
    />
);

// ExternalLinkCard and cardColors have been removed as all leaf components are now rendered by the unified ResourceCard.

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    isCurrent?: boolean;
}

interface TeacherBreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const TeacherBreadcrumbs: React.FC<TeacherBreadcrumbsProps> = ({ items }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3, flexWrap: 'wrap' }}>
        {items.map((item, i) => (
            <React.Fragment key={i}>
                {i > 0 && (
                    <ChevronRightIcon sx={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }} aria-hidden="true" />
                )}
                {item.isCurrent ? (
                    <Typography component="span" sx={{ fontFamily: FONT_HEADING, fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }} aria-current="page">
                        {item.label}
                    </Typography>
                ) : (
                    <Box
                        component="span"
                        onClick={item.onClick}
                        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && item.onClick) { e.preventDefault(); item.onClick(); } }}
                        sx={breadcrumbLinkSx}
                        role="link" tabIndex={0}
                    >
                        {item.label}
                    </Box>
                )}
            </React.Fragment>
        ))}
    </Box>
);
