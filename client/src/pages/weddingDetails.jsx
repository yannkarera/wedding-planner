import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  CircleDollarSign, 
  Briefcase, 
  Edit3, 
  Save, 
  X 
} from 'lucide-react';
import '../styles/weddingDetails.css';

const WeddingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // États pour l'édition
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', location: '', date: '' });

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const res = await api.get(`/weddings/${id}`);
        const data = res.data.data || res.data;
        setWedding(data);
        // On prépare déjà les données au cas où on clique sur "Modifier"
        setEditData({
          name: data.name,
          location: data.location,
          date: data.date.split('T')[0] // Format YYYY-MM-DD pour l'input date
        });
      } catch (err) {
        console.error("Erreur lors de la récupération du mariage", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchWeddingDetails();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/weddings/${id}`, editData);
      setWedding(res.data);
      setIsEditing(false);
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <div className="loading">Chargement du mariage...</div>;
  if (!wedding) return <div className="error">Mariage introuvable.</div>;

  return (
    <div className="details-container">
      {/* BARRE DE NAVIGATION HAUTE */}
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Retour au tableau de bord
      </button>

      <div className="details-card">
        <header className="details-header">
          {isEditing ? (
            /* FORMULAIRE D'ÉDITION */
            <form onSubmit={handleUpdate} className="edit-wedding-form">
              <input 
                className="edit-input-title"
                value={editData.name}
                onChange={e => setEditData({...editData, name: e.target.value})}
                placeholder='Ajouter un nom'
                required
              />
              <div className="edit-row">
                <div className="input-with-icon">
                  <MapPin size={16} />
                  <input 
                    value={editData.location}
                    onChange={e => setEditData({...editData, location: e.target.value})}
                    required
                  />
                </div>
                <div className="input-with-icon">
                  <Calendar size={16} />
                  <input 
                    type="date"
                    value={editData.date}
                    onChange={e => setEditData({...editData, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="edit-buttons">
                <button type="submit" className="btn-save"><Save size={16}/> Enregistrer</button>
                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}><X size={16}/> Annuler</button>
              </div>
            </form>
          ) : (
            /* AFFICHAGE NORMAL */
            <>
              <div className="header-top">
                <h1>{wedding.title}</h1>
                <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>
                  <Edit3 size={18} />
                </button>
              </div>
              <div className="details-info">
                <h1>{wedding.name}</h1>
                <span className="info-item"><MapPin size={18} /> {wedding.location}</span>
                <span className="info-item">
                  <Calendar size={18} /> {new Date(wedding.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
            </>
          )}
        </header>

        {/* GRILLE DE GESTION LOGISTIQUE */}
        <div className="management-grid">
          {/* Section Invités */}
          <div className="manage-box">
            <div className="icon-wrapper color-purple">
              <Users size={32} />
            </div>
            <h3>Invités</h3>
            <p>Gérer la liste, les présences et le plan de table.</p>
            <button onClick={() => navigate(`/guests/${id}`)} className="btn-manage btn-guests">
              Voir les invités
            </button>
          </div>

          {/* Section Budget */}
          <div className="manage-box">
            <div className="icon-wrapper color-green">
              <CircleDollarSign size={32} />
            </div>
            <h3>Budget</h3>
            <p>Suivez vos dépenses et les paiements effectués.</p>
            <button onClick={() => navigate(`/budgets/${id}`)} className="btn-manage btn-budget">
              Gérer le budget
            </button>
          </div>

          {/* Section Prestataires */}
          <div className="manage-box">
            <div className="icon-wrapper color-gold">
              <Briefcase size={32} />
            </div>
            <h3>Prestataires</h3>
            <p>Contacts, contrats et détails logistiques.</p>
            <button onClick={() => navigate(`/vendors/${id}`)} className="btn-manage btn-vendors">
              Gérer les prestataires
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingDetails;