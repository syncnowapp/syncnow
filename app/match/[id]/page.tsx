"use client";

import { useState, useEffect, use } from "react";
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
import { useRouter } from "next/navigation";

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

export default function MatchPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [gameState, setGameState] = useState<GameState>('lobby');
    const [role, setRole] = useState<'transmitter' | 'receiver'>('transmitter');
    const [level, setLevel] = useState(3);
    const [timer, setTimer] = useState(0);
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [transmittedShape, setTransmittedShape] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const [isReady, setIsReady] = useState(false);
    const [partnerReady, setPartnerReady] = useState(false); // Mock for peer status

    // Initialize role and level from URL (in a real app this would come from the database/lobby)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const urlRole = urlParams.get('role') as 'transmitter' | 'receiver';
            const urlLevel = parseInt(urlParams.get('level') || '3');
            if (urlRole) setRole(urlRole);
            setLevel(urlLevel);
        }
    }, []);

    // Mock auto-ready partner for demo purposes (after 3 seconds)
    useEffect(() => {
        if (gameState === 'lobby') {
            const timer = setTimeout(() => setPartnerReady(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [gameState]);

    // Handle Ready Check Logic
    useEffect(() => {
        if (gameState === 'lobby' && isReady && partnerReady) {
            // Start flow: Sync Phase
            setGameState('sync');
            setTimer(10);
        }
    }, [isReady, partnerReady, gameState]);

    // Mock Timer Logic
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
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const availableShapes = SHAPES.slice(0, level);

    return (
        <main className="min-h-screen flex flex-col p-6 max-w-2xl mx-auto w-full">
            {/* Header */}
            <header className="flex items-center justify-between mb-8 opacity-60">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold tracking-widest uppercase">ID: {resolvedParams.id}</span>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="text-text-secondary hover:text-error transition-colors p-2"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            <AnimatePresence mode="wait">
                {/* LOBBY STATE */}
                {gameState === 'lobby' && (
                    <motion.div
                        key="lobby"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">In attesa del <span className="gold-text">Partner</span></h2>
                            <p className="text-text-secondary">Invia il link al ricevitore per iniziare l'esperimento.</p>
                        </div>

                        <div className="w-full glass-card flex items-center gap-4 p-4">
                            <code className="flex-1 text-left text-sm truncate opacity-60">
                                {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
                            </code>
                            <button
                                onClick={copyUrl}
                                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                title="Copia Link"
                            >
                                {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="w-full space-y-4 pt-12">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-text-secondary/50">
                                <div className="h-px flex-1 bg-white/10" />
                                <span>Riepilogo Configurazione</span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                                    <div className="text-[10px] uppercase text-text-secondary mb-1 tracking-widest">Livello Selezionato</div>
                                    <div className="text-2xl font-black text-primary">{level} Forme</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <div className="text-[10px] uppercase text-text-secondary mb-1 tracking-widest">Il tuo Ruolo</div>
                                    <div className="text-2xl font-black capitalize">{role === 'transmitter' ? 'Trasmettitore' : 'Ricevitore'}</div>
                                </div>
                            </div>
                        </div>

                        {role === 'transmitter' && (
                            <div className="w-full space-y-6 pt-8">
                                <p className="text-sm font-medium">Scegli la forma da trasmettere:</p>
                                <div className="grid grid-cols-3 gap-4">
                                    {availableShapes.map((shape) => (
                                        <button
                                            key={shape.id}
                                            onClick={() => {
                                                setSelectedShape(shape.id);
                                                setIsReady(false); // Reset ready if shape changes
                                            }}
                                            className={`aspect-square rounded-2xl border flex items-center justify-center transition-all ${selectedShape === shape.id
                                                ? "bg-primary text-black border-primary scale-105"
                                                : "bg-white text-black border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            <shape.icon className="w-12 h-12" fill="currentColor" />
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest px-2">
                                        <span className={isReady ? "text-success" : "text-text-secondary"}>
                                            Tu: {isReady ? "PRONTO" : "NON PRONTO"}
                                        </span>
                                        <span className={partnerReady ? "text-success" : "text-text-secondary"}>
                                            Partner: {partnerReady ? "PRONTO" : "IN ATTESA"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={toggleReady}
                                        disabled={!selectedShape}
                                        className={`btn-primary w-full py-5 ${isReady ? "opacity-50" : ""}`}
                                    >
                                        {isReady ? "Annulla Pronto" : "Sono Pronto"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {role === 'receiver' && (
                            <div className="w-full space-y-8 pt-12">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="text-center space-y-2">
                                        <h2 className="text-2xl font-bold">Sei il <span className="gold-text">Ricevitore</span></h2>
                                        <p className="text-text-secondary text-sm">Preparati a ricevere la trasmissione mentale.</p>
                                    </div>

                                    <div className="w-full glass-card space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                                <div className="text-[10px] uppercase text-text-secondary mb-1">Livello</div>
                                                <div className="font-bold">{level} Forme</div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                                <div className="text-[10px] uppercase text-text-secondary mb-1">Trasmettitore</div>
                                                <div className="font-bold text-primary">{partnerReady ? "PRONTO" : "IN ATTESA"}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest px-2">
                                                <span className={isReady ? "text-success" : "text-text-secondary"}>
                                                    Tu: {isReady ? "PRONTO" : "NON PRONTO"}
                                                </span>
                                            </div>
                                            <button
                                                onClick={toggleReady}
                                                className={`btn-primary w-full py-5 ${isReady ? "opacity-50" : ""}`}
                                            >
                                                {isReady ? "Sono Pronto" : "Clicca quando sei pronto"}
                                            </button>
                                        </div>
                                    </div>

                                    {!partnerReady && (
                                        <p className="text-xs text-text-secondary italic animate-pulse">
                                            In attesa che il trasmettitore selezioni la forma...
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* SYNC PHASE */}
                {gameState === 'sync' && (
                    <motion.div
                        key="sync"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-12"
                    >
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.3, 0.1]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-primary rounded-full blur-3xl"
                            />
                            <div className="text-6xl font-black tabular-nums gold-text relative z-10">{timer}</div>
                        </div>

                        <div className="space-y-4 max-w-xs">
                            <h2 className="text-2xl font-bold uppercase tracking-tighter">Sincronizzazione</h2>
                            <p className="text-text-secondary italic">
                                “Rilassati. Svuota la mente. Mantieni la connessione con il tuo partner.”
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* TRANSMISSION ACTIVE */}
                {gameState === 'transmission' && (
                    <motion.div
                        key="transmission"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center space-y-12 w-full"
                    >
                        <div className="flex items-center gap-4 text-primary bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
                            <Clock className="w-5 h-5" />
                            <span className="font-bold tabular-nums text-xl">{timer}s</span>
                        </div>

                        {role === 'transmitter' ? (
                            <div className="flex flex-col items-center space-y-8">
                                <div className="text-xs uppercase font-bold tracking-[0.3em] text-text-secondary">Stai trasmettendo:</div>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-48 h-48 rounded-3xl bg-white flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon className="w-24 h-24" fill="currentColor" />;
                                    })()}
                                </motion.div>
                                <p className="text-text-secondary text-sm italic">Mantieni l'immagine fissa nella tua mente.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-8 w-full">
                                <div className="text-xs uppercase font-bold tracking-[0.3em] text-text-secondary">Cosa percepisci?</div>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    {availableShapes.map((shape) => (
                                        <button
                                            key={shape.id}
                                            onClick={() => setTransmittedShape(shape.id)}
                                            className={`aspect-video rounded-2xl border flex items-center justify-center transition-all ${transmittedShape === shape.id
                                                ? "bg-primary text-black border-primary"
                                                : "bg-white text-black border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            <shape.icon className="w-10 h-10" fill="currentColor" />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-text-secondary text-sm italic">Scegli la forma che emerge spontaneamente.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* RESULT STATE */}
                {gameState === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col items-center justify-center space-y-12"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-bold">Risultato</h2>
                            <div className={`text-xl font-bold tracking-widest uppercase ${selectedShape === transmittedShape ? "text-success" : "text-error"
                                }`}>
                                {selectedShape === transmittedShape ? "Connessione Riuscita" : "Segnale Debole"}
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-center space-y-4">
                                <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Trasmesso</div>
                                <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center text-black">
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon className="w-12 h-12" fill="currentColor" />;
                                    })()}
                                </div>
                            </div>
                            <div className="h-px w-8 bg-white/10" />
                            <div className="text-center space-y-4">
                                <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Ricevuto</div>
                                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center bg-white text-black ${selectedShape === transmittedShape ? "border-2 border-success/50" : "border-2 border-error/50"
                                    }`}>
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === transmittedShape)?.icon || Circle;
                                        return transmittedShape ? <ShapeIcon className="w-12 h-12" fill="currentColor" /> : <div className="text-2xl font-black">?</div>;
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4">
                            <button
                                onClick={() => {
                                    setGameState('lobby');
                                    setSelectedShape(null);
                                    setTransmittedShape(null);
                                }}
                                className="btn-primary"
                            >
                                Gioca Ancora
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="btn-secondary"
                            >
                                Torna alla Home
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="mt-auto pt-8 border-t border-white/5 flex justify-between text-[10px] font-bold tracking-widest uppercase text-text-secondary/40">
                <span>SyncNow v0.1</span>
                <span>Experimental Protocol</span>
            </footer>
        </main>
    );
}
