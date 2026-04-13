# Wedding Planner App

📋 Présentation du Projet

Wedding Planner App est une application web full-stack conçue pour simplifier l'organisation de mariages. Elle permet aux futurs mariés de gérer leurs événements de A à Z : de la liste des invités au suivi rigoureux du budget, en passant par la gestion des prestataires logistiques.

🚀 Objectif


L'objectif est d'offrir une interface centralisée et intuitive pour réduire le stress lié aux préparatifs, en permettant une gestion en temps réel des coûts et des contacts essentiels.
🛠 Technologies Utilisées

L'application utilise la stack MERN :

    Frontend : React.js (Vite), React Router, Axios, Lucide-React (icônes).

    Backend : Node.js, Express.js.

    Base de données : MongoDB Atlas (NoSQL) avec Mongoose.

    Authentification : JSON Web Tokens (JWT) et Bcrypt pour le hachage des mots de passe.

⚙️ Installation

    Cloner le projet :
    Bash

    git clone https://github.com/ton-pseudo/wedding_planner.git
    cd wedding_planner

    Installer les dépendances du Backend :
    Bash

    cd api
    npm install

    Installer les dépendances du Frontend :
    Bash

    cd ../client
    npm install

🔐 Configuration du fichier .env

Crée un fichier .env dans le dossier /api :
Extrait de code

PORT=5000
MONGO_URI=votre_lien_mongodb_atlas
JWT_SECRET=votre_cle_secrete_super_securisee

    Note : Assurez-vous que le fichier .env est bien listé dans votre .gitignore avant de pousser sur GitHub.

🏃 Lancement de l'application
Lancer le Backend

Depuis le dossier /api :
Bash

npm run start

 # Le serveur tournera sur http://localhost:5000

Lancer le Frontend

Depuis le dossier /client :
Bash

npm run dev
# L'application sera accessible sur http://localhost:5173

🛣 Routes Principales de l'API
Méthode	Route	Description
POST	/api/auth/register	Créer un nouveau compte utilisateur
POST	/api/auth/login	Connexion et récupération du Token
GET	/api/weddings	Liste des mariages de l'utilisateur
POST	/api/weddings	Créer un nouveau mariage
GET	/api/guests/:weddingId	Liste des invités d'un mariage
PATCH	/api/budgets/:id	Modifier le statut "payé" d'une dépense
POST	/api/vendors/:weddingId	Ajouter un prestataire
💡 Résumé du Fonctionnement

    Authentification : L'utilisateur s'inscrit et se connecte. Un token JWT est généré et stocké pour sécuriser les accès suivants.

    Tableau de Bord : L'utilisateur crée un ou plusieurs mariages. En cliquant sur l'un d'eux, il accède aux détails spécifiques.

    Gestion de l'événement :

        Invités : Suivi des présences et des invitations.

        Budget : Chaque dépense est enregistrée. L'application calcule automatiquement le total payé et le reste à payer grâce à un système de cases à cocher.

        Prestataires : Un annuaire dédié pour centraliser les contacts (traiteurs, DJs, photographes) et leurs tarifs.

    Persistance : Toutes les modifications sont enregistrées instantanément dans la base de données MongoDB via l'API REST.

📝 Auteur

Yann Karera - Passionné par le développement d'outils simplifiant la vie quotidienne.
