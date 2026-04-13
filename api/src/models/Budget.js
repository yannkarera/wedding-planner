const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  wedding: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  }
}, { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
