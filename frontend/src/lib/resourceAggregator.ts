import type { Resource, ContentBlock, OlympiadSection } from '@/types';
import teachersData from '@/data/teachers.json';
import studentsData from '@/data/students.json';
import sectionsData from '@/data/sections.json';
import { findTeacherResourceById, teacherCardToResource } from '@/lib/utils';
import { getUrlType } from '@/lib/urlUtils';

// --- URL Source of Truth Map ---
// This map stores the latest URLs from all JSON files, keyed by resource ID.
// It ensures that search results always use the most up-to-date URLs.
function buildSourceUrlMap(): Map<string, string> {
    const map = new Map<string, string>();

    function collectUrls(cards: any[]) {
        for (const card of cards) {
            if (card.driveUrl && typeof card.driveUrl === 'string') {
                map.set(card.id, card.driveUrl);
            }
            if (card.subCards?.length) {
                collectUrls(card.subCards);
            }
        }
    }

    if (teachersData?.mainCards) {
        for (const mainCard of teachersData.mainCards) {
            collectUrls(mainCard.subCards ?? []);
        }
    }

    if (studentsData?.officialLinks) {
        for (const link of studentsData.officialLinks) {
            if (link.url) map.set(link.id, link.url);
        }
    }

    const blocks = (sectionsData?.mathLovers?.blocks || []) as ContentBlock[];
    for (const block of blocks) {
        if (block.driveUrl) map.set(block.id, block.driveUrl);
        if (block.links) {
            for (const link of block.links) {
                if (link.url) {
                    const linkId = `${block.id}-${link.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
                    map.set(linkId, link.url);
                }
            }
        }
    }

    const olympiadSection = sectionsData?.mathLovers?.olympiadSection as OlympiadSection | undefined;
    if (olympiadSection?.links) {
        for (const link of olympiadSection.links) {
            if (link.url) {
                const linkId = `olympiad-${link.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
                map.set(linkId, link.url);
            }
        }
    }

    return map;
}

const sourceUrlMap = buildSourceUrlMap();

/**
 * Apply the latest URL from the source of truth map to a resource.
 */
function applyLatestUrl(resource: Resource): Resource {
    const sourceUrl = sourceUrlMap.get(resource.id);
    if (sourceUrl) {
        return { ...resource, driveUrl: sourceUrl, urlType: getUrlType(sourceUrl) };
    }
    return { ...resource, urlType: getUrlType(resource.driveUrl) };
}

/**
 * Flatten all resources from ALL JSON files into a single deduplicated array.
 * Uses a Map keyed by ID so the latest source wins (teachers.json over resources.json).
 */
function buildFlattenedResources(): Resource[] {
    const map = new Map<string, Resource>();

    // 1. Teacher resources from teachers.json (leaf nodes with driveUrl)
    function collectTeacherResources(cards: any[], subject: string) {
        for (const card of cards) {
            if (card.driveUrl && !card.hasSubCards) {
                map.set(card.id, teacherCardToResource(card, subject));
            }
            if (card.subCards?.length) {
                collectTeacherResources(card.subCards, subject);
            }
        }
    }

    if (teachersData?.mainCards) {
        for (const mainCard of teachersData.mainCards) {
            const subject = mainCard.id === 'tgt-pgt' ? 'Mathematics' : 'General';
            collectTeacherResources(mainCard.subCards ?? [], subject);
        }
    }

    // 3. Student official links
    if (studentsData?.officialLinks) {
        for (const link of studentsData.officialLinks) {
            map.set(link.id, {
                id: link.id,
                title: link.title,
                description: link.description,
                category: 'student-links',
                class: null,
                subject: 'General',
                type: 'link',
                driveUrl: link.url,
                urlType: getUrlType(link.url),
                thumbnail: null,
                contributors: ['Sajhi Shiksha Team'],
                lastUpdated: new Date().toISOString().split('T')[0] || '',
            });
        }
    }

    // 4. Math Lovers blocks
    const blocks = (sectionsData?.mathLovers?.blocks || []) as ContentBlock[];
    for (const block of blocks) {
        if (block.driveUrl) {
            map.set(block.id, {
                id: block.id,
                title: block.title,
                description: block.description,
                category: 'math-lovers',
                class: null,
                subject: 'Mathematics',
                type: 'link',
                driveUrl: block.driveUrl,
                urlType: getUrlType(block.driveUrl),
                thumbnail: null,
                contributors: ['Sajhi Shiksha Team'],
                lastUpdated: (block.lastUpdated ?? new Date().toISOString().split('T')[0]) || '',
            });
        }
        if (block.links) {
            for (const link of block.links) {
                const linkId = `${block.id}-${link.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
                map.set(linkId, {
                    id: linkId,
                    title: link.title,
                    description: `${block.title} - ${link.title}`,
                    category: 'math-lovers',
                    class: null,
                    subject: 'Mathematics',
                    type: 'link',
                    driveUrl: link.url,
                    urlType: getUrlType(link.url),
                    thumbnail: null,
                    contributors: ['Sajhi Shiksha Team'],
                    lastUpdated: new Date().toISOString().split('T')[0] || '',
                });
            }
        }
    }

    const olympiadSection = sectionsData?.mathLovers?.olympiadSection as OlympiadSection | undefined;
    if (olympiadSection?.links) {
        for (const link of olympiadSection.links) {
            const linkId = `olympiad-${link.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
            map.set(linkId, {
                id: linkId,
                title: link.title,
                description: `Olympiad - ${link.title}`,
                category: 'math-lovers',
                class: null,
                subject: 'Mathematics',
                type: 'link',
                driveUrl: link.url,
                urlType: getUrlType(link.url),
                thumbnail: null,
                contributors: ['Sajhi Shiksha Team'],
                lastUpdated: new Date().toISOString().split('T')[0] || '',
            });
        }
    }

    return Array.from(map.values());
}

const allFlattenedResources = buildFlattenedResources();

export function getResourceById(id: string): Resource | null {
    const found = allFlattenedResources.find((r) => r.id === id);
    if (found) {
        return applyLatestUrl(found);
    }
    const teacherResource = findTeacherResourceById(id, teachersData);
    if (teacherResource) {
        return applyLatestUrl(teacherResource);
    }
    return null;
}

export function getAllResources(): Resource[] {
    return allFlattenedResources.map((r) => applyLatestUrl(r));
}
