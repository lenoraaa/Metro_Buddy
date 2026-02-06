'use client';

import React, { useState } from 'react';
import { Phone, AlertTriangle, X } from 'lucide-react';
import styles from './EmergencyButton.module.css';

export default function EmergencyButton() {
    const [isOpen, setIsOpen] = useState(false);

    const handleHelp = () => {
        setIsOpen(true);
        // Play audio immediately
        speak("I need help reaching my destination. Please assist me.");
    };

    const speak = (text: string) => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <>
            <button
                className={styles.floatButton}
                onClick={handleHelp}
                aria-label="Emergency Help"
            >
                <div className={styles.innerPulse}></div>
                <AlertTriangle size={24} />
                <span className={styles.label}>HELP</span>
            </button>

            {isOpen && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.header}>
                            <h2>🆘 Emergency Help</h2>
                            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.content}>
                            <p className={styles.audioMessage}>
                                "I need help reaching my destination."
                            </p>

                            <div className={styles.actions}>
                                <button className={styles.actionBtn} onClick={() => speak("I need help.")}>
                                    🔊 Play Audio Again
                                </button>

                                <a href="tel:1234567890" className={`${styles.actionBtn} ${styles.callBtn}`}>
                                    <Phone size={20} />
                                    Call Metro Help
                                </a>
                            </div>

                            <div className={styles.offlineNote}>
                                <p>✅ Works Offline</p>
                                <small>Show this screen to any station staff.</small>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
