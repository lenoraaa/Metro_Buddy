'use client';

import React, { useEffect, useState } from 'react';

interface AudioAnimationProps {
    isPlaying: boolean;
}

export default function AudioAnimation({ isPlaying }: AudioAnimationProps) {
    const [bars, setBars] = useState([40, 60, 80, 60, 40]);

    useEffect(() => {
        if (!isPlaying) {
            setBars([40, 60, 80, 60, 40]);
            return;
        }

        const interval = setInterval(() => {
            setBars([
                Math.random() * 60 + 20,
                Math.random() * 80 + 20,
                Math.random() * 100 + 20,
                Math.random() * 80 + 20,
                Math.random() * 60 + 20
            ]);
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying]);

    if (!isPlaying) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '6px',
            padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
            backdropFilter: 'blur(10px)',
            zIndex: 999,
            animation: 'slideUp 0.3s ease-out'
        }}>
            <span style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: 'white',
                marginRight: '12px'
            }}>🔊</span>
            {bars.map((height, i) => (
                <div
                    key={i}
                    style={{
                        width: '4px',
                        height: `${height}px`,
                        background: 'white',
                        borderRadius: '2px',
                        transition: 'height 0.1s ease-out'
                    }}
                />
            ))}
        </div>
    );
}
