import React from 'react';

interface StarDoodleProps {
    size?: number;
    color?: string;
    rotation?: number;
}

const StarDoodle: React.FC<StarDoodleProps> = ({
    size = 32,
    color = 'var(--color-yellow)',
    rotation = 0,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(${rotation}deg)` }}
    >
        <path
            d="M20 2L25 14L38 16L28 25L31 38L20 32L9 38L12 25L2 16L15 14L20 2Z"
            fill={color}
            stroke="var(--color-border)"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
    </svg>
);

export default StarDoodle;
