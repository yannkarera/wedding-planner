import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogOut, Plus, X } from 'lucide-react';
import '../styles/Dashboard.css'; // <--- IMPORT DU CSS ICI

const Dashboard = () => {
    const [weddings, setWeddings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', date: '', location: '' });
    const navigate = useNavigate();

    const fetchWeddings = async () => {
        try {
            const res = await api.get('/weddings');
            setWeddings(res.data.data || res.data);
        } catch (err) {
            console.error("Erreur fetch", err);
        }
    };

    useEffect(() => {
        fetchWeddings();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/weddings', formData);
            setShowForm(false);
            setFormData({ title: '', date: '', location: '' });
            fetchWeddings();
        } catch (err) {
            alert("Erreur lors de la création");
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Mes Mariages</h1>
                <button 
                    className="logout-btn"
                    onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
                >
                    Déconnexion
                </button>
            </header>

            <div className="weddings-grid">
                {/* BOUTON AJOUTER */}
                <div className="add-wedding-card" onClick={() => setShowForm(true)}>
                    <Plus size={40} color="#aaa" />
                    <span>Ajouter un mariage</span>
                </div>

                {/* LISTE DES MARIAGES */}
                {weddings.map((w) => (
                    <div key={w._id} className="wedding-card">
                        <h3>{w.name}</h3>
                        <p>📍 {w.location}</p>
                        <p>📅 {new Date(w.date).toLocaleDateString()}</p>
                        <button onClick={() => navigate(`/weddings/${w._id}`)} className="open-btn">
                            Gérer le mariage
                        </button>
                    </div>
                ))}
            </div>

            {/* MODALE FORMULAIRE */}
            {showForm && (
                <div className="modal-overlay">
                    <form onSubmit={handleCreate} className="modal-form">
                        <X className="close-icon" onClick={() => setShowForm(false)} />
                        <h2>Nouveau Mariage</h2>
                        <input
                            placeholder="Nom du mariage (ex: Julie & Thomas)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Lieu"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                        <button type="submit" className="submit-btn">
                            Créer le projet
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;