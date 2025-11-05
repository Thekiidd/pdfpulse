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
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'; // <-- ¡NUEVO!
import { auth, googleProvider, db, storage } from '../firebase'; // <-- ¡NUEVO!

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return React.useContext(AuthContext);
}

// eslint-disable-next-line react-refresh/only-export-components
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); 
  const [userData, setUserData] = useState(null);     
  const [loading, setLoading] = useState(true);

  // ... (Las funciones signInWithGoogle, registerWithEmail, loginWithEmail, logout no cambian) ...
  const signInWithGoogle = () => { return signInWithPopup(auth, googleProvider); };
  const registerWithEmail = (e, p) => { return createUserWithEmailAndPassword(auth, e, p); };
  const loginWithEmail = (e, p) => { return signInWithEmailAndPassword(auth, e, p); };
  const logout = () => { setUserData(null); return signOut(auth); };

  // --- Función para CREAR PERFIL (Sigue igual) ---
  const createUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
      return;
    }
    const userDataBase = {
      // ... (toda la estructura de datos que definimos) ...
      uid: user.uid, email: user.email, photoURL: user.photoURL || null,
      createdAt: serverTimestamp(), lastLogin: serverTimestamp(),
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

  // --- Función para ACTUALIZAR DATOS DE TEXTO ---
  const updateUserProfile = async (uid, dataToUpdate) => {
    if (!uid) return;
    const userRef = doc(db, 'users', uid);
    try {
      // 1. Actualiza la base de datos
      await updateDoc(userRef, dataToUpdate);
      // 2. Vuelve a leer los datos frescos de la BD
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        // 3. Actualiza el estado local para que la UI reaccione
        setUserData(docSnap.data()); 
      }
      console.log("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw error; 
    }
  };

  // --- ¡NUEVA FUNCIÓN PARA SUBIR IMAGEN! ---
  const uploadProfileImage = async (file, uid) => {
    if (!file || !uid) return;

    // 1. Define la ruta en Firebase Storage
    const storageRef = ref(storage, `profileImages/${uid}/${file.name}`);
    
    try {
      // 2. Sube el archivo
      const snapshot = await uploadBytes(storageRef, file);
      
      // 3. Obtiene la URL pública del archivo subido
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 4. Actualiza el campo 'photoURL' en Firestore
      await updateUserProfile(uid, {
        photoURL: downloadURL
      });

      console.log("Imagen subida y perfil actualizado!");
      return downloadURL; // Devuelve la URL por si la UI la necesita

    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw error;
    }
  };

  // 4. Listener de Autenticación (Sigue igual)
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

  // 5. Valores compartidos (¡Añadimos las nuevas funciones!)
  const value = {
    currentUser,
    userData,
    loading,
    signInWithGoogle,
    registerWithEmail,
    loginWithEmail,
    logout,
    createUserDocument,
    updateUserProfile,
    uploadProfileImage // <-- ¡NUEVO!
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}