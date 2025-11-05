import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background from '../components/layout/Background';
import { GoogleIcon } from '../components/common/Icons';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default function AuthPage() {
  const [view, setView] = useState('login'); // 'login' o 'register'
  
  const count = 0;

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        <main className="flex-grow flex items-center justify-center py-24 px-4">
          
          <LayoutGroup>
            <div className="w-full max-w-4xl min-h-[600px] flex overflow-hidden
                            bg-white/5 backdrop-blur-xl border border-neon/30 shadow-neon-lg"> {/* rounded-3xl quitado */}

              {/* === PANEL DE FORMULARIO === */}
              <motion.div 
                layout
                transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
                className={`w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center ${view === 'login' ? 'order-1' : 'order-2'}`}
              >
                <AnimatePresence mode="wait">
                  {view === 'login' ? (
                    <AuthForm key="login" setView={setView} />
                  ) : (
                    <AuthForm key="register" isRegister setView={setView} />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* === PANEL DE INFORMACIÓN === */}
              <motion.div 
                layout
                transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
                className={`w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-black/20 ${view === 'login' ? 'order-2' : 'order-1'}`}
              >
                <AnimatePresence mode="wait">
                  {view === 'login' ? (
                    <InfoPanel key="loginInfo" setView={setView} />
                  ) : (
                    <InfoPanel key="registerInfo" isRegister setView={setView} />
                  )}
                </AnimatePresence>
              </motion.div>

            </div>
          </LayoutGroup>

        </main>
        <Footer  count={count} />
      </div>
    </>
  );
}


// --- SUB-COMPONENTE: Panel de Información ---
function InfoPanel({ isRegister = false, setView }) {
  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center"
    >
      {isRegister ? (
        <>
          <h2 className="text-3xl font-bold text-white mb-4">¿Ya tienes cuenta?</h2>
          <p className="text-gray-300 mb-6">
            Inicia sesión para acceder a tus herramientas y tokens guardados.
          </p>
          <button
            onClick={() => setView('login')}
            className="btn-neon-outline px-8 py-3 text-sm font-bold tracking-wider" // rounded-lg quitado
          >
            Iniciar Sesión
          </button>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-white mb-4">¿Eres nuevo aquí?</h2>
          <p className="text-gray-300 mb-6">
            Regístrate gratis y obtén 150 tokens de prueba para nuestras herramientas avanzadas.
          </p>
          <button
            onClick={() => setView('register')}
            className="btn-neon px-8 py-3 text-sm font-bold tracking-wider" // rounded-lg quitado
          >
            Crear Cuenta Gratis
          </button>
        </>
      )}
    </motion.div>
  );
}


// --- SUB-COMPONENTE: Formulario (Maneja ambos) ---
function AuthForm({ isRegister = false, setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, registerWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
        navigate('/crear-perfil'); 
      } else {
        await loginWithEmail(email, password);
        navigate('/dashboard'); // Al Dashboard al iniciar sesión
      }
    } catch (err) {
      if (isRegister) {
        if (err.code === 'auth/email-already-in-use') setError('Este correo ya está en uso.');
        else setError('Error al crear la cuenta.');
      } else {
        if (err.code.includes('auth/invalid-credential')) setError('Correo o contraseña incorrectos.');
        else setError('Error al iniciar sesión.');
      }
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      await signInWithGoogle();
      navigate('/dashboard'); // Al Dashboard (el guardián decidirá si va a /crear-perfil)
    } catch (err) {
      setError('Error al iniciar sesión con Google.');
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-4xl font-bold mb-6 text-neon text-glow text-center">
        {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
      </h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 mb-4 text-center"> {/* rounded-lg quitado */}
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleAuth}
        className="w-full flex justify-center items-center gap-3 px-5 py-3 text-sm font-medium border border-neon/20 bg-black/30 hover:bg-neon/10 transition-colors mb-6" // rounded-lg quitado
      >
        <GoogleIcon className="w-5 h-5" />
        {isRegister ? 'Continuar con Google' : 'Continuar con Google'}
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neon/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">O usa tu email</span> {/* rounded-full quitado */}
        </div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-black/30 border border-neon/20 text-white focus:outline-none focus:ring-2 focus:ring-neon" // rounded-lg quitado
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña (mín. 6 caracteres)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 bg-black/30 border border-neon/20 text-white focus:outline-none focus:ring-2 focus:ring-neon" // rounded-lg quitado
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-neon px-5 py-3 text-sm font-bold tracking-wider disabled:opacity-50" // rounded-lg quitado
        >
          {loading ? 'Cargando...' : (isRegister ? 'Crear cuenta' : 'Iniciar Sesión')}
        </button>
      </form>
    </motion.div>
  );
}