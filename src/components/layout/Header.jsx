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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const displayName = userData?.displayName || currentUser?.email?.split('@')[0] || 'Usuario';
  const photoURL = userData?.photoURL || currentUser?.photoURL;
  const tokens = userData?.tokens || 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-neon/20">
      <div className="flex items-center gap-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="p-2 hover:bg-neon/10 transition"
          >
            <ArrowLeftIcon className="w-6 h-6 text-neon" />
          </button>
        ) : (
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-neon animate-pulse"></div>
            <span className="text-xl font-bold text-white group-hover:text-neon transition-colors">PDFPulse</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/contacto"
          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-neon transition-colors"
        >
          <EnvelopeIcon className="w-5 h-5" />
          Contacto
        </Link>

        {currentUser ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 pl-3 pr-2 py-1 bg-white/5 border border-neon/30 text-white text-sm font-medium hover:bg-neon/10 transition"
            >
              <div className="w-7 h-7 overflow-hidden bg-black/30">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Avatar"
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
                  className="absolute top-full right-0 mt-2 w-64 bg-black/80 backdrop-blur-lg border border-neon/30 shadow-neon-lg overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-neon/20">
                    <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>

                    <div className="sm:hidden flex items-center gap-1 text-neon mt-2">
                      <TicketIcon className="w-4 h-4" />
                      <span className="font-bold">{tokens} Tokens</span>
                    </div>
                  </div>

                  <nav className="p-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-neon/10 hover:text-neon transition-colors"
                    >
                      Mi Dashboard
                    </Link>
                    <Link
                      to="/store"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-neon/10 hover:text-neon transition-colors"
                    >
                      Comprar Tokens
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      Cerrar Sesión
                    </button>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            to="/auth"
            className="btn-neon px-5 py-2 text-sm font-bold"
          >
            Acceder
          </Link>
        )}
      </div>
    </header>
  );
}