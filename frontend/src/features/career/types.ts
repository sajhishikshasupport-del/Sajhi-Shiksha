/**
 * Shared types for the Career Counselling section.
 *
 * The content itself is authored by the Career Counselling Agent and synced in
 * as static JSON (see `career-website-content.json` and `career-pages/*.json`).
 * These types mirror that shape so the routes and components stay type-safe.
 */

/** One item in the career manifest (a section link or a page). */
export interface CareerManifestItem {
    id: string;
    title: string;
    description: string;
    /** 'link' opens an external url; 'page' renders an internal sub-route. */
    type: string;
    url?: string;
    phase: number;
    order: number;
    icon?: string;
    /** 'free' | 'paid' — used for the free/paid label. */
    access?: string;
    /** Only items with visible !== false are shown publicly. */
    visible?: boolean;
}

export interface CareerManifestSection {
    title: string;
    subtitle: string;
    icon?: string;
    color?: string;
}

export interface CareerFreeVsPaid {
    free_area?: string;
    paid_area?: string;
    boundary_rule?: string;
}

export interface CareerManifest {
    section: CareerManifestSection;
    free_vs_paid?: CareerFreeVsPaid;
    items: CareerManifestItem[];
}

/** A single card inside a page section. */
export interface CareerPageItem {
    title: string;
    body?: string;
    meta?: string;
}

/** A heading + body block, optionally with a list of cards. */
export interface CareerPageSection {
    heading: string;
    body?: string;
    icon?: string;
    items?: CareerPageItem[];
}

/** The full content of one `/career-counselling/<slug>` page. */
export interface CareerPageContent {
    title: string;
    intro_short: string;
    intro_full: string;
    sections: CareerPageSection[];
}
