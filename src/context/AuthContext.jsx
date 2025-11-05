import React, { createContext, useState, useEffect } from 'react';
import { 
  // CAMBIOS AQUÍ: Usamos la versión Redirect
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getRedirectResult // <-- ¡NUEVO!
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

// 1. Creamos y EXPORTAMOS el Contexto
export const AuthContext = createContext();

// 2. Hook 'useAuth'
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return React.useContext(AuthContext);
}

// 3. Proveedor
// eslint-disable-next-line react-refresh/only-export-components
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); 
  const [userData, setUserData] = useState(null);     
  const [loading, setLoading] = useState(true);

  // --- Función de Login con Google (¡CAMBIO A REDIRECT!) ---
  const signInWithGoogle = () => {
    // Esto redirige la página completa a Google
    return signInWithRedirect(auth, googleProvider);
  };

  // --- Función de Registro con Email ---
  const registerWithEmail = (e, p) => { return createUserWithEmailAndPassword(auth, e, p); };
  
  // --- Función de Login con Email ---
  const loginWithEmail = (e, p) => { return signInWithEmailAndPassword(auth, e, p); };
  
  // --- Función de Logout ---
  const logout = () => { 
    setUserData(null); 
    // Limpia cualquier estado de redirección antes de salir
    sessionStorage.removeItem('redirecting'); 
    return signOut(auth); 
  };

  // --- Función para CREAR PERFIL (Lógica sin cambios) ---
  const createUserDocument = async (user, additionalData) => {
    // ... (Lógica de creación de perfil y tokens) ...
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
      return;
    }
    const seed = additionalData.displayName || user.email;
    const photoURL = user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
    const userDataBase = {
      uid: user.uid, email: user.email, photoURL: photoURL,
      createdAt: serverTimestamp(), lastLogin: serverTimestamp(),
      tokens: { remaining: 150, lastRefill: serverTimestamp() },
      subscription: { plan: "free", status: "active", stripeCustomerId: null },
      personalInfo: {
        displayName: additionalData.displayName || user.displayName || 'Usuario PDFPulse',
        firstName: additionalData.firstName || null, lastName: additionalData.lastName || null,
        companyName: additionalData.companyName || null, jobTitle: null, phone: null, website: null,
        address: { street: null, city: null, state: null, postalCode: null, country: null },
        socialLinks: { linkedin: null, twitter: null, github: null },
        preferences: { language: "es", timezone: "America/Mexico_City" }
      }
    };
    try {
      await setDoc(userRef, userDataBase);
      setUserData(userDataBase); 
    } catch (error) { console.error("Error al crear el documento:", error); }
  };

  // --- Función para ACTUALIZAR DATOS DE TEXTO (Sin cambios) ---
  const updateUserProfile = async (uid, dataToUpdate) => {
    if (!uid) return;
    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, dataToUpdate);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data()); 
      }
      console.log("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw error; 
    }
  };

  // 4. Listener de Autenticación (¡NUEVA LÓGICA PARA REDIRECCIÓN!)
  useEffect(() => {
    // 4A. Manejar el resultado de la redirección al cargar la app
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // Si hay resultado, significa que acabamos de regresar de Google
          // Limpiamos el indicador para no causar ciclos de carga
          sessionStorage.removeItem('redirecting'); 
          
          // result.user ya está autenticado. onAuthStateChanged lo detectará
          // y actualizará currentUser y userData
          
          // OPCIONAL: Forzar la creación del documento si regresa de registro/login
          // await createUserDocument(result.user, {}); 

          // El listener principal de onAuthStateChanged se dispara y toma el control
        }
      } catch (error) {
        console.error("Error al obtener el resultado de la redirección:", error);
        sessionStorage.removeItem('redirecting'); 
        // Si hay un error, el loading se manejará en el listener principal
      }
    };

    handleRedirectResult();

    // 4B. Listener principal para cualquier cambio de estado
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user); 
      
      // Si estamos en un estado de 'redirecting' (justo antes de ir a Google), 
      // no mostramos el contenido, solo el spinner (esto previene destellos)
      if (sessionStorage.getItem('redirecting')) {
         setLoading(true);
         return;
      }
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
          setUserData(docSnap.data());
        } else {
          setUserData(null); // Es nuevo, irá a /crear-perfil
        }
      } else {
        setUserData(null);
      }
      setLoading(false); 
    });
    return unsubscribe;
  }, []);

  // 5. Valores compartidos
  const value = {
    currentUser, userData, loading,
    signInWithGoogle, registerWithEmail, loginWithEmail,
    logout, createUserDocument, updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Añadimos un chequeo de sesión para mostrar un spinner al inicio */}
      {loading ? (
          <div className="bg-black min-h-screen flex items-center justify-center text-neon">
            Cargando Sesión...
          </div>
        ) : (
          children
        )}
    </AuthContext.Provider>
  );
}