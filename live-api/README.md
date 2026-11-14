# live-api
Fonction Vercel qui valide le mot de passe et renvoie l'ID du live Cloudflare Stream.
Deploy: nouveau projet Vercel, Root Directory = `live-api`.
Variables d'environnement: `LIVE_ACCESS`, `CF_CUSTOMER_CODE`, `CF_LIVE_INPUT_ID`, `CF_SIGNING_KEY_ID`, `CF_SIGNING_KEY_PEM`.
Puis mettre l'URL du projet dans `LIVE_API` en haut du script de `dmcprint/`.
