// Foto a 360° del gioco «Dove mi trovo?»: restituisce l'indirizzo (temporaneo) dell'immagine sferica di Mapillary.
// GET /api/pano?id=1135220014282345  → { url }   oppure 404
// Variabile d'ambiente: MAPILLARY_TOKEN (client token dell'app Mapillary «Geografia in gioco», sola lettura).
module.exports = async (req, res) => {
  const id = String((req.query && req.query.id) || '');
  if (!/^\d{5,20}$/.test(id)) return res.status(400).json({ errore: 'id non valido' });
  const token = process.env.MAPILLARY_TOKEN;
  if (!token) return res.status(503).json({ errore: 'Foto a 360° non configurate' });
  try {
    const r = await fetch(`https://graph.mapillary.com/${id}?fields=thumb_2048_url&access_token=${encodeURIComponent(token)}`);
    const j = r.ok ? await r.json() : null;
    if (!j || !j.thumb_2048_url) return res.status(404).json({ errore: 'foto non trovata' });
    res.setHeader('Cache-Control', 'public, s-maxage=3600, max-age=600');   // l'indirizzo dell'immagine resta valido per un po'
    return res.json({ url: j.thumb_2048_url });
  } catch {
    return res.status(502).json({ errore: 'Mapillary non risponde' });
  }
};
