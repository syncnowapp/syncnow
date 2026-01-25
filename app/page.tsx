"use client";

import { motion } from "framer-motion";
import { Zap, Users, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="page-container">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary opacity-[0.03] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="page-content w-full max-w-2xl mx-auto space-y-8 relative z-10"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-4"
          >
            <Zap className="w-3 h-3" />
            v0.1 MVP - Telepathy Training
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Sync<span className="gold-text">Now</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-lg mx-auto leading-relaxed">
            Un esperimento serio per l'allenamento e l'osservazione della comunicazione non verbale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <Link href="/match/create" className="group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card h-full flex flex-col items-start text-left gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">Nuova Partita</h3>
                <p className="text-sm text-text-secondary">Crea un link di invito e sfida un partner in tempo reale.</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-text-secondary group-hover:text-primary transition-colors" />
            </motion.div>
          </Link>

          <Link href="/stats" className="group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card h-full flex flex-col items-start text-left gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1 group-hover:text-secondary transition-colors">Statistiche</h3>
                <p className="text-sm text-text-secondary">Analizza i tuoi dati e la tua accuratezza nel tempo.</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-text-secondary group-hover:text-secondary transition-colors" />
            </motion.div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="pt-12"
        >
          <Link href="/auth">
            <button className="btn-secondary w-full md:w-auto">
              Accedi per salvare i progressi
            </button>
          </Link>
        </motion.div>
      </motion.div>

      <footer className="absolute bottom-8 text-xs text-text-secondary/50 font-medium tracking-widest uppercase">
        Scientific & Spiritual Research Protocol
      </footer>
    </main>
  );
}
