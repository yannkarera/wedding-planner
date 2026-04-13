const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Wedding = require('../models/Wedding');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');


router.post('/register', async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword });

        await user.save();
        const wedding = new Wedding({
            name: `Mariage de ${user.name}`,
            date: new Date(), // Date du jour par défaut
            location: "À définir", // Texte par défaut
            owner: user._id
        });
        await wedding.save();

        const token = generateToken(user);
        res.status(201).json({
            status: "succes",
            data: {
                user: {
                    id: user.id,
                    name: name,
                    email: email,
                    wedding: {
                        id: wedding._id,
                        name: wedding.name
                    }
                },
                token
            }
        })

    } catch (error) {
        console.error("ERREUR DETAILLEE :", error); // <--- AJOUTE CECI
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message // <--- RENVOIE LE MESSAGE A POSTMAN
        });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email
        });

        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" })
        }
        const wedding = await Wedding.findOne({ owner: user._id });
        const token = generateToken(user);

        res.status(201).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    email: email
                },
                token
            }
        })

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;