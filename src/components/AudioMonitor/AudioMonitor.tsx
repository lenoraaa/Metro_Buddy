import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';

interface AudioMonitorProps {
    isListening: boolean;
    onToggle: () => void;
    label?: string;
}

export default function AudioMonitor({ isListening, onToggle, label = "Monitor Station Audio" }: AudioMonitorProps) {
    const [level, setLevel] = useState(0);

    // Simulated audio visualizer effect
    useEffect(() => {
        if (!isListening) {
            setLevel(0);
            return;
        }

        const interval = setInterval(() => {
            // Random bounce for demo purposes, in real app would link to AudioContext analyzer
            setLevel(Math.random() * 100);
        }, 100);

        return () => clearInterval(interval);
    }, [isListening]);

    return (
        <button
            onClick={onToggle}
            className={`
                relative overflow-hidden group w-full p-6 rounded-3xl transition-all duration-300
                ${isListening
                    ? 'bg-red-500 shadow-lg shadow-red-900/30 scale-[1.02]'
                    : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'}
            `}
        >
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`
                        p-3 rounded-full transition-colors
                        ${isListening ? 'bg-white text-red-600' : 'bg-white/10 text-slate-400'}
                    `}>
                        {isListening ? <Activity className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
                    </div>
                    <div className="text-left">
                        <h3 className={`text-lg font-bold ${isListening ? 'text-white' : 'text-slate-200'}`}>
                            {isListening ? "Listening to Announcements..." : label}
                        </h3>
                        <p className={`text-sm ${isListening ? 'text-red-100' : 'text-slate-400'}`}>
                            {isListening ? "AI is analyzing station audio" : "Tap to start audio intelligence"}
                        </p>
                    </div>
                </div>

                {isListening && (
                    <div className="flex gap-1 h-8 items-end">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div
                                key={i}
                                className="w-1 bg-white/80 rounded-full transition-all duration-75"
                                style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
                            ></div>
                        ))}
                    </div>
                )}
            </div>

            {/* Background Pulse Effect */}
            {isListening && (
                <div className="absolute inset-0 bg-red-600 animate-pulse opacity-20"></div>
            )}
        </button>
    );
}
