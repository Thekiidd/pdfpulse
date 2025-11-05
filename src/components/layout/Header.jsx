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
import { useAuth } from '../../context/AuthContext'; 

export default function Header({ onBack }) {
  const { currentUser, userData, logout } = useAuth(); 

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-neon/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-neon/10 transition" // rounded-lg quitado
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

        <div className="flex items-center gap-4 md:gap-6">
          
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

          <div className="flex items-center">
            {currentUser && userData ? (
              <UserMenu user={userData} onLogout={logout} />
            ) : !currentUser ? (
              <Link
                to="/auth"
                className="btn-neon text-sm px-5 py-2" // (btn-neon no tiene radius)
              >
                Iniciar Sesión
              </Link>
            ) : (
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = async () => {
    setIsOpen(false);
    await onLogout();
    navigate('/');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-3 pr-2 py-1 bg-white/5 border border-neon/30 text-white text-sm font-medium hover:bg-neon/10 transition" // rounded-full quitado
      >
        <div className="w-7 h-7 overflow-hidden bg-black/30"> {/* rounded-full quitado */}
          {photoURL ? (
            <img 
              src={photoURL} 
              alt={displayName} 
              className="w-full h-full object-cover" 
              onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`}
            />
          ) : (
            <UserCircleIcon className="w-full h-full text-neon/60" />
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-1 text-neon">
          <TicketIcon className="w-4 h-4" />
          <span className="font-bold">{tokens}</span>
        </div>
        
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-64 bg-black/80 backdrop-blur-lg border border-neon/30 shadow-neon-lg overflow-hidden z-50" // rounded-2xl quitado
          >
            <div className="p-4 border-b border-neon/20">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              
              <div className="sm:hidden flex items-center gap-1 text-neon mt-2">
                <TicketIcon className="w-4 h-4" />
                <span className="font-bold">{tokens} Tokens</span>
              </div>
            </div>

            <nav className="p-2">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:bg-neon/10 hover:text-neon transition-colors" // rounded-lg quitado
              >
                Mi Dashboard
              </Link>
              <Link
                to="/comprar-tokens"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:bg-neon/10 hover:text-neon transition-colors" // rounded-lg quitado
              >
                Comprar Tokens
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors" // rounded-lg quitado
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