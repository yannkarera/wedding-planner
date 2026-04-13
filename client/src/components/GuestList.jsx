import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/GuestList.css';
import { 
  ArrowLeft, 
  UserPlus, 
  Trash2, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle 
} from 'lucide-react';
import '../styles/GuestList.css';

const GuestList = () => {
  const { weddingId } = useParams();
  const navigate = useNavigate();
  
  // États
  const [guests, setGuests] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Charger les invités depuis la DB
  const fetchGuests = async () => {
    try {
      const res = await api.get(`/guests/${weddingId}`);
      // On adapte selon la structure de ton back (res.data ou res.data.data)
      setGuests(res.data.data || res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des invités", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weddingId) fetchGuests();
  }, [weddingId]);

  // 2. Ajouter un invité
  const addGuest = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/guests/${weddingId}`, { name: newName });
      setNewName('');
      fetchGuests(); // Rafraîchir la liste
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

  // 3. Mettre à jour le statut (Confirmé, Décliné, etc.)
  const updateStatus = async (guestId, newStatus) => {
    try {
      await api.patch(`/guests/${guestId}`, { status: newStatus });
      fetchGuests();
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  // 4. Supprimer un invité
  const deleteGuest = async (guestId) => {
    if (window.confirm("Supprimer cet invité ?")) {
      try {
        await api.delete(`/guests/${guestId}`);
        fetchGuests();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Calcul des statistiques
  const stats = {
    total: guests.length,
    confirme: guests.filter(g => g.status === 'Confirmé').length,
    attente: guests.filter(g => g.status === 'En attente').length,
    decline: guests.filter(g => g.status === 'Décliné').length
  };

  // Helper pour la couleur des badges de statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmé': return '#d1fae5';
      case 'Décliné': return '#fee2e2';
      default: return '#fef3c7';
    }
  };

  if (loading) return <div className="guest-page-container">Chargement...</div>;

  return (
    <div className="guest-page-container">
      {/* BOUTON RETOUR */}
      <button 
        onClick={() => navigate(`/weddings/${weddingId}`)} 
        className="back-to-wedding"
      >
        <ArrowLeft size={18} /> Retour au mariage
      </button>

      {/* SECTION STATISTIQUES */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '5px solid #6c5ce7' }}>
          <div className="stat-header"><Users size={18}/> Total</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '5px solid #00b894' }}>
          <div className="stat-header"><CheckCircle size={18}/> Confirmés</div>
          <div className="stat-value">{stats.confirme}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '5px solid #fdcb6e' }}>
          <div className="stat-header"><Clock size={18}/> En attente</div>
          <div className="stat-value">{stats.attente}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '5px solid #ff7675' }}>
          <div className="stat-header"><XCircle size={18}/> Déclinés</div>
          <div className="stat-value">{stats.decline}</div>
        </div>
      </div>

      <div className="guest-list-content">
        <h3>Ajouter un invité</h3>

        {/* FORMULAIRE D'AJOUT */}
        <form onSubmit={addGuest} className="add-guest-form">
          <input 
            className="add-guest-input"
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nom complet de l'invité..."
            required
          />
          <button type="submit" className="add-guest-btn">
            <UserPlus size={18} /> Ajouter
          </button>
        </form>

        {/* TABLEAU DES INVITÉS */}
        <table className="guest-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.length > 0 ? (
              guests.map((guest) => (
                <tr key={guest._id}>
                  <td className="guest-name">{guest.name}</td>
                  <td>
                    <select 
                      value={guest.status} 
                      onChange={(e) => updateStatus(guest._id, e.target.value)}
                      className="status-select-badge"
                      style={{ backgroundColor: getStatusColor(guest.status) }}
                    >
                      <option value="En attente">⏳ En attente</option>
                      <option value="Confirmé">✅ Confirmé</option>
                      <option value="Décliné">❌ Décliné</option>
                    </select>
                  </td>
                  <td >
                    <button 
                      className="delete-btn" 
                      onClick={() => deleteGuest(guest._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-message">
                  Aucun invité trouvé. Commencez par en ajouter un !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestList;