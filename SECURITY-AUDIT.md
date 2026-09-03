# Audit de sécurité — DMC-IA

Audit du code du dépôt (site statique + handlers PHP + API CRM Vercel).
Périmètre : `php/`, `crm/`, `js/`, pages HTML, `nextapp/`. Aucun test contre
l'infrastructure en production n'a été effectué.

## Résumé

| # | Vulnérabilité | Sévérité | Statut |
|---|---------------|----------|--------|
| 1 | API CRM exposée sans authentification (fuite de toute la base de contacts) | **Critique** | Corrigé |
| 2 | Écriture/modification arbitraire du statut des leads (`update-status`) | **Critique** | Corrigé |
| 3 | Injection de chemin dans l'URL de l'API HubSpot via `id` | **Élevée** | Corrigé |
| 4 | Liste d'emails écrite sous la racine web (`/data/notify_list.txt`) | **Élevée** | Corrigé |
| 5 | `Access-Control-Allow-Origin: *` sur les endpoints CRM | **Élevée** | Corrigé |
| 6 | Fuite du corps d'erreur HubSpot vers le client | **Moyenne** | Corrigé |
| 7 | Champs non bornés / caractères de contrôle dans les en-têtes mail | **Moyenne** | Corrigé |
| 8 | Scripts CDN sans SRI et version flottante (`@emailjs/browser@4`) | **Moyenne** | Partiel |
| 9 | Absence d'en-têtes de sécurité (CSP, HSTS, X-Frame-Options) | **Moyenne** | Partiel |
| 10 | `.DS_Store` versionné | **Faible** | Corrigé |
| 11 | Rate limiting contournable, clé MD5 | **Faible** | Atténué |

---

## 1–3. API CRM `crm/api/*` — critique

`contacts.js` et `update-status.js` proxifient un token privé HubSpot ayant
accès en lecture **et** en écriture à l'ensemble des contacts. Aucune
authentification n'était exigée et `Access-Control-Allow-Origin: *` autorisait
n'importe quelle page web à les appeler :

```
GET https://<crm>/api/contacts        → nom, email, société, statut de tous les leads
PATCH https://<crm>/api/update-status → modification du statut de n'importe quel lead
```

De plus, `contacts.js` ne vérifiait pas la méthode HTTP : un `POST` (comme celui
émis par `php/contact.php` et par `contact.html`) renvoyait la liste complète des
contacts au lieu de créer un lead.

Enfin, `id` était interpolé brut dans l'URL HubSpot :
`` `.../objects/contacts/${id}` ``. Une valeur comme `1/../../../objects/deals`
sortait du chemin prévu et permettait d'adresser d'autres ressources de l'API
HubSpot avec le token du serveur.

**Correctif** — nouveau module `crm/api/_security.js` :
- secret partagé obligatoire (`CRM_API_TOKEN`), comparé en temps constant, en
  `Authorization: Bearer` ou `x-api-key` ; l'endpoint renvoie `503` (fail closed)
  si le secret n'est pas configuré ;
- CORS restreint à une liste blanche (`CRM_ALLOWED_ORIGINS`) avec `Vary: Origin` ;
- vérification stricte de la méthode, préflight `OPTIONS` correct ;
- `id` validé (`^[0-9]{1,32}$`) puis encodé, `status` validé contre la liste
  autorisée, corps JSON parsé défensivement ;
- les erreurs HubSpot ne sont plus renvoyées telles quelles (elles peuvent
  contenir un écho de la requête, donc du token) mais journalisées côté serveur.

### Action requise au déploiement

1. Définir `CRM_API_TOKEN` (valeur aléatoire ≥ 32 octets) et
   `CRM_ALLOWED_ORIGINS` dans les variables d'environnement Vercel du projet CRM.
2. Le tableau de bord CRM (hébergé hors de ce dépôt) doit envoyer ce token.
   **Sans cette mise à jour, le dashboard recevra des `401`.** Un token porté par
   un front public reste lisible : la solution durable est une session
   authentifiée côté serveur.
3. **Considérer le token HubSpot comme compromis et le faire tourner** : les
   endpoints ont été publics, la fuite peut déjà avoir eu lieu.

## 4. Liste d'emails accessible publiquement — élevée

`php/notify.php` écrivait dans `__DIR__/../data/notify_list.txt`, soit
`https://dmc-ia.com/data/notify_list.txt` — téléchargeable par n'importe qui.
La ligne `Disallow: /data/` de `robots.txt` n'est pas un contrôle d'accès : elle
ne fait qu'indiquer le chemin aux curieux.

