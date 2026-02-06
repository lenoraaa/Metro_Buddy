'use client';

import React, { useEffect, useState } from 'react';
import styles from './DyslexiaSettings.module.css';
import { Type, Sun, Volume2, X } from 'lucide-react';

export default function DyslexiaSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState({
        fontFamily: 'default',
        highContrast: false,
        fontSize: 'medium',
        speechRate: 1.0,
    });

    useEffect(() => {
        const saved = localStorage.getItem('dyslexia-settings');
        if (saved) {
            const parsed = JSON.parse(saved);
            setSettings(parsed);
            applySettings(parsed);
        }
    }, []);

    const applySettings = (newSettings: typeof settings) => {
        const root = document.documentElement;

        // Font Family
        if (newSettings.fontFamily === 'opendyslexic') {
            root.style.setProperty('--font-family-main', '"OpenDyslexic", sans-serif');
        } else if (newSettings.fontFamily === 'comicsans') {
            root.style.setProperty('--font-family-main', '"Comic Sans MS", "Comic Sans", cursive');
        } else {
            root.style.setProperty('--font-family-main', 'var(--font-inter)');
        }

        // High Contrast
        if (newSettings.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Font Size
        if (newSettings.fontSize === 'large') {
            root.style.setProperty('--base-font-size', '20px');
        } else if (newSettings.fontSize === 'xlarge') {
            root.style.setProperty('--base-font-size', '24px');
        } else {
            root.style.setProperty('--base-font-size', '16px');
        }

        localStorage.setItem('dyslexia-settings', JSON.stringify(newSettings));
    };

    const updateSetting = (key: keyof typeof settings, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        applySettings(newSettings);
    };

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                className={styles.fab}
                onClick={toggleOpen}
                aria-label="Accessability Settings"
            >
                <Type size={24} />
            </button>

            {isOpen && (
                <div className={styles.overlay} onClick={toggleOpen}>
                    <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.header}>
                            <h3>Accessibility</h3>
                            <button onClick={toggleOpen} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.section}>
                            <label className={styles.label}>
                                <Type size={18} /> Font Style
                            </label>
                            <div className={styles.buttonGroup}>
                                <button
                                    className={settings.fontFamily === 'default' ? styles.active : ''}
                                    onClick={() => updateSetting('fontFamily', 'default')}
                                >
                                    Default
                                </button>
                                <button
                                    className={settings.fontFamily === 'opendyslexic' ? styles.active : ''}
                                    onClick={() => updateSetting('fontFamily', 'opendyslexic')}
                                    style={{ fontFamily: 'OpenDyslexic, sans-serif' }}
                                >
                                    Dyslexic
                                </button>
                                <button
                                    className={settings.fontFamily === 'comicsans' ? styles.active : ''}
                                    onClick={() => updateSetting('fontFamily', 'comicsans')}
                                    style={{ fontFamily: '"Comic Sans MS", cursive' }}
                                >
                                    Comic
                                </button>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <label className={styles.label}>
                                <Sun size={18} /> Contrast
                            </label>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={settings.highContrast}
                                    onChange={(e) => updateSetting('highContrast', e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                                <span className={styles.switchText}>High Contrast Mode</span>
                            </label>
                        </div>

                        <div className={styles.section}>
                            <label className={styles.label}>
                                <Type size={18} /> Text Size
                            </label>
                            <div className={styles.buttonGroup}>
                                <button
                                    className={settings.fontSize === 'medium' ? styles.active : ''}
                                    onClick={() => updateSetting('fontSize', 'medium')}
                                >
                                    Normal
                                </button>
                                <button
                                    className={settings.fontSize === 'large' ? styles.active : ''}
                                    onClick={() => updateSetting('fontSize', 'large')}
                                >
                                    Large
                                </button>
                                <button
                                    className={settings.fontSize === 'xlarge' ? styles.active : ''}
                                    onClick={() => updateSetting('fontSize', 'xlarge')}
                                >
                                    Extra
                                </button>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <label className={styles.label}>
                                <Volume2 size={18} /> Audio Speed
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="2.0"
                                step="0.1"
                                value={settings.speechRate}
                                onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
                                className={styles.range}
                            />
                            <div className={styles.rangeLabels}>
                                <span>Slower</span>
                                <span>{settings.speechRate}x</span>
                                <span>Faster</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
