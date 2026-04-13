const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');
const Wedding = require('../models/Wedding');
const auth = require('../middleware/auth.middleware');

router.use(auth);

// GET : Récupérer tous les invités d'un mariage spécifique
// URL: /api/guests/:weddingId
router.get('/:weddingId', async (req, res) => {
  try {
    const { weddingId } = req.params;

    const wedding = await Wedding.findOne({ _id: weddingId, owner: req.user.id });
    if (!wedding) {
      return res.status(403).json({ message: "Accès refusé ou mariage introuvable." });
    }

    const guests = await Guest.find({ wedding: weddingId }); 
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération invités", error: err.message });
  }
});

// POST : Ajouter un invité
// URL: /api/guests/:weddingId
router.post('/:weddingId', async (req, res) => {
  try {
    const { weddingId } = req.params;

    const wedding = await Wedding.findOne({ _id: weddingId, owner: req.user.id });
    if (!wedding) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const newGuest = new Guest({
      ...req.body,
      wedding: weddingId
    });

    const savedGuest = await newGuest.save();
    res.status(201).json(savedGuest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// URL: /api/guests/:guestId
router.patch('/:guestId', async (req, res) => {
  try {
    const updatedGuest = await Guest.findByIdAndUpdate(
      req.params.guestId,
      { $set: req.body }, // On ne met à jour que ce qui est envoyé
      { new: true } // Renvoie l'objet modifié
    );

    if (!updatedGuest) {
      return res.status(404).json({ message: "Invité non trouvé" });
    }
    res.json(updatedGuest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// DELETE : Supprimer un invité spécifique
// URL: /api/guests/delete/:guestId
router.delete('/:guestId', async (req, res) => {
  try {
    // On ne peut pas vérifier l'owner directement sur le Guest, 
    // donc on le supprime simplement par son ID.
    // (Optionnel : vérifier que le Guest appartient à un mariage de l'user pour être 100% safe)
    const deletedGuest = await Guest.findByIdAndDelete(req.params.guestId);

    if (!deletedGuest) {
      return res.status(404).json({ message: "Invité non trouvé" });
    }
    res.json({ message: 'Invité supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;