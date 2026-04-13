const express = require('express');
const connectDB = require('./src/config/db');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/weddings', require('./src/routes/weddingRoutes'));
app.use('/api/guests', require('./src/routes/guestRoutes'));
app.use('/api/vendors', require('./src/routes/vendorRoutes'));
app.use('/api/budgets', require('./src/routes/budgetRoutes'));

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
