# CESAME Finances — déploiement Vercel + Supabase

Cette version est prête à être déposée sur GitHub puis déployée sur Vercel. Les données et utilisateurs seront stockés dans Supabase.

## 1. Créer la base Supabase

1. Créez un projet sur Supabase.
2. Dans **SQL Editor**, exécutez le contenu de `supabase-schema.sql`.
3. Relevez dans **Project Settings > API** : l’URL du projet, la clé publishable/anon et la clé `service_role`.

## 2. Créer le premier Promoteur

Dans **Authentication > Users**, créez l’utilisateur Promoteur avec son e-mail et son mot de passe. Relevez son identifiant utilisateur (UUID), puis exécutez dans le SQL Editor, en remplaçant les valeurs :

```sql
insert into public.profiles (id, email, name, role, active)
values ('UUID-UTILISATEUR', 'promoteur@cesame.cm', 'Paul Mbarga', 'Promoteur', true);
```

Après la première connexion, ce compte pourra créer les autres utilisateurs depuis l’application.

## 3. Déployer sur Vercel

1. Placez le contenu de ce dossier à la racine d’un dépôt GitHub privé. Les dossiers `api/` et le fichier `package.json` doivent être au même niveau que `index.html`. Si le dossier reste imbriqué dans le dépôt, renseignez ce nom de dossier dans **Vercel > Settings > General > Root Directory**.
2. Importez le dépôt dans Vercel.
3. Dans **Settings > Environment Variables**, créez : `SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` avec les valeurs Supabase.
4. Lancez le déploiement.

Ne placez jamais la clé `SUPABASE_SERVICE_ROLE_KEY` dans le code du navigateur ni dans GitHub. Elle doit uniquement exister dans les variables sécurisées de Vercel.
