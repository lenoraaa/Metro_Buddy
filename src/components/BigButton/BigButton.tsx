import React from 'react';
import styles from './BigButton.module.css';

interface BigButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    type?: 'button' | 'submit';
}

export default function BigButton({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    fullWidth = false,
    icon,
    type = 'button'
}: BigButtonProps) {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.text}>{children}</span>
        </button>
    );
}
