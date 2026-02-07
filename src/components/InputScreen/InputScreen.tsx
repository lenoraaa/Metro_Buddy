'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Ticket } from 'lucide-react';
import BigButton from '@/components/BigButton/BigButton';
import VoiceInput from '@/components/VoiceInput/VoiceInput';
import AudioAnimation from '@/components/AudioAnimation/AudioAnimation';
import { getDemoStations } from '@/services/ai-service';
import styles from './InputScreen.module.css';

interface InputScreenProps {
    onSubmit: (startStation: string, destinationStation: string) => void;
}

// Mock coordinates for demo
const STATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'Central': { lat: 22.5726, lng: 88.3639 },
    'Park Street': { lat: 22.555, lng: 88.35 },
    'Riverside': { lat: 22.58, lng: 88.34 },
    'Downtown': { lat: 22.56, lng: 88.35 },
    'Airport': { lat: 22.64, lng: 88.44 },
    'Junction Station': { lat: 22.59, lng: 88.41 }
};

export default function InputScreen({ onSubmit }: InputScreenProps) {
    const [startStation, setStartStation] = useState('');
    const [destinationStation, setDestinationStation] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const stations = getDemoStations();

    // ... inside component
    const [confirmationStation, setConfirmationStation] = useState<{ name: string, landmark?: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Skip validation click for now, handled by confirm
    };

    const requestRoute = () => {
        if (startStation && destinationStation) {
            // Find destination details for confirmation
            const destDetails = stations.find(s => s.name === destinationStation);
            setConfirmationStation({
                name: destinationStation,
                landmark: destDetails?.landmark
            });

            // Speak confirmation WITHOUT emojis
            const cleanLandmark = destDetails?.landmark?.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() || '';
            const text = `You are going to ${destinationStation}. ${cleanLandmark}. Is this correct?`;
            speak(text);
        }
    };

    const confirmRoute = () => {
        setConfirmationStation(null);
        onSubmit(startStation, destinationStation);
    };

    const speak = (text: string) => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleVoiceInput = (text: string, field: 'start' | 'destination') => {
        // ... existing logic ...
        // (Keep existing voice logic, but maybe trigger confirm if destination?)
        const lowerText = text.toLowerCase();
        const match = stations.find(s =>
            lowerText.includes(s.name.toLowerCase()) ||
            s.name.toLowerCase().includes(lowerText)
        );

        if (match) {
            if (field === 'start') setStartStation(match.name);
            else {
                setDestinationStation(match.name);
                // Optional: Auto-trigger confirm? For now let user click 'Get Route'
            }
        } else {
            alert(`Could not find a station matching "${text}".`);
        }
    };

    // ... existing geolocation ...

    const handleGeolocation = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                // In a real app, calculate distance. 
                // For demo, we'll simulate finding "Central" after a delay
                setTimeout(() => {
                    setStartStation('Central');
                    setIsLocating(false);
                }, 1500);
            }, (error) => {
                console.error("Location error", error);

                // Fallback for demo if permission denied or error
                setTimeout(() => {
                    setStartStation('Central'); // Demo fallback
                    setIsLocating(false);
                }, 1000);
            });
        } else {
            alert("Geolocation is not supported by your browser");
            setIsLocating(false);
        }
    };

    const isValid = startStation && destinationStation && startStation !== destinationStation;

    return (
        <div className={styles.container}>
            {/* Confirmation Modal */}
            {confirmationStation && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        borderRadius: '24px',
                        padding: '40px',
                        maxWidth: '500px',
                        width: '90%',
                        border: '2px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '32px',
                            color: '#f1f5f9'
                        }}>Confirm Destination</h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '32px'
                        }}>
                            <span style={{ fontSize: '4rem' }}>🏁</span>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: '#3b82f6',
                                    marginBottom: '8px'
                                }}>{confirmationStation.name}</p>
                                <p style={{
                                    fontSize: '1.125rem',
                                    color: '#94a3b8'
                                }}>{confirmationStation.landmark}</p>
                            </div>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px'
                        }}>
                            <button
                                style={{
                                    padding: '16px 24px',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    borderRadius: '16px',
                                    border: '2px solid #ef4444',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onClick={() => setConfirmationStation(null)}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                            >
                                ❌ No
                            </button>
                            <button
                                style={{
                                    padding: '16px 24px',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    borderRadius: '16px',
                                    border: '2px solid #10b981',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                                }}
                                onClick={confirmRoute}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                ✅ Yes, Go!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.header}>
                {/* ... Keep header ... */}
                <h1 className={styles.title}>
                    <span className="gradient-text">Metro Route</span> Assistant
                </h1>
                <p className={styles.subtitle}>
                    Simple guidance for your journey
                </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); requestRoute(); }} className={styles.form}>

                {/* ... Keep inputs ... */}
                <div className={styles.inputGroup}>
                    <label htmlFor="start" className={styles.label}>
                        <span className={styles.icon}>📍</span>
                        FROM
                    </label>
                    <div className={styles.voiceFirstWrapper}>
                        <VoiceInput onSpeechResult={(text) => handleVoiceInput(text, 'start')} />
                        <div className={styles.selectSecondary}>
                            <select
                                id="start"
                                value={startStation}
                                onChange={(e) => setStartStation(e.target.value)}
                                className={styles.select}
                                required
                            >
                                <option value="">Select your station</option>
                                {stations.map((station) => (
                                    <option key={station.id} value={station.name}>
                                        {station.name} {station.landmark}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.locationButton}
                        onClick={handleGeolocation}
                        disabled={isLocating}
                    >
                        <MapPin size={18} />
                        {isLocating ? "Finding nearest station..." : "Use my current location"}
                    </button>
                </div>

                <div className={styles.arrow}>
                    <ArrowRight size={32} />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="destination" className={styles.label}>
                        <span className={styles.icon}>🏁</span>
                        TO
                    </label>
                    <div className={styles.voiceFirstWrapper}>
                        <VoiceInput onSpeechResult={(text) => handleVoiceInput(text, 'destination')} />
                        <div className={styles.selectSecondary}>
                            <select
                                id="destination"
                                value={destinationStation}
                                onChange={(e) => setDestinationStation(e.target.value)}
                                className={styles.select}
                                required
                            >
                                <option value="">Select your destination</option>
                                {stations.map((station) => (
                                    <option key={station.id} value={station.name}>
                                        {station.name} {station.landmark}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <BigButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={!isValid}
                    icon={<ArrowRight size={24} />}
                >
                    Get Route Guidance
                </BigButton>

            </form>

            <div className={styles.ticketSection}>
                <div className={styles.ticketGrid}>
                    <Link href="/ticketing?mode=vision" className={`${styles.ticketButton} ${styles.scanButton}`}>
                        <span className={styles.ticketEmoji}>📸</span>
                        <div className="flex flex-col items-center">
                            <span className={styles.ticketLabel}>Scan Machine</span>
                            <span className={styles.ticketDesc}>Use camera at station</span>
                        </div>
                    </Link>

                    <Link href="/ticketing?mode=online" className={`${styles.ticketButton} ${styles.buyButton}`}>
                        <span className={styles.ticketEmoji}>🛒</span>
                        <div className="flex flex-col items-center">
                            <span className={styles.ticketLabel}>Buy Online</span>
                            <span className={styles.ticketDesc}>Get digital ticket now</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* ... Demo note ... */}
            <div className={styles.demoNote}>
                <p>✨ AI Features Active</p>
                <p className={styles.demoText}>
                    Tip: Say "Central" or click "Use my current location"
                </p>
            </div>

            {/* Audio Animation */}
            <AudioAnimation isPlaying={isSpeaking} />
        </div >
    );
}
