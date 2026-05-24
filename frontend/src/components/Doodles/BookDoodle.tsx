import React from 'react';

interface BookDoodleProps {
    size?: number;
    color?: string;
}

const BookDoodle: React.FC<BookDoodleProps> = ({
    size = 40,
    color = 'var(--color-teal)',
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6 8C6 8 14 6 24 8C34 6 42 8 42 8V38C42 38 34 36 24 38C14 36 6 38 6 38V8Z"
            fill={color}
            stroke="var(--color-border)"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        <path
            d="M24 8V38"
            stroke="var(--color-border)"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        <path
            d="M12 16H18"
            stroke="var(--color-border)"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M12 22H18"
            stroke="var(--color-border)"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M30 16H36"
            stroke="var(--color-border)"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M30 22H36"
            stroke="var(--color-border)"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export default BookDoodle;
