import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon,
  ChevronDownIcon,
  TicketIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importamos el hook

export default function Header({ onBack }) {
  const { currentUser, userData, logout } = useAuth(); // Obtenemos el estado del usuario

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-neon/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* === LOGO + BOTÓN ATRÁS (Sin cambios) === */}
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
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(255,0,51,0.5)",
                  "0 0 30px rgba(255,0,51,0.8)",
                  "0 0 10px rgba(255,0,51,0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              PDF<span className="text-white">PULSE</span>
            </motion.h1>
          </Link>
        </div>

        {/* === BOTONES DERECHA (¡Ahora dinámico!) === */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* --- Enlaces Públicos (Blog, Acerca de, Contacto) --- */}
          {/* Ocultos en móvil para dar espacio al menú de usuario */}
          <nav className="hidden md:flex items-center gap-4 md:gap-6">
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
            <Link
              to="/contacto"
              className="text-sm font-medium text-gray-300 hover:text-neon transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* --- Bloque de Autenticación (La Magia) --- */}
          <div className="flex items-center">
            {currentUser && userData ? (
              // 1. ESTADO: Logueado y con perfil
              <UserMenu user={userData} onLogout={logout} />
            ) : !currentUser ? (
              // 2. ESTADO: No Logueado
              <Link
                to="/auth"
                className="btn-neon text-sm px-5 py-2"
              >
                Iniciar Sesión
              </Link>
            ) : (
              // 3. ESTADO: Logueado pero sin perfil (en /crear-perfil)
              <Link
                to="/crear-perfil"
                className="btn-neon text-sm px-5 py-2 animate-pulse"
              >
                Completar Perfil
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// --- SUB-COMPONENTE: Menú de Usuario (Dropdown) ---
function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const displayName = user.personalInfo?.displayName || 'Usuario';
  const photoURL = user.photoURL;
  const tokens = user.tokens?.remaining;

  // --- Cierra el menú si se hace clic fuera ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // --- Maneja el Logout y redirige ---
  const handleLogout = async () => {
    setIsOpen(false);
    await onLogout();
    navigate('/');
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* --- Botón que abre el menú --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-3 pr-2 py-1 bg-white/5 border border-neon/30 rounded-full text-white text-sm font-medium hover:bg-neon/10 transition"
      >
        {/* Foto de perfil o icono */}
        <div className="w-7 h-7 rounded-full overflow-hidden bg-black/30">
          {photoURL ? (
            <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <UserCircleIcon className="w-full h-full text-neon/60" />
          )}
        </div>
        
        {/* Tokens (Visible en pantallas más grandes) */}
        <div className="hidden sm:flex items-center gap-1 text-neon">
          <TicketIcon className="w-4 h-4" />
          <span className="font-bold">{tokens}</span>
        </div>
        
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* --- Panel del Menú Desplegable --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-64 bg-black/80 backdrop-blur-lg border border-neon/30 rounded-2xl shadow-neon-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b border-neon/20">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              
              {/* Tokens (Visible en móvil aquí) */}
              <div className="sm:hidden flex items-center gap-1 text-neon mt-2">
                <TicketIcon className="w-4 h-4" />
                <span className="font-bold">{tokens} Tokens</span>
              </div>
            </div>

            <nav className="p-2">
              <Link
                to="/dashboard" // (Página futura)
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:bg-neon/10 hover:text-neon rounded-lg transition-colors"
              >
                Mi Perfil
              </Link>
              <Link
                to="/comprar-tokens" // (Página futura)
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:bg-neon/10 hover:text-neon rounded-lg transition-colors"
              >
                Comprar Tokens
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}