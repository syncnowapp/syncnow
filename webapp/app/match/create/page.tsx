"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Target, Eye, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateMatch() {
    const router = useRouter();
    const [level, setLevel] = useState(3);
    const [role, setRole] = useState<"transmitter" | "receiver">("transmitter");

    const handleCreate = () => {
        // For MVP, we'll just generate a random ID and redirect
        const matchId = Math.random().toString(36).substring(7).toUpperCase();
        const targetUrl = `/match/${matchId}?role=${role}&level=${level}`;

        console.log("Redirecting to:", targetUrl);
        window.location.assign(targetUrl);
    };

    return (
        <main className="page-container">
            <div className="max-w-xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Torna alla Home</span>
                </Link>

                <div className="space-y-2">
                    <h1 className="text-5xl md:text-6xl font-bold">Configura <span className="gold-text">Partita</span></h1>
                    <p className="text-text-secondary">Definisci i parametri dell'esperimento.</p>
                </div>

                <div className="space-y-6">
                    {/* Livello */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-text-secondary/70">
                            <Settings2 className="w-4 h-4" />
                            <span>Livello di difficoltà</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[3, 6, 9].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`p-4 rounded-xl border transition-all ${level === l
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-glass border-glass-border text-text-secondary hover:border-white/20"
                                        }`}
                                >
                                    <div className="text-xl font-bold">{l}</div>
                                    <div className="text-[10px] uppercase font-semibold">Forme</div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Ruolo */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-text-secondary/70">
                            <Users className="w-4 h-4" />
                            <span>Il tuo ruolo iniziale</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setRole("transmitter")}
                                className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${role === "transmitter"
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-glass border-glass-border text-text-secondary hover:border-white/20"
                                    }`}
                            >
                                <div className="p-3 rounded-full bg-white/5">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <div className="font-bold">Trasmettitore</div>
                                    <div className="text-[10px] uppercase">Seleziona le forme</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setRole("receiver")}
                                className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${role === "receiver"
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-glass border-glass-border text-text-secondary hover:border-white/20"
                                    }`}
                            >
                                <div className="p-3 rounded-full bg-white/5">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <div className="font-bold">Ricevitore</div>
                                    <div className="text-[10px] uppercase">Indovina le forme</div>
                                </div>
                            </button>
                        </div>
                    </section>

                    <button
                        onClick={handleCreate}
                        className="btn-primary w-full py-5 text-lg"
                    >
                        Crea Link di Invito
                    </button>
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
