// Usage: LIVE_JWT_PEM_FILE=private.pem LIVE_JWT_KID=dmcprint-1 node make-publish-token.js
// Prints a long-lived token to put in OBS: stream key = "live?jwt=<token>"
const crypto = require('crypto');
const fs = require('fs');
const b64url = (x) => Buffer.from(x).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const kid = process.env.LIVE_JWT_KID;
const now = Math.floor(Date.now() / 1000);
const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid }));
const body = b64url(JSON.stringify({ iat: now, exp: now + 365 * 86400, mediamtx_permissions: [{ action: 'publish', path: 'live' }] }));
const sig = crypto.createSign('RSA-SHA256').update(head + '.' + body).sign(fs.readFileSync(process.env.LIVE_JWT_PEM_FILE, 'utf8'));
console.log(head + '.' + body + '.' + b64url(sig));
