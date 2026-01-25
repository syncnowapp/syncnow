"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic for Supabase Auth would go here
        console.log("Auth attempt:", { mode, email });
        router.push("/");
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-primary opacity-[0.05] blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 relative z-10"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Torna alla Home</span>
                </Link>

                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">
                        {mode === "login" ? "Accedi" : "Registrati"} su <span className="gold-text">SyncNow</span>
                    </h1>
                    <p className="text-text-secondary">Partecipa all'esperimento scientifico.</p>
                </div>

                <div className="glass-card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70 flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tua@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70 flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full py-4 uppercase tracking-widest text-xs font-bold">
                            {mode === "login" ? "Entra" : "Crea Account"}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <button
                            onClick={() => setMode(mode === "login" ? "register" : "login")}
                            className="text-sm text-text-secondary hover:text-white transition-colors"
                        >
                            {mode === "login" ? (
                                <>Non hai un account? <span className="text-primary font-bold">Registrati</span></>
                            ) : (
                                <>Hai già un account? <span className="text-primary font-bold">Accedi</span></>
                            )}
                        </button>
                    </div>
                </div>

                <p className="text-[10px] text-center text-text-secondary/40 leading-relaxed">
                    Accedendo, accetti i termini dell'esperimento.<br />
                    I tuoi dati verranno utilizzati esclusivamente per fini statistici e di ricerca.
                </p>
            </motion.div>
        </main>
    );
}
