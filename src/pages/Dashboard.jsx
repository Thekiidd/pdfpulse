import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background from '../components/layout/Background';
import { translations } from '../utils/translations';
import { 
  TicketIcon, BuildingOffice2Icon, EnvelopeIcon, UserCircleIcon, 
  IdentificationIcon, CreditCardIcon, SparklesIcon,
  PencilIcon, ArrowUpOnSquareIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// --- PESTAÑAS (TABS) ---
const TABS = {
  RESUMEN: 'resumen',
  PERFIL: 'perfil',
  FACTURACION: 'facturacion',
};

// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---
export default function Dashboard() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS.RESUMEN); // El estado ahora controla el contenido

  const t = translations['es'];
  const count = 0;

  if (!userData) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-neon">
        Cargando datos...
      </div>
    );
  }

  const { displayName } = userData.personalInfo;

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        <main className="flex-grow max-w-7xl mx-auto px-4 py-24 w-full">
          {/* --- Cabecera del Dashboard --- */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neon text-glow">
              Mi Cuenta
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Hola, {displayName}. Gestiona tu perfil y tus tokens.
            </p>
          </div>

          {/* --- Layout de 2 Columnas (Sidebar + Contenido) --- */}
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* --- 1. Sidebar de Navegación --- */}
            <aside className="md:w-1/4">
              <nav className="flex flex-row md:flex-col gap-2 p-2 bg-white/5 border border-neon/30 rounded-2xl">
                <SidebarTab
                  title="Resumen"
                  icon={SparklesIcon}
                  isActive={activeTab === TABS.RESUMEN}
                  onClick={() => setActiveTab(TABS.RESUMEN)}
                />
                <SidebarTab
                  title="Editar Perfil"
                  icon={IdentificationIcon}
                  isActive={activeTab === TABS.PERFIL}
                  onClick={() => setActiveTab(TABS.PERFIL)}
                />
                <SidebarTab
                  title="Facturación"
                  icon={CreditCardIcon}
                  isActive={activeTab === TABS.FACTURACION}
                  onClick={() => setActiveTab(TABS.FACTURACION)}
                  disabled={true} // (Sigue deshabilitada)
                />
              </nav>
            </aside>

            {/* --- 2. Área de Contenido Principal --- */}
            <section className="md:w-3/4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab} // El key hace que la animación funcione al cambiar de tab
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === TABS.RESUMEN && <DashboardResumen userData={userData} />}
                  {activeTab === TABS.PERFIL && <ProfileForm userData={userData} />}
                  {activeTab === TABS.FACTURACION && (
                    <div className="text-center py-20 bg-white/5 p-8 rounded-3xl border border-neon/30">
                      <h2 className="text-2xl font-bold text-gray-400">Próximamente...</h2>
                      <p className="text-gray-500">Aquí podrás gestionar tus métodos de pago y ver facturas.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </section>

          </div>
        </main>
        <Footer t={t} count={count} />
      </div>
    </>
  );
}

// --- Componente de Botón del Sidebar ---
function SidebarTab({ title, icon: Icon, isActive, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold 
                  rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-neon/10 text-neon' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon className="w-5 h-5" />
      {title}
    </button>
  );
}


