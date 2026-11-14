# live-api + serveur local (Mac)

OBS -> MediaMTX (Mac) -> tunnel Cloudflare (live.dmc-ia.com) -> page /dmcprint (mot de passe).

## 1. Cle de signature (une seule fois)
    openssl genrsa -out private.pem 2048
    base64 -i private.pem | tr -d '\n'      # a coller dans LIVE_JWT_PEM sur Vercel

## 2. Vercel (Root Directory = live-api), variables
- LIVE_ACCESS   = marie:mdp1,paul:mdp2
- LIVE_JWT_PEM  = (sortie base64 ci-dessus)
- LIVE_JWT_KID  = dmcprint-1
- LIVE_HLS_URL  = https://live.dmc-ia.com/live/index.m3u8
Puis mettre l'URL du projet dans LIVE_API de dmcprint/index.html et dans mediamtx/mediamtx.yml.

## 3. Mac
    brew install mediamtx cloudflared
    mediamtx mediamtx/mediamtx.yml
    cloudflared tunnel login
    cloudflared tunnel create dmcprint
    cloudflared tunnel route dns dmcprint live.dmc-ia.com
    cloudflared tunnel --config ~/.cloudflared/config.yml run dmcprint   # voir mediamtx/cloudflared-config.yml
Ne jamais committer private.pem (cle privee).

## 4. OBS
Parametres > Diffusion > Personnalise
- Serveur : rtmp://127.0.0.1/
- Cle de diffusion : live?jwt=<token>
Token : LIVE_JWT_PEM_FILE=private.pem LIVE_JWT_KID=dmcprint-1 node scripts/make-publish-token.js
