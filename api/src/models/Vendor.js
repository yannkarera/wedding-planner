const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  contact: { type: String },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ['contacté', 'en attente', 'confirmé'], default: 'contacté' },
  wedding: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  }
});

module.exports = mongoose.model('Vendor', vendorSchema);
