import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Plus, Trash2, PiggyBank, CreditCard, Wallet } from 'lucide-react';
import '../styles/Budget.css';

const Budget = () => {
  const { weddingId } = useParams();
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ title: '', amount: '' });
  const [loading, setLoading] = useState(true);

  const fetchBudget = async () => {
    try {
      const res = await api.get(`/budgets/${weddingId}`);
      setItems(res.data);
    } catch (err) {
      console.error("Erreur budget:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weddingId) fetchBudget();
  }, [weddingId]);

  // Calculs
  const totalBudget = items.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = items.reduce((acc, curr) => acc + (curr.paid ? curr.amount : 0), 0);
  const remaining = totalBudget - totalPaid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/budgets/${weddingId}`, formData);
      setFormData({ title: '', amount: '' });
      fetchBudget();
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

const togglePaid = async (id) => {
  // 1. On trouve l'item actuel dans notre liste
  const itemToUpdate = items.find(item => item._id === id);
  
  try {
    // 2. On envoie l'ID et le NOUVEL état de "paid"
    await api.patch(`/budgets/${id}`, { paid: !itemToUpdate.paid });
    fetchBudget();
  } catch (err) {
    alert("Erreur de mise à jour");
  }
};

  const deleteItem = async (id) => {
    if (window.confirm("Supprimer cette dépense ?")) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudget();
      } catch (err) {
        alert("Erreur de suppression");
      }
    }
  };

  if (loading) return <div className="budget-container">Chargement...</div>;

  return (
    <div className="budget-container">
      <button onClick={() => navigate(`/weddings/${weddingId}`)} className="back-btn">
        <ArrowLeft size={18} /> Retour
      </button>

      <h2 className="page-title"> Gestion du Budget</h2>

      <div className="budget-summary">
        <div className="summary-card total">
          <PiggyBank size={24} />
          <div><span>Total Prévu</span><h3>{totalBudget} €</h3></div>
        </div>
        <div className="summary-card paid">
          <CreditCard size={24} />
          <div><span>Déjà Payé</span><h3>{totalPaid} €</h3></div>
        </div>
        <div className="summary-card rest">
          <Wallet size={24} />
          <div><span>Reste à payer</span><h3>{remaining} €</h3></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="budget-form">
        <input 
          placeholder="Ex: Alcool, nourritures, ..." 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Montant (€)" 
          value={formData.amount} 
          onChange={e => setFormData({...formData, amount: e.target.value})} 
          required 
        />
        <button type="submit" className="add-btn"><Plus size={18} /> Ajouter</button>
      </form>

      <div className="budget-list">
        {items.map(item => (
          <div key={item._id} className={`budget-item ${item.paid ? 'paid-row' : ''}`}>
            <div className="item-main">
              <input 
                type="checkbox" 
                checked={item.paid} 
                onChange={() => togglePaid(item._id)}
                className="paid-checkbox"
              />
              <span className="item-name">{item.title}</span>
            </div>
            <div className="item-actions">
              <span className="item-price">{item.amount} €</span>
              <button onClick={() => deleteItem(item._id)} className="delete-icon">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="empty-msg">Aucune dépense enregistrée.</p>}
      </div>
    </div>
  );
};

export default Budget;