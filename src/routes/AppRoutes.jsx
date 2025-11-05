import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import About from '../pages/About';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import CreateProfile from '../pages/CreateProfile';
import AuthPage from '../pages/AuthPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Store from '../pages/Store'; 

import Blog from '../pages/Blog';
import BlogPost from '../pages/BlogPost'; // <-- ¡Asegúrate de tener esta!

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/acerca-de" element={<About />} />
      <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Rutas del Blog */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} /> {/* <-- ¡Y esta! */}

      {/* Ruta semi-protegida */}
      <Route path="/crear-perfil" element={<CreateProfile />} />

      {/* Rutas Protegidas */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/comprar-tokens" 
        element={<ProtectedRoute><Store /></ProtectedRoute>} 
      />

      {/* Ruta comodín */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}