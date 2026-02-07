import React from 'react';
import { QrCode, Clock, MapPin, Scan, ArrowRight } from 'lucide-react';

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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white text-black w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center">
                {/* Header Card */}
                <div className="bg-gradient-to-br from-[#0057e7] to-[#003da5] w-full p-8 text-white text-center flex flex-col items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-full mb-2">
                        <Scan className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight uppercase">Single Journey</h2>
                    <div className="flex items-center gap-2 text-white/80 font-medium">
                        <Clock className="w-4 h-4" />
                        <span>Valid for 2 hours</span>
                    </div>
                </div>

                {/* Main Body */}
                <div className="p-8 w-full space-y-8 flex flex-col items-center">

                    {/* Journey Stats */}
                    <div className="flex w-full justify-between items-center relative py-2">
                        <div className="flex flex-col items-center gap-1 z-10 bg-white px-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">From</span>
                            <span className="text-xl font-black text-slate-800">{startStation}</span>
                        </div>

                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -z-0"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                            <ArrowRight className="text-slate-300 w-5 h-5" />
                        </div>

                        <div className="flex flex-col items-center gap-1 z-10 bg-white px-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">To</span>
                            <span className="text-xl font-black text-blue-600">{destination}</span>
                        </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="w-full flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-[40px] border border-slate-100">
                        <div className="p-4 bg-white rounded-3xl shadow-sm">
                            <QrCode className="w-40 h-40 text-slate-900" strokeWidth={1} />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">Scan at Entry Gate</p>
                            <div className="flex items-center justify-center gap-4 mt-2">
                                <span className="text-sm font-bold text-slate-500">{timestamp}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                <span className="text-sm font-bold text-slate-500">{date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Price Tag */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Fare</span>
                        <span className="text-4xl font-black text-slate-900">{cost}</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200"
                    >
                        Close Ticket
                    </button>
                </div>
            </div>
        </div>
    );
}
