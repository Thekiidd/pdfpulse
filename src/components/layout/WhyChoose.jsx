import { motion } from 'framer-motion';
import { ShieldCheckIcon, BoltIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function WhyChoose() {
  const items = [
    { title: "Rápido", desc: "Procesamiento instantáneo", icon: BoltIcon },
    { title: "Simple", desc: "Sin registros ni complicaciones", icon: SparklesIcon },
    { title: "Seguro", desc: "Tus archivos nunca salen", icon: ShieldCheckIcon },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-black text-center mb-16 text-neon text-glow"
        >
          ¿Por qué PDFPulse?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -8 }}
              className="group text-center"
            >
              <div className="relative p-1 mb-6">
                <div className="absolute inset-0 bg-neon/20 blur-xl group-hover:blur-2xl transition"></div>
                <div className="relative p-6 bg-black/40 backdrop-blur-xl border border-neon/30"> {/* rounded-2xl quitado */}
                  <item.icon className="w-12 h-12 mx-auto text-neon group-hover:scale-110 transition" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-white group-hover:text-neon transition">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}