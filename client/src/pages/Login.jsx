import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.message || 'Identifiants incorrects'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="login-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="votre@email.com"
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              className="login-input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>
      </div>
      <button onClick={() => navigate('/register')} className="register-link">
        Pas de compte ? Inscrivez-vous
      </button>
    </div>
    
  );
};

export default Login;