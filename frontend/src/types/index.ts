export interface Resource {
    id: string;
    title: string;
    description: string;
    category: string;
    class: number | null;
    subject: string | null;
    type: 'pdf' | 'document' | 'format' | 'link';
    driveUrl: string;
    urlType: 'youtube' | 'drive' | 'website';
    thumbnail: string | null;
    contributors: string[];
    lastUpdated: string;
}

export interface NavLink {
    label: string;
    route: string;
}

export interface SectionConfig {
    enabled: boolean;
    title: string;
    subtitle: string;
    icon: string;
    buttonColor: string;
    redirectRoute: string;
}

export interface LinkItem {
    title: string;
    url: string;
}

export interface ContentBlock {
    id: string;
    title: string;
    description: string;
    driveUrl?: string;
    lastUpdated?: string;
    links?: LinkItem[];
}

export interface OfficialLink {
    id: string;
    title: string;
    description: string;
    url: string;
    icon: string;
}

export interface TeacherSubCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    driveUrl?: string;
    hasSubCards?: boolean;
    subCards?: TeacherLeafCard[];
}

export interface TeacherLeafCard {
    id: string;
    title: string;
    description: string;
    driveUrl: string;
}

export interface TeacherMainCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    buttonColor: string;
    subCards: TeacherSubCard[];
}

export interface SiteContent {
    site: {
        name: string;
        tagline: string;
        footerTagline: string;
        contactEmail: string;
        whatsappGroupUrl: string;
        whatsappNumber: string;
    };
    homepage: {
        heroTitle: string;
        heroHighlightWord: string;
        heroSubtitle: string;
    };
    sections: {
        students: SectionConfig & { filterParams: { class: string[]; subject: string[] } };
        teachers: SectionConfig & { categoryFilters: string[] };
        mathLovers: SectionConfig & { blocks: ContentBlock[] };
    };
    forStudents: {
        officialLinks: OfficialLink[];
    };
    teacherCards: {
        mainCards: TeacherMainCard[];
    };
    navigation: {
        headerLinks: NavLink[];
        footerGroups: { heading: string; links: NavLink[] }[];
    };
    contact: {
        showProfessorNames: boolean;
        email: string;
        showContributors: boolean;
    };
}

export interface OlympiadSection {
    id: string;
    title: string;
    description: string;
    links: LinkItem[];
}
