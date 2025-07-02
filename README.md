# Pokedex API – Backend

Ce dépôt contient le **backend** du projet Pokedex, développé avec [NestJS](https://nestjs.com/) et [TypeORM](https://typeorm.io/) pour la gestion des Pokémons, des utilisateurs et de l’authentification.

---

## Structure du projet

```
src/
  app.module.ts           // Module principal
  main.ts                 // Point d'entrée de l'app
  common/                 // Filtres, middlewares globaux
  auth/                   // Authentification JWT, login/register
  pokemon/                // Gestion des Pokémons (CRUD, recherche, favoris)
  users/                  // Gestion des utilisateurs et favoris
```

- **auth/** : Authentification JWT, login, register, stratégie Passport.
- **pokemon/** : Contrôleur, service, entités, DTOs pour les Pokémons.
- **users/** : Contrôleur, service, entités, DTOs pour les utilisateurs et leurs favoris.
- **common/** : Filtres d’exception globaux.

---

## Fonctionnalités principales

- **CRUD Pokémon** : Ajouter, lister, rechercher, supprimer des Pokémons.
- **Recherche avancée** : Par nom (avec pagination) ou par type (avec pagination).
- **Gestion des utilisateurs** : Inscription, connexion sécurisée (JWT).
- **Favoris** : Ajouter/retirer des Pokémons favoris pour chaque utilisateur, lister ses favoris.
- **Swagger** : Documentation interactive disponible sur `/api`.
- **Sécurité** : Authentification JWT, gestion des erreurs centralisée.
- **Dockerisé** : Prêt à être lancé avec Docker Compose (API, MySQL, Adminer).

---

## Lancer le projet en local (avec Docker)

1. **Configurer le fichier `.env`** (exemple fourni) :

    ```
    DB_HOST=mysql
    DB_PORT=3306
    DB_USER=nest_user
    DB_PASSWORD=monmotdepasse
    DB_NAME=pokedex
    JWT_SECRET=une_clé_secrète_complexe
    ```

2. **Lancer tous les services** :

    ```bash
    docker-compose up --build -d
    ```

3. **Accéder à l’API** :  
   [http://localhost:3000](http://localhost:3000)

4. **Accéder à la documentation Swagger** :  
   [http://localhost:3000/api](http://localhost:3000/api)

5. **Accéder à Adminer (gestion MySQL)** :  
   [http://localhost:8080](http://localhost:8080)

---

## Exemples d’utilisation

- **Inscription / Connexion** : `/auth/register`, `/auth/login`
- **Lister les Pokémons** : `/pokemons`
- **Rechercher par nom** : `/pokemons/search?name=Pikachu&page=1&limit=10`
- **Rechercher par type** : `/pokemons/search-by-type?type=Feu&page=1&limit=10`
- **Ajouter un favori** : `/users/favoris/:pokemonId` (POST, JWT requis)
- **Lister ses favoris** : `/users/favoris` (GET, JWT requis)

---

## Contribution

Toute PR ou suggestion est la bienvenue !

---

## Licence

MIT