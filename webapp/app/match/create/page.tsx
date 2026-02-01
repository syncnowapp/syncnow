"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Target,
    Eye,
    Circle,
    Square,
    Triangle,
    Radio,
    Palette,
    Shapes
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { generateMatchId } from '@/lib/matchHelpers';

const SHAPE_OPTIONS = [
    { id: 'circle', icon: Circle, label: 'Cerchio' },
    { id: 'square', icon: Square, label: 'Quadrato' },
    { id: 'triangle', icon: Triangle, label: 'Triangolo' },
];

const COLOR_OPTIONS = [
    { id: 'yellow', hex: '#FFD700', label: 'Giallo' },
    { id: 'blue', hex: '#4169E1', label: 'Blu' },
    { id: 'red', hex: '#DC143C', label: 'Rosso' },
];

export default function CreateMatch() {
    const router = useRouter();
    const [gameMode, setGameMode] = useState<'shapes' | 'colors' | null>(null);
    const [role, setRole] = useState<"transmitter" | "receiver">("transmitter");
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!gameMode) return;
        if (role === 'transmitter' && !selectedItem) return;

        try {
            const matchId = generateMatchId();
            console.log('🎮 Creating match with ID:', matchId);

            // Crea match in Supabase
            const { data, error } = await supabase
                .from('matches')
                .insert({
                    id: matchId,
                    game_mode: gameMode,
                    selected_item: role === 'transmitter' ? selectedItem : null,
                    state: 'lobby'
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Insert error:', error);
                throw error;
            }

            console.log('✅ Match created:', data);

            // Naviga al match
            router.push(`/match/${matchId}?role=${role}&mode=${gameMode}${role === 'transmitter' && selectedItem ? `&item=${selectedItem}` : ''}`);
        } catch (error) {
            console.error('Failed to create match:', error);
            alert('Errore nella creazione del match. Riprova.');
        }
    };

    const canCreate = gameMode && (role === 'receiver' || selectedItem);

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
                    <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors group">
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
                        className="text-6xl md:text-7xl font-bold tracking-tight leading-none text-center"
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
                        className="text-text-secondary text-lg font-medium tracking-wide text-center"
                    >
                        Imposta le caratteristiche del match.
                    </motion.p>
                </motion.div>

                <div className="space-y-12 md:space-y-20 pb-12 md:pb-20">
                    {/* Game Mode Selection */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                            <Target className="w-5 h-5" />
                            <span>1. Scegli la modalità</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, type: "spring" }}
                                onClick={() => {
                                    setGameMode('shapes');
                                    setSelectedItem(null);
                                }}
                                whileHover={{ scale: 1.05, rotate: -1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-10 md:p-12 border-4 transition-all duration-300 flex flex-col items-center gap-6 ${
                                    gameMode === 'shapes'
                                        ? "bg-primary border-primary text-black shadow-[0_0_60px_rgba(224,40,165,0.5)]"
                                        : "bg-glass border-white/10 text-text-secondary hover:border-primary/30"
                                }`}
                                style={{ borderRadius: '24px' }}
                            >
                                <div className={`p-5 rounded-2xl ${gameMode === 'shapes' ? 'bg-black/20' : 'bg-white/5'}`}>
                                    <Shapes className="w-10 h-10 md:w-12 md:h-12" />
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-xl md:text-2xl uppercase tracking-wider">Forme</div>
                                </div>
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, type: "spring" }}
                                onClick={() => {
                                    setGameMode('colors');
                                    setSelectedItem(null);
                                }}
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-10 md:p-12 border-4 transition-all duration-300 flex flex-col items-center gap-6 ${
                                    gameMode === 'colors'
                                        ? "bg-secondary border-secondary text-white shadow-[0_0_60px_rgba(137,40,224,0.5)]"
                                        : "bg-glass border-white/10 text-text-secondary hover:border-secondary/30"
                                }`}
                                style={{ borderRadius: '24px' }}
                            >
                                <div className={`p-5 rounded-2xl ${gameMode === 'colors' ? 'bg-white/20' : 'bg-white/5'}`}>
                                    <Palette className="w-10 h-10 md:w-12 md:h-12" />
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-xl md:text-2xl uppercase tracking-wider">Colori</div>
                                </div>
                            </motion.button>
                        </div>
                    </motion.section>

                    {/* Role Selection */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                            <Radio className="w-5 h-5" />
                            <span>2. Il tuo ruolo</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 md:gap-12">
                            <motion.button
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1, type: "spring" }}
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
                                transition={{ delay: 1.1, type: "spring" }}
                                onClick={() => {
                                    setRole("receiver");
                                    setSelectedItem(null);
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

                    {/* Item Selection (Transmitter Only) */}
                    <AnimatePresence>
                        {role === 'transmitter' && gameMode && (
                            <motion.section
                                key={`selection-${gameMode}`}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 40 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                                    <Target className="w-5 h-5" />
                                    <span>3. Scegli {gameMode === 'shapes' ? 'la forma' : 'il colore'} da trasmettere</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {(gameMode === 'shapes' ? SHAPE_OPTIONS : COLOR_OPTIONS).map((item, idx) => {
                                        const isShape = 'icon' in item;
                                        const ShapeIcon = isShape ? item.icon : Circle;
                                        const isSelected = selectedItem === item.id;

                                        return (
                                            <motion.button
                                                key={item.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: isSelected ? 1.08 : 1
                                                }}
                                                transition={{ delay: idx * 0.08, type: "spring" }}
                                                onClick={() => setSelectedItem(item.id)}
                                                whileHover={{ scale: isSelected ? 1.08 : 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`aspect-square flex items-center justify-center transition-all duration-300 p-4 md:p-6 ${
                                                    isSelected
                                                        ? "shadow-[0_0_100px_rgba(224,40,165,0.8),0_0_40px_rgba(224,40,165,1)] border-[6px] border-primary"
                                                        : isShape
                                                        ? "bg-white hover:shadow-xl border-4 border-transparent"
                                                        : "hover:shadow-xl border-4 border-transparent"
                                                }`}
                                                style={{
                                                    backgroundColor: !isShape ? (item as typeof COLOR_OPTIONS[0]).hex : undefined,
                                                    borderRadius: '0'
                                                }}
                                            >
                                                {isShape ? (
                                                    <ShapeIcon
                                                        style={{ width: '85%', height: '85%' }}
                                                        className="text-black"
                                                        fill="currentColor"
                                                        stroke="none"
                                                    />
                                                ) : (
                                                    <span className="text-sm md:text-base font-bold uppercase tracking-wider text-white drop-shadow-2xl">
                                                        {item.label}
                                                    </span>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                <AnimatePresence>
                                    {selectedItem && (
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
                                                MATCH IMPOSTATO
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
                        transition={{ delay: role === 'transmitter' ? 1.5 : 1.2 }}
                        className="flex flex-col items-center gap-12 pt-16 border-t-2 border-white/5"
                    >
                        <motion.button
                            onClick={handleCreate}
                            disabled={!canCreate}
                            whileHover={!canCreate ? {} : { scale: 1.05 }}
                            whileTap={!canCreate ? {} : { scale: 0.95 }}
                            className={`w-full max-w-lg py-6 md:py-10 text-lg md:text-2xl tracking-[0.2em] md:tracking-[0.3em] font-bold uppercase transition-all duration-500 ${
                                !canCreate
                                    ? "bg-white/5 text-white/60 cursor-not-allowed border-2 border-white/20"
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
