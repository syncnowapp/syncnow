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
    Moon,
    Radio
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
    const [level, setLevel] = useState(2);
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
        <main className="page-container py-8 md:py-12">
            {/* Animated psychedelic orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[10%] left-[5%] w-[35%] h-[35%] rounded-full bg-primary opacity-[0.12] blur-[100px]"
                    animate={{
                        scale: [1, 1.4, 1],
                        x: [0, 60, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-[15%] right-[10%] w-[40%] h-[40%] rounded-full bg-secondary opacity-[0.1] blur-[120px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        y: [0, -40, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <div className="w-full max-w-3xl mx-auto space-y-10 md:space-y-16 relative z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group">
                        <motion.div
                            whileHover={{ x: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.div>
                        <span className="font-bold tracking-wider uppercase text-xs">Torna alla Home</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <motion.h1
                        className="text-6xl md:text-7xl font-bold tracking-tight leading-none"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        CONFIGURA <br />
                        <span className="gold-text">PARTITA</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-text-secondary text-lg font-medium tracking-wide"
                    >
                        Inizializzazione dei parametri dell'esperimento telepatetico.
                    </motion.p>
                </motion.div>

                <div className="space-y-12 md:space-y-20 pb-12 md:pb-20">
                    {/* Level Selection */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                            <Settings2 className="w-5 h-5" />
                            <span>1. Livello di difficoltà</span>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {[2, 4, 8].map((l, idx) => (
                                <motion.button
                                    key={l}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + (idx * 0.1), type: "spring" }}
                                    onClick={() => {
                                        setLevel(l);
                                        setSelectedShape(null);
                                    }}
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-12 border-4 transition-all duration-300 ${
                                        level === l
                                            ? "bg-primary border-primary text-black shadow-[0_0_60px_rgba(224,40,165,0.5)]"
                                            : "bg-glass border-white/10 text-text-secondary hover:border-primary/30"
                                    }`}
                                    style={{ borderRadius: '24px' }}
                                >
                                    <div className="text-5xl font-bold leading-none">{l}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3 opacity-70">
                                        Forme
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>

                    {/* Role Selection */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                            <Radio className="w-5 h-5" />
                            <span>2. Il tuo ruolo neurale</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 md:gap-12">
                            <motion.button
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.1, type: "spring" }}
                                onClick={() => setRole("transmitter")}
                                whileHover={{ scale: 1.03, rotate: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className={`flex-1 max-w-[160px] md:max-w-[200px] p-4 md:p-10 border-2 md:border-4 transition-all duration-300 flex flex-col items-center gap-3 md:gap-6 ${
                                    role === "transmitter"
                                        ? "bg-primary border-primary text-black shadow-[0_0_60px_rgba(224,40,165,0.5)]"
                                        : "bg-glass border-white/10 text-text-secondary hover:border-primary/30"
                                }`}
                                style={{ borderRadius: '24px' }}
                            >
                                <div className={`p-3 md:p-5 rounded-2xl ${role === 'transmitter' ? 'bg-black/20' : 'bg-white/5'}`}>
                                    <Target className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-base md:text-xl uppercase tracking-wider">Trasmettitore</div>
                                </div>
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2, type: "spring" }}
                                onClick={() => {
                                    setRole("receiver");
                                    setSelectedShape(null);
                                }}
                                whileHover={{ scale: 1.03, rotate: 1 }}
                                whileTap={{ scale: 0.97 }}
                                className={`flex-1 max-w-[160px] md:max-w-[200px] p-4 md:p-10 border-2 md:border-4 transition-all duration-300 flex flex-col items-center gap-3 md:gap-6 ${
                                    role === "receiver"
                                        ? "bg-secondary border-secondary text-white shadow-[0_0_60px_rgba(137,40,224,0.5)]"
                                        : "bg-glass border-white/10 text-text-secondary hover:border-secondary/30"
                                }`}
                                style={{ borderRadius: '24px' }}
                            >
                                <div className={`p-3 md:p-5 rounded-2xl ${role === 'receiver' ? 'bg-white/20' : 'bg-white/5'}`}>
                                    <Eye className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-base md:text-xl uppercase tracking-wider">Ricevitore</div>
                                </div>
                            </motion.button>
                        </div>
                    </motion.section>

                    {/* Shape Selection (Transmitter Only) */}
                    <AnimatePresence>
                        {role === 'transmitter' && (
                            <motion.section
                                key={`shapes-${level}`}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 40 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                                    <Target className="w-5 h-5" />
                                    <span>3. Selezione della Forma Target</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                                    {availableShapes.map((shape, idx) => {
                                        const ShapeIcon = shape.icon;
                                        return (
                                            <motion.button
                                                key={shape.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{
                                                    delay: idx * 0.05,
                                                    type: "spring",
                                                    stiffness: 200
                                                }}
                                                type="button"
                                                onClick={() => setSelectedShape(shape.id)}
                                                whileHover={{
                                                    scale: 1.05,
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`aspect-square flex items-center justify-center transition-all duration-300 p-4 md:p-6 ${
                                                    selectedShape === shape.id
                                                        ? "bg-primary text-black shadow-[0_0_80px_rgba(224,40,165,0.6)]"
                                                        : "bg-white text-black hover:shadow-xl"
                                                }`}
                                                style={{ borderRadius: '0' }}
                                            >
                                                <ShapeIcon
                                                    style={{ width: '85%', height: '85%' }}
                                                    fill="currentColor"
                                                    stroke="none"
                                                />
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                <AnimatePresence>
                                    {selectedShape && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-center space-y-4"
                                        >
                                            <div className="h-px w-24 bg-primary/40 mx-auto" />
                                            <motion.p
                                                className="text-sm text-primary font-bold tracking-[0.5em] uppercase"
                                                animate={{
                                                    opacity: [0.5, 1, 0.5],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                            >
                                                MANIFESTAZIONE BLOCCATA
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    {/* Create Match CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: role === 'transmitter' ? 2 : 1.4 }}
                        className="flex flex-col items-center gap-12 pt-16 border-t-2 border-white/5"
                    >
                        <motion.button
                            onClick={handleCreate}
                            disabled={role === 'transmitter' && !selectedShape}
                            whileHover={role === 'transmitter' && !selectedShape ? {} : { scale: 1.05 }}
                            whileTap={role === 'transmitter' && !selectedShape ? {} : { scale: 0.95 }}
                            className={`w-full max-w-lg py-6 md:py-10 text-lg md:text-2xl tracking-[0.2em] md:tracking-[0.3em] font-bold uppercase transition-all duration-500 ${
                                role === 'transmitter' && !selectedShape
                                    ? "bg-white/5 text-white/20 cursor-not-allowed opacity-40"
                                    : "bg-primary text-black hover:shadow-[0_20px_80px_rgba(224,40,165,0.5)]"
                            }`}
                            style={{ borderRadius: '999px' }}
                        >
                            CREA PARTITA
                        </motion.button>

                        <div className="space-y-4 text-center">
                            <p className="text-[12px] text-text-secondary/60 uppercase font-bold tracking-[0.4em] leading-relaxed">
                                TRANSMISSIONE <br /> PROTOCOLLO SINC
                            </p>
                            <div className="flex justify-center gap-3">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-primary/60"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.3, 1, 0.3],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.3,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
