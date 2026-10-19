// Verifica preparata dall'insegnante: una sola configurazione per tutto il sito, salvata su Upstash Redis (Vercel Marketplace).
// GET  /api/verifica                       → la configurazione attuale (o { config: null } se non ce n'è)
// POST /api/verifica  { password, config }  → la salva (serve la password VERIFICA_PASSWORD)
// POST /api/verifica  { password, prova: true } → controlla solo la password
// Variabili d'ambiente: KV_REST_API_URL + KV_REST_API_TOKEN (o UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN), VERIFICA_PASSWORD.
const crypto = require('crypto');

const CHIAVE = 'verifica:europa';
const URL_DB = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_DB = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const TIPI = ['fisica', 'trovaFis', 'trova', 'indovina', 'capitali', 'ue'];

async function redis(comando) {
  const r = await fetch(URL_DB, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN_DB}`, 'Content-Type': 'application/json' }, body: JSON.stringify(comando) });
  if (!r.ok) throw new Error('Database: ' + r.status);
  return (await r.json()).result;
}
function passwordGiusta(p) {
  const vera = process.env.VERIFICA_PASSWORD || '';
  if (!vera || typeof p !== 'string') return false;
  const a = crypto.createHash('sha256').update(p).digest(), b = crypto.createHash('sha256').update(vera).digest();
  return crypto.timingSafeEqual(a, b);
}
// tiene solo campi noti e valori ragionevoli
function pulisci(c) {
  const ids = l => Array.isArray(l) ? [...new Set(l.filter(x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,60}$/.test(x)))].slice(0, 500) : [];
  const parti = {};
  TIPI.forEach(t => { const n = Math.round(Number(c && c.parti && c.parti[t]) || 0); parti[t] = Math.max(0, Math.min(50, n)); });
  if (!Object.values(parti).some(n => n > 0)) return null;
  return { v: 1, titolo: String((c && c.titolo) || '').slice(0, 80), parti, stati: ids(c && c.stati), fisici: ids(c && c.fisici), agg: Date.now() };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL_DB || !TOKEN_DB) return res.status(503).json({ errore: 'Database non configurato' });
  try {
    if (req.method === 'GET') {
      const v = await redis(['GET', CHIAVE]);
      return res.status(200).json({ config: v ? JSON.parse(v) : null });
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      if (!passwordGiusta(body.password)) return res.status(401).json({ errore: 'Password sbagliata' });
      if (body.prova) return res.status(200).json({ ok: true });
      const config = pulisci(body.config);
      if (!config) return res.status(400).json({ errore: 'Verifica senza domande' });
      await redis(['SET', CHIAVE, JSON.stringify(config)]);
      return res.status(200).json({ ok: true, config });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ errore: 'Metodo non consentito' });
  } catch (e) {
    return res.status(500).json({ errore: 'Errore del server' });
  }
};