**Correctif** : stockage hors racine web (`DMCIA_DATA_DIR`, par défaut
`../dmcia-private`), répertoire en `0700`, fichier en `0600`, plus un `.htaccess`
`Deny from all` en défense en profondeur si l'hébergeur place malgré tout le
dossier sous la racine.

> Si un fichier `data/notify_list.txt` existe déjà en production, le déplacer
> hors racine et vérifier les logs d'accès.

## 6–7. Handlers PHP — moyenne

- Les champs du formulaire n'étaient pas bornés en longueur ; `name` et
  `subject` alimentent la ligne `Subject:` du mail. `FILTER_VALIDATE_EMAIL`
  bloquait déjà l'injection d'en-têtes via l'email, mais les autres champs
  n'étaient filtrés que par `htmlspecialchars`, qui ne retire pas les caractères
  de contrôle.
- `htmlspecialchars()` était appliqué à des données destinées à un mail en texte
  brut : cela n'apporte aucune protection et corrompt le contenu (`O'Brien` →
  `O&#039;Brien`).

**Correctif** : `clean()` / `cleanLine()` retirent le balisage et les caractères
de contrôle, suppriment CR/LF des champs mono-ligne et bornent les longueurs
(200 / 254 / 5000). L'email est retiré du sujet de `notify.php`.
`CURLOPT_SSL_VERIFYHOST => 2` et `FOLLOWLOCATION => false` ajoutés à l'appel CRM,
qui n'est plus effectué si aucun token n'est configuré (on n'envoie plus de
données personnelles vers un endpoint non authentifié).

## 8. Scripts tiers — moyenne, partiellement corrigé

`contact.html` chargeait `@emailjs/browser@4` : une **plage de versions**, donc
du code arbitraire décidé par le CDN à chaque visite, sans `integrity`.

Version épinglée (`4.4.1`) + `crossorigin` / `referrerpolicy`. Les hachages SRI
n'ont **pas** pu être calculés depuis cet environnement (accès CDN bloqué par le
proxy). À faire avant le prochain déploiement :

```sh
curl -sL https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/dist/email.min.js \
  | openssl dgst -sha384 -binary | openssl base64 -A
curl -sL https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js \
  | openssl dgst -sha384 -binary | openssl base64 -A
```
puis ajouter `integrity="sha384-…"` sur les deux balises `<script>`.

À noter : la clé publique EmailJS (`emailjs.init('EZXB26bMLhUnkClON')`) est
publique par conception, mais elle permet à un tiers d'envoyer des mails via
votre quota. Activer la restriction de domaine dans le tableau de bord EmailJS.

## 9. En-têtes de sécurité — moyenne, partiellement corrigé

Aucun en-tête de sécurité n'était émis. Ajoutés sur le projet CRM via
`crm/vercel.json` : HSTS, `X-Frame-Options: DENY`, `nosniff`,
`Referrer-Policy`, `Permissions-Policy`, `X-Robots-Tag: noindex`.

Le site principal semble servi par GitHub Pages (fichier `CNAME`), qui ne permet
pas de définir d'en-têtes. Une CSP n'a donc **pas** été ajoutée : la poser en
`<meta>` sur ~30 pages contenant du script inline demande une passe dédiée et
risque de casser des pages. Recommandation : passer le site derrière un CDN
capable d'émettre les en-têtes (Cloudflare, Vercel), puis appliquer une CSP.

## 10–11. Divers — faible

- `.DS_Store` était versionné (révèle les noms de fichiers locaux, y compris
  supprimés) : retiré, `.gitignore` ajouté.
- Le rate limiting reste basé sur `REMOTE_ADDR` et un fichier dans `/tmp` :
  contournable via IPv6 rotatif et non partagé entre serveurs. MD5 remplacé par
  SHA-256 (le nom de fichier dérivait d'une entrée contrôlée). Suffisant contre
  le spam basique ; pour un usage sérieux, ajouter un captcha ou un rate limit
  côté edge.

## Points vérifiés sans constat

- **XSS DOM** : le widget de chat (`js/layout.js`) utilise `textContent` pour
  tout contenu utilisateur — sain. `innerHTML` dans `js/i18n.js` n'est alimenté
  que par la table de traductions statique. `catalogue.html` valide le fragment
  d'URL via `getElementById` avant usage.
- **Secrets en dur** : aucun. Les tokens proviennent de `process.env`.
- **`nextapp/`** : dépendances à jour (Next 16.2.7, React 19.2.4), pas de route
  API, `dangerouslySetInnerHTML` alimenté par une constante de style locale.
- **Injection SQL / commandes** : aucune base de données ni exécution de
  processus dans le code.
