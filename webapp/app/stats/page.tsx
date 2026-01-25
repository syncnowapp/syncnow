"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, Target, Award } from "lucide-react";
import Link from "next/link";

export default function StatsPage() {
    const stats = [
        { label: "Accuratezza Totale", value: "32%", icon: Target, color: "text-primary" },
        { label: "Partite Completate", value: "12", icon: BarChart3, color: "text-secondary" },
        { label: "Record Corrette", value: "4", icon: Award, color: "text-success" },
        { label: "Miglioramento", value: "+5%", icon: TrendingUp, color: "text-primary" },
    ];

    return (
        <main className="page-container">
            <div className="max-w-xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Torna alla Home</span>
                </Link>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold">Le tue <span className="gold-text">Statistiche</span></h1>
                    <p className="text-text-secondary">Analisi storica delle tue sessioni di allenamento.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 flex flex-col items-center text-center gap-4"
                        >
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-black">{stat.value}</div>
                                <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <section className="glass-card space-y-6">
                    <h3 className="text-lg font-bold">Andamento Temporale</h3>
                    <div className="h-48 flex items-end gap-2 px-2">
                        {[40, 25, 60, 30, 45, 20, 35].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.5 + (i * 0.05), duration: 1 }}
                                className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm relative group"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h}% accuracy
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] uppercase font-bold text-text-secondary/50 px-2">
                        <span>Luna</span>
                        <span>Mar</span>
                        <span>Mer</span>
                        <span>Gio</span>
                        <span>Ven</span>
                        <span>Sab</span>
                        <span>Dom</span>
                    </div>
                </section>

                <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl">
                    <p className="text-sm text-center italic text-text-secondary">
                        "La costanza è la chiave per stabilizzare la connessione mente-mente."
                    </p>
                </div>
            </div>
        </main>
    );
}
