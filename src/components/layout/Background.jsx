// src/components/layout/Background.jsx
import { motion } from 'framer-motion';

export default function Background() {
  return (
    <>
      {/* Imagen de fondo */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url(/Background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Overlay oscuro */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black/90 via-black/70 to-black/90" />

      {/* Partículas flotantes */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon rounded-full opacity-70"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{ y: -50 }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </>
  );
}