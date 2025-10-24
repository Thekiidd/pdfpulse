import { motion } from 'framer-motion';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pulse-dark via-black to-pulse-dark py-32">
      <div className="absolute inset-0 bg-pulse-red opacity-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-4xl mx-auto text-center px-4"
      >
        <motion.h1 
          animate={{ 
            textShadow: [
              "0 0 20px rgba(239,68,68,0.5)",
              "0 0 40px rgba(239,68,68,0.8)",
              "0 0 20px rgba(239,68,68,0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl md:text-8xl font-black text-white mb-6"
        >
          PDF<span className="text-pulse-red">Pulse</span>
        </motion.h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Une, comprime y convierte PDFs al instante. <br />
          <span className="text-pulse-red font-bold">100% gratis. Sin registros.</span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('tools').scrollIntoView({ behavior: 'smooth' })}
          className="bg-pulse-red text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-pulse-red/50 transition-all"
        >
          Explora Herramientas
        </motion.button>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-12"
        >
          <ArrowDownIcon className="w-8 h-8 text-pulse-red mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Banner;