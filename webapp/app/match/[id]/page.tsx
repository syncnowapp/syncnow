"use client";

import { useState, useEffect, use, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Circle,
    Square,
    Triangle,
    Star,
    Diamond,
    Hexagon,
    Plus,
    Heart,
    Moon,
    Copy,
    Check,
    Zap,
    Clock,
    LogOut
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Define the shapes
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

type GameState = 'lobby' | 'sync' | 'transmission' | 'result';

function MatchContent({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [gameState, setGameState] = useState<GameState>('lobby');
    const [role, setRole] = useState<'transmitter' | 'receiver'>('transmitter');
    const [level, setLevel] = useState(3);
    const [timer, setTimer] = useState(0);
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [transmittedShape, setTransmittedShape] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const [isReady, setIsReady] = useState(false);
    const [partnerReady, setPartnerReady] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // SYNC LOGIC
    useEffect(() => {
        if (!isMounted) return;

        const syncKey = `match_${resolvedParams.id}_ready`;
        const dataKey = `match_${resolvedParams.id}_data`;

        const updateSync = () => {
            const currentReady = JSON.parse(localStorage.getItem(syncKey) || '{}');
            const currentData = JSON.parse(localStorage.getItem(dataKey) || '{}');

            if (role === 'transmitter') {
                setPartnerReady(!!currentReady.receiver);
                if (currentData.receiverChoice) {
                    setTransmittedShape(currentData.receiverChoice);
                    if (gameState === 'transmission') setGameState('result');
                }
            } else {
                setPartnerReady(!!currentReady.transmitter);
                if (currentData.transmitterChoice) setSelectedShape(currentData.transmitterChoice);
            }
        };

        const myReady = JSON.parse(localStorage.getItem(syncKey) || '{}');
        localStorage.setItem(syncKey, JSON.stringify({
            ...myReady,
            [role]: isReady
        }));

        const currentData = JSON.parse(localStorage.getItem(dataKey) || '{}');
        if (role === 'transmitter' && selectedShape) {
            localStorage.setItem(dataKey, JSON.stringify({ ...currentData, transmitterChoice: selectedShape }));
        } else if (role === 'receiver' && transmittedShape) {
            localStorage.setItem(dataKey, JSON.stringify({ ...currentData, receiverChoice: transmittedShape }));
        }

        const interval = setInterval(updateSync, 500);
        return () => clearInterval(interval);
    }, [isReady, role, isMounted, resolvedParams.id, selectedShape, transmittedShape, gameState]);

    // Initialize role and level
    useEffect(() => {
        setIsMounted(true);
        const urlRole = searchParams.get('role') as 'transmitter' | 'receiver';
        const urlLevel = parseInt(searchParams.get('level') || '3');
        const urlShape = searchParams.get('shape');

        if (urlRole) setRole(urlRole);
        if (urlLevel) setLevel(urlLevel);
        if (urlRole === 'transmitter' && urlShape) setSelectedShape(urlShape);
    }, [searchParams]);

    // Handle Start Logic
    useEffect(() => {
        if (gameState === 'lobby' && isReady && partnerReady) {
            setGameState('sync');
            setTimer(10);
        }
    }, [isReady, partnerReady, gameState]);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameState === 'sync' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (gameState === 'sync' && timer === 0) {
            setGameState('transmission');
            setTimer(30);
        } else if (gameState === 'transmission' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (gameState === 'transmission' && timer === 0) {
            setGameState('result');
        }
        return () => clearInterval(interval);
    }, [gameState, timer]);

    const toggleReady = () => {
        if (role === 'transmitter' && !selectedShape) return;
        setIsReady(!isReady);
    };

    const copyUrl = () => {
        let url = typeof window !== 'undefined' ? window.location.href : '';
        if (url.includes('role=transmitter')) {
            url = url.replace('role=transmitter', 'role=receiver');
        } else if (url.includes('role=receiver')) {
            url = url.replace('role=receiver', 'role=transmitter');
        }
        if (url.includes('&shape=')) {
            url = url.split('&shape=')[0];
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const availableShapes = SHAPES.slice(0, level);

    if (!isMounted) return <main className="page-container"><div className="text-primary animate-pulse font-black uppercase tracking-widest text-center">Sincronizzazione Protocollo...</div></main>;

    return (
        <main className="page-container">
            <header className="flex items-center justify-between mb-24 opacity-60 w-full max-w-6xl">
                <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-sm font-black tracking-[0.3em] uppercase">ID: {resolvedParams.id}</span>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="text-text-secondary hover:text-error transition-colors p-3 hover:bg-white/5 rounded-full"
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </header>

            <AnimatePresence mode="wait">
                {gameState === 'lobby' && (
                    <motion.div
                        key="lobby"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-20 w-full max-w-6xl"
                    >
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight">Lobby <span className="gold-text">Sincronizzazione</span></h2>
                            <p className="text-text-secondary text-xl font-medium">Stabilizzazione della connessione neurale in corso.</p>
                        </div>

                        <div className="w-full max-w-3xl glass-card flex flex-col items-center gap-10 p-12">
                            <div className="text-[12px] uppercase font-black tracking-[0.5em] text-primary/70">Link di Invito al Protocollo</div>
                            <div className="w-full flex items-center gap-6 bg-black/40 p-6 rounded-none border-2 border-white/10 shadow-inner">
                                <code className="flex-1 text-left text-sm font-bold truncate text-primary/90 tracking-wider overflow-hidden">
                                    {isMounted ? window.location.href.split('?')[0] + '?role=' + (role === 'transmitter' ? 'receiver' : 'transmitter') + '&level=' + level : 'Loading...'}
                                </code>
                                <button
                                    onClick={copyUrl}
                                    className="p-5 bg-primary text-white hover:bg-primary/80 transition-all shadow-[0_0_30px_rgba(76,40,224,0.4)] active:scale-90 flex-shrink-0"
                                    style={{ borderRadius: '0' }}
                                >
                                    {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        <div className="w-full space-y-12">
                            <div className="flex items-center gap-6 text-xs font-black uppercase tracking-[0.4em] text-text-secondary/40 px-10">
                                <div className="h-[2px] flex-1 bg-white/10" />
                                <span>Specifiche Sessione</span>
                                <div className="h-[2px] flex-1 bg-white/10" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="p-10 bg-white/5 border-2 border-white/10 text-center space-y-4 shadow-xl">
                                    <div className="text-[11px] uppercase text-text-secondary font-black tracking-widest">Ruolo Neurale</div>
                                    <div className="text-3xl font-black capitalize text-white tracking-tight">{role === 'transmitter' ? 'Trasmettitore' : 'Ricevitore'}</div>
                                </div>
                                <div className="p-10 bg-white/5 border-2 border-white/10 text-center space-y-4 shadow-xl">
                                    <div className="text-[11px] uppercase text-text-secondary font-black tracking-widest">Densità Livello</div>
                                    <div className="text-4xl font-black text-white">{level} FIGURE</div>
                                </div>
                                <div className="p-10 bg-primary/10 border-2 border-primary/20 text-center space-y-6 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                                    <div className="text-[11px] uppercase text-primary font-black tracking-widest">Connessione Tab</div>
                                    <div className="flex items-center justify-center gap-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className={`w-4 h-4 rounded-none ${isReady ? 'bg-success shadow-[0_0_20px_#22C55E]' : 'bg-white/10 animate-pulse'}`} />
                                            <span className="text-[10px] font-black uppercase text-white/40">TU</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className={`w-4 h-4 rounded-none ${partnerReady ? 'bg-success shadow-[0_0_20px_#22C55E]' : 'bg-white/10 animate-pulse'}`} />
                                            <span className="text-[10px] font-black uppercase text-white/40">SINC</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {role === 'transmitter' && selectedShape && (
                            <div className="w-full flex flex-col items-center gap-10 pt-10">
                                <div className="text-[12px] uppercase font-black tracking-[0.6em] text-primary">Figura Selezionata</div>
                                <div
                                    className="w-[35vmin] h-[35vmin] max-w-[280px] max-h-[280px] bg-white flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,255,255,0.1)] p-6"
                                    style={{ borderRadius: '0' }}
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon style={{ width: '85%', height: '85%' }} fill="currentColor" />;
                                    })()}
                                </div>
                                <button
                                    onClick={() => router.back()}
                                    className="text-[11px] font-black uppercase tracking-[0.4em] text-text-secondary hover:text-white transition-colors border-b-2 border-white/5 pb-2 mt-4"
                                >
                                    Modifica Configurazione
                                </button>
                            </div>
                        )}

                        <div className="w-full max-w-2xl mx-auto pt-20">
                            <button
                                onClick={toggleReady}
                                className={`w-full py-10 text-3xl tracking-[0.5em] font-black shadow-2xl uppercase transition-all duration-500 border-4 ${isReady
                                        ? "bg-primary border-primary text-white scale-95 opacity-50 shadow-none grayscale"
                                        : "bg-surface border-white/10 text-white hover:border-primary hover:text-primary hover:scale-[1.02]"
                                    }`}
                                style={{ borderRadius: '0' }}
                            >
                                {isReady ? "In Attesa..." : "Pronto"}
                            </button>
                        </div>
                    </motion.div>
                )}

                {gameState === 'sync' && (
                    <motion.div
                        key="sync"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-16"
                    >
                        <div className="relative w-80 h-80 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.2, 0.4, 0.2]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-primary rounded-none blur-[120px]"
                            />
                            <div className="text-[14rem] font-black tabular-nums gold-text relative z-10 leading-none">{timer}</div>
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            <h2 className="text-6xl font-black uppercase tracking-tighter text-white">Sincronizzazione</h2>
                            <p className="text-text-secondary italic text-2xl opacity-80 leading-relaxed font-medium">
                                “Svuota la mente. Elimina ogni distrazione. Concentrati sul partner.”
                            </p>
                        </div>
                    </motion.div>
                )}

                {gameState === 'transmission' && (
                    <motion.div
                        key="transmission"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center space-y-20 w-full"
                    >
                        <div className="flex items-center gap-6 text-primary bg-primary/10 px-10 py-6 border-2 border-primary/20 backdrop-blur-2xl">
                            <Clock className="w-8 h-8" />
                            <span className="font-black tabular-nums text-4xl tracking-tighter">{timer}S</span>
                        </div>

                        {role === 'transmitter' ? (
                            <div className="flex flex-col items-center space-y-12">
                                <div className="text-3xl font-black uppercase tracking-[0.6em] text-text-secondary">Trasmissione in Corso</div>
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-[85vmin] h-[85vmin] max-w-[800px] max-h-[800px] bg-white flex items-center justify-center text-black shadow-[0_0_150px_rgba(76,40,224,0.4)] p-12"
                                    style={{ borderRadius: '0' }}
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon style={{ width: '90%', height: '90%' }} fill="currentColor" />;
                                    })()}
                                </motion.div>
                                <p className="text-text-secondary text-xl font-medium italic opacity-60 mt-6 uppercase tracking-widest">Proietta questa immagine nel campo neurale.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-16 w-full">
                                <div className="text-3xl font-black uppercase tracking-[0.6em] text-text-secondary">Cosa Percepisci?</div>
                                <div className="grid grid-cols-2 gap-16 w-full max-w-5xl">
                                    {availableShapes.map((shape) => (
                                        <button
                                            key={shape.id}
                                            onClick={() => {
                                                setTransmittedShape(shape.id);
                                                setGameState('result');
                                            }}
                                            className={`aspect-square border-4 flex items-center justify-center transition-all p-8 ${transmittedShape === shape.id
                                                    ? "bg-primary border-primary shadow-[0_0_50px_rgba(76,40,224,0.5)] scale-105"
                                                    : "bg-white text-black border-transparent hover:scale-105 hover:shadow-2xl"
                                                }`}
                                            style={{ borderRadius: '0' }}
                                        >
                                            <shape.icon style={{ width: '85%', height: '85%' }} fill="currentColor" />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-text-secondary text-xl font-medium italic opacity-60 mt-10 uppercase tracking-widest">Scegli la figura che si è manifestata.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {gameState === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center space-y-20 w-full"
                    >
                        <div className="text-center space-y-8">
                            <h2 className="text-7xl font-black uppercase tracking-tighter">Risultato</h2>
                            <div className={`text-3xl font-black tracking-[0.5em] uppercase py-4 px-12 border-4 ${selectedShape === transmittedShape
                                    ? "bg-success/10 text-success border-success/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]"
                                    : "bg-error/10 text-error border-error/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]"
                                }`}>
                                {selectedShape === transmittedShape ? "Connessione Stabilita" : "Segnale Interrotto"}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-40">
                            <div className="text-center space-y-8">
                                <div className="text-[12px] uppercase font-black tracking-[0.6em] text-text-secondary">Trasmesso</div>
                                <div
                                    className="w-[50vmin] h-[50vmin] max-w-[320px] max-h-[320px] bg-white flex items-center justify-center text-black shadow-2xl p-8"
                                    style={{ borderRadius: '0' }}
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon style={{ width: '85%', height: '85%' }} fill="currentColor" />;
                                    })()}
                                </div>
                            </div>
                            <div className="text-center space-y-8">
                                <div className="text-[12px] uppercase font-black tracking-[0.6em] text-text-secondary">Ricevuto</div>
                                <div
                                    className={`w-[50vmin] h-[50vmin] max-w-[320px] max-h-[320px] flex items-center justify-center bg-white text-black shadow-2xl p-8 ${selectedShape === transmittedShape ? "border-[12px] border-success/40" : "border-[12px] border-error/40"
                                        }`}
                                    style={{ borderRadius: '0' }}
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === transmittedShape)?.icon || Circle;
                                        return transmittedShape ? <ShapeIcon style={{ width: '85%', height: '85%' }} fill="currentColor" /> : <div className="text-9xl font-black">?</div>;
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-10 pt-16 pb-20">
                            <button
                                onClick={() => {
                                    const syncKey = `match_${resolvedParams.id}_ready`;
                                    const dataKey = `match_${resolvedParams.id}_data`;
                                    localStorage.removeItem(syncKey);
                                    localStorage.removeItem(dataKey);
                                    setGameState('lobby');
                                    setIsReady(false);
                                    setTransmittedShape(null);
                                }}
                                className="bg-primary text-white py-8 text-3xl font-black tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-2xl"
                                style={{ borderRadius: '0' }}
                            >
                                DI NUOVO
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="bg-surface border-4 border-white/10 text-white py-8 text-3xl font-black tracking-[0.4em] uppercase hover:border-white transition-all"
                                style={{ borderRadius: '0' }}
                            >
                                HOME
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="mt-32 pt-10 border-t-2 border-white/5 flex flex-col md:flex-row justify-between gap-6 text-[11px] font-black tracking-[0.5em] uppercase text-text-secondary/20 pb-16">
                <div className="flex gap-6">
                    <span>SyncNow v0.1</span>
                    <span className="opacity-40 font-bold">Node: {resolvedParams.id}</span>
                </div>
                <span>Neural Synchronization Division</span>
            </footer>
        </main >
    );
}

export default function MatchPage(props: any) {
    return (
        <Suspense fallback={<main className="page-container"><div className="text-primary animate-pulse font-black uppercase tracking-[0.6em] text-center pt-40">Sincronizzazione Protocollo...</div></main>}>
            <MatchContent {...props} />
        </Suspense>
    );
}
