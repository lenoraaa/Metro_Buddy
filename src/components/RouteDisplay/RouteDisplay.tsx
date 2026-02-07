'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Activity } from 'lucide-react';
import { RouteData } from '@/types/route';
import StepCard from '@/components/StepCard/StepCard';
import RouteLine from '@/components/RouteLine/RouteLine';
import BigButton from '@/components/BigButton/BigButton';
import styles from './RouteDisplay.module.css';

interface RouteDisplayProps {
    routeData: RouteData;
    onBack: () => void;
}

export default function RouteDisplay({ routeData, onBack }: RouteDisplayProps) {
    const [currentStep, setCurrentStep] = useState(0);


    // Determine which data source to use (Rich or Legacy)
    const smartSteps = routeData.smart_steps;
    const hasSmartSteps = smartSteps && smartSteps.length > 0;
    const totalSteps = hasSmartSteps ? smartSteps.length : routeData.steps.length;

    // Auto-play audio when step changes
    useEffect(() => {
        let textToSpeak = '';
        if (hasSmartSteps) {
            textToSpeak = smartSteps[currentStep].audio_text;
        } else if (routeData.steps && routeData.steps[currentStep]) {
            textToSpeak = routeData.steps[currentStep];
        }

        if (textToSpeak) {
            speak(textToSpeak);
        }
    }, [currentStep, hasSmartSteps, smartSteps, routeData.steps]);

    const speak = (text: string) => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();

            // Get rate from settings
            const saved = localStorage.getItem('dyslexia-settings');
            let rate = 0.85;
            if (saved) {
                try { rate = JSON.parse(saved).speechRate || 0.85; } catch { }
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            window.speechSynthesis.cancel();
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            window.speechSynthesis.cancel();
            setCurrentStep(currentStep - 1);
        }
    };

    const handleReplay = () => {
        let textToSpeak = '';
        if (hasSmartSteps) {
            textToSpeak = smartSteps[currentStep].audio_text;
        } else if (routeData.steps && routeData.steps[currentStep]) {
            textToSpeak = routeData.steps[currentStep];
        }

        if (textToSpeak) {
            speak(textToSpeak);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>
                    <ArrowLeft size={24} />
                    <span>Back</span>
                </button>
                <h1 className={styles.title}>Your Route</h1>
            </header>

            <div className={styles.content}>
                {/* Only show AI Insight on first step or if requested? Keeping it always visible for now */}
                {routeData.ai_insight && (
                    <div className={styles.aiInsight}>
                        <div className={styles.aiIcon}>✨</div>
                        <p>{routeData.ai_insight}</p>
                    </div>
                )}

                <div className={styles.stepSection}>
                    <StepCard
                        step={hasSmartSteps ? smartSteps[currentStep] : undefined}
                        stepNumber={currentStep + 1}
                        totalSteps={totalSteps}
                        lineColor={routeData.line_color}
                        // Fallback props
                        instruction={hasSmartSteps ? smartSteps[currentStep].instruction : routeData.steps[currentStep]}
                        icon={hasSmartSteps ? smartSteps[currentStep].icon : routeData.visual_icons?.[currentStep]}
                    />

                    <div className={styles.navigation}>
                        <BigButton
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            variant="secondary"
                            icon={<ArrowLeft size={20} />}
                        >
                            Previous
                        </BigButton>

                        <BigButton
                            onClick={handleNext}
                            disabled={currentStep === totalSteps - 1}
                            variant="primary"
                            icon={<ArrowRight size={20} />}
                        >
                            {currentStep === totalSteps - 1 ? "Arrived!" : "Next Step"}
                        </BigButton>
                    </div>


                    {/* Audio Replay Button for Step */}
                    <button onClick={handleReplay} className={styles.replayButton}>
                        🔊 Replay Instructions
                    </button>
                </div>
            </div>
        </div>
    );
}
