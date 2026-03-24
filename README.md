# Alicia & Léo

Application `Next.js` mobile-first pensée comme une expérience intime, douce et interactive, avec persistance réelle via `Prisma + SQLite`.

## Stack

- `Next.js` + `React` + `TypeScript`
- `Tailwind CSS`
- `Prisma` + `SQLite`
- uploads persistants dans `public/uploads`
- auth simple Alicia via cookie signé côté serveur

## Lancer le projet

1. Installer les dépendances
2. Copier `.env.example` vers `.env`
3. Choisir `SESSION_SECRET` et `ALICIA_PASSWORD`
4. Initialiser la base
5. Lancer le serveur

```bash
npm install
cp .env.example .env
npm run prisma:push
npm run dev
```

## Ce qui est inclus

- accueil avec interaction `Oui / Non`
- galerie des livres + ajout de livre + lecture page par page
- galerie photo avec upload et pagination
- page publique `Confiance`
- `Mode vérité`
- `Playlist`
- `Plus de nous` avec sablier animé et compteur live
- page `Mots`
- `Espace libre + défis`
- `Jeu Gugus`
- mini-jeu plateforme mobile avec boutons tactiles
- connexion Alicia
- page privée de gestion des barres
- 404 personnalisée

## Persistance

- données structurées: `SQLite` via `Prisma`
- images: stockage local persistant dans `public/uploads/books` et `public/uploads/photos`
- un seeding automatique remplit les contenus initiaux si la base est vide

## Compte Alicia

- username par défaut: valeur de `ALICIA_USERNAME`
- mot de passe initial: valeur de `ALICIA_PASSWORD`
- le mot de passe est hashé avant stockage en base
