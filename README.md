# Wedding Planner App

📋 Présentation du Projet

Wedding Planner App est une application web full-stack conçue pour simplifier l'organisation de mariages. Elle permet aux futurs mariés de gérer leurs événements de A à Z : de la liste des invités au suivi rigoureux du budget, en passant par la gestion des prestataires logistiques.

🚀 Objectif

L'objectif est d'offrir une interface centralisée et intuitive pour réduire le stress lié aux préparatifs, en permettant une gestion en temps réel des coûts et des contacts essentiels.

✨ Fonctionnalités Clés

*   **Authentification Sécurisée :** Inscription, connexion et protection des routes via JSON Web Tokens (JWT) et hachage des mots de passe (Bcrypt).
*   **Tableau de Bord Multi-Mariages :** Possibilité de créer, lister et basculer entre plusieurs projets de mariages.
*   **Gestion des Invités :** Suivi en temps réel des listes d'invitations, des confirmations de présence (RSVP) et des détails associés.
*   **Suivi Dynamique du Budget :** Enregistrement des dépenses avec calcul automatique du total payé et du reste à payer à l'aide d'un système de cases à cocher.
*   **Annuaire des Prestataires :** Centralisation des contacts logistiques (traiteurs, photographes, DJs) avec suivi de leurs tarifs respectifs.

🛠 Technologies Utilisées

L'application utilise la stack MERN :
*   **Frontend :** React.js (Vite), React Router, Axios, Lucide-React (icônes).
*   **Backend :** Node.js, Express.js.
*   **Base de données :** MongoDB Atlas (NoSQL) avec Mongoose.
*   **Authentification :** JSON Web Tokens (JWT) et Bcrypt.

📂 Structure des Fichiers Modifiés / Principaux

Voici un aperçu des fichiers clés créés et modifiés pour faire tourner l'application :

```text
wedding_planner/
├── api/                        # BACKEND (Express & Mongoose)
│   ├── config/
│   │   └── db.js               # Connexion à MongoDB Atlas
│   ├── models/                 # Schémas de données Mongoose
│   │   ├── User.js
│   │   ├── Wedding.js
│   │   ├── Guest.js
│   │   ├── Budget.js
│   │   └── Vendor.js
│   ├── routes/                 # Définition des endpoints d'API
│   │   ├── auth.js
│   │   ├── weddings.js
│   │   ├── guests.js
│   │   ├── budgets.js
│   │   └── vendors.js
│   ├── middleware/
│   │   └── authMiddleware.js   # Validation du token JWT
│   ├── .env                    # Variables d'environnement (local)
│   └── server.js               # Point d'entrée de l'API
│
└── client/                     # FRONTEND (React & Vite)
    ├── src/
    │   ├── components/         # Composants UI réutilisables (Navbar, Sidebar, Cards)
    │   ├── pages/              # Vues principales de l'application
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── GuestsManager.jsx
    │   │   ├── BudgetTracker.jsx
    │   │   └── VendorsDirectory.jsx
    │   ├── services/
    │   │   └── api.js          # Configuration d'Axios et appels API
    │   ├── App.jsx             # Configuration des routes (React Router)
    │   └── main.jsx
