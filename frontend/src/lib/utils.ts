import type { Resource } from '@/types';
import { getUrlType } from '@/lib/urlUtils';

export function isYouTubeUrl(url: string): boolean {
    if (!url) return false;
    return /youtube\.com|youtu\.be/i.test(url);
}

export function getDriveEmbedUrl(driveUrl: string): string {
    if (!driveUrl || driveUrl.trim() === '') return '';

    const fileIdMatch = driveUrl.match(/\/d\/([^/]+)/);
    if (fileIdMatch?.[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    if (driveUrl.includes('preview')) {
        return driveUrl;
    }
    return driveUrl;
}

export function formatResourceCount(count: number): string {
    if (count === 0) return 'No resources';
    if (count === 1) return '1 resource';
    return `${count} resources`;
}

/**
 * Creates a structured resource object from teacher card data.
 * Correctly maps `item.driveUrl` and sets the `type` dynamically.
 */
export function teacherCardToResource(item: any, subject: string): Resource {
    const driveUrl = item.driveUrl ?? '';
    const urlType = getUrlType(driveUrl);
    let type: 'pdf' | 'document' | 'format' | 'link' = 'document';
    if (urlType === 'youtube' || urlType === 'website') {
        type = 'link';
    } else if (urlType === 'drive') {
        if (driveUrl.toLowerCase().includes('folder') || driveUrl.toLowerCase().includes('list')) {
            type = 'format';
        } else {
            type = 'pdf';
        }
    }
    return {
        id: item.id,
        title: item.title,
        description: item.description,
        category: 'teacher',
        class: null,
        subject,
        type: item.type ?? type,
        driveUrl,
        urlType,
        thumbnail: null,
        contributors: item.contributors || ['Sajhi Shiksha Team'],
        lastUpdated: item.lastUpdated ?? new Date().toISOString().split('T')[0],
    };
}

export function findCardDeep(id: string, cards: any[]): any | null {
    for (const card of cards) {
        if (card.id === id) return card;
        if (card.subCards?.length) {
            const found = findCardDeep(id, card.subCards);
            if (found) return found;
        }
    }
    return null;
}

export function getCardPath(id: string, cards: any[], parents: any[] = []): any[] | null {
    for (const card of cards) {
        if (card.id === id) return [...parents, card];
        if (card.subCards?.length) {
            const found = getCardPath(id, card.subCards, [...parents, card]);
            if (found) return found;
        }
    }
    return null;
}

// --- CRITICAL FIX: Robust recursive lookup for teacher cards ---

function findResourceDeep(id: string, cards: any[], subject: string): Resource | null {
    for (const card of cards) {
        if (card.id === id) return teacherCardToResource(card, subject);
        if (card.subCards?.length) {
            const found = findResourceDeep(id, card.subCards, subject);
            if (found) return found;
        }
    }
    return null;
}

export function findTeacherResourceById(id: string, teachersData: any): Resource | null {
    if (!teachersData?.mainCards) return null;
    for (const mainCard of teachersData.mainCards) {
        const subject = mainCard.id === 'tgt-pgt' ? 'Mathematics' : 'General';
        const found = findResourceDeep(id, mainCard.subCards ?? [], subject);
        if (found) return found;
    }
    return null;
}
