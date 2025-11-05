// components/layout/Hero.jsx
import { motion } from 'framer-motion';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-neon via-red-500 to-neon-light bg-clip-text text-transparent animate-glow"
        >
          PDF<span className="text-white">PULSE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
        >
          Une, comprime y convierte PDFs <span className="text-neon font-bold">al instante</span>.<br />
          <span className="text-neon-light">100% gratis. Sin registros.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-neon px-10 py-4 text-lg"
          >
            Explora Herramientas
          </button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mt-16"
        >
          <ArrowDownIcon className="w-8 h-8 text-neon mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}