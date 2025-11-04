import { motion } from 'framer-motion';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Header({ onBack }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-neon/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LOGO + BACK */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-neon/10 transition"
            >
              <ArrowLeftIcon className="w-6 h-6 text-neon" />
            </button>
          )}
          <Link to="/" className="flex items-center">
            <motion.h1 
              className="text-2xl font-black text-neon text-glow"
            // ... (animación de motion no cambia)
            >
              PDF<span className="text-white">PULSE</span>
            </motion.h1>
          </Link>
        </div>

        {/* BOTONES DERECHA */}
        <div className="flex items-center gap-4"> {/* Aumenté el 'gap' de 3 a 4 */}
          
          {/* === INICIO: NUEVOS ENLACES DE NAVEGACIÓN === */}
          <Link 
            to="/blog" 
            className="text-sm font-medium text-gray-300 hover:text-neon transition-colors"
          >
            Blog
          </Link>
          <Link 
            to="/acerca-de" 
            className="text-sm font-medium text-gray-300 hover:text-neon transition-colors"
          >
            Acerca de
          </Link>
          {/* === FIN: NUEVOS ENLACES DE NAVEGACIÓN === */}


          {/* ENLACE A CONTACTO (ya existe) */}
          <Link
            to="/contacto"
            className="flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/30 rounded-xl text-neon text-sm font-medium hover:bg-neon/20 transition"
          >
            <EnvelopeIcon className="w-5 h-5" />
            Contacto
          </Link>

          {/* BOTÓN PREMIUM (ya existe) */}
          <button className="btn-neon text-sm px-5 py-2">
            PREMIUM
          </button>
        </div>
      </div>
    </header>
  );
}