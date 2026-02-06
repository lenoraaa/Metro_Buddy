'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import styles from './AudioController.module.css';

interface AudioControllerProps {
    audioScript: string[];
    autoPlay?: boolean;
}

export default function AudioController({ audioScript, autoPlay = false }: AudioControllerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSynthesis(window.speechSynthesis);
        }
    }, []);

    useEffect(() => {
        if (autoPlay && synthesis && audioScript.length > 0) {
            playAudio();
        }

        return () => {
            if (synthesis) {
                synthesis.cancel();
            }
        };
    }, [audioScript]);

    const speakText = (text: string, index: number) => {
        if (!synthesis) return;

        // Get speech rate from settings
        const saved = localStorage.getItem('dyslexia-settings');
        let rate = 0.85;
        if (saved) {
            try {
                rate = JSON.parse(saved).speechRate || 0.85;
            } catch (e) {
                console.error('Error parsing settings', e);
            }
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => {
            if (index < audioScript.length - 1) {
                setTimeout(() => {
                    setCurrentIndex(index + 1);
                    speakText(audioScript[index + 1], index + 1);
                }, 800); // Pause between sentences
            } else {
                setIsPlaying(false);
                setCurrentIndex(0);
            }
        };

        synthesis.speak(utterance);
    };

    const playAudio = () => {
        if (!synthesis || audioScript.length === 0) return;

        synthesis.cancel();
        setIsPlaying(true);
        setCurrentIndex(0);
        speakText(audioScript[0], 0);
    };

    const pauseAudio = () => {
        if (!synthesis) return;

        synthesis.cancel();
        setIsPlaying(false);
    };

    const replayAudio = () => {
        if (!synthesis) return;

        synthesis.cancel();
        setCurrentIndex(0);
        setIsPlaying(true);
        speakText(audioScript[0], 0);
    };

    return (
        <div className={styles.controller}>
            <div className={styles.controls}>
                <button
                    className={`${styles.button} ${styles.primary}`}
                    onClick={isPlaying ? pauseAudio : playAudio}
                    aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                    {isPlaying ? (
                        <>
                            <Pause size={24} />
                            <span>Pause</span>
                        </>
                    ) : (
                        <>
                            <Play size={24} />
                            <span>Play Instructions</span>
                        </>
                    )}
                </button>

                <button
                    className={`${styles.button} ${styles.secondary}`}
                    onClick={replayAudio}
                    disabled={isPlaying}
                    aria-label="Replay audio"
                >
                    <RotateCcw size={20} />
                    <span>Replay</span>
                </button>
            </div>

            {isPlaying && (
                <div className={styles.indicator}>
                    <div className={styles.waveform}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p className={styles.currentText}>{audioScript[currentIndex]}</p>
                </div>
            )}
        </div>
    );
}
