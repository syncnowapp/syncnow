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

    // SYNC LOGIC (using localStorage for quick local testing between two tabs)
    useEffect(() => {
        if (!isMounted) return;

        const syncKey = `match_${resolvedParams.id}_ready`;
        const dataKey = `match_${resolvedParams.id}_data`;

        const updateSync = () => {
            const currentReady = JSON.parse(localStorage.getItem(syncKey) || '{}');
            const currentData = JSON.parse(localStorage.getItem(dataKey) || '{}');

            if (role === 'transmitter') {
                setPartnerReady(!!currentReady.receiver);
                // Sync receiver's choice to transmitter
                if (currentData.receiverChoice) {
                    setTransmittedShape(currentData.receiverChoice);
                    if (gameState === 'transmission') setGameState('result');
                }
            } else {
                setPartnerReady(!!currentReady.transmitter);
                // Sync transmitter's choice to receiver
                if (currentData.transmitterChoice) setSelectedShape(currentData.transmitterChoice);
            }
        };

        // Update when my state changes
        const myReady = JSON.parse(localStorage.getItem(syncKey) || '{}');
        localStorage.setItem(syncKey, JSON.stringify({
            ...myReady,
            [role]: isReady
        }));

        // Sync local choices to global
        const currentData = JSON.parse(localStorage.getItem(dataKey) || '{}');
        if (role === 'transmitter' && selectedShape) {
            localStorage.setItem(dataKey, JSON.stringify({ ...currentData, transmitterChoice: selectedShape }));
        } else if (role === 'receiver' && transmittedShape) {
            localStorage.setItem(dataKey, JSON.stringify({ ...currentData, receiverChoice: transmittedShape }));
        }

        // Listen for changes from other tabs
        const interval = setInterval(updateSync, 500);
        return () => clearInterval(interval);
    }, [isReady, role, isMounted, resolvedParams.id, selectedShape, transmittedShape]);

    // Initialize role and level
    useEffect(() => {
        setIsMounted(true);
        const urlRole = searchParams.get('role') as 'transmitter' | 'receiver';
        const urlLevel = parseInt(searchParams.get('level') || '3');
        if (urlRole) setRole(urlRole);
        setLevel(urlLevel);
    }, [searchParams]);

    // Handle Start Logic: ONLY when BOTH are ready
    useEffect(() => {
        if (gameState === 'lobby' && isReady && partnerReady) {
            console.log("Both ready! Starting Sync...");
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
        let url = typeof window !== 'undefined' ? window.location.href : '';

        // Flip the role for the invitation
        if (url.includes('role=transmitter')) {
            url = url.replace('role=transmitter', 'role=receiver');
        } else if (url.includes('role=receiver')) {
            url = url.replace('role=receiver', 'role=transmitter');
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => fallbackCopy(url));
        } else {
            fallbackCopy(url);
        }
    };

    const fallbackCopy = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    };

    const availableShapes = SHAPES.slice(0, level);

    if (!isMounted) return <main className="page-container"><div className="text-primary animate-pulse">Sincronizzazione...</div></main>;

    return (
        <main className="page-container">
            {/* Header */}
            <header className="flex items-center justify-between mb-8 opacity-60 w-full max-w-6xl">
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
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-12 w-full max-w-6xl"
                    >
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold">In attesa del <span className="gold-text">Partner</span></h2>
                            <p className="text-text-secondary">Invia il link al ricevitore per iniziare l'esperimento.</p>
                        </div>

                        <div className="w-full glass-card flex items-center gap-4 p-4">
                            <code className="flex-1 text-left text-sm truncate opacity-60">
                                {isMounted ? window.location.href : 'Loading...'}
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
                                <div className="grid grid-cols-3 gap-8">
                                    {availableShapes.map((shape) => (
                                        <button
                                            key={shape.id}
                                            type="button"
                                            onClick={() => {
                                                console.log("Selecting shape:", shape.id);
                                                setSelectedShape(shape.id);
                                                setIsReady(false); // Reset ready if shape changes
                                            }}
                                            className={`aspect-square rounded-2xl border flex items-center justify-center transition-all ${selectedShape === shape.id
                                                ? "bg-primary selected-shape"
                                                : "bg-white text-black border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            <shape.icon className="w-[20vmin] h-[20vmin] max-w-[150px] max-h-[150px]" fill="currentColor" />
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
                                        <h2 className="text-4xl md:text-5xl font-bold">Sei il <span className="gold-text">Ricevitore</span></h2>
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
                                className="absolute inset-0 bg-primary rounded-full blur-[100px] opacity-40"
                            />
                            <div className="text-8xl font-black tabular-nums gold-text relative z-10">{timer}</div>
                        </div>

                        <div className="space-y-4 max-w-xl">
                            <h2 className="text-5xl font-bold uppercase tracking-tighter">Sincronizzazione</h2>
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
                                <div className="text-2xl uppercase font-bold tracking-[0.3em] text-text-secondary">Stai trasmettendo:</div>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-[70vmin] h-[70vmin] max-w-[600px] max-h-[600px] rounded-[4rem] bg-white flex items-center justify-center text-black shadow-[0_0_100px_rgba(99,102,241,0.4)]"
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon className="w-[40vmin] h-[40vmin] max-w-[350px] max-h-[350px]" fill="currentColor" />;
                                    })()}
                                </motion.div>
                                <p className="text-text-secondary text-sm italic">Mantieni l'immagine fissa nella tua mente.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-8 w-full">
                                <div className="text-2xl uppercase font-bold tracking-[0.3em] text-text-secondary">Cosa percepisci?</div>
                                <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
                                    {availableShapes.map((shape) => (
                                        <button
                                            key={shape.id}
                                            onClick={() => {
                                                setTransmittedShape(shape.id);
                                                setGameState('result');
                                            }}
                                            className={`aspect-square rounded-2xl border flex items-center justify-center transition-all ${transmittedShape === shape.id
                                                ? "bg-primary selected-shape"
                                                : "bg-white text-black border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            <shape.icon className="w-[15vmin] h-[15vmin] max-w-[120px] max-h-[120px]" fill="currentColor" />
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

                        <div className="flex items-center gap-12">
                            <div className="text-center space-y-4">
                                <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Trasmesso</div>
                                <div className="w-[40vmin] h-[40vmin] max-w-[300px] max-h-[300px] rounded-[3rem] bg-white flex items-center justify-center text-black">
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon className="w-[25vmin] h-[25vmin] max-w-[180px] max-h-[180px]" fill="currentColor" />;
                                    })()}
                                </div>
                            </div>
                            <div className="h-px w-8 bg-white/10" />
                            <div className="text-center space-y-4">
                                <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Ricevuto</div>
                                <div className={`w-[40vmin] h-[40vmin] max-w-[300px] max-h-[300px] rounded-[3rem] flex items-center justify-center bg-white text-black ${selectedShape === transmittedShape ? "border-4 border-success" : "border-4 border-error"
                                    }`}>
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === transmittedShape)?.icon || Circle;
                                        return transmittedShape ? <ShapeIcon className="w-[25vmin] h-[25vmin] max-w-[180px] max-h-[180px]" fill="currentColor" /> : <div className="text-8xl font-black">?</div>;
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4">
                            <button
                                onClick={() => {
                                    const syncKey = `match_${resolvedParams.id}_ready`;
                                    const dataKey = `match_${resolvedParams.id}_data`;
                                    localStorage.removeItem(syncKey);
                                    localStorage.removeItem(dataKey);

                                    setGameState('lobby');
                                    setIsReady(false);
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

export default function MatchPage(props: any) {
    return (
        <Suspense fallback={<main className="page-container"><div className="text-primary animate-pulse italic uppercase tracking-widest text-xs">Connessione al protocollo...</div></main>}>
            <MatchContent {...props} />
        </Suspense>
    );
}
