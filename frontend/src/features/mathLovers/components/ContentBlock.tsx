import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { FONT_HEADING } from '@/lib/constants';
import type { LinkItem } from '@/types';
import { getUrlType } from '@/lib/urlUtils';
import ResourceCard from '@/components/ResourceCard/ResourceCard';
import mathLoversContents from '@/data/math-lovers-contents.json';
import teacherContents from '@/data/teacher-contents.json';
import { DocumentList } from '@/features/teachers/components/TeacherShared';
import type { FolderContents } from '@/features/teachers/components/TeacherShared';

const DRIVE_FOLDER_RE = /embeddedfolderview\?id=([A-Za-z0-9_-]+)/;

// The English project-ideas Drive folder holds the same files as the Maths Lab
// project-ideas leaf, so its document list is reused from teacher-contents.json.
const FALLBACK_LEAF_KEYS: Record<string, string> = {
    '1hB7zZC-lkU6WhOHGEo8JjnE-kg6urg4y': 'project-ideas',
};

interface DriveFolderList {
    linkTitle: string;
    contents: FolderContents;
}

interface ContentBlockProps {
    id: string;
    title: string;
    description: string;
    links?: LinkItem[];
}

const ContentBlock: React.FC<ContentBlockProps> = ({ id, title, description, links }) => {
    const navigate = useNavigate();

    // Drive-folder links with a scanned document list render as a DocumentList instead of a card
    const driveFolderLists = useMemo<DriveFolderList[]>(() => {
        if (!links) return [];
        const contentsMap = mathLoversContents as unknown as Record<string, FolderContents | undefined>;
        const teacherContentsMap = teacherContents as unknown as Record<string, FolderContents | undefined>;
        const out: DriveFolderList[] = [];
        for (const link of links) {
            const match = link.url.match(DRIVE_FOLDER_RE);
            const folderId = match?.[1] ?? '';
            const contents = contentsMap[folderId] ?? (FALLBACK_LEAF_KEYS[folderId] ? teacherContentsMap[FALLBACK_LEAF_KEYS[folderId] ?? ''] : undefined);
            if (contents) out.push({ linkTitle: link.title, contents });
        }
        return out;
    }, [links]);

    const listedFolderIds = useMemo(() => {
        const s = new Set<string>();
        for (const folder of driveFolderLists) {
            const match = (links || []).find((l) => l.title === folder.linkTitle)?.url.match(DRIVE_FOLDER_RE);
            if (match) s.add(match[1] ?? '');
        }
        return s;
    }, [driveFolderLists, links]);

    // Map mathematical link items to unified Resource format for ResourceCard consumption
    const mappedResources = useMemo(() => {
        if (!links) return [];
        return links
            .filter((link) => {
                const match = link.url.match(DRIVE_FOLDER_RE);
                return !(match && listedFolderIds.has(match[1] ?? ''));
            })
            .map((link) => {
                const prefix = id === 'ml-olympiad' ? 'olympiad' : id;
                const linkId = `${prefix}-${link.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
                return {
                    id: linkId,
                    title: link.title,
                    description: `${title} - ${link.title}`,
                    category: 'math-lovers',
                    class: null,
                    subject: 'Mathematics',
                    type: 'link' as const,
                    driveUrl: link.url,
                    urlType: getUrlType(link.url),
                    thumbnail: null,
                    contributors: ['Sajhi Shiksha Team'],
                    lastUpdated: new Date().toISOString().split('T')[0] || '',
                };
            });
    }, [links, title, id, listedFolderIds]);

    const handleView = (resourceId: string) => {
        navigate({ to: '/view/$id', params: { id: resourceId } });
    };

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <Box
            sx={{
                p: { xs: 3, md: 4 },
                mb: 6,
                bgcolor: 'var(--color-bg)',
                border: '3px solid var(--color-border)',
                boxShadow: '4px 4px 0px var(--color-shadow)',
            }}
        >
            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    mb: 1,
                }}
            >
                {title}
            </Typography>
            <Typography
                sx={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '1rem',
                    mb: 4,
                }}
            >
                {description}
            </Typography>

            {mappedResources.length > 0 && (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 3,
                    }}
                >
                    {mappedResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            viewMode="grid"
                            onView={handleView}
                            onDownload={handleDownload}
                        />
                    ))}
                </Box>
            )}

            {driveFolderLists.map((folder) => (
                <Box key={folder.linkTitle} sx={{ mt: 4 }}>
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            fontSize: { xs: '1.25rem', md: '1.4rem' },
                            mb: 2,
                        }}
                    >
                        {folder.linkTitle}
                    </Typography>
                    <DocumentList contents={folder.contents} />
                </Box>
            ))}
        </Box>
    );
};

export default ContentBlock;
