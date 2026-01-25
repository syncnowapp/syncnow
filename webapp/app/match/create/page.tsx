"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Target,
    Eye,
    Settings2,
    Circle,
    Square,
    Triangle,
    Star,
    Diamond,
    Hexagon,
    Plus,
    Heart,
    Moon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SHAPES = [
    { id: 'circle', icon: Circle },
    { id: 'square', icon: Square },
    { id: 'triangle', icon: Triangle },
    { id: 'star', icon: Star },
    { id: 'diamond', icon: Diamond },
    { id: 'hexagon', icon: Hexagon },
    { id: 'plus', icon: Plus },
    { id: 'heart', icon: Heart },
    { id: 'moon', icon: Moon },
];

export default function CreateMatch() {
    const router = useRouter();
    const [level, setLevel] = useState(3);
    const [role, setRole] = useState<"transmitter" | "receiver">("transmitter");
    const [selectedShape, setSelectedShape] = useState<string | null>(null);

    const handleCreate = () => {
        if (role === 'transmitter' && !selectedShape) return;

        const matchId = Math.random().toString(36).substring(7).toUpperCase();
        let targetUrl = `/match/${matchId}?role=${role}&level=${level}`;

        if (role === 'transmitter' && selectedShape) {
            targetUrl += `&shape=${selectedShape}`;
        }

        console.log("Redirecting to:", targetUrl);
        window.location.assign(targetUrl);
    };

    const availableShapes = SHAPES.slice(0, level);

    return (
        <main className="page-container py-20">
            <div className="max-w-xl mx-auto space-y-24">
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold tracking-widest uppercase text-xs">Torna alla Home</span>
                </Link>

                <div className="space-y-8">
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none">
                        CONFIGURA <br />
                        <span className="gold-text">PARTITA</span>
                    </h1>
                    <p className="text-text-secondary text-xl font-medium tracking-wide">
                        Inizializzazione dei parametri dell'esperimento telepatetico.
                    </p>
                </div>

                <div className="space-y-40 pb-40">
                    {/* Livello */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.5em] text-primary/80">
                            <Settings2 className="w-5 h-5" />
                            <span>1. Livello di difficoltà</span>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {[3, 6, 9].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => {
                                        setLevel(l);
                                        setSelectedShape(null);
                                    }}
                                    className={`p-10 border-4 transition-all duration-300 ${level === l
                                        ? "bg-primary border-primary text-white shadow-[0_0_40px_rgba(76,40,224,0.4)] scale-105"
                                        : "bg-surface border-white/5 text-text-secondary hover:border-white/20"
                                        }`}
                                    style={{ borderRadius: '0' }}
                                >
                                    <div className="text-4xl font-black leading-none">{l}</div>
                                    <div className="text-[10px] uppercase font-black tracking-[0.2em] mt-2">Forme</div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Ruolo */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.5em] text-primary/80">
                            <Users className="w-5 h-5" />
                            <span>2. Il tuo ruolo neurale</span>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <button
                                onClick={() => setRole("transmitter")}
                                className={`p-12 border-4 transition-all duration-300 flex flex-col items-center gap-8 ${role === "transmitter"
                                    ? "bg-primary border-primary text-white shadow-[0_0_40px_rgba(76,40,224,0.4)] scale-105"
                                    : "bg-surface border-white/5 text-text-secondary hover:border-white/20"
                                    }`}
                                style={{ borderRadius: '0' }}
                            >
                                <div className={`p-5 ${role === 'transmitter' ? 'bg-white/20' : 'bg-white/5'}`}>
                                    <Target className="w-10 h-10" />
                                </div>
                                <div className="text-center">
                                    <div className="font-black text-2xl uppercase tracking-widest">Trasmettitore</div>
                                    <div className={`text-[11px] uppercase font-black tracking-[0.3em] mt-3 ${role === 'transmitter' ? 'text-white/70' : 'opacity-40'}`}>Proiezione Mentale</div>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setRole("receiver");
                                    setSelectedShape(null);
                                }}
                                className={`p-12 border-4 transition-all duration-300 flex flex-col items-center gap-8 ${role === "receiver"
                                    ? "bg-primary border-primary text-white shadow-[0_0_40px_rgba(76,40,224,0.4)] scale-105"
                                    : "bg-surface border-white/5 text-text-secondary hover:border-white/20"
                                    }`}
                                style={{ borderRadius: '0' }}
                            >
                                <div className={`p-5 ${role === 'receiver' ? 'bg-white/20' : 'bg-white/5'}`}>
                                    <Eye className="w-10 h-10" />
                                </div>
                                <div className="text-center">
                                    <div className="font-black text-2xl uppercase tracking-widest">Ricevitore</div>
                                    <div className={`text-[11px] uppercase font-black tracking-[0.3em] mt-3 ${role === 'receiver' ? 'text-white/70' : 'opacity-40'}`}>Percezione Sensoriale</div>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Forma (Solo per Trasmettitore) */}
                    <AnimatePresence>
                        {role === 'transmitter' && (
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                className="space-y-16"
                            >
                                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.5em] text-primary/80">
                                    <Target className="w-5 h-5" />
                                    <span>3. Selezione della Forma Target</span>
                                </div>
                                <div className="grid grid-cols-3 gap-10">
                                    {availableShapes.map((shape) => (
                                        <button
                                            key={shape.id}
                                            type="button"
                                            onClick={() => setSelectedShape(shape.id)}
                                            className={`aspect-square flex items-center justify-center transition-all duration-300 p-8 border-4 ${selectedShape === shape.id
                                                ? "bg-primary border-primary shadow-[0_0_60px_rgba(76,40,224,0.5)] scale-110 z-10"
                                                : "bg-white text-black border-transparent hover:scale-105 hover:shadow-xl"
                                                }`}
                                            style={{ borderRadius: '0' }}
                                        >
                                            <shape.icon style={{ width: '90%', height: '90%' }} fill="currentColor" />
                                        </button>
                                    ))}
                                </div>
                                {selectedShape && (
                                    <div className="text-center space-y-4">
                                        <div className="h-px w-20 bg-primary/30 mx-auto" />
                                        <p className="text-sm text-primary animate-pulse font-black tracking-[0.8em] uppercase">
                                            MANIFESTAZIONE BLOCCATA
                                        </p>
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col items-center gap-16 pt-24 border-t-4 border-white/5">
                        <button
                            onClick={handleCreate}
                            disabled={role === 'transmitter' && !selectedShape}
                            className={`w-full md:w-[500px] py-12 text-4xl tracking-[0.5em] font-black uppercase transition-all duration-500 shadow-[0_30px_70px_rgba(76,40,224,0.4)] ${role === 'transmitter' && !selectedShape
                                    ? "bg-white/5 text-white/10 grayscale cursor-not-allowed opacity-30"
                                    : "bg-primary text-white hover:scale-105 active:scale-95"
                                }`}
                            style={{ borderRadius: '0' }}
                        >
                            CREA PARTITA
                        </button>
                        <div className="space-y-4 text-center">
                            <p className="text-[14px] text-text-secondary/60 uppercase font-black tracking-[0.6em] leading-relaxed">
                                TRANSMISSIONE <br /> PROTOCOLLO SINC
                            </p>
                            <div className="flex justify-center gap-4">
                                <div className="w-2 h-2 bg-primary/40 animate-ping" />
                                <div className="w-2 h-2 bg-primary/40 animate-ping delay-75" />
                                <div className="w-2 h-2 bg-primary/40 animate-ping delay-150" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Users({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