// --- PESTAÑA 1: Resumen (Se queda igual) ---
function DashboardResumen({ userData }) {
  // ... (El código de DashboardResumen no cambia) ...
  const { displayName, companyName } = userData.personalInfo;
  const { remaining } = userData.tokens;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-neon/30 shadow-neon-lg flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neon uppercase tracking-wider mb-2">Tokens Disponibles</h2>
          <div className="text-6xl font-black text-white mb-4">
            {remaining}
          </div>
        </div>
        <Link
          to="/comprar-tokens"
          className="btn-neon w-full md:w-auto text-center px-6 py-3 text-sm font-bold tracking-wider rounded-lg"
        >
          Comprar más Tokens
        </Link>
      </div>
      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-neon/30 shadow-neon-lg">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Mi Perfil (Resumen)</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-black/30 flex-shrink-0">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="w-full h-full text-neon/60 p-1" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{displayName}</h3>
              <p className="text-sm text-gray-400">Usuario de PDFPulse</p>
            </div>
          </div>
          <div className="border-t border-neon/20 pt-4 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <EnvelopeIcon className="w-5 h-5 text-neon" />
              <span>{userData.email}</span>
            </div>
            {companyName && (
              <div className="flex items-center gap-3 text-gray-300">
                <BuildingOffice2Icon className="w-5 h-5 text-neon" />
                <span>{companyName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// --- PESTAÑA 2: Formulario de Perfil (¡ACTUALIZADO CON UPLOAD DE IMAGEN!) ---
function ProfileForm({ userData }) {
  const { currentUser, updateUserProfile, uploadProfileImage } = useAuth();
  
  const [formData, setFormData] = useState({ /* ... */ });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // ¡NUEVO!
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null); // Ref para el input de archivo

  // Carga los datos existentes de 'userData' en el formulario
  useEffect(() => {
    if (userData && userData.personalInfo) {
      setFormData({
        displayName: userData.personalInfo.displayName || '',
        firstName: userData.personalInfo.firstName || '',
        lastName: userData.personalInfo.lastName || '',
        companyName: userData.personalInfo.companyName || '',
        jobTitle: userData.personalInfo.jobTitle || '',
        phone: userData.personalInfo.phone || '',
        website: userData.personalInfo.website || '',
        linkedin: userData.personalInfo.socialLinks?.linkedin || '',
        twitter: userData.personalInfo.socialLinks?.twitter || '',
        github: userData.personalInfo.socialLinks?.github || '',
      });
    }
  }, [userData]);

  // Manejador para actualizar el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- ¡NUEVO! Manejador para Subir Imagen ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { // Límite de 5MB
      setError("El archivo es muy grande (máx. 5MB)");
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      await uploadProfileImage(file, currentUser.uid);
      setSuccess(true); // El 'userData' se actualizará desde el context
    } catch (err) {
      setError("Error al subir la imagen.");
      console.error(err);
    }
    setUploading(false);
  };

  // --- Manejador para guardar datos de TEXTO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const dataToUpdate = {
      'personalInfo.displayName': formData.displayName,
      'personalInfo.firstName': formData.firstName,
      'personalInfo.lastName': formData.lastName,
      'personalInfo.companyName': formData.companyName,
      'personalInfo.jobTitle': formData.jobTitle,
      'personalInfo.phone': formData.phone,
      'personalInfo.website': formData.website,
      'personalInfo.socialLinks.linkedin': formData.linkedin,
      'personalInfo.socialLinks.twitter': formData.twitter,
      'personalInfo.socialLinks.github': formData.github,
    };

    try {
      await updateUserProfile(currentUser.uid, dataToUpdate);
      setSuccess(true);
    } catch (err) {
      setError("Error al guardar. Inténtalo de nuevo.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-neon/30 shadow-neon-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- Sección de Imagen de Perfil --- */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-black/30 flex-shrink-0">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt={formData.displayName} className="w-full h-full object-cover" />
            ) : (
              <UserCircleIcon className="w-full h-full text-neon/60 p-2" />
            )}
            {/* Overlay de Carga */}
            {uploading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-neon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Editar Foto de Perfil</h2>
            <p className="text-sm text-gray-400 mb-3">Sube una imagen (JPG, PNG, máx 5MB)</p>
            <input 
              type="file" 
              accept="image/png, image/jpeg"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/30 rounded-xl text-neon text-sm font-medium hover:bg-neon/20 transition disabled:opacity-50"
            >
              <ArrowUpOnSquareIcon className="w-5 h-5" />
              {uploading ? 'Cargando...' : 'Subir Imagen'}
            </button>
          </div>
        </div>

        <div className="border-t border-neon/20"></div>
        
        {/* Sección 1: Perfil Básico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput 
            label="Nombre para mostrar (Público)" 
            name="displayName" 
            value={formData.displayName} 
            onChange={handleChange}
            required={true}
          />
          <FormInput 
            label="Puesto de trabajo" 
            name="jobTitle" 
            value={formData.jobTitle} 
            onChange={handleChange}
            placeholder="Ej: Desarrollador, Estudiante"
          />
          {/* ... (resto de inputs: firstName, lastName, companyName, phone) ... */}
           <FormInput Name="firstName" value={formData.firstName} onChange={handleChange} />
           <FormInput label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} />
           <FormInput label="Compañía" name="companyName" value={formData.companyName} onChange={handleChange} />
           <FormInput label="Teléfono" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        </div>
        
        <div className="border-t border-neon/20"></div>

        {/* Sección 2: Enlaces Sociales */}
        <h3 className="text-lg font-semibold text-gray-200">Enlaces y Redes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... (inputs: website, linkedin, twitter, github) ... */}
           <FormInput label="Sitio Web" name="website" type="url" value={formData.website} onChange={handleChange} placeholder="https://... " />
           <FormInput label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="linkedin.com/in/..." />
           <FormInput label="Twitter / X" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="twitter.com/..." />
           <FormInput label="GitHub" name="github" value={formData.github} onChange={handleChange} placeholder="github.com/..." />
        </div>

        {/* Botón de Guardar y Mensajes */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-green-400"
                onAnimationComplete={() => setTimeout(() => setSuccess(false), 2000)} // Desaparece
              >
                ¡Guardado!
              </motion.div>
            )}
            {error && <div className="text-sm text-red-400">{error}</div>}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-neon px-8 py-3 text-sm font-bold tracking-wider rounded-lg disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </form>
    </div>
  );
}

// --- Componente Reutilizable de Input ---
function FormInput({ label, name, type = 'text', value, onChange, placeholder = '', required = false }) {
  // ... (Este componente no cambia) ...
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-neon">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 bg-black/30 border border-neon/20 rounded-lg text-white
                   focus:outline-none focus:ring-2 focus:ring-neon"
      />
    </div>
  );
}