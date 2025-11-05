import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="py-20 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto px-4 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-neon text-glow">
          ¿Listo para el futuro del PDF?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Miles ya lo usan. <span className="text-neon-light">Tú eres el siguiente.</span>
        </p>
        <button className="btn-neon px-12 py-4 text-xl">
          Comenzar Ahora
        </button>
      </motion.div>
    </section>
  );
}