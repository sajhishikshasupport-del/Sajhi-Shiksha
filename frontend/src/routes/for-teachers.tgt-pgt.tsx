import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as forTeachersRoute } from './for-teachers';
import { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import teachersData from '@/data/teachers.json';
import navigationData from '@/data/navigation.json';
import {
    BackButton, EmptyState, LeafView, FolderCard, ResourceCardWrapper,
    TeacherBreadcrumbs
} from '@/features/teachers/components/TeacherShared';

function TgtPgtPage(): React.ReactElement {
    const navigate = useNavigate();
    const mainCard = teachersData.mainCards.find((c) => c.id === 'tgt-pgt');
    const parentLabel = navigationData.headerLinks.find((l) => l.route === '/for-teachers')?.label ?? 'For Teachers';
    const pageTitle = mainCard?.title ?? '';
    const allSubCards = mainCard?.subCards ?? [];

    const [selectedSubCard, setSelectedSubCard] = useState<string | null>(null);
    const [selectedLeaf, setSelectedLeaf] = useState<string | null>(null);

    const currentSubCard = allSubCards.find((s) => s.id === selectedSubCard) ?? null;
    const hasSubCards = currentSubCard?.hasSubCards && !!currentSubCard?.subCards?.length;
    const leafItems = hasSubCards ? (currentSubCard?.subCards ?? []) : [];
    const currentLeaf = (hasSubCards ? leafItems : allSubCards).find((l: any) => l.id === (hasSubCards ? selectedLeaf : selectedSubCard)) ?? null;

    const handleBack = useCallback(() => {
        if (selectedLeaf) {
            setSelectedLeaf(null);
        } else if (selectedSubCard) {
            setSelectedSubCard(null);
        } else {
            navigate({ to: '/for-teachers' });
        }
    }, [selectedLeaf, selectedSubCard, navigate]);

    const handleOpenLink = useCallback((url?: string) => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    if (selectedLeaf && currentLeaf) {
        return (
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
                <TeacherBreadcrumbs
                    items={[
                        { label: parentLabel, onClick: () => navigate({ to: '/for-teachers' }) },
                        { label: pageTitle, onClick: () => { setSelectedSubCard(null); setSelectedLeaf(null); } },
                        ...(selectedSubCard && currentSubCard ? [{ label: currentSubCard.title, onClick: () => setSelectedLeaf(null) }] : []),
                        { label: currentLeaf.title, isCurrent: true },
                    ]}
                />
                <LeafView
                    title={currentLeaf.title}
                    description={currentLeaf.description}
                    driveUrl={currentLeaf.driveUrl || ''}
                    onBack={handleBack}
                    onOpenLink={handleOpenLink}
                />
            </Box>
        );
    }

    if (selectedSubCard && hasSubCards) {
        return (
            <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
                <TeacherBreadcrumbs
                    items={[
                        { label: parentLabel, onClick: () => navigate({ to: '/for-teachers' }) },
                        { label: pageTitle, onClick: () => { setSelectedSubCard(null); setSelectedLeaf(null); } },
                        { label: currentSubCard.title, isCurrent: true },
                    ]}
                />
                <BackButton onClick={handleBack} />
                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}>
                    {currentSubCard.title}
                </Typography>
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.9rem', color: 'var(--color-text-secondary)', mb: 4 }}>
                    {currentSubCard.description}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
                    {leafItems.map((leaf) => (
                        <ResourceCardWrapper
                            key={leaf.id}
                            item={leaf}
                            subject={currentSubCard.title}
                            onView={(id) => navigate({ to: '/view/$id', params: { id } })}
                            onDownload={(url) => window.open(url, '_blank')}
                        />
                    ))}
                </Box>
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
                                    onClick={() => setSelectedSubCard(subCard.id)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSubCard(subCard.id); } }}
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
    path: 'tgt-pgt',
    component: TgtPgtPage,
});
