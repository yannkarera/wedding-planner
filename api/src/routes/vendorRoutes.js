const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const auth = require('../middleware/auth.middleware');
const Wedding = require('../models/Wedding');

router.use(auth);

// GET Afficher tous les fournisseurs
router.get('/:weddingId', async (req, res) => {
  try{
    const { weddingId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, owner: req.user.id });

    if(!wedding){
      return res.status(403).json({ message: "Accès refusé" });
    }
    const vendors = await Vendor.find({ wedding: weddingId });
    res.json(vendors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET Afficher un fournisseur par son ID
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Prestataire non trouvé" });

    // SÉCURITÉ : On vérifie que le mariage appartient bien à l'user
    const wedding = await Wedding.findOne({ _id: vendor.wedding, owner: req.user.id });
    if (!wedding) return res.status(403).json({ message: "Accès refusé" });

    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Poster un nouveau fournisseur
router.post('/:weddingId', async (req, res) => {
  try {
    const { weddingId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, owner: req.user.id });

    if (!wedding) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const newVendor = new Vendor({ ...req.body, wedding: weddingId });
    const savedVendor = await newVendor.save();
    res.status(201).json(savedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT : Mettre à jour un prestataire
router.put('/:id', async (req, res) => {
  try {
    // On vérifie que le prestataire existe
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Prestataire non trouvé" });

    // Sécurité : le mariage lié appartient-il à l'user ?
    const wedding = await Wedding.findOne({ _id: vendor.wedding, owner: req.user.id });
    if (!wedding) return res.status(403).json({ message: "Accès refusé" });

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    res.json(updatedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE : Supprimer un prestataire
router.delete('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Prestataire non trouvé" });

    const wedding = await Wedding.findOne({ _id: vendor.wedding, owner: req.user.id });
    if (!wedding) return res.status(403).json({ message: "Accès refusé" });

    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
