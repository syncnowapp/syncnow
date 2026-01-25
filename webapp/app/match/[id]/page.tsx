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
    LogOut,
    Radio,
    Share2
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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

    useEffect(() => {
        setIsMounted(true);
        const urlRole = searchParams.get('role') as 'transmitter' | 'receiver';
        const urlLevel = parseInt(searchParams.get('level') || '3');
        const urlShape = searchParams.get('shape');

        if (urlRole) setRole(urlRole);
        if (urlLevel) setLevel(urlLevel);
        if (urlRole === 'transmitter' && urlShape) setSelectedShape(urlShape);
    }, [searchParams]);

    useEffect(() => {
        if (gameState === 'lobby' && isReady && partnerReady) {
            setGameState('sync');
            setTimer(10);
        }
    }, [isReady, partnerReady, gameState]);

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

    const shareToWhatsApp = () => {
        let url = typeof window !== 'undefined' ? window.location.href : '';
        if (url.includes('role=transmitter')) {
            url = url.replace('role=transmitter', 'role=receiver');
        } else if (url.includes('role=receiver')) {
            url = url.replace('role=receiver', 'role=transmitter');
        }
        if (url.includes('&shape=')) {
            url = url.split('&shape=')[0];
        }

        const message = encodeURIComponent(`🧠 Unisciti a me su SyncNow per un esperimento di telepatia!\n\n${url}`);
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const availableShapes = SHAPES.slice(0, level);

    if (!isMounted) {
        return (
            <main className="page-container">
                <motion.div
                    className="flex items-center justify-center h-screen"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                >
                    <div className="text-primary font-bold uppercase tracking-[0.5em] text-xl">
                        Sincronizzazione Protocollo...
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="page-container">
            {/* Floating animated orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[15%] left-[10%] w-[30%] h-[30%] rounded-full bg-primary opacity-[0.08] blur-[100px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 40, 0],
                    }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-[20%] right-[15%] w-[35%] h-[35%] rounded-full bg-secondary opacity-[0.06] blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-16 w-full max-w-6xl mx-auto relative z-10"
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <Zap className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span className="text-sm font-bold tracking-[0.2em] uppercase text-text-secondary">
                        ID: {resolvedParams.id}
                    </span>
                </div>
                <motion.button
                    onClick={() => router.push('/')}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-text-secondary hover:text-primary transition-colors p-3 hover:bg-white/5 rounded-full"
                >
                    <LogOut className="w-6 h-6" />
                </motion.button>
            </motion.header>

            <AnimatePresence mode="wait">
                {/* LOBBY STATE */}
                {gameState === 'lobby' && (
                    <motion.div
                        key="lobby"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-16 w-full max-w-6xl mx-auto relative z-10"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4 md:space-y-6 px-4"
                        >
                            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tight leading-tight">
                                In attesa di un{' '}
                                <span className="gold-text">
                                    {role === 'transmitter' ? 'Ricevitore' : 'Trasmettitore'}
                                </span>
                            </h2>
                            <p className="text-text-secondary text-base md:text-xl font-medium">
                                Inizia a concentrarti, tra poco si inizia!
                            </p>
                        </motion.div>

                        {/* Invite Link Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="w-full max-w-3xl glass-card flex flex-col items-center gap-8 p-10"
                        >
                            <div className="text-xs uppercase font-bold tracking-[0.3em] text-primary/70">
                                Link di Invito al Protocollo
                            </div>
                            <div className="w-full flex items-center gap-3 bg-black/60 p-4 md:p-5 rounded-2xl border-2 border-white/10">
                                <code className="flex-1 text-left text-xs md:text-sm font-bold truncate text-primary/90 tracking-wide">
                                    {isMounted ? window.location.href.split('?')[0] + '?role=' + (role === 'transmitter' ? 'receiver' : 'transmitter') + '&level=' + level : 'Loading...'}
                                </code>
                                <motion.button
                                    onClick={shareToWhatsApp}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 md:p-4 bg-secondary text-white hover:bg-secondary/90 transition-all rounded-xl shadow-[0_0_30px_rgba(137,40,224,0.4)]"
                                    title="Condividi su WhatsApp"
                                >
                                    <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                                </motion.button>
                                <motion.button
                                    onClick={copyUrl}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 md:p-4 bg-primary text-black hover:bg-primary/90 transition-all rounded-xl shadow-[0_0_30px_rgba(224,40,165,0.4)]"
                                    title="Copia link"
                                >
                                    {copied ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Copy className="w-5 h-5 md:w-6 md:h-6" />}
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Session Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="w-full space-y-10"
                        >
                            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-[0.3em] text-text-secondary/40">
                                <div className="h-[2px] flex-1 bg-white/10" />
                                <span>Specifiche Sessione</span>
                                <div className="h-[2px] flex-1 bg-white/10" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="p-8 bg-glass border-2 border-white/10 text-center space-y-3 rounded-2xl"
                                >
                                    <div className="text-[10px] uppercase text-text-secondary font-bold tracking-[0.2em]">
                                        Ruolo
                                    </div>
                                    <div className="text-2xl font-bold capitalize text-white">
                                        {role === 'transmitter' ? 'Trasmettitore' : 'Ricevitore'}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="p-8 bg-glass border-2 border-white/10 text-center space-y-3 rounded-2xl"
                                >
                                    <div className="text-[10px] uppercase text-text-secondary font-bold tracking-[0.2em]">
                                        Densità Livello
                                    </div>
                                    <div className="text-3xl font-bold text-white">{level} FIGURE</div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="p-8 bg-primary/5 border-2 border-primary/20 text-center space-y-4 rounded-2xl relative overflow-hidden"
                                >
                                    <div className="text-[10px] uppercase text-primary font-bold tracking-[0.2em]">
                                        Stato
                                    </div>
                                    <div className="flex items-center justify-center gap-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.div
                                                className={`w-4 h-4 rounded-full ${
                                                    isReady ? 'bg-primary shadow-[0_0_20px_rgba(224,40,165,0.8)]' : 'bg-white/10'
                                                }`}
                                                animate={isReady ? {
                                                    scale: [1, 1.3, 1],
                                                } : {}}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                }}
                                            />
                                            <span className="text-[9px] font-bold uppercase text-white/40">TU</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.div
                                                className={`w-4 h-4 rounded-full ${
                                                    partnerReady ? 'bg-secondary shadow-[0_0_20px_rgba(137,40,224,0.8)]' : 'bg-white/10'
                                                }`}
                                                animate={partnerReady ? {
                                                    scale: [1, 1.3, 1],
                                                } : {}}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                }}
                                            />
                                            <span className="text-[9px] font-bold uppercase text-white/40">SINC</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Selected Shape Preview (Transmitter) */}
                        {role === 'transmitter' && selectedShape && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="w-full flex flex-col items-center gap-8"
                            >
                                <div className="text-xs uppercase font-bold tracking-[0.4em] text-primary">
                                    Figura Selezionata
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="w-64 h-64 bg-white flex items-center justify-center text-black shadow-[0_0_80px_rgba(255,255,255,0.2)] p-10 rounded-3xl"
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon style={{ width: '100%', height: '100%' }} fill="currentColor" />;
                                    })()}
                                </motion.div>
                                <button
                                    onClick={() => router.back()}
                                    className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary hover:text-white transition-colors border-b-2 border-white/10 hover:border-primary/50 pb-2"
                                >
                                    Modifica Configurazione
                                </button>
                            </motion.div>
                        )}

                        {/* Ready Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="w-full max-w-2xl pt-12"
                        >
                            <motion.button
                                onClick={toggleReady}
                                disabled={role === 'transmitter' && !selectedShape}
                                whileHover={isReady ? {} : { scale: 1.02 }}
                                whileTap={isReady ? {} : { scale: 0.98 }}
                                className={`w-full py-10 text-2xl tracking-[0.3em] font-bold uppercase transition-all duration-500 rounded-full ${
                                    isReady
                                        ? "bg-glass border-2 border-primary/30 text-primary/60 shadow-inner"
                                        : role === 'transmitter' && !selectedShape
                                        ? "bg-white/5 text-white/20 cursor-not-allowed"
                                        : "bg-primary text-black hover:shadow-[0_20px_60px_rgba(224,40,165,0.5)] border-2 border-transparent"
                                }`}
                            >
                                {isReady ? "In Attesa..." : "Pronto"}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}

                {/* SYNC STATE */}
                {gameState === 'sync' && (
                    <motion.div
                        key="sync"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-16 relative z-10"
                    >
                        <div className="relative w-96 h-96 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.6, 1],
                                    opacity: [0.15, 0.3, 0.15],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-primary rounded-full blur-[120px]"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-secondary rounded-full blur-[100px]"
                            />
                            <motion.div
                                className="text-[16rem] font-bold tabular-nums gold-text relative z-10 leading-none"
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                }}
                            >
                                {timer}
                            </motion.div>
                        </div>

                        <div className="space-y-6 max-w-3xl">
                            <h2 className="text-6xl font-bold uppercase tracking-tight text-white">
                                Sincronizzazione
                            </h2>
                            <p className="text-text-secondary italic text-2xl leading-relaxed font-medium">
                                "Svuota la mente. Elimina ogni distrazione. Concentrati sul partner."
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* TRANSMISSION STATE */}
                {gameState === 'transmission' && (
                    <motion.div
                        key="transmission"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center space-y-16 w-full relative z-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-5 text-primary bg-primary/10 px-10 py-6 border-2 border-primary/30 backdrop-blur-xl rounded-full"
                        >
                            <Clock className="w-8 h-8" />
                            <span className="font-bold tabular-nums text-4xl tracking-tight">{timer}S</span>
                        </motion.div>

                        {role === 'transmitter' ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center space-y-12"
                            >
                                <div className="text-2xl font-bold uppercase tracking-[0.4em] text-text-secondary">
                                    Trasmissione in Corso
                                </div>
                                <motion.div
                                    className="w-[70vmin] h-[70vmin] max-w-[600px] max-h-[600px] bg-white flex items-center justify-center text-black shadow-[0_0_120px_rgba(224,40,165,0.4)] p-16 rounded-3xl"
                                    animate={{
                                        boxShadow: [
                                            "0 0 120px rgba(224,40,165,0.4)",
                                            "0 0 160px rgba(137,40,224,0.6)",
                                            "0 0 120px rgba(224,40,165,0.4)",
                                        ],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon style={{ width: '100%', height: '100%' }} fill="currentColor" />;
                                    })()}
                                </motion.div>
                                <p className="text-text-secondary text-lg font-medium italic uppercase tracking-[0.2em]">
                                    Proietta questa immagine nel campo neurale.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center space-y-12 w-full"
                            >
                                <div className="text-2xl font-bold uppercase tracking-[0.4em] text-text-secondary">
                                    Cosa Percepisci?
                                </div>
                                <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
                                    {availableShapes.map((shape, idx) => {
                                        const ShapeIcon = shape.icon;
                                        return (
                                            <motion.button
                                                key={shape.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05, type: "spring" }}
                                                onClick={() => {
                                                    setTransmittedShape(shape.id);
                                                    setGameState('result');
                                                }}
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotate: 5,
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                className={`aspect-square border-4 flex items-center justify-center transition-all p-8 rounded-3xl ${
                                                    transmittedShape === shape.id
                                                        ? "bg-primary border-white text-black shadow-[0_0_80px_rgba(224,40,165,0.6)]"
                                                        : "bg-white/95 text-black border-transparent hover:bg-white hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)]"
                                                }`}
                                            >
                                                <ShapeIcon
                                                    style={{ width: '70%', height: '70%' }}
                                                    fill="currentColor"
                                                />
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                <p className="text-text-secondary text-lg font-medium italic uppercase tracking-[0.2em] pt-6">
                                    Scegli la figura che si è manifestata.
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* RESULT STATE */}
                {gameState === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center space-y-16 w-full relative z-10"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-8"
                        >
                            <h2 className="text-7xl font-bold uppercase tracking-tight">Risultato</h2>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className={`text-2xl font-bold tracking-[0.3em] uppercase py-6 px-16 border-4 rounded-full ${
                                    selectedShape === transmittedShape
                                        ? "bg-primary/20 text-primary border-primary shadow-[0_0_60px_rgba(224,40,165,0.4)]"
                                        : "bg-white/5 text-text-secondary border-white/20"
                                }`}
                            >
                                {selectedShape === transmittedShape ? "Connessione Stabilita" : "Segnale Interrotto"}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
                        >
                            <div className="text-center space-y-6">
                                <div className="text-xs uppercase font-bold tracking-[0.4em] text-text-secondary">
                                    Trasmesso
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: -2 }}
                                    className="w-72 h-72 bg-white flex items-center justify-center text-black shadow-2xl p-12 rounded-3xl"
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === selectedShape)?.icon || Circle;
                                        return <ShapeIcon style={{ width: '100%', height: '100%' }} fill="currentColor" />;
                                    })()}
                                </motion.div>
                            </div>

                            <div className="text-center space-y-6">
                                <div className="text-xs uppercase font-bold tracking-[0.4em] text-text-secondary">
                                    Ricevuto
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    className={`w-72 h-72 flex items-center justify-center bg-white text-black shadow-2xl p-12 rounded-3xl ${
                                        selectedShape === transmittedShape
                                            ? "border-8 border-primary/60"
                                            : "border-8 border-white/20"
                                    }`}
                                >
                                    {(() => {
                                        const ShapeIcon = SHAPES.find(s => s.id === transmittedShape)?.icon || Circle;
                                        return transmittedShape ? (
                                            <ShapeIcon style={{ width: '100%', height: '100%' }} fill="currentColor" />
                                        ) : (
                                            <div className="text-9xl font-bold">?</div>
                                        );
                                    })()}
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 pt-12"
                        >
                            <motion.button
                                onClick={() => {
                                    const syncKey = `match_${resolvedParams.id}_ready`;
                                    const dataKey = `match_${resolvedParams.id}_data`;
                                    localStorage.removeItem(syncKey);
                                    localStorage.removeItem(dataKey);
                                    setGameState('lobby');
                                    setIsReady(false);
                                    setTransmittedShape(null);
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-primary text-black py-8 text-xl font-bold tracking-[0.3em] uppercase hover:shadow-[0_20px_60px_rgba(224,40,165,0.5)] transition-all rounded-full"
                            >
                                DI NUOVO
                            </motion.button>
                            <motion.button
                                onClick={() => router.push('/')}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-glass border-2 border-white/10 text-white py-8 text-xl font-bold tracking-[0.3em] uppercase hover:border-primary/50 transition-all rounded-full"
                            >
                                HOME
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-20 pt-8 border-t-2 border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-[0.3em] uppercase text-text-secondary/30 pb-12 w-full max-w-6xl mx-auto relative z-10"
            >
                <div className="flex gap-6">
                    <span>SyncNow v0.1</span>
                    <span className="opacity-50">Node: {resolvedParams.id}</span>
                </div>
                <span>Neural Synchronization Division</span>
            </motion.footer>
        </main>
    );
}

export default function MatchPage(props: any) {
    return (
        <Suspense fallback={
            <main className="page-container">
                <motion.div
                    className="flex items-center justify-center h-screen"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                >
                    <div className="text-primary font-bold uppercase tracking-[0.5em] text-xl">
                        Sincronizzazione Protocollo...
                    </div>
                </motion.div>
            </main>
        }>
            <MatchContent {...props} />
        </Suspense>
    );
}
