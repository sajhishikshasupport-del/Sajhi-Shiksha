export function getUrlType(url: string): 'youtube' | 'drive' | 'website' {
    if (!url) return 'website';
    if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
    if (/drive\.google\.com/i.test(url)) return 'drive';
    return 'website';
}
