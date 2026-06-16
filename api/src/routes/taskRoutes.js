const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth.middleware');

router.use(auth);

// GET : Récupérer toutes les tâches d'un mariage

router.get('/:weddingId', async (req, res) => {
    try{
        const tasks = await Task.find({ wedding: req.params.weddingId });
        res.json(tasks);
    } catch (error) {
        console.error("ERREUR DETAILLEE :", error);
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
});

// POST : Créer une nouvelle tâche pour un mariage

router.post('/:weddingId', async (req, res) => {
    try {
        const newTask = new Task({
            ...req.body,
            wedding: req.params.weddingId
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("ERREUR DETAILLEE :", error);
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
});

// PUT : Mettre à jour une tâche

router.put('/:id', async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Tâche mise à jour' }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tâche supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;