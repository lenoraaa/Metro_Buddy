import React from 'react';
import { QrCode, Clock, Scan, ArrowRight, User, ShieldCheck } from 'lucide-react';

interface DigitalTicketProps {
    startStation: string;
    destination: string;
    cost: string;
    onClose: () => void;
}

export default function DigitalTicket({ startStation, destination, cost, onClose }: DigitalTicketProps) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = new Date().toLocaleDateString();

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '40px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Visual Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #0057e7 0%, #003da5 100%)',
                    padding: '40px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '100px',
                        height: '100px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%'
                    }} />

                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        padding: '12px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(10px)',
                        marginBottom: '8px'
                    }}>
                        <Scan style={{ color: 'white', width: '32px', height: '32px' }} />
                    </div>

                    <h2 style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        margin: 0
                    }}>Metro Pass</h2>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        <Clock style={{ width: '16px', height: '16px' }} />
                        <span>Valid for 120 Minutes</span>
                    </div>
                </div>

                {/* Main Body */}
                <div style={{
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '32px'
                }}>

                    {/* Pictorial Route - Stylized */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px',
                        width: '100%'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                border: '1px solid #e2e8f0'
                            }}>
                                📍
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                                {startStation}
                            </span>
                        </div>

                        <div style={{
                            flex: 1,
                            height: '4px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '2px',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: '50%',
                                background: 'linear-gradient(to right, #0057e7, #10b981)',
                                borderRadius: '2px'
                            }} />
                            <ArrowRight style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'white',
                                padding: '4px',
                                color: '#cbd5e1',
                                width: '24px',
                                height: '24px'
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                backgroundColor: '#ecfdf5',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                border: '1px solid #d1fae5'
                            }}>
                                🏁
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase' }}>
                                {destination}
                            </span>
                        </div>
                    </div>

                    {/* QR Code Scan Zone */}
                    <div style={{
                        width: '100%',
                        backgroundColor: '#f8fafc',
                        padding: '24px',
                        borderRadius: '32px',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Scanning Bar Animation simulated with persistent bar */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '10%',
                            width: '80%',
                            height: '2px',
                            background: 'rgba(59, 130, 246, 0.5)',
                            boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)',
                            zIndex: 5
                        }} />

                        <div style={{
                            backgroundColor: 'white',
                            padding: '16px',
                            borderRadius: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <QrCode style={{ width: '160px', height: '160px', color: '#0f172a' }} strokeWidth={1.5} />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{
                                margin: 0,
                                fontSize: '10px',
                                fontWeight: '900',
                                letterSpacing: '3px',
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                marginBottom: '8px'
                            }}>Scan at Entry Gate</p>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#64748b'
                            }}>
                                <span>{timestamp}</span>
                                <div style={{ width: '4px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '50%' }} />
                                <span>{date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info & Price */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Total Fare
                        </span>
                        <div style={{
                            fontSize: '42px',
                            fontWeight: '900',
                            color: '#0f172a',
                            letterSpacing: '-1px'
                        }}>
                            {cost}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '20px',
                            backgroundColor: '#0f172a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '18px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ShieldCheck style={{ width: '20px', height: '20px' }} />
                        DONE
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
