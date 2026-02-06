'use client';

import React from 'react';
import { NavigationStep } from '@/types/route';
import styles from './StepCard.module.css';

interface StepCardProps {
    step?: NavigationStep; // New rich data
    stepNumber: number;
    totalSteps: number;
    lineColor?: string;
    // Legacy support
    instruction?: string;
    icon?: string;
}

export default function StepCard({
    step,
    stepNumber,
    totalSteps,
    lineColor,
    instruction,
    icon
}: StepCardProps) {
    const getLineColorClass = () => {
        switch (lineColor?.toLowerCase()) {
            case 'blue': return styles.lineBlue;
            case 'red': return styles.lineRed;
            case 'green': return styles.lineGreen;
            case 'yellow': return styles.lineYellow;
            case 'purple': return styles.linePurple;
            default: return styles.lineBlue;
        }
    };

    // Derived values (Prefer rich step data, fallback to legacy)
    const displayInstruction = step?.instruction || instruction;
    const displayIcon = step?.icon || icon;

    return (
        <div className={`${styles.card} ${getLineColorClass()}`}>
            <div className={styles.header}>
                <span className={styles.stepLabel}>Step {stepNumber} of {totalSteps}</span>
                {step?.type && <span className={styles.stepType}>{step.type.toUpperCase()}</span>}
            </div>

            <div className={styles.iconContainer}>
                <span className={styles.icon}>{displayIcon}</span>
            </div>

            <div className={styles.instructionContainer}>
                <p className={styles.instruction}>{displayInstruction}</p>

                {/* Rich Metadata Display */}
                {step?.visual_cue && (
                    <div className={styles.visualCue}>
                        <span>👀 Look for:</span>
                        <strong>{step.visual_cue}</strong>
                    </div>
                )}

                <div className={styles.metaGrid}>
                    {step?.metadata?.platform && (
                        <div className={styles.metaBadge}>
                            <span className={styles.metaLabel}>PLATFORM</span>
                            <span className={styles.metaValue}>{step.metadata.platform}</span>
                        </div>
                    )}
                    {step?.metadata?.gate && (
                        <div className={styles.metaBadge}>
                            <span className={styles.metaLabel}>GATE</span>
                            <span className={styles.metaValue}>{step.metadata.gate}</span>
                        </div>
                    )}
                    {step?.metadata?.ticket_type && (
                        <div className={styles.metaBadge}>
                            <span className={styles.metaLabel}>TICKET</span>
                            <span className={styles.metaValue}>{step.metadata.ticket_type}</span>
                        </div>
                    )}
                    {step?.metadata?.cost && (
                        <div className={styles.metaBadge}>
                            <span className={styles.metaLabel}>COST</span>
                            <span className={styles.metaValue}>{step.metadata.cost}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
                />
            </div>
        </div>
    );
}
