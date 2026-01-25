"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Auth attempt:", { mode, email });
        router.push("/");
    };

    return (
        <main className="page-container">
            {/* Psychedelic background orb */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70%] h-[70%] rounded-full bg-primary opacity-[0.08] blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md mx-auto space-y-8 relative z-10"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-semibold">Torna alla Home</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-3"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="inline-block"
                    >
                        <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                    </motion.div>
                    <h1 className="text-4xl font-bold leading-tight">
                        {mode === "login" ? "Accedi" : "Registrati"} su <span className="gold-text">SyncNow</span>
                    </h1>
                    <p className="text-text-secondary">Partecipa all'esperimento scientifico.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-2"
                            >
                                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70 flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tua@email.com"
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 focus:border-primary focus:bg-white/8 outline-none transition-all"
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-2"
                            >
                                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70 flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 focus:border-primary focus:bg-white/8 outline-none transition-all"
                                    required
                                />
                            </motion.div>
                        </div>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            type="submit"
                            className="btn-primary w-full py-4 uppercase tracking-widest text-sm font-bold"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {mode === "login" ? "Entra" : "Crea Account"}
                        </motion.button>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="mt-8 pt-8 border-t-2 border-white/5 text-center"
                    >
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
                    </motion.div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-[10px] text-center text-text-secondary/40 leading-relaxed"
                >
                    Accedendo, accetti i termini dell'esperimento.<br />
                    I tuoi dati verranno utilizzati esclusivamente per fini statistici e di ricerca.
                </motion.p>
            </motion.div>
        </main>
    );
}
