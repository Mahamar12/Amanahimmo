# 🚀 Guide d'installation et de connexion Supabase — AmanahImmo

Ce guide vous explique comment connecter votre propre projet **Supabase** au site web **AmanahImmo**.

---

### Étape 1 : Créer votre projet Supabase (Gratuit)

1. Rendez-vous sur [https://app.supabase.com](https://app.supabase.com) et connectez-vous.
2. Cliquez sur **"New Project"**.
3. Nommez le projet `AmanahImmo`, définissez un mot de passe sécurisé et choisissez la région la plus proche (ex: *EU West / Frankfurt*).
4. Attendez environ 1 minute que le projet soit prêt.

---

### Étape 2 : Créer la base de données et les tables (SQL)

1. Dans le tableau de bord de votre projet Supabase, cliquez sur **SQL Editor** dans le menu de gauche.
2. Cliquez sur **"New Query"**.
3. Copiez tout le contenu du fichier [supabase/schema.sql](file:///c:/Users/group/Desktop/Mohamed/amanahimmo/supabase/schema.sql) et collez-le dans l'éditeur.
4. Cliquez sur **"Run"** (en bas à droite).
5. 🎉 La table `properties`, la sécurité RLS, le stockage photos et les annonces de démonstration sont instantanément créés !

---

### Étape 3 : Récupérer et coller vos clés API dans `.env`

1. Dans Supabase, allez dans **Project Settings** (icône engrenage ⚙️ en bas à gauche) -> **API**.
2. Copiez la valeur **Project URL** (ex: `https://xxxx.supabase.co`).
3. Copiez la valeur **anon public key** (une longue clé qui commence par `eyJ...`).
4. Ouvrez le fichier [.env](file:///c:/Users/group/Desktop/Mohamed/amanahimmo/.env) à la racine du projet et collez-y vos clés :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_public
```

5. Redémarrez le serveur avec `npm run dev`.

---

### Étape 4 : Authentification Administrateur (Optionnel)

Pour utiliser l'authentification Supabase dans l'espace Admin :
1. Dans Supabase, allez dans **Authentication** -> **Users** -> **Add User** -> **Create User**.
2. Entrez par exemple `admin@amanahimmo.sn` et votre mot de passe administrateur.
3. Vous pourrez désormais vous connecter avec cet utilisateur dans l'espace `/admin/login` !
