import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import About from '../pages/About';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Blog from '../pages/Blog';
import CreateProfile from '../pages/CreateProfile';
import AuthPage from '../pages/AuthPage';

// --- 1. Importa el guardián y las nuevas páginas ---
import ProtectedRoute from '../components/common/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Store from '../pages/Store'; // (Crearemos estos archivos ahora)

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/acerca-de" element={<About />} />
      <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Ruta semi-protegida: 
        CreateProfile maneja su propia lógica de redirección
      */}
      <Route path="/crear-perfil" element={<CreateProfile />} />

      {/* --- 2. Rutas Protegidas (NUEVAS) --- */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/comprar-tokens" 
        element={
          <ProtectedRoute>
            <Store />
          </ProtectedRoute>
        } 
      />

      {/* Ruta comodín */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}