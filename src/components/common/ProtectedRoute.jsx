import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Muestra un spinner mientras se verifica la autenticación
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-neon">
        Cargando sesión...
      </div>
    );
  }

  // 1. No está logueado -> A la página de autenticación
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 2. Está logueado, PERO no ha completado su perfil (userData es null)
  if (currentUser && !userData) {
    // Lo forzamos a ir a crear su perfil
    return <Navigate to="/crear-perfil" state={{ from: location }} replace />;
  }

  // 3. ¡Éxito! Está logueado y tiene perfil
  return children;
}