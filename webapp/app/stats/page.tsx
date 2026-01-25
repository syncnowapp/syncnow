"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, Target, Award, Brain, Zap } from "lucide-react";
import Link from "next/link";

export default function StatsPage() {
    const stats = [
        { label: "Accuratezza Totale", value: "32%", icon: Target, color: "text-primary", bgColor: "bg-primary/10" },
        { label: "Partite Completate", value: "12", icon: BarChart3, color: "text-secondary", bgColor: "bg-secondary/10" },
        { label: "Record Corrette", value: "4", icon: Award, color: "text-accent", bgColor: "bg-accent/10" },
        { label: "Miglioramento", value: "+5%", icon: TrendingUp, color: "text-primary", bgColor: "bg-primary/10" },
    ];

    const weekData = [40, 25, 60, 30, 45, 20, 35];

    return (
        <main className="page-container">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-secondary opacity-[0.1] blur-[100px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -30, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto space-y-12 relative z-10"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-semibold">Torna alla Home</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <Brain className="w-8 h-8 text-primary" />
                        </motion.div>
                        <h1 className="text-5xl font-bold">
                            Le tue <span className="gold-text">Statistiche</span>
                        </h1>
                    </div>
                    <p className="text-text-secondary text-lg">
                        Analisi storica delle tue sessioni di allenamento telepatico.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-5"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + (i * 0.1), type: "spring" }}
                            whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                            className="glass-card p-8 flex flex-col items-center text-center gap-5 hover:border-primary/50"
                        >
                            <motion.div
                                className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color}`}
                                whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <stat.icon className="w-8 h-8" />
                            </motion.div>
                            <div>
                                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                                <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary/70">
                                    {stat.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Temporal Chart */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="glass-card space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">Andamento Temporale</h3>
                        <Zap className="w-5 h-5 text-primary" />
                    </div>

                    <div className="h-56 flex items-end gap-3 px-4">
                        {weekData.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: `${h}%`, opacity: 1 }}
                                transition={{
                                    delay: 1.2 + (i * 0.08),
                                    duration: 0.8,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    filter: "brightness(1.3)"
                                }}
                                className="flex-1 rounded-t-lg relative group cursor-pointer"
                                style={{
                                    background: `linear-gradient(180deg, #E028A5 0%, #8928E0 100%)`,
                                }}
                            >
                                <motion.div
                                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-primary/30"
                                    initial={{ y: 10 }}
                                    whileHover={{ y: 0 }}
                                >
                                    {h}% accuracy
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-between text-[10px] uppercase font-bold text-text-secondary/50 px-4">
                        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day, i) => (
                            <motion.span
                                key={day}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + (i * 0.08) }}
                            >
                                {day}
                            </motion.span>
                        ))}
                    </div>
                </motion.section>

                {/* Inspirational Quote */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 }}
                    className="p-8 bg-primary/5 border-2 border-primary/10 rounded-3xl relative overflow-hidden"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    <p className="text-sm text-center italic text-text-secondary relative z-10 leading-relaxed">
                        "La costanza è la chiave per stabilizzare la connessione mente-mente."
                    </p>
                </motion.div>
            </motion.div>
        </main>
    );
}
