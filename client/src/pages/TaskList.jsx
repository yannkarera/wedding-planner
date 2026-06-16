import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { ArrowLeft, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import '../styles/TaskList.css';


const TaskList = () => {
    const { weddingId } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
     });

     const fetchTasks = async () => {
        try {
            const res = await api.get(`/tasks/${weddingId}`);
            setTasks(res.data);
        } catch (err) {
            console.error("Erreur tâches:", err);
        } finally {
            setLoading(false);
        }
     }

     useEffect( () => {
        if (weddingId) fetchTasks();
        }, [weddingId]
     );

     const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/tasks/${weddingId}`, formData);
            setFormData({ title: '', description: '' });
            fetchTasks();
        } catch (err) {
            console.error("Erreur soumission tâche:", err);
            alert("Erreur lors de la création de la tâche. Veuillez réessayer.");
        }
     }

     const toggleStatus = async (task) => {
        const newStatus = task.status === 'à faire' ? 'en cours' : task.status === 'en cours' ? 'complété' : 'à faire';
        try {
            await api.put(`/tasks/${task._id}`, { ...task, status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error("Erreur mise à jour tâche:", err);
            alert("Erreur lors de la mise à jour de la tâche. Veuillez réessayer.");
        }
     }

     const deleteTask = async (id) => {
        if (window.confirm("Supprimer cette tâche ?")) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (err) {
                console.error("Erreur suppression tâche:", err);
                alert("Erreur lors de la suppression de la tâche. Veuillez réessayer.");
            }
        }
     }

     if (loading) return <div className="tasks-container">Chargement des tâches...</div>;

     return (
        <div className="tasks-container">
            <button onClick={() => navigate(`/weddings/${weddingId}`)} className="back-btn">
                <ArrowLeft size={20} /> Retour
            </button>

            <h2 className="page-title">Liste des tâches</h2>
            <form onSubmit={handleSubmit} className="task-form">
                <input
                    placeholder="Titre de la tâche"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <input
                    placeholder="Description (optionnelle)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <button type="submit" className="add-btn">
                    <Plus size={16} /> Ajouter
                </button>
            </form>

            {/* Affichage des tâches */}
            <div className="tasks-list">
                {tasks.map(task => (
                    <div key={task._id} className={`task-item ${task.status === 'complété' ? 'task-done' : ''}`}>
                        <div className="task-main" onClick={() => toggleStatus(task)}>
                            <button type="button" className="status-toggle">
                                {task.status === 'complété' ? (
                                    <CheckCircle size={18} color="#4CAF50" />
                                ) : (
                                    <Circle size={18} color="#999" />
                                )}
                            </button>
                            <div>
                                <h4 className="task-title">{task.title}</h4>
                                {task.description && <p className="task-desc">{task.description}</p>}
                            </div>
                        </div>
                        <button onClick={() => deleteTask(task._id)} className="delete-task-icon">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && <p className="no-tasks">Aucune tâche pour le moment. Ajoutez-en une !</p>}
            </div>
        </div>
     )
    }

export default TaskList;