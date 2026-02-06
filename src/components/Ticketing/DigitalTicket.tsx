import React from 'react';
import { QrCode, Clock, MapPin } from 'lucide-react';

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
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white text-black w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-[#0057e7] p-6 text-white text-center relative">
                    <h2 className="text-2xl font-bold mb-1">Single Journey</h2>
                    <p className="opacity-90">Valid for 2 hours</p>
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500"></div>
                </div>

                {/* Ticket Details */}
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center text-lg">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm mb-1">FROM</span>
                            <span className="font-bold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#0057e7]" />
                                {startStation}
                            </span>
                        </div>
                        <div className="text-gray-300">➜</div>
                        <div className="flex flex-col items-end">
                            <span className="text-gray-500 text-sm mb-1">TO</span>
                            <span className="font-bold flex items-center gap-2">
                                {destination}
                                <MapPin className="w-4 h-4 text-[#d62d20]" />
                            </span>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                        <QrCode className="w-48 h-48 text-black opacity-90" strokeWidth={1.5} />
                        <p className="text-gray-500 text-sm mt-3 font-mono tracking-widest">SCAN AT GATE</p>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">{timestamp}</span>
                        </div>
                        <div className="text-xl font-bold text-[#008744]">{cost}</div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-black text-white p-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
                    >
                        Close Ticket
                    </button>
                </div>
            </div>
        </div>
    );
}
