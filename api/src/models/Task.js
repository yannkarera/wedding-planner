const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['à faire', 'en cours', 'complété'], default: 'à faire' },
    wedding: { type: mongoose.Schema.Types.ObjectId, ref: 'Wedding', required: true }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;      