import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background from '../components/layout/Background';
import { translations } from '../utils/translations';

export default function CreateProfile() {
  const { currentUser, userData, loading, createUserDocument } = useAuth();
  const navigate = useNavigate();

  // Estado del formulario
  const [displayName, setDisplayName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Lógica de Redirección (Guardia) ---
  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        // 1. Si NO está logueado, patada al login
        navigate('/auth'); // Actualizado a /auth
      } else if (currentUser && userData) {
        // 2. Si SÍ está logueado Y SÍ tiene datos (perfil), patada al Home
        // Esto evita que usuarios existentes vuelvan a esta página
        navigate('/');
      }
      // 3. Si SÍ está logueado Y NO tiene datos (userData es null),
      // se queda en esta página para rellenar el formulario (¡Correcto!)
    }
  }, [currentUser, userData, loading, navigate]);

  // --- Precarga el nombre de Google ---
  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [currentUser]);


  // --- Manejador del Formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    if (!displayName) {
      setError('Por favor, ingresa al menos un nombre para mostrar.');
      setFormLoading(false);
      return;
    }

    try {
      // Prepara los datos adicionales del formulario
      const additionalData = {
        displayName,
        firstName,
        lastName,
        companyName
        // (los demás campos de personalInfo se quedan en null)
      };

      // Llama a la función del context para crear el documento EN FIRESTORE
      // Esta función también le asignará sus 150 tokens
      await createUserDocument(currentUser, additionalData);
      
      // ¡Éxito! El context ahora tendrá 'userData'
      // Lo enviamos al Home
      navigate('/dashboard');
      
    } catch (err) {
      setError('Error al guardar el perfil. Inténtalo de nuevo.');
      console.error(err);
    }
    setFormLoading(false);
  };

  // (Para Footer)
  const t = translations['es'];
  const count = 0;

  // No renderiza nada hasta que la carga inicial del Auth termine
  if (loading || !currentUser || userData) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-neon">
        {/* Puedes poner un spinner aquí */}
        Cargando...
      </div>
    );
  }

  // --- Renderiza el Formulario ---
  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        <main className="flex-grow flex items-center justify-center py-24 px-4">
          <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-neon/30 shadow-neon-lg">
            
            <h1 className="text-4xl font-bold mb-2 text-neon text-glow text-center">
              ¡Bienvenido a PDFPulse!
            </h1>
            <p className="text-lg text-gray-300 text-center mb-6">
              Completa tu perfil para obtener tus 150 tokens de prueba.
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            {/* --- Formulario de Perfil --- */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre para mostrar (Público) <span className="text-neon">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-black/30 border border-neon/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre (Opcional)
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 bg-black/30 border border-neon/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Apellido (Opcional)
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 bg-black/30 border border-neon/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Compañía (Opcional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 bg-black/30 border border-neon/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon"
                />
              </div>
              
              <button
                type="submit"
                disabled={formLoading}
                className="w-full btn-neon px-5 py-3 text-sm font-bold tracking-wider rounded-lg disabled:opacity-50"
              >
                {formLoading ? 'Guardando...' : 'Guardar y Obtener Tokens'}
              </button>
            </form>

          </div>
        </main>
        <Footer t={t} count={count} />
      </div>
    </>
  );
}