'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import styles from './VoiceInput.module.css';

interface VoiceInputProps {
    onSpeechResult: (text: string) => void;
    placeholder?: string;
}

export default function VoiceInput({ onSpeechResult, placeholder = "Tap to speak" }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const reco = new SpeechRecognition();
                reco.continuous = false;
                reco.interimResults = false;
                reco.lang = 'en-US';

                reco.onstart = () => setIsListening(true);
                reco.onend = () => setIsListening(false);
                reco.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    console.log('Voice Input:', transcript);
                    onSpeechResult(transcript);
                };

                setRecognition(reco);
            }
        }
    }, [onSpeechResult]);

    const toggleListening = () => {
        if (!recognition) {
            alert("Voice input is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    return (
        <button
            type="button"
            className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Tap to speak"}
        >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
    );
}
