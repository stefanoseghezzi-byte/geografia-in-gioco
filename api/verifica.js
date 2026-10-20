// Verifiche preparate dagli insegnanti: ognuna ha un proprio codice e una propria password, salvate su Upstash Redis (Vercel Marketplace).
// GET  /api/verifica?codice=K7M2Q                                                  → { config } (senza password) oppure 404
// POST { azione: 'prova', passwordDocenti }                                        → controlla la password degli insegnanti
// POST { azione: 'crea', passwordDocenti, passwordVerifica, codice?, config }      → crea una verifica; senza codice lo sceglie il sito → { codice, config }
// POST { azione: 'accedi', codice, password }                                      → controlla codice e password, restituisce la configurazione per modificarla
// POST { azione: 'salva', codice, password, config }                              → modifica una verifica esistente
// Variabili d'ambiente: KV_REST_API_URL + KV_REST_API_TOKEN (o UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN), VERIFICA_PASSWORD (password degli insegnanti,
// che vale anche per aprire e modificare qualunque verifica, se qualcuno perde codice o password).
const crypto = require('crypto');

const URL_DB = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_DB = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const TIPI = ['fisica', 'trovaFis', 'trova', 'indovina', 'capitali', 'ue', 'continente'];
const SEZIONI = ['europa', 'mondo'];
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';   // senza lettere e cifre che si confondono (I, L, O, 0, 1)
const chiave = codice => 'verifica:' + codice;

async function redis(comando) {
  const r = await fetch(URL_DB, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN_DB}`, 'Content-Type': 'application/json' }, body: JSON.stringify(comando) });
  if (!r.ok) throw new Error('Database: ' + r.status);
  return (await r.json()).result;
}
const uguali = (x, y) => { const a = crypto.createHash('sha256').update(String(x)).digest(), b = crypto.createHash('sha256').update(String(y)).digest(); return crypto.timingSafeEqual(a, b); };
function passwordDocentiGiusta(p) {
  const vera = process.env.VERIFICA_PASSWORD || '';
  return !!vera && typeof p === 'string' && uguali(p, vera);
}
const faiHash = p => { const sale = crypto.randomBytes(16).toString('hex'); return sale + ':' + crypto.scryptSync(p, sale, 32).toString('hex'); };
function hashGiusto(p, h) {
  if (typeof p !== 'string' || typeof h !== 'string') return false;
  const [sale, atteso] = h.split(':');
  return !!sale && !!atteso && uguali(crypto.scryptSync(p, sale, 32).toString('hex'), atteso);
}
const pulisciCodice = c => String(c || '').trim().toUpperCase().replace(/\s+/g, '');
const codiceValido = c => /^[A-Z0-9-]{3,20}$/.test(c);
function codiceNuovo() {
  let c = '';
  for (let i = 0; i < 5; i++) c += ALFABETO[crypto.randomInt(ALFABETO.length)];
  return c;
}
// tiene solo campi noti e valori ragionevoli
function pulisci(c, sez) {
  const ids = l => Array.isArray(l) ? [...new Set(l.filter(x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,60}$/.test(x)))].slice(0, 500) : [];
  const parti = {};
  TIPI.forEach(t => { const n = Math.round(Number(c && c.parti && c.parti[t]) || 0); parti[t] = Math.max(0, Math.min(50, n)); });
  if (!Object.values(parti).some(n => n > 0)) return null;
  return { v: 2, sez, titolo: String((c && c.titolo) || '').slice(0, 80), parti, stati: ids(c && c.stati), fisici: ids(c && c.fisici), agg: Date.now() };
}
const pubblica = rec => { const { ph, ...resto } = rec; return resto; };
const leggi = async codice => { const v = await redis(['GET', chiave(codice)]); return v ? JSON.parse(v) : null; };

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL_DB || !TOKEN_DB) return res.status(503).json({ errore: 'Database non configurato' });
  try {
    if (req.method === 'GET') {
      const codice = pulisciCodice(req.query && req.query.codice);
      if (!codiceValido(codice)) return res.status(400).json({ errore: 'Codice non valido' });
      const rec = await leggi(codice);
      if (!rec) return res.status(404).json({ errore: 'Codice non trovato' });
      return res.status(200).json({ codice, config: pubblica(rec) });
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const { azione } = body;
      if (azione === 'prova' || azione === 'crea') {
        if (!passwordDocentiGiusta(body.passwordDocenti)) return res.status(401).json({ errore: 'Password sbagliata' });
        if (azione === 'prova') return res.status(200).json({ ok: true });
        const sez = SEZIONI.includes(body.config && body.config.sez) ? body.config.sez : null;
        const config = sez && pulisci(body.config, sez);
        if (!config) return res.status(400).json({ errore: 'Verifica senza domande' });
        if (typeof body.passwordVerifica !== 'string' || body.passwordVerifica.length < 4 || body.passwordVerifica.length > 60) return res.status(400).json({ errore: 'La password della verifica deve avere almeno 4 caratteri' });
        config.ph = faiHash(body.passwordVerifica);
        let codice = pulisciCodice(body.codice);
        if (codice) {
          if (!codiceValido(codice)) return res.status(400).json({ errore: 'Il codice può avere da 3 a 20 tra lettere, numeri e trattini' });
          if ((await redis(['SET', chiave(codice), JSON.stringify(config), 'NX'])) !== 'OK') return res.status(409).json({ errore: 'Questo codice esiste già: scegline un altro' });
        } else {
          for (let i = 0; i < 10 && !codice; i++) {
            const c = codiceNuovo();
            if ((await redis(['SET', chiave(c), JSON.stringify(config), 'NX'])) === 'OK') codice = c;
          }
          if (!codice) return res.status(500).json({ errore: 'Non riesco a creare un codice' });
        }
        return res.status(200).json({ ok: true, codice, config: pubblica(config) });
      }
      if (azione === 'accedi' || azione === 'salva') {
        const codice = pulisciCodice(body.codice);
        if (!codiceValido(codice)) return res.status(400).json({ errore: 'Codice non valido' });
        const rec = await leggi(codice);
        if (!rec) return res.status(404).json({ errore: 'Codice non trovato' });
        if (!hashGiusto(body.password, rec.ph) && !passwordDocentiGiusta(body.password)) return res.status(401).json({ errore: 'Password sbagliata' });
        if (azione === 'accedi') return res.status(200).json({ ok: true, codice, config: pubblica(rec) });
        const config = pulisci(body.config, rec.sez);
        if (!config) return res.status(400).json({ errore: 'Verifica senza domande' });
        config.ph = rec.ph;
        await redis(['SET', chiave(codice), JSON.stringify(config)]);
        return res.status(200).json({ ok: true, codice, config: pubblica(config) });
      }
      return res.status(400).json({ errore: 'Richiesta non valida' });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ errore: 'Metodo non consentito' });
  } catch (e) {
    return res.status(500).json({ errore: 'Errore del server' });
  }
};
