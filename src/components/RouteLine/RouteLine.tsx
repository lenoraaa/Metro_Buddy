import React from 'react';
import { LineColor } from '@/types/route';
import styles from './RouteLine.module.css';

interface RouteLineProps {
    lineColor: LineColor;
    startStation: string;
    destinationStation: string;
    totalStops: number;
    transferRequired: boolean;
}

export default function RouteLine({
    lineColor,
    startStation,
    destinationStation,
    totalStops,
    transferRequired
}: RouteLineProps) {
    const getLineColorClass = () => {
        switch (lineColor.toLowerCase()) {
            case 'blue': return styles.lineBlue;
            case 'red': return styles.lineRed;
            case 'green': return styles.lineGreen;
            case 'yellow': return styles.lineYellow;
            case 'purple': return styles.linePurple;
            default: return styles.lineBlue;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={`${styles.lineBadge} ${getLineColorClass()}`}>
                    {lineColor} Line
                </div>
                <div className={styles.stopCount}>
                    {totalStops} {totalStops === 1 ? 'stop' : 'stops'}
                </div>
            </div>

            <div className={styles.routeVisualization}>
                <div className={styles.station}>
                    <div className={`${styles.dot} ${styles.start}`}>🚉</div>
                    <div className={styles.stationName}>{startStation}</div>
                </div>

                <div className={`${styles.line} ${getLineColorClass()}`}>
                    <div className={styles.lineInner}></div>
                </div>

                {transferRequired && (
                    <>
                        <div className={styles.station}>
                            <div className={`${styles.dot} ${styles.transfer}`}>🔁</div>
                            <div className={styles.stationName}>Transfer</div>
                        </div>
                        <div className={`${styles.line} ${getLineColorClass()}`}>
                            <div className={styles.lineInner}></div>
                        </div>
                    </>
                )}

                <div className={styles.station}>
                    <div className={`${styles.dot} ${styles.end}`}>🏁</div>
                    <div className={styles.stationName}>{destinationStation}</div>
                </div>
            </div>
        </div>
    );
}
