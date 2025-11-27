// components/layout/Hero.jsx
import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon, BoltIcon, DocumentDuplicateIcon, ShieldCheckIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden px-4 md:px-8 py-20">

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Column: Text Content */}
        <div className="text-left space-y-8">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-white"
          >
            Tus PDFs, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">
              más poderosos.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-lg leading-relaxed"
          >
            Une, comprime, convierte y edita documentos en segundos.
            Sin límites, sin marcas de agua y con la seguridad que necesitas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-neon px-8 py-4 text-lg font-bold flex items-center gap-3 group"
            >
              <BoltIcon className="w-6 h-6" />
              Empezar Gratis
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium transition-all flex items-center gap-2"
            >
              Ver herramientas
            </button>
          </motion.div>

          {/* Stats / Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 border-t border-white/10 flex gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-neon" />
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudArrowUpIcon className="w-5 h-5 text-neon" />
              <span>Procesamiento Local</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visual / Abstract UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:flex justify-center items-center"
        >
          {/* Stylized PDF Document */}
          <div className="relative z-20 w-[350px] aspect-[1/1.414] bg-white rounded-lg shadow-2xl transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500 p-8 flex flex-col">
            {/* PDF Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">PDF</span>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>

            {/* Fake Content Lines */}
            <div className="space-y-4 flex-1">
              <div className="w-full h-4 bg-gray-200 rounded" />
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
              <div className="w-full h-4 bg-gray-200 rounded" />
              <div className="w-5/6 h-4 bg-gray-200 rounded" />
              <div className="w-full h-32 bg-gray-100 rounded-lg mt-6 border-2 border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-gray-300 text-4xl">IMG</div>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded mt-6" />
              <div className="w-2/3 h-4 bg-gray-200 rounded" />
            </div>

            {/* Corner Fold Effect */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-300 to-white shadow-lg rounded-bl-lg" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-neon/20 rounded-full blur-[80px] z-0 transform scale-75" />

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-1/4 bg-white p-3 rounded-xl shadow-xl z-30"
          >
            <DocumentDuplicateIcon className="w-8 h-8 text-blue-500" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-8 bottom-1/4 bg-white p-3 rounded-xl shadow-xl z-30"
          >
            <SparklesIcon className="w-8 h-8 text-neon" />
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}