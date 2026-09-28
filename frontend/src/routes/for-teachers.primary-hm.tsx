import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as forTeachersRoute } from './for-teachers';
import { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import { useSEO, breadcrumbSchema } from '@/hooks/useSEO';
import { findCardDeep, getCardPath } from '@/lib/utils';
import teachersData from '@/data/teachers.json';
import teacherContents from '@/data/teacher-contents-primary.json';
import navigationData from '@/data/navigation.json';
import {
    BackButton, EmptyState, LeafView, FolderCard, ResourceCardWrapper,
    TeacherBreadcrumbs
} from '@/features/teachers/components/TeacherShared';
import type { FolderContents } from '@/features/teachers/components/TeacherShared';

function PrimaryHMPage(): React.ReactElement {
    const navigate = useNavigate();
    const { folder: selectedFolder, leaf: selectedLeaf } = Route.useSearch();
    const mainCard = teachersData.mainCards.find((c) => c.id === 'primary-hm');
    const parentLabel = navigationData.headerLinks.find((l) => l.route === '/for-teachers')?.label ?? 'For Teachers';
    const pageTitle = mainCard?.title ?? '';
    const allSubCards = mainCard?.subCards ?? [];

    const currentFolder = selectedFolder ? findCardDeep(selectedFolder, allSubCards) : null;
    const folderChildren = currentFolder?.subCards ?? [];
    const currentLeafItem = selectedLeaf ? findCardDeep(selectedLeaf, allSubCards) : null;

    useSEO({
        title: pageTitle || 'Primary Teachers & HM',
        description: 'Primary classes (1-5) teaching resources: lesson plans, worksheets, cycle tests, SRP, textbooks, split-ups, primary programmes, and Head Master materials.',
        canonicalPath: '/for-teachers/primary-hm',
        ogImage: '/images/og-teachers.png',
        jsonLd: breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'For Teachers', path: '/for-teachers' },
            { name: pageTitle || 'Primary Teachers & HM', path: '/for-teachers/primary-hm' },
        ]),
    });

    const handleBack = useCallback(() => {
        if (selectedLeaf) {
            navigate({
                to: '/for-teachers/primary-hm',
                search: selectedFolder ? { folder: selectedFolder } : {},
            });
        } else if (selectedFolder) {
            const path = getCardPath(selectedFolder, allSubCards);
            if (path && path.length > 1) {
                navigate({
                    to: '/for-teachers/primary-hm',
                    search: { folder: path[path.length - 2].id },
                });
            } else {
                navigate({ to: '/for-teachers/primary-hm', search: {} });
            }
        } else {
            navigate({ to: '/for-teachers' });
        }
    }, [selectedLeaf, selectedFolder, navigate, allSubCards]);

    const handleOpenLink = useCallback((url?: string) => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    if (selectedLeaf && currentLeafItem) {
        return (
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
                <TeacherBreadcrumbs
                    items={[
                        { label: parentLabel, onClick: () => navigate({ to: '/for-teachers' }) },
                        { label: pageTitle, onClick: () => navigate({ to: '/for-teachers/primary-hm', search: {} }) },
                        ...(() => {
                            const folderPath = selectedFolder ? getCardPath(selectedFolder, allSubCards) : null;
                            return (folderPath || []).map((item) => ({
                                label: item.title,
                                onClick: () => navigate({ to: '/for-teachers/primary-hm', search: { folder: item.id } }),
                            }));
                        })(),
                        { label: currentLeafItem.title, isCurrent: true },
                    ]}
                />
                <LeafView
                    title={currentLeafItem.title}
                    description={currentLeafItem.description}
                    driveUrl={currentLeafItem.driveUrl || ''}
                    contents={(teacherContents as unknown as Record<string, FolderContents | undefined>)[currentLeafItem.id]}
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
                        { label: pageTitle, onClick: () => navigate({ to: '/for-teachers/primary-hm', search: {} }) },
                        ...(() => {
                            const folderPath = getCardPath(selectedFolder, allSubCards);
                            return (folderPath || []).map((item, idx) => ({
                                label: item.title,
                                isCurrent: idx === (folderPath?.length ?? 0) - 1,
                                onClick: idx < (folderPath?.length ?? 0) - 1 ? () => navigate({ to: '/for-teachers/primary-hm', search: { folder: item.id } }) : undefined,
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
                                        onClick={() => navigate({ to: '/for-teachers/primary-hm', search: { folder: child.id } })}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate({ to: '/for-teachers/primary-hm', search: { folder: child.id } }); } }}
                                    />
                                );
                            }
                            return (
                                <ResourceCardWrapper
                                    key={child.id}
                                    item={child}
                                    subject={currentFolder.title}
                                    onView={() => navigate({ to: '/for-teachers/primary-hm', search: { folder: selectedFolder, leaf: child.id } })}
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
                                    onClick={() => navigate({ to: '/for-teachers/primary-hm', search: { folder: subCard.id } })}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate({ to: '/for-teachers/primary-hm', search: { folder: subCard.id } }); } }}
                                />
                            );
                        }
                        return (
                            <ResourceCardWrapper
                                key={subCard.id}
                                item={subCard}
                                subject={pageTitle}
                                onView={(id) => navigate({ to: '/for-teachers/primary-hm', search: { leaf: id } })}
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
    path: 'primary-hm',
    component: PrimaryHMPage,
    validateSearch: (search: Record<string, unknown>): { folder?: string; leaf?: string } => ({
        folder: typeof search.folder === 'string' ? search.folder : undefined,
        leaf: typeof search.leaf === 'string' ? search.leaf : undefined,
    }),
});
