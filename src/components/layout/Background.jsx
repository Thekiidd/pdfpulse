// src/components/layout/Background.jsx
import { motion } from 'framer-motion';

export default function Background() {
  return (
    <>
      {/* Imagen de fondo - RESTAURADA */}
      <div
        className="fixed inset-0 -z-30"
        style={{
          backgroundImage: 'url(/Background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)',
        }}
      />

      {/* Overlay oscuro para mejorar contraste */}
      <div className="fixed inset-0 -z-20 bg-black/70" />

      {/* Orbes brillantes (Círculos) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Orbe Neon (Superior Derecho) */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-neon/10 rounded-full blur-[120px]"
        />

        {/* Orbe Púrpura (Inferior Izquierdo) */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Overlay de ruido sutil */}
      <div className="fixed inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      {/* Partículas flotantes NEON ROJAS */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_8px_rgba(255,0,51,0.8)]"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0,
            }}
            animate={{
              y: -100,
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 15, // Un poco más rápidas y variadas
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
    </>
  );
}