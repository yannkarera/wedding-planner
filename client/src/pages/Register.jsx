import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Login.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = { name, email, password };
            await api.post('auth/register', formData);
            navigate('/login');
        } catch (err) {
            alert('Erreur : ' + (err.response?.data?.message || 'Impossible de s\'inscrire'));
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Inscription</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom</label>
                        <input type="text"
                            className="login-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Votre nom"
                        />
                    </div>
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
                        S'inscrire
                    </button>
                </form>
            </div>
            <button onClick={() => navigate(`/login`)} className="register-link">
                        Déja membre? Connectez-vous
            </button>
        </div>
    );
};

export default Register;