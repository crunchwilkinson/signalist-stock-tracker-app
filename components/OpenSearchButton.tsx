'use client';

import React from 'react';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function OpenSearchButton({ children, className }: Props) {
    const handleOpen = () => {
        // Broadcast the signal that SearchCommand is listening for
        window.dispatchEvent(new CustomEvent('open-search'));
    };

    return (
        <button onClick={handleOpen} className={className}>
            {children}
        </button>
    );
}