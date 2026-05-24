import React, { useState, useEffect, useRef } from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const [isEntering, setIsEntering] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const timer = setTimeout(() => {
            setIsEntering(false);
        }, 50);

        return (): void => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={isEntering ? 'page-enter page-enter-active' : ''}
        >
            {children}
        </div>
    );
};

export default React.memo(PageTransition);
