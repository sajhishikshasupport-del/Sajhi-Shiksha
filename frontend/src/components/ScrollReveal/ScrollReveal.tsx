import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    delay?: number;
    threshold?: number;
    rootMargin?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    delay = 0,
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const hasRevealed = useRef<boolean>(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || hasRevealed.current) return;

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        hasRevealed.current = true;
                        setTimeout(() => {
                            setIsRevealed(true);
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold, rootMargin },
        );

        observer.observe(el);

        return (): void => {
            observer.disconnect();
        };
    }, [delay, threshold, rootMargin]);

    return (
        <div
            ref={ref}
            className={`scroll-reveal ${isRevealed ? 'revealed' : ''}`}
        >
            {children}
        </div>
    );
};

export default React.memo(ScrollReveal);
