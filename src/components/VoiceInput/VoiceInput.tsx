'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import styles from './VoiceInput.module.css';

interface VoiceInputProps {
    onSpeechResult: (text: string) => void;
    placeholder?: string;
}

export default function VoiceInput({ onSpeechResult, placeholder = "Tap to speak" }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any | null>(null);
    const callbackRef = useRef(onSpeechResult);

    // Keep the ref updated with the latest callback
    useEffect(() => {
        callbackRef.current = onSpeechResult;
    }, [onSpeechResult]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const reco = new SpeechRecognition();
                reco.continuous = false;
                reco.interimResults = false;
                reco.lang = 'en-US';

                reco.onstart = () => setIsListening(true);
                reco.onend = () => setIsListening(false);
                reco.onresult = (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
                    const transcript = event.results[0][0].transcript;
                    console.log('Voice Input:', transcript);
                    callbackRef.current(transcript); // Use the ref here
                };

                setRecognition(reco);
            }
        }
        // removing onSpeechResult from deps makes this only run once
    }, []);

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
