import { Link } from 'react-router-dom';

export default function Footer({ count }) {
  return (
    <footer className="py-12 border-t border-neon/20 relative">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-neon animate-pulse"></div> {/* rounded quitado */}
          <span className="text-lg font-bold text-neon">PDFPulse</span>
        </div>
        
        <nav className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-6 text-sm">
          <Link 
            to="/blog" 
            className="text-gray-400 hover:text-neon hover:underline transition-colors"
          >
            Blog
          </Link>
          <Link 
            to="/acerca-de" 
            className="text-gray-400 hover:text-neon hover:underline transition-colors"
          >
            Acerca de
          </Link>
          <Link 
            to="/contacto" 
            className="text-gray-400 hover:text-neon hover:underline transition-colors"
          >
            Contacto
          </Link>
          <Link 
            to="/politica-de-privacidad" 
            className="text-gray-400 hover:text-neon hover:underline transition-colors"
          >
            Política de Privacidad
          </Link>
        </nav>
        
        <p className="text-xs text-gray-500 mb-1">
          © 2025 PDFPulse.online • Hecho en México
        </p>
        <p className="text-xs text-neon-light animate-pulse">
          {count.toLocaleString()} PDFs procesados
        </p>
        <p className="text-xs text-gray-600 mt-3">
          Gratis ahora · Tokens pronto
        </p>
        
      </div>
    </footer>
  );
}