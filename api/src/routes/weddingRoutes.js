const express = require('express');
const router = express.Router();
const Wedding = require('../models/Wedding');
const auth = require('../middleware/auth.middleware');

// On protège TOUTES les routes du fichier
router.use(auth);

// GET : Récupérer TOUS les mariages de l'utilisateur connecté
router.get('/', async (req, res) => {
  try {
    const weddings = await Wedding.find({ owner: req.user.id });
    res.json(weddings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:weddingId', async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.weddingId);
    if (!wedding) return res.status(404).json({ message: "Mariage non trouvé" });

    // SÉCURITÉ : On vérifie que le mariage appartient bien à l'user
    if (wedding.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    res.json(wedding);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST : Créer un nouveau mariage supplémentaire
router.post('/', async (req, res) => {
  try {
    const newWedding = new Wedding({
      ...req.body,
      owner: req.user.id // L'utilisateur connecté devient l'owner
    });
    await newWedding.save();
    res.status(201).json(newWedding);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT : Mettre à jour MON mariage
router.patch('/:weddingId', async (req, res) => {
  try {
  
    const wedding = await Wedding.findById(req.params.weddingId);
    if (!wedding) return res.status(404).json({ message: "Mariage non trouvé" });

    // SÉCURITÉ : On vérifie que le mariage appartient bien à l'user
    if (wedding.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    // On utilise req.user.weddingId pour être sûr de ne modifier que le nôtre
    const updatedWedding = await Wedding.findByIdAndUpdate(
      req.params.weddingId, 
      {$set: req.body}, 
      { new: true, runValidators: true }
    );
    res.json(updatedWedding);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
});



// DELETE Supprimer un mariage
router.delete('/:weddingId', async (req, res) => {
  await Wedding.findByIdAndDelete(req.user.weddingId);
  res.json({ message: 'Wedding deleted' });
});

module.exports = router;
