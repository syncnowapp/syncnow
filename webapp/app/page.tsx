"use client";

import { motion } from "framer-motion";
import { Zap, Users, BarChart3, ChevronRight, Brain, Waves } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="page-container">
      {/* Psychedelic floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary opacity-[0.15] blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-[30%] right-[5%] w-[35%] h-[35%] rounded-full bg-secondary opacity-[0.12] blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full opacity-[0.1] blur-[120px]"
          style={{
            background: "linear-gradient(135deg, #C528E0 0%, #4C28E0 100%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 90, 0],
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
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="page-content w-full max-w-2xl mx-auto space-y-12 relative z-10"
      >
        {/* Header Badge with pulsing animation */}
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Zap className="w-4 h-4" />
            </motion.div>
            v0.1 MVP - Telepathy Training
          </motion.div>

          {/* Hero Title with staggered animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Sync
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="gold-text"
            >
              Now
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed"
          >
            Un esperimento serio per l'allenamento e l'osservazione della comunicazione non verbale.
          </motion.p>

          {/* Decorative brain wave indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="flex items-center gap-3 pt-4"
          >
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
              <Brain className="w-6 h-6 text-primary/60" />
            </motion.div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary/40 rounded-full"
                  animate={{
                    height: [8, 24, 8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <Waves className="w-5 h-5 text-secondary/60" />
          </motion.div>
        </div>

        {/* Action Cards with enhanced hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
        >
          <Link href="/match/create" className="group">
            <motion.div
              whileHover={{ scale: 1.03, rotate: 1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-card h-full flex flex-col items-start text-left gap-6 hover:border-primary/50 transition-colors"
            >
              <motion.div
                className="p-4 rounded-2xl bg-primary/10 text-primary"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Users className="w-8 h-8" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Nuova Partita
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Crea un link di invito e sfida un partner in tempo reale.
                </p>
              </div>
              <motion.div
                className="ml-auto"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors" />
              </motion.div>
            </motion.div>
          </Link>

          <Link href="/stats" className="group">
            <motion.div
              whileHover={{ scale: 1.03, rotate: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-card h-full flex flex-col items-start text-left gap-6 hover:border-primary/50 transition-colors"
            >
              <motion.div
                className="p-4 rounded-2xl bg-secondary/10 text-secondary"
                whileHover={{ rotate: [0, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <BarChart3 className="w-8 h-8" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">
                  Statistiche
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Analizza i tuoi dati e la tua accuratezza nel tempo.
                </p>
              </div>
              <motion.div
                className="ml-auto"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <ChevronRight className="w-6 h-6 text-text-secondary group-hover:text-secondary transition-colors" />
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>

        {/* CTA Button with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="pt-12"
        >
          <Link href="/auth">
            <motion.button
              className="btn-secondary w-full md:w-auto px-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Accedi per salvare i progressi
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer tagline */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.5 }}
        className="absolute bottom-8 text-xs text-white/30 font-medium tracking-widest uppercase"
      >
        <motion.span
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Scientific & Spiritual Research Protocol
        </motion.span>
      </motion.footer>
    </main>
  );
}
