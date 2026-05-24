import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as forTeachersRoute } from './for-teachers';
import { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import { findCardDeep, getCardPath } from '@/lib/utils';
import teachersData from '@/data/teachers.json';
import navigationData from '@/data/navigation.json';
import {
    BackButton, EmptyState, LeafView, FolderCard, ResourceCardWrapper,
    TeacherBreadcrumbs
} from '@/features/teachers/components/TeacherShared';

function CircularFormatsPage(): React.ReactElement {
    const navigate = useNavigate();
    const mainCard = teachersData.mainCards.find((c) => c.id === 'circular-formats');
    const parentLabel = navigationData.headerLinks.find((l) => l.route === '/for-teachers')?.label ?? 'For Teachers';
    const pageTitle = mainCard?.title ?? '';
    const allSubCards = mainCard?.subCards ?? [];

    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedLeaf, setSelectedLeaf] = useState<string | null>(null);

    const currentFolder = selectedFolder ? findCardDeep(selectedFolder, allSubCards) : null;
    const folderChildren = currentFolder?.subCards ?? [];
    const currentLeafItem = selectedLeaf ? findCardDeep(selectedLeaf, allSubCards) : null;

    const handleBack = useCallback(() => {
        if (selectedLeaf) {
            setSelectedLeaf(null);
        } else if (selectedFolder) {
            const path = getCardPath(selectedFolder, allSubCards);
            if (path && path.length > 1) {
                setSelectedFolder(path[path.length - 2].id);
            } else {
                setSelectedFolder(null);
            }
        } else {
            navigate({ to: '/for-teachers' });
        }
    }, [selectedLeaf, selectedFolder, navigate]);

    const handleOpenLink = useCallback((url?: string) => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    if (selectedLeaf && currentLeafItem) {
        return (
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
                <TeacherBreadcrumbs
                    items={[
                        { label: parentLabel, onClick: () => navigate({ to: '/for-teachers' }) },
                        { label: pageTitle, onClick: () => { setSelectedFolder(null); setSelectedLeaf(null); } },
                        ...(() => {
                            const folderPath = selectedFolder ? getCardPath(selectedFolder, allSubCards) : null;
                            return (folderPath || []).map((item) => ({
                                label: item.title,
                                onClick: () => { setSelectedLeaf(null); setSelectedFolder(item.id); },
                            }));
                        })(),
                        { label: currentLeafItem.title, isCurrent: true },
                    ]}
                />
                <LeafView
                    title={currentLeafItem.title}
                    description={currentLeafItem.description}
                    driveUrl={currentLeafItem.driveUrl || ''}
                    onBack={handleBack}
                    onOpenLink={handleOpenLink}
                />
            </Box>
        );
    }

    if (selectedFolder && currentFolder) {
        return (
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
                <TeacherBreadcrumbs
                    items={[
                        { label: parentLabel, onClick: () => navigate({ to: '/for-teachers' }) },
                        { label: pageTitle, onClick: () => { setSelectedFolder(null); setSelectedLeaf(null); } },
                        ...(() => {
                            const folderPath = getCardPath(selectedFolder, allSubCards);
                            return (folderPath || []).map((item, idx) => ({
                                label: item.title,
                                isCurrent: idx === (folderPath?.length ?? 0) - 1,
                                onClick: idx < (folderPath?.length ?? 0) - 1 ? () => { setSelectedLeaf(null); setSelectedFolder(item.id); } : undefined,
                            }));
                        })(),
                    ]}
                />
                <BackButton onClick={handleBack} />
                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}>
                    {currentFolder.title}
                </Typography>
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.9rem', color: 'var(--color-text-secondary)', mb: 4 }}>
                    {currentFolder.description}
                </Typography>
                {folderChildren.length === 0 ? (
                    <EmptyState title="No resources yet" message="Resources will appear here once added." />
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
                        {folderChildren.map((child: any) => {
                            const childHasChildren = child.hasSubCards && !!child.subCards?.length;
                            if (childHasChildren) {
                                return (
                                    <FolderCard
                                        key={child.id}
                                        title={child.title}
                                        description={child.description}
                                        parentTitle={currentFolder.title}
                                        onClick={() => setSelectedFolder(child.id)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedFolder(child.id); } }}
                                    />
                                );
                            }
                            return (
                                <ResourceCardWrapper
                                    key={child.id}
                                    item={child}
                                    subject={currentFolder.title}
                                    onView={() => setSelectedLeaf(child.id)}
                                    onDownload={(url) => window.open(url, '_blank')}
                                />
                            );
                        })}
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <TeacherBreadcrumbs
                items={[
                    { label: parentLabel, onClick: () => navigate({ to: '/for-teachers' }) },
                    { label: pageTitle, isCurrent: true },
                ]}
            />
            <BackButton onClick={handleBack} />
            <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}>
                {pageTitle}
            </Typography>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.9rem', color: 'var(--color-text-secondary)', mb: 4 }}>
                {mainCard?.description ?? ''}
            </Typography>
            {allSubCards.length === 0 ? (
                <EmptyState title="No resources yet" message="Resources will appear here once added." />
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
                    {allSubCards.map((subCard) => {
                        const hasChildren = subCard.hasSubCards && !!subCard.subCards?.length;
                        if (hasChildren) {
                            return (
                                <FolderCard
                                    key={subCard.id}
                                    title={subCard.title}
                                    description={subCard.description}
                                    parentTitle={pageTitle}
                                    onClick={() => setSelectedFolder(subCard.id)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedFolder(subCard.id); } }}
                                />
                            );
                        }
                        return (
                            <ResourceCardWrapper
                                key={subCard.id}
                                item={subCard}
                                subject={pageTitle}
                                onView={(id) => navigate({ to: '/view/$id', params: { id } })}
                                onDownload={(url) => window.open(url, '_blank')}
                            />
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}

export const Route = createRoute({
    getParentRoute: () => forTeachersRoute,
    path: 'circular-formats',
    component: CircularFormatsPage,
});
