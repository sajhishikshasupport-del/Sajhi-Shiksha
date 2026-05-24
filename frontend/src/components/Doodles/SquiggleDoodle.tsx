import React from 'react';

interface SquiggleDoodleProps {
    width?: number;
    color?: string;
}

const SquiggleDoodle: React.FC<SquiggleDoodleProps> = ({
    width = 200,
    color = 'var(--color-border)',
}) => (
    <svg
        width={width}
        height="24"
        viewBox="0 0 200 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M2 12C15 4 30 20 50 12C70 4 85 20 100 12C115 4 130 20 150 12C170 4 185 20 198 12"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
        />
    </svg>
);

export default SquiggleDoodle;
