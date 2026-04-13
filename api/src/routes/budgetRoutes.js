const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth.middleware');
const Wedding = require('../models/Wedding');
router.use(auth)

// GET Afficher tous les budgets
router.get('/:weddingId', async (req, res) => {
  try{ 
  const { weddingId } = req.params;
  const wedding = await Wedding.findOne({ _id: weddingId, owner: req.user.id });
  
  if (!wedding) {
    return res.status(403).json({ message: "Accès refusé : ce mariage ne vous appartient pas." });
  }

  const budgets = await Budget.find({ wedding: weddingId });
  res.json(budgets);
}catch (err) {
    res.status(500).json({ message: err.message });
}
});
 
// POST Poster un nouveau budget
router.post('/:weddingId', async (req, res) => {
  try { 
  const { weddingId } = req.params;
  const wedding = await Wedding.findOne({ _id: weddingId, owner: req.user.id });
  
  if (!wedding) {
    return res.status(403).json({ message: "Accès refusé : ce mariage ne vous appartient pas." });
  }
  const newBudget = new Budget({ ...req.body, wedding: weddingId });
  const savedBudget = await newBudget.save();
  res.status(201).json(savedBudget);
} catch (err) {
    res.status(400).json({ message: err.message });
}
});

// ... (tes imports et router.use(auth) sont parfaits)

// PUT Mettre à jour un budget (SÉCURISÉ)
router.patch('/:id', async (req, res) => {
  try {
    // On cherche d'abord le budget
    
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget non trouvé" })

    // SÉCURITÉ : On vérifie que le mariage lié à ce budget appartient bien à l'user
    const wedding = await Wedding.findOne({ _id: budget.wedding, owner: req.user.id });
    if (!wedding) return res.status(403).json({ message: "Accès refusé" });

    // Si c'est bon, on met à jour
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id, 
      {$set: req.body}, 
      { new: true, runValidators: true }
    );
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Supprimer un budget (SÉCURISÉ)
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget non trouvé" });

    // SÉCURITÉ : Vérification de l'owner via le mariage lié
    const wedding = await Wedding.findOne({ _id: budget.wedding, owner: req.user.id });
    if (!wedding) return res.status(403).json({ message: "Accès refusé" });

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget item deleted', deletedItem: budget });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;