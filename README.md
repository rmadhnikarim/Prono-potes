# Pronos entre potes ⚽

Appli de pronostics Ligue 1 entre amis, avec comptes utilisateurs, verrouillage automatique, règle d'attaque, et import automatique des matchs Ligue 1.

## Déploiement

1. Connecte ce dépôt GitHub à Netlify (New site from Git)
2. Dans Netlify → Site settings → Environment variables, ajoute :
   - `FOOTBALL_API_KEY` = ta clé football-data.org
3. Déploie !

## Structure

- `index.html` — l'appli complète
- `netlify/functions/get-matches.js` — fonction qui va chercher les matchs Ligue 1
- `netlify.toml` — configuration Netlify
