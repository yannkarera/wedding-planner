import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Plus, Trash2, Phone, Tag, DollarSign } from 'lucide-react';
import '../styles/Vendors.css';

const Vendors = () => {
  const { weddingId } = useParams();
  const navigate = useNavigate();
  
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Traiteur',
    contact: '',
    price: '',
    status: 'contacté'
  });

  const fetchVendors = async () => {
    try {
      const res = await api.get(`/vendors/${weddingId}`);
      setVendors(res.data);
    } catch (err) {
      console.error("Erreur prestataires:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weddingId) fetchVendors();
  }, [weddingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/vendors/${weddingId}`, formData);
      setFormData({ name: '', type: 'Traiteur', contact: '', price: '', status: 'contacté' });
      fetchVendors();
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

  const deleteVendor = async (id) => {
    if (window.confirm("Supprimer ce prestataire ?")) {
      await api.delete(`/vendors/${id}`);
      fetchVendors();
    }
  };

  if (loading) return <div className="vendors-container">Chargement...</div>;

  return (
    <div className="vendors-container">
      <button onClick={() => navigate(`/weddings/${weddingId}`)} className="back-btn">
        <ArrowLeft size={18} /> Retour
      </button>

      <h2 className="page-title">🤝 Mes Prestataires</h2>

      {/* FORMULAIRE D'AJOUT */}
      <form onSubmit={handleSubmit} className="vendor-form">
        <input 
          placeholder="Nom (ex: DJ Jean)" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
          <option value="Traiteur">Traiteur</option>
          <option value="Photographe">Photographe</option>
          <option value="Musique">Musique</option>
          <option value="Fleuriste">Fleuriste</option>
          <option value="Autre">Autre</option>
        </select>
        <input 
          placeholder="Contact (Tél/Email)" 
          value={formData.contact} 
          onChange={e => setFormData({...formData, contact: e.target.value})} 
        />
        <input 
          type="number" 
          placeholder="Prix estimé" 
          value={formData.price} 
          onChange={e => setFormData({...formData, price: e.target.value})} 
        />
        <button type="submit" className="add-btn"><Plus size={18} /> Ajouter</button>
      </form>

      {/* LISTE DES PRESTATAIRES */}
      <div className="vendors-grid">
        {vendors.map(vendor => (
          <div key={vendor._id} className="vendor-card">
            <div className="vendor-header">
              <span className="vendor-type">{vendor.type}</span>
              <span className={`status-badge ${vendor.status.replace(' ', '-')}`}>
                {vendor.status}
              </span>
            </div>
            <h3 className="vendor-name">{vendor.name}</h3>
            <div className="vendor-body">
              <p><Phone size={14} /> {vendor.contact || "Non renseigné"}</p>
              <p><DollarSign size={14} /> {vendor.price} €</p>
            </div>
            <button onClick={() => deleteVendor(vendor._id)} className="delete-vendor-btn">
              <Trash2 size={16} /> Supprimer
            </button>
          </div>
        ))}
      </div>
      {vendors.length === 0 && <p className="empty-msg">Aucun prestataire pour le moment.</p>}
    </div>
  );
};

export default Vendors;