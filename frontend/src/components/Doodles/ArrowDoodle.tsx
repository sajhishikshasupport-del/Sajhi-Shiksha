import React from 'react';

interface ArrowDoodleProps {
    size?: number;
    color?: string;
    direction?: 'left' | 'right' | 'up' | 'down';
}

const ArrowDoodle: React.FC<ArrowDoodleProps> = ({
    size = 48,
    color = 'var(--color-border)',
    direction = 'right',
}) => {
    const rotation = { right: 0, down: 90, left: 180, up: 270 }[direction];

    return (
        <svg
            width={size}
            height={size * 0.6}
            viewBox="0 0 60 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <path
                d="M2 18C15 18 30 10 42 12"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M34 4L44 12L34 20"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
};

export default ArrowDoodle;
