import React, { createContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword, // <-- Para registro con email
  signInWithEmailAndPassword    // <-- Para login con email
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

// 1. Creamos y EXPORTAMOS el Contexto
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// 2. Hook 'useAuth' (como lo querías)
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return React.useContext(AuthContext);
}

// 3. Proveedor que envolverá la aplicación
export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Usuario de Firebase Auth
  const [userData, setUserData] = useState(null);     // Datos de Firestore (Nuestra estructura)
  const [loading, setLoading] = useState(true);

  // --- Función de Login con Google ---
  const signInWithGoogle = () => {
    // onAuthStateChanged se encargará de detectar el login/registro
    return signInWithPopup(auth, googleProvider);
  };

  // --- Función de Registro con Email ---
  const registerWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // --- Función de Login con Email ---
  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // --- Función de Logout ---
  const logout = () => {
    setUserData(null);
    return signOut(auth);
  };

  // --- Función para CREAR PERFIL (llamada desde la página CreateProfile) ---
  const createUserDocument = async (user, additionalData) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    
    // Prepara los datos base del usuario
    const userDataBase = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      tokens: {
        remaining: 150, // ¡Tokens de regalo!
        lastRefill: serverTimestamp()
      },
      subscription: {
        plan: "free",
        status: "active",
        stripeCustomerId: null
      },
      // Fusiona la estructura de personalInfo con los datos del formulario
      personalInfo: {
        displayName: additionalData.displayName || user.displayName || 'Usuario PDFPulse',
        firstName: additionalData.firstName || null,
        lastName: additionalData.lastName || null,
        companyName: additionalData.companyName || null,
        jobTitle: additionalData.jobTitle || null,
        phone: additionalData.phone || null,
        website: additionalData.website || null,
        address: { street: null, city: null, state: null, postalCode: null, country: null },
        socialLinks: { linkedin: null, twitter: null, github: null },
        preferences: { language: "es", timezone: "America/Mexico_City" }
      }
    };

    try {
      // Escribe el documento en Firestore
      await setDoc(userRef, userDataBase);
      // Actualiza el estado local para que la app reaccione
      setUserData(userDataBase); 
    } catch (error) {
      console.error("Error al crear el documento del usuario:", error);
    }
  };

  // 4. Listener de Autenticación (La Lógica de Redirección)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user); // Pone el usuario de Auth
      
      if (user) {
        // Usuario logueado. ¿Tiene perfil en Firestore?
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          // --- Usuario que REGRESA ---
          // Tiene perfil. Actualiza su 'lastLogin' y carga sus datos.
          await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
          setUserData(docSnap.data());
        } else {
          // --- Usuario NUEVO ---
          // Es nuevo (o se logueó con Google por 1ra vez).
          // Dejamos userData como 'null'.
          // La app (nuestras páginas) detectará esto y lo forzará a ir a /crear-perfil
          setUserData(null); 
        }
      } else {
        // No logueado
        setUserData(null);
      }
      setLoading(false); // Terminamos de cargar
    });
    return unsubscribe;
  }, []);

  // 5. Valores compartidos
  const value = {
    currentUser,    // user.uid, user.email
    userData,       // null o { tokens: ..., personalInfo: ... }
    loading,        // true/false
    signInWithGoogle,
    registerWithEmail,
    loginWithEmail,
    logout,
    createUserDocument // <-- Exponemos la función para crear el perfil
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}