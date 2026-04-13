import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Au chargement, on vérifie si un token existe
    const token = localStorage.getItem('token');
    if (token) {
      // Optionnel : tu pourrais appeler une route /me ici pour vérifier le token
      setUser({ token }); 
    }
    setLoading(false);
  }, []);
const login = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    
    // On va chercher le token là où il se cache vraiment
    const token = res.data.data.token; 
    const userData = res.data.data.user;

    if (token) {
      localStorage.setItem('token', token);
      setUser(userData); // On stocke les infos de l'user (id, email, etc.)
      return res.data;
    } else {
      console.error("Structure reçue mais token absent :", res.data);
      throw new Error("Token non trouvé dans la réponse");
    }
  } catch (err) {
    throw err;
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
