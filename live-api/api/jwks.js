// Public keys (JWKS) that MediaMTX downloads to verify playback tokens.
const crypto = require('crypto');

module.exports = (req, res) => {
  const pem = Buffer.from(process.env.LIVE_JWT_PEM || '', 'base64').toString('utf8');
  const jwk = crypto.createPublicKey(pem).export({ format: 'jwk' });
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json({ keys: [{ ...jwk, kid: process.env.LIVE_JWT_KID, alg: 'RS256', use: 'sig' }] });
};
