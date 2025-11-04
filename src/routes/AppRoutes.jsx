import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import About from '../pages/About';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Blog from '../pages/Blog';

// === Importa las nuevas páginas de autenticación ===
import Login from '../pages/Login';
import Register from '../pages/Register';
import CreateProfile from '../pages/CreateProfile';
// (Crearemos estos archivos en el siguiente paso)

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/acerca-de" element={<About />} />
      <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
      <Route path="/blog" element={<Blog />} />

      {/* === Rutas de Autenticación === */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* === Rutas Protegidas (Ejemplo Básico) === */}
      {/* Más adelante haremos esto más robusto con un 'ProtectedRoute' */}
      <Route path="/crear-perfil" element={<CreateProfile />} />

      {/* Ruta comodín */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
