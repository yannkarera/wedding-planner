import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Pendant que l'AuthContext vérifie le token au démarrage
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Si pas d'utilisateur (pas de token), redirection vers /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si tout est bon, on affiche la page demandée
  return children;
};

export default ProtectedRoute;