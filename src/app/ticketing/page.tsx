'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, ShoppingCart, ArrowLeft, Loader2, Scan } from 'lucide-react';
import Link from 'next/link';
import VoiceInput from '@/components/VoiceInput/VoiceInput';
import { analyzeImage, getDemoStations } from '@/services/ai-service';
import DigitalTicket from '@/components/Ticketing/DigitalTicket';
import styles from './TicketingPage.module.css';

export default function TicketingPage() {
    const webcamRef = useRef<Webcam>(null);
    const [mounted, setMounted] = useState(false);
    const [mode, setMode] = useState<'vision' | 'online' | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [visionResult, setVisionResult] = useState<string | null>(null);
    const [showTicket, setShowTicket] = useState(false);

    // Online Ticket State
    const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
    const [startStation, setStartStation] = useState('Central');

    // Prevent hydration mismatch & Handle URL mode
    useEffect(() => {
        setMounted(true);

        const params = new URLSearchParams(window.location.search);
        const urlMode = params.get('mode') as 'vision' | 'online' | null;
        if (urlMode === 'vision' || urlMode === 'online') {
            setMode(urlMode);
        }
    }, []);

    const stations = getDemoStations();

    const mapVoiceToStation = (text: string) => {
        const lower = text.toLowerCase();
        const matched = stations.find(s => lower.includes(s.name.toLowerCase()));
        return matched ? matched.name : null;
    };

    const captureAndAnalyze = useCallback(async () => {
        if (!webcamRef.current) return;

        setIsAnalyzing(true);
        setVisionResult(null);

        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                const prompt = `You are helping a DYSLEXIC user who CANNOT READ EASILY. 
Look at this ticket machine screen.

CRITICAL INSTRUCTIONS:
1. If you see a LIST OF DESTINATIONS or STATION NAMES, read them out ONE BY ONE with their position number.
   Format: "Number 1: [Station Name]. Number 2: [Station Name]." etc.
2. If you see BUTTONS (like Green/Blue/Confirm), say which button to press.
3. Use SIMPLE words. NO complex sentences.
4. Be CLEAR and SLOW-PACED in your description.

Example: "Number 1: Central Station. Number 2: Airport. Number 3: Park Street. Then press the green Confirm button."`;
                const result = await analyzeImage(imageSrc, prompt);
                setVisionResult(result);
            }
        } catch (error) {
            console.error('Analysis failed', error);
            setVisionResult("Could not see clearly. Try again.");
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    // Auto-speak vision result for dyslexic users
    useEffect(() => {
        if (visionResult && typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(visionResult);
            utterance.rate = 0.85; // Slower for clarity
            window.speechSynthesis.speak(utterance);
        }
    }, [visionResult]);

    const handleBuyOnline = (dest: string) => {
        setSelectedDestination(dest);
        setShowTicket(true);
    };

    if (!mounted) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (showTicket && selectedDestination) {
        return (
            <DigitalTicket
                startStation={startStation}
                destination={selectedDestination}
                cost="$2.00"
                onClose={() => {
                    setShowTicket(false);
                    setMode(null);
                }}
            />
        );
    }

    return (
        <div className={styles.container}>
            {/* Background Decorations */}
            <div className={styles.decorations}>
                <div className={styles.glowBlue}></div>
                <div className={styles.glowGreen}></div>
            </div>

            <header className={styles.header}>
                <Link href="/" className={styles.backBtn}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 className={styles.title}>Ticket Assistant</h1>
                <div style={{ width: 44 }}></div>
            </header>

            <main className={styles.main}>
                {!mode ? (
                    <div className={styles.modeSelection}>
                        <div className={styles.welcomeText}>
                            <p>How can I help you today?</p>
                            <div className={styles.divider}></div>
                        </div>

                        <button onClick={() => setMode('vision')} className={styles.visionBtn}>
                            <div className={styles.iconWrapper}>
                                <Scan size={32} />
                            </div>
                            <div className={styles.btnText}>
                                <span className={styles.btnTitle}>Help Me Buy</span>
                                <span className={styles.btnSubtitle}>Point camera at machine screen</span>
                            </div>
                        </button>

                        <button onClick={() => setMode('online')} className={styles.onlineBtn}>
                            <div className={styles.emojiWrapper}>🎟️🛒</div>
                            <div style={{ textAlign: 'center' }}>
                                <span className={styles.onlineBtnTitle}>Buy Ticket Online</span>
                                <p className={styles.onlineBtnSubtitle}>Skip the line • Get it now</p>
                            </div>
                        </button>
                    </div>
                ) : mode === 'online' ? (
                    <div className={styles.formContainer}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Plan Your Journey</h2>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>
                                    <span className={styles.dot} style={{ background: '#3b82f6' }}></span>
                                    From (Source)
                                </label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        className={styles.select}
                                        value={startStation}
                                        onChange={(e) => setStartStation(e.target.value)}
                                    >
                                        {stations.map(s => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                    <div className={styles.voiceBtn}>
                                        <VoiceInput onSpeechResult={(text) => setStartStation(mapVoiceToStation(text) || text)} />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>
                                    <span className={styles.dot} style={{ background: '#10b981' }}></span>
                                    To (Destination)
                                </label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        className={styles.select}
                                        value={selectedDestination || ''}
                                        onChange={(e) => setSelectedDestination(e.target.value)}
                                    >
                                        <option value="">Select Destination...</option>
                                        {stations
                                            .filter(s => s.name !== startStation)
                                            .map(s => (
                                                <option key={s.id} value={s.name}>{s.name} ($2.00)</option>
                                            ))}
                                    </select>
                                    <div className={styles.voiceBtn}>
                                        <VoiceInput onSpeechResult={(text) => {
                                            const lowerText = text.toLowerCase();
                                            const matched = stations
                                                .filter(s => s.name !== startStation)
                                                .find(s => lowerText.includes(s.name.toLowerCase()));
                                            if (matched) setSelectedDestination(matched.name);
                                        }} />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowTicket(true)}
                                disabled={!selectedDestination}
                                className={styles.submitBtn}
                            >
                                <ShoppingCart size={24} />
                                BUY TICKET NOW
                            </button>

                            <center>
                                <button onClick={() => setMode(null)} className={styles.cancelBtn}>
                                    Cancel and go back
                                </button>
                            </center>
                        </div>
                    </div>
                ) : (
                    <div className={styles.visionContainer}>
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: 'environment' }}
                            className={styles.webcam}
                        />

                        <div className={styles.visionOverlay}>
                            <div className={styles.guide}></div>
                        </div>

                        <div className={styles.visionControls}>
                            {visionResult ? (
                                <div className={styles.card} style={{ background: '#3b82f6', border: 'none' }}>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{visionResult}</p>
                                    <button onClick={() => setVisionResult(null)} className={styles.scanAgain}>
                                        SCAN AGAIN
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={captureAndAnalyze}
                                    disabled={isAnalyzing}
                                    className={styles.captureBtn}
                                >
                                    {isAnalyzing ? <Loader2 size={40} className="animate-spin" /> : <Camera size={40} />}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
