import React, { createContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
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

  // --- Funciones de Login/Registro ---
  const signInWithGoogle = () => { return signInWithPopup(auth, googleProvider); };
  const registerWithEmail = (e, p) => { return createUserWithEmailAndPassword(auth, e, p); };
  const loginWithEmail = (e, p) => { return signInWithEmailAndPassword(auth, e, p); };
  const logout = () => { setUserData(null); return signOut(auth); };

  // --- Función para CREAR PERFIL (con Lógica de Avatar) ---
  const createUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
      return;
    }

    // --- Lógica de Avatar ---
    let photoURL = user.photoURL || null;
    if (!photoURL) {
      // Generamos un avatar con sus iniciales o email
      const seed = additionalData.displayName || user.email;
      photoURL = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
    }
    // --- Fin de la lógica de avatar ---

    const userDataBase = {
      uid: user.uid,
      email: user.email,
      photoURL: photoURL, // Usamos la URL de Google o la generada
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      tokens: { remaining: 150, lastRefill: serverTimestamp() },
      subscription: { plan: "free", status: "active", stripeCustomerId: null },
      personalInfo: {
        displayName: additionalData.displayName || user.displayName || 'Usuario PDFPulse',
        firstName: additionalData.firstName || null,
        lastName: additionalData.lastName || null,
        companyName: additionalData.companyName || null,
        jobTitle: null, phone: null, website: null,
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

  // --- Función para ACTUALIZAR DATOS DE TEXTO (Ahora incluye photoURL) ---
  const updateUserProfile = async (uid, dataToUpdate) => {
    if (!uid) return;
    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, dataToUpdate);
      const docSnap = await getDoc(userRef); // Vuelve a leer los datos
      if (docSnap.exists()) {
        setUserData(docSnap.data()); 
      }
      console.log("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw error; 
    }
  };

  // 4. Listener de Autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user); 
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
          setUserData(docSnap.data());
        } else {
          setUserData(null); 
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
    currentUser,
    userData,
    loading,
    signInWithGoogle,
    registerWithEmail,
    loginWithEmail,
    logout,
    createUserDocument,
    updateUserProfile 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}