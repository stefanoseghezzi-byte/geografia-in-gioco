(() => {
'use strict';
// Dati della sezione attiva (Europa o Mondo): vengono impostati da impostaSezione()
let E, P, F, X, per, fis, MICRO = [], SZ;
const NS = 'http://www.w3.org/2000/svg';
const $ = id => document.getElementById(id);

const CATS = [
  { id: 'mari', nome: 'Mari e oceani', sing: 'mare', ico: '🌊', q: 'Quale mare (o oceano) è evidenziato?' },
  { id: 'stretti', nome: 'Stretti e canali', sing: 'stretto o canale', ico: '↔️', q: 'Quale stretto (o canale) è evidenziato?' },
  { id: 'fiumi', nome: 'Fiumi', sing: 'fiume', ico: '🏞️', q: 'Quale fiume è evidenziato?' },
  { id: 'monti', nome: 'Catene montuose', sing: 'catena montuosa', ico: '⛰️', q: 'Quale catena montuosa è evidenziata?' },
  { id: 'pianure', nome: 'Pianure e altopiani', sing: 'pianura o altopiano', ico: '🌾', q: 'Quale pianura (o altopiano) è evidenziata?' },
  { id: 'vette', nome: 'Vette e vulcani', sing: 'vetta o vulcano', ico: '🌋', q: 'Quale vetta o vulcano è evidenziato?' },
  { id: 'penisole', nome: 'Penisole', sing: 'penisola', ico: '🥾', q: 'Quale penisola è evidenziata?' },
  { id: 'isole', nome: 'Isole', sing: 'isola', ico: '🏝️', q: 'Quale isola è evidenziata?' },
  { id: 'laghi', nome: 'Laghi', sing: 'lago', ico: '💧', q: 'Quale lago è evidenziato?' },
  { id: 'deserti', nome: 'Deserti', sing: 'deserto', ico: '🏜️', q: 'Quale deserto è evidenziato?' },
];
// nomi delle categorie diversi nella sezione Italia (dove ci sono golfi, arcipelaghi, promontori e massicci)
const CATS_BASE = CATS.map(c => ({ ...c }));
const CATS_ITALIA = {
  mari: { nome: 'Mari e golfi', sing: 'mare o golfo', q: 'Quale mare (o golfo) è evidenziato?' },
  monti: { nome: 'Monti', sing: 'catena o massiccio montuoso', q: 'Quale catena montuosa (o massiccio) è evidenziata?' },
  isole: { nome: 'Isole e arcipelaghi', sing: 'isola o arcipelago', q: 'Quale isola (o arcipelago) è evidenziata?' },
  penisole: { nome: 'Penisole e promontori', sing: 'penisola o promontorio', q: 'Quale penisola (o promontorio) è evidenziata?' },
};
const cat = id => CATS.find(c => c.id === id);
const dato = id => per[id] || fis[id];
const nome = id => dato(id).nome;
const nomeStato = id => (per[id] ? per[id].nome : id);
const ITA = () => SZ.id === 'italia';
const citta = id => !!(per[id] && per[id].citta);
// regioni e Stati (senza le città), per i giochi di geografia fisica che collegano elementi e territori
const poolTerr = liv => pool(liv).filter(p => !p.citta);

const LIVELLI = [
  { n: 1, nome: 'Facile', desc: n => modo === 'fisico' ? (ITA() ? `${n} elementi: quelli fondamentali del programma di prima media.` : `${n} elementi: quelli fondamentali del programma base.`) : ITA() ? `Le 20 regioni e i ${n - 20} capoluoghi di regione.` : SZ.id === 'mondo' ? `${n} Stati: i più grandi e conosciuti di ogni continente.` : `${n} Stati: i principali, quelli grandi e più conosciuti.` },
  { n: 2, nome: 'Medio', desc: n => modo === 'fisico' ? (ITA() ? `${n} elementi: si aggiungono laghi, Dolomiti, arcipelaghi, affluenti del Po e altre vette.` : `${n} elementi: tutte le catene montuose e gli elementi più importanti.`) : ITA() ? `Le regioni e ${n - 20} capoluoghi: si aggiungono i capoluoghi di provincia più conosciuti.` : SZ.id === 'mondo' ? `${n} Stati: si aggiungono molti Stati di media grandezza.` : `${n} Stati: si aggiungono i Balcani, i Paesi baltici e altri Stati medio-piccoli.` },
  { n: 3, nome: 'Difficile', desc: n => modo === 'fisico' ? (ITA() ? `${n} elementi: tutti, compresi golfi, isole minori e altri fiumi e massicci.` : `${n} elementi: anche i più piccoli, ognuno con una curiosità di attualità.`) : ITA() ? `Le regioni e tutti i ${n - 20} capoluoghi di provincia.` : SZ.id === 'mondo' ? `${n} Stati: tutti, compresi gli Stati insulari e i più piccoli.` : `${n} Stati: tutti, compresi Malta, Kosovo e i microstati.` },
];
const TUTTE = ['europa', 'mondo'], TRE = ['italia', 'europa', 'mondo'];
// ent (solo Italia): 'reg' = gioco sulle regioni, 'citta' = gioco sui capoluoghi; base = gioco di cui si usano le domande
const GIOCHI = [
  { id: 'studio', ico: '📖', ic: 'libro', nome: 'Studio', desc: 'Esplora la mappa: tocca uno Stato per aprire la sua carta d\'identità.', punti: false, modo: 'stati', sez: TUTTE },
  { id: 'studio', ico: '📖', ic: 'libro', nome: 'Studio', desc: 'Esplora la mappa: tocca una regione o un capoluogo per aprire la sua scheda.', punti: false, modo: 'stati', sez: ['italia'] },
  { id: 'trova', ico: '🎯', ic: 'mirino', nome: 'Trova lo Stato', desc: 'Leggi il nome e cliccalo sulla mappa.', modo: 'stati', sez: TUTTE },
  { id: 'trova', ico: '🎯', ic: 'mirino', nome: 'Trova la regione', desc: 'Leggi il nome di una regione e cliccala sulla mappa.', modo: 'stati', sez: ['italia'], ent: 'reg' },
  { id: 'trovaCitta', base: 'trova', ico: '🎯', ic: 'mirino', nome: 'Trova la città', desc: 'Leggi il nome di un capoluogo e clicca il suo punto sulla mappa.', modo: 'stati', sez: ['italia'], ent: 'citta' },
  { id: 'indovina', ico: '❓', ic: 'domanda', nome: 'Che Stato è?', desc: 'Uno Stato è evidenziato: scegli il nome giusto.', modo: 'stati', sez: TUTTE },
  { id: 'indovina', ico: '❓', ic: 'domanda', nome: 'Che regione è?', desc: 'Una regione è evidenziata: scegli il nome giusto.', modo: 'stati', sez: ['italia'], ent: 'reg' },
  { id: 'indovinaCitta', base: 'indovina', ico: '❓', ic: 'domanda', nome: 'Che città è?', desc: 'Un capoluogo è evidenziato sulla mappa: scegli il nome giusto.', modo: 'stati', sez: ['italia'], ent: 'citta' },
  { id: 'capitali', ico: '🏛️', ic: 'colonne', nome: 'Le capitali', desc: 'Uno Stato è evidenziato: scegli la sua capitale.', modo: 'stati', sez: TUTTE },
  { id: 'capitali', ico: '🏛️', ic: 'colonne', nome: 'I capoluoghi di regione', desc: 'Una regione è evidenziata: scegli il suo capoluogo.', modo: 'stati', sez: ['italia'], ent: 'reg' },
  { id: 'regioneDi', ico: '🧭', ic: 'globo', nome: 'In che regione si trova?', desc: 'Un capoluogo è evidenziato: scegli la regione in cui si trova.', modo: 'stati', sez: ['italia'], ent: 'citta' },
  { id: 'coloraCont', ico: '🟩', ic: 'griglia', nome: 'Componi l\'area', desc: 'Seleziona sulla mappa tutte le regioni dell\'Italia settentrionale, centrale o meridionale.', modo: 'stati', sez: ['italia'], ent: 'reg' },
  { id: 'identita', ico: '🪪', ic: 'carta', nome: 'Carta d\'identità', desc: 'Area, abitanti, superficie: quanto conosci le regioni?', modo: 'stati', sez: ['italia'], ent: 'reg' },
  { id: 'continente', ico: '🧭', ic: 'globo', nome: 'In che continente?', desc: 'Uno Stato è evidenziato: scegli il continente in cui si trova.', modo: 'stati', sez: ['mondo'] },
  { id: 'coloraCont', ico: '🟩', ic: 'griglia', nome: 'Componi il continente', desc: 'Seleziona sulla mappa tutti gli Stati di un continente.', modo: 'stati', sez: ['mondo'] },
  { id: 'ue', ico: '🇪🇺', ic: 'bandiera', nome: 'UE o non UE?', desc: 'Lo Stato evidenziato fa parte dell\'Unione europea?', modo: 'stati', sez: ['europa'] },
  { id: 'coloraUE', ico: '🟦', ic: 'griglia', nome: 'Componi l\'UE', desc: 'Seleziona sulla mappa tutti gli Stati membri dell\'Unione europea.', modo: 'stati', sez: ['europa'] },
  { id: 'risiko', ico: '⚔️', ic: 'bandiera', nome: 'Costruisci il tuo Stato', desc: 'Un Risiko con un obiettivo diverso: conquistare non basta, devi creare territorio, popolo e governo.', punti: false, modo: 'stati', sez: [] }, // nascosto (in lavorazione): per riattivarlo, sez: ['europa']
  { id: 'identita', ico: '🪪', ic: 'carta', nome: 'Carta d\'identità', desc: 'Moneta, lingua, posizione, abitanti, superficie: quanto conosci gli Stati?', modo: 'stati', sez: TUTTE },
  { id: 'studio', ico: '📖', ic: 'libro', nome: 'Studio', desc: 'Esplora la mappa fisica: tocca un elemento per leggerne il nome e una curiosità.', punti: false, modo: 'fisico', sez: TRE },
  { id: 'trova', ico: '🎯', ic: 'mirino', nome: 'Trova sulla mappa', desc: 'Leggi il nome (di un fiume, un monte, un mare…) e cliccalo sulla mappa.', modo: 'fisico', sez: TRE },
  { id: 'indovina', ico: '❓', ic: 'domanda', nome: 'Che cos\'è?', desc: 'Un elemento è evidenziato: scegli il nome giusto.', modo: 'fisico', sez: TRE },
  { id: 'legami', ico: '🔗', ic: 'link', nome: 'Stati collegati', desc: 'Leggi il nome di un mare, un fiume, un monte… e seleziona sulla mappa gli Stati che tocca. Senza aiuti: devi ricordarlo!', modo: 'fisico', sez: TUTTE },
  { id: 'legami', ico: '🔗', ic: 'link', nome: 'Regioni collegate', desc: 'Leggi il nome di un fiume, un monte, un mare… e seleziona sulla mappa le regioni in cui si trova. Senza aiuti: devi ricordarlo!', modo: 'fisico', sez: ['italia'] },
  { id: 'verifica', ico: '📝', ic: 'matita', nome: 'Simulazione della verifica', desc: 'Geografia fisica e politica insieme, come in classe: il voto arriva alla fine.', modo: 'verifica', sez: ['europa'] },
  { id: 'elementi', ico: '🧩', ic: 'strati', nome: 'Cosa lo tocca?', desc: 'Uno Stato è evidenziato: scegli quali elementi fisici (fiumi, monti, mari…) si trovano lì.', modo: 'fisico', sez: TUTTE },
  { id: 'elementi', ico: '🧩', ic: 'strati', nome: 'Cosa c\'è in questa regione?', desc: 'Una regione è evidenziata: scegli quali elementi fisici (fiumi, monti, mari…) si trovano lì.', modo: 'fisico', sez: ['italia'] },
];
// il gioco con questo id nella sezione attiva (alcuni giochi hanno nomi e testi diversi nella sezione Italia)
const giocoDi = (id, m) => GIOCHI.find(x => x.id === id && x.modo === m && x.sez.includes(SZ.id)) || GIOCHI.find(x => x.id === id && x.modo === m);
const TIPI_BASE = { cont: 'continente', elementi: 'elementi collegati', stati: 'Stati collegati', moneta: 'moneta', lingua: 'lingua', area: 'posizione', abitanti: 'abitanti', superficie: 'superficie', ue: 'UE', cap: 'capitale', reg: 'regione' };
const TIPI = { ...TIPI_BASE };

// ---------- memoria locale (impostazioni, profili, statistiche) ----------
const mem = {
  get(k, d) { try { const v = localStorage.getItem('eg_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('eg_' + k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem('eg_' + k); } catch {} },
};
let profili = mem.get('profili', ['Io']);
let profilo = mem.get('profilo', profili[0]);
if (!profili.includes(profilo)) profilo = profili[0];
const mp = { get: (k, d) => mem.get(`p_${profilo}_${k}`, d), set: (k, v) => mem.set(`p_${profilo}_${k}`, v), del: k => mem.del(`p_${profilo}_${k}`) };
let livello = mem.get('liv', 1), quantita = mem.get('qta', 10), modo = mem.get('modo', 'stati');
let sezione = mem.get('sez', 'europa');
let cats = [];
// categorie fisiche presenti nella sezione attiva (es. i deserti ci sono solo nel Mondo); la scelta è salvata per sezione
const catsSez = () => CATS.filter(c => F.some(f => f.cat === c.id));
const salvaCats = () => mem.set('cats' + SZ.suf, cats);
let tema = mem.get('tema', null);
if (tema !== 'chiaro') tema = 'scuro';
document.documentElement.dataset.tema = tema;

// Ogni sezione ha le sue statistiche, le sue partite e i suoi record (Europa mantiene le chiavi di sempre)
const kStat = () => 'stat' + SZ.suf, kSess = () => 'sess' + SZ.suf;
function registra(chiave, ok) {
  const st = mp.get(kStat(), {}), r = st[chiave] || { n: 0, e: 0, r: [] };
  r.n++; if (!ok) r.e++; r.r = [...r.r.slice(-5), ok ? 1 : 0]; r.t = Date.now(); st[chiave] = r;
  mp.set(kStat(), st);
}
const baseId = k => k.split('|')[0];
const etichettaChiave = k => { const [b, t] = k.split('|'); return nome(b) + (t ? ` <small>(${TIPI[t] || t})</small>` : ''); };
const gruppoChiave = k => { const b = baseId(k); if (k.endsWith('|elementi')) return 'Elementi collegati'; return per[b] ? (ITA() ? (per[b].citta ? 'Capoluoghi' : 'Regioni') : 'Stati') : cat(fis[b].cat).nome; };

// ---------- icone (tratto, colore del testo) ----------
const ICONE = {
  libro: '<path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z"/>',
  mirino: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  domanda: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 1 1 3.6 2.4c-.7.3-1.1.9-1.1 1.7v.4"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  colonne: '<path d="M3 21h18"/><path d="M5 18v-7"/><path d="M9.5 18v-7"/><path d="M14.5 18v-7"/><path d="M19 18v-7"/><path d="M2.5 9 12 3.5 21.5 9z"/>',
  bandiera: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4.5L17 13H5"/>',
  griglia: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="m14.5 17 2 2 3.5-4"/>',
  carta: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5.5 16c.6-1.5 1.7-2.2 3-2.2s2.4.7 3 2.2"/><path d="M14.5 10h4"/><path d="M14.5 14h4"/>',
  globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
  strati: '<path d="M12 3 2.5 8l9.5 5 9.5-5z"/><path d="m2.5 12.5 9.5 5 9.5-5"/><path d="m2.5 17 9.5 5 9.5-5"/>',
  stella: '<path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.3 6.8 19.1l1-5.8-4.3-4.1 5.9-.8z"/>',
  fiamma: '<path d="M12 2.5c.6 3.3 4.5 5.4 4.5 10a4.5 4.5 0 0 1-9 0c0-1.9.9-3.3 2-4.3-.1 1.6.6 2.8 1.6 3.3.3-3.6.3-6.3.9-9z"/>',
  corona: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
  monte: '<path d="m2 20 7-12 4 6 3-4 6 10z"/>',
  trofeo: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3a3 3 0 0 1-3 4"/><path d="M7 5H4a3 3 0 0 0 3 4"/>',
  scudo: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  lucchetto: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  freccia: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  avanti: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  ricarica: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
  grafico: '<path d="M3 20h18"/><path d="M6 16v-5"/><path d="M11 16V7"/><path d="M16 16v-8"/><path d="M21 16V4"/>',
  suono: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
  muto: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6"/><path d="m21 9-5 6"/>',
  luna: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
  sole: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  spunta: '<path d="m5 12 5 5 9-10"/>',
  matita: '<path d="M4 20h4L19.5 8.5a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
};
const icona = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONE[n] || ''}</svg>`;
const STELLA = '<path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8z"/>';
const stelleDa = perc => perc >= 90 ? 3 : perc >= 70 ? 2 : perc >= 40 ? 1 : 0;
const stelline = n => `<span class="stelline" role="img" aria-label="${n} stelle su 3">${[1, 2, 3].map(k => `<svg viewBox="0 0 24 24" class="${k <= n ? 'on' : ''}" aria-hidden="true">${STELLA}</svg>`).join('')}</span>`;
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>';

// ---------- esperienza (XP), livelli e medaglie: per profilo, valgono per Europa e Mondo insieme ----------
const XP_RISPOSTA = 10, XP_SERIE = 5, XP_RECORD = 20, XP_PERFETTO = 25;
const sogliaLiv = n => 50 * n * (n - 1);   // XP totali per arrivare al livello n: 2 → 100, 3 → 300, 4 → 600…
const livDa = xp => { let n = 1; while (xp >= sogliaLiv(n + 1)) n++; return n; };
const infoLiv = xp => { const n = livDa(xp), a = sogliaLiv(n), b = sogliaLiv(n + 1); return { n, dentro: xp - a, serve: b - a, manca: b - xp, perc: 100 * (xp - a) / (b - a) }; };
function xpTot() {
  let x = mp.get('xp', null);
  if (x === null) { // primo avvio con l'esperienza: si recupera quella delle partite già giocate (10 XP per risposta giusta)
    x = [...mp.get('sess', []), ...mp.get('sess_m', []), ...mp.get('sess_i', [])].reduce((s, p) => s + Math.round(p.p / 100 * p.n) * XP_RISPOSTA, 0);
    mp.set('xp', x);
  }
  return x;
}
const MEDAGLIE = [
  { id: 'prima', nome: 'Prima partita', desc: 'Completa una partita', ic: 'bandiera', c: 'ciano' },
  { id: 'serie10', nome: 'Serie ×10', desc: '10 risposte giuste di fila', ic: 'fiamma', c: 'arancio' },
  { id: 'perfetto', nome: 'Perfetto!', desc: '100% in una partita da almeno 10 domande', ic: 'stella', c: 'oro' },
  { id: 'capitali', nome: 'Re delle capitali', desc: '3 stelle a Le capitali (o ai capoluoghi di regione)', ic: 'colonne', c: 'rosso' },
  { id: 'difficile', nome: 'Esperto', desc: '3 stelle a livello Difficile', ic: 'corona', c: 'oro' },
  { id: 'ue', nome: 'Tutta l\'UE', desc: 'Componi l\'UE senza errori', ic: 'griglia', c: 'ciano' },
  { id: 'continente', nome: 'Giramondo', desc: 'Componi un continente (o un\'area d\'Italia) senza errori', ic: 'globo', c: 'verde' },
  { id: 'fisico', nome: 'Geografo', desc: '3 stelle in un gioco di geografia fisica', ic: 'monte', c: 'verde' },
  { id: 'esploratore', nome: 'Esploratore', desc: 'Apri 30 schede in Studio', ic: 'libro', c: 'ciano' },
  { id: 'tutti', nome: 'Collezionista', desc: 'Gioca tutti i giochi di una sezione', ic: 'strati', c: 'viola' },
  { id: 'maratona', nome: 'Maratoneta', desc: 'Completa 25 partite', ic: 'trofeo', c: 'arancio' },
  { id: 'liv10', nome: 'Veterano', desc: 'Raggiungi il livello 10', ic: 'scudo', c: 'viola' },
];
const medOttenute = () => mp.get('med', {});
function sblocca(id, nuove) { const m = medOttenute(); if (m[id]) return; m[id] = Date.now(); mp.set('med', m); if (nuove) nuove.push(id); }
const medagliaHtml = (d, aperta, nuova) => `<div class="medaglia ${aperta ? '' : 'chiusa'} ${nuova ? 'nuova' : ''}"><span class="disco" style="--c: var(--${d.c})">${icona(aperta ? d.ic : 'lucchetto')}</span><b>${d.nome}</b><small>${d.desc}</small></div>`;
function avviso(html) {
  const d = document.createElement('div'); d.className = 'avviso'; d.setAttribute('role', 'status'); d.innerHTML = html;
  document.body.appendChild(d); setTimeout(() => d.remove(), 4000);
}

const CLS_CONT = [0, 1, 2, 3, 4, 5, 6].map(i => 'cont-' + i);
const mescola = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pool = liv => P.filter(p => p.liv <= liv);
const poolFis = (liv, cs) => F.filter(f => cs.includes(f.cat) && f.liv <= liv);
const poolModo = (m, liv, cs) => (m === 'stati' ? pool(liv) : poolFis(liv, cs));
const chiaveRec = (g, m, liv, cs) => m === 'stati' ? `${SZ.rec}${g}_${liv}` : `${SZ.rec}fis_${g}_${liv}_${[...cs].sort().join('-')}`;

// ---------- sezioni: Italia (prima media), Europa (seconda media) e Mondo (terza media) ----------
const SEZIONI = {
  italia: {
    id: 'italia', nome: 'Italia', suf: '_i', rec: 'reci_', zmax: 16, mk: [9, 0.16], fs: 1.9, etAdatt: true,
    titolo: 'Impara l\'Italia', classe: 'Prima media', img: 'dati/rilievo-italia.webp',
    testo: 'Questo è un sito didattico per <b>studiare e imparare</b> la geografia dell\'Italia: le <b>regioni</b> con i loro <b>capoluoghi</b>, i <b>capoluoghi di provincia</b> e la <b>geografia fisica</b> (mari e golfi, fiumi, laghi, monti, vette e vulcani, pianure, isole e penisole).',
    moduli: [['stati', 'Regioni e città'], ['fisico', 'Geografia fisica']],
    rilievo: 'dati/rilievo-italia.webp', minW: 230, mappa: 'Mappa dell\'Italia', vistaIntera: 'Vista intera dell\'Italia (torna alla mappa completa)',
    aree: [],
    areaDom: nome => `<b>${nome}</b>: in quale parte d'Italia si trova?`,
    piede: 'Confini e coste: Natural Earth (dominio pubblico). Fiumi e laghi: © OpenStreetMap contributors (ODbL). Quote del terreno: Terrain Tiles su AWS Open Data. Dati arrotondati e aggiornati al 2025: per le verifiche fa fede il libro di testo. Per la Sardegna sono indicati i quattro capoluoghi di provincia storici.',
  },
  europa: {
    id: 'europa', nome: 'Europa', suf: '', rec: 'rec_', zmax: 14, mk: [6, 0.12], etAdatt: false,
    titolo: 'Impara l\'Europa', classe: 'Seconda media', img: 'dati/rilievo.webp',
    testo: 'Questo è un sito didattico per <b>studiare e imparare</b> la geografia dell\'Europa: gli <b>elementi fisici</b> (monti, pianure, mari, stretti, fiumi, isole, penisole e laghi), gli <b>Stati</b> e le <b>informazioni di base</b> su ciascuno, come capitale, moneta, lingua e appartenenza all\'Unione europea.',
    moduli: [['stati', 'Stati d\'Europa'], ['fisico', 'Geografia fisica']],
    rilievo: 'dati/rilievo.webp', minW: 420, mappa: 'Mappa dell\'Europa', vistaIntera: 'Vista intera dell\'Europa (torna alla mappa completa)',
    aree: ['Europa settentrionale', 'Europa occidentale', 'Europa centrale', 'Europa orientale', 'Europa meridionale', 'Balcani'],
    areaDom: nome => `<b>${nome}</b>: in quale area d'Europa si trova?`,
    piede: 'Confini, fiumi e carta fisica: Natural Earth (dominio pubblico). Quote del terreno: Terrain Tiles su AWS Open Data (da SRTM, ETOPO1 e altre fonti pubbliche). Dati arrotondati e aggiornati al 2026: per le verifiche fa fede il libro di testo.',
  },
  mondo: {
    id: 'mondo', nome: 'Mondo', suf: '_m', rec: 'recm_', zmax: 40, mk: [7, 0.05], etAdatt: true,
    titolo: 'Impara il mondo', classe: 'Terza media', img: 'dati/rilievo-mondo.webp',
    testo: 'Questo è un sito didattico per <b>studiare e imparare</b> la geografia del mondo: i <b>continenti</b>, gli <b>Stati</b> di ogni parte della Terra e le <b>informazioni di base</b> su ciascuno, come capitale, moneta, lingua e abitanti, oltre alla <b>geografia fisica</b> (oceani, mari, catene montuose, fiumi, deserti, isole, penisole e laghi).',
    moduli: [['stati', 'Stati del mondo'], ['fisico', 'Geografia fisica']],
    rilievo: 'dati/rilievo-mondo.webp', minW: 150, mappa: 'Mappa del mondo', vistaIntera: 'Vista intera del mondo (torna alla mappa completa)',
    aree: [],
    areaDom: nome => `<b>${nome}</b>: in quale continente si trova?`,
    piede: 'Confini: Natural Earth (dominio pubblico). Dati arrotondati e aggiornati al 2025: per le verifiche fa fede il libro di testo. Alcuni confini e alcuni Stati (come Taiwan, Palestina e Kosovo) sono oggetto di dispute internazionali.',
  },
};
const caricati = {};
const carica = src => caricati[src] || (caricati[src] = new Promise((ok, ko) => {
  const t = document.createElement('script'); t.src = src; t.onload = ok; t.onerror = () => { delete caricati[src]; ko(new Error('Impossibile caricare ' + src)); };
  document.head.appendChild(t);
}));
// Stati ambigui tra due continenti: non penalizzano nelle domande sul continente
const ALT = { RUS: ['Europa', 'Asia'], TUR: ['Asia', 'Europa'], CYP: ['Asia', 'Europa'], KAZ: ['Asia', 'Europa'], ARM: ['Asia', 'Europa'], AZE: ['Asia', 'Europa'], GEO: ['Asia', 'Europa'], MEX: ['America centrale', 'America settentrionale'] };
let sezPronta = null;
async function impostaSezione(id) {
  const z = SEZIONI[id] || SEZIONI.europa;
  if (z.id === 'mondo') { await carica('dati/mondo.js'); await carica('mondo-paesi.js'); await carica('dati/mondo-fisico.js'); }
  if (z.id === 'italia') { await carica('dati/italia.js'); await carica('italia-dati.js'); await carica('dati/italia-fisico.js'); }
  SZ = z; sezione = z.id; mem.set('sez', z.id);
  CATS.forEach((c, i) => Object.assign(c, CATS_BASE[i], z.id === 'italia' ? CATS_ITALIA[c.id] : null));
  Object.assign(TIPI, TIPI_BASE, z.id === 'italia' ? { stati: 'regioni collegate', cont: 'area', cap: 'capoluogo', area: 'area' } : null);
  if (z.id === 'europa') {
    E = window.EUROPA; P = window.PAESI; F = window.FISICO; X = window.CONTENUTI || {};
    if (!F.fatto) { F.forEach(f => { if (X[f.id]) Object.assign(f, X[f.id]); else console.warn('Elemento senza contenuti:', f.id); }); F.fatto = true; }
    MICRO = ['MLT', 'AND', 'MCO', 'SMR', 'VAT', 'LIE'];
  } else if (z.id === 'italia') {
    // regioni (con forma) e capoluoghi (punti sulla mappa, come i microstati)
    E = window.ITALIA; P = window.PAESI_ITALIA; F = window.FISICO_ITALIA; X = {};
    MICRO = E.micro.slice();
    const nomi = Object.fromEntries(P.map(p => [p.id, p.nome]));
    P.forEach(p => { if (!p.citta && !p.confFatto) { p.conf = [...(E.conf[p.id] || []).map(x => nomi[x]), ...(E.est[p.id] || [])]; p.cont = p.area; p.confFatto = true; } });
    SZ.aree = window.AREE_ITALIA;
  } else {
    E = window.MONDO; P = window.PAESI_MONDO; F = window.FISICO_MONDO; X = {};
    const idP = new Set(P.map(p => p.id)); MICRO = E.micro.filter(id => idP.has(id));
    P.forEach(p => { p.area = p.cont; p.alt = p.amb ? (ALT[p.id] || [p.cont]) : null; });
    const nomi = Object.fromEntries(P.map(p => [p.id, p.nome]));
    P.forEach(p => { if (!p.confFatto) { p.conf = (E.conf[p.id] || []).filter(x => nomi[x] && x !== p.id).map(x => nomi[x]); p.confFatto = true; } });
    SZ.aree = window.CONTINENTI;
  }
  per = Object.fromEntries(P.map(p => [p.id, p])); fis = Object.fromEntries(F.map(f => [f.id, f]));
  if (!SZ.moduli.some(([m, , off]) => m === modo && !off)) { modo = 'stati'; mem.set('modo', modo); }
  cats = mem.get('cats' + SZ.suf, catsSez().map(c => c.id)).filter(c => catsSez().some(x => x.id === c));
  if (!cats.length) cats = catsSez().map(c => c.id);
  document.title = 'Geografia in gioco · ' + z.nome;
  $('gioco').classList.toggle('sez-mondo', z.id === 'mondo'); $('gioco').classList.toggle('sez-italia', z.id === 'italia');
  costruisciMappa();
}

// ---------- formati ----------
const fmt = n => n.toLocaleString('it-IT');
const fmtSup = v => (v < 10 ? v.toLocaleString('it-IT', { maximumFractionDigits: 2 }) : fmt(Math.round(v))) + ' km²';
const fmtAb = v => v >= 1e6 ? 'circa ' + (v / 1e6).toLocaleString('it-IT', { maximumFractionDigits: v >= 1e8 ? 0 : 1 }) + ' milioni' : 'circa ' + fmt(v);
const monetaBase = p => p.mon.replace(/ \(.*\)/, '');

// ---------- home ----------
const giochiHome = () => GIOCHI.filter(g => g.modo === modo && g.sez.includes(SZ.id));
function giocoVuoto(g, nPool) {
  return modo === 'fisico' && g.id === 'legami' ? !poolFis(livello, cats).some(f => f.s && f.s.length)
    : modo === 'fisico' && g.id === 'elementi' ? statiConElementi(poolFis(livello, cats), poolTerr(Math.max(2, livello)).map(p => p.id)).length === 0 : nPool === 0;
}
// piccola cartina politica (Stati del livello scelto colorati) per la scheda Studio
function miniMappa(ids) {
  const set = new Set(ids), m = document.createElementNS(NS, 'svg');
  m.setAttribute('viewBox', `0 0 ${E.W} ${E.H}`); m.setAttribute('preserveAspectRatio', 'xMidYMid slice'); m.setAttribute('aria-hidden', 'true');
  crea('rect', { width: E.W, height: E.H }, m, 'mare');
  Object.entries(E.paesi).forEach(([id, d]) => crea('path', { d }, m, 'terra' + (set.has(id) ? ' attiva pol-' + (polDi[id] || 0) : '')));
  return m;
}
function aggiornaProfilo() {
  const l = infoLiv(xpTot());
  $('nomeProfilo').textContent = profilo; $('avatar').textContent = (profilo.trim()[0] || '?');
  $('livProfilo').textContent = 'LIV ' + l.n; $('xpProfilo').style.width = l.perc + '%';
  $('btnProfilo').setAttribute('aria-label', `Profilo ${profilo}, livello ${l.n}: cambia profilo`);
}
function disegnaHome() {
  aggiornaProfilo(); iconaTema();
  const SC = $('sezioni'); SC.innerHTML = '';
  ['italia', 'europa', 'mondo'].forEach(id => {
    const z = SEZIONI[id], b = document.createElement('button'); b.className = 'sez-btn';
    b.innerHTML = `<img src="${z.img}" alt="" loading="lazy"><span class="sez-ok">${icona('spunta')}Selezionata</span><span class="sez-dida"><small>${z.classe}</small><b>${z.nome}</b></span>`;
    b.setAttribute('aria-pressed', id === SZ.id); b.setAttribute('aria-label', `${z.nome} (${z.classe.toLowerCase()})`);
    b.onclick = () => { if (id !== SZ.id) cambiaSezione(id); };
    SC.appendChild(b);
  });
  $('heroClasse').textContent = `${SZ.classe} · ${SZ.nome}`;
  $('heroTitolo').innerHTML = `${SZ.titolo}<br><em>giocando.</em>`; $('heroTesto').innerHTML = SZ.testo; $('piede').textContent = SZ.piede;
  const M = $('modi'); M.innerHTML = '';
  SZ.moduli.forEach(([id, t, off]) => {
    const b = document.createElement('button'); b.textContent = t;
    b.setAttribute('aria-pressed', id === modo);
    if (off) b.disabled = true;
    b.onclick = () => { modo = id; mem.set('modo', id); disegnaHome(); };
    M.appendChild(b);
  });
  const C = $('categorie'); C.innerHTML = '';
  $('sezCat').hidden = modo !== 'fisico';
  if (modo === 'fisico') {
    catsSez().forEach(c => {
      const n = poolFis(livello, [c.id]).length;
      const b = document.createElement('button'); b.className = 'chip' + (n ? '' : ' vuoto'); b.innerHTML = `${c.nome}<span class="n">${n}</span>`;
      b.setAttribute('aria-pressed', cats.includes(c.id));
      b.onclick = () => {
        cats = cats.includes(c.id) ? cats.filter(x => x !== c.id) : [...cats, c.id];
        if (!cats.length) cats = [c.id];
        salvaCats(); disegnaHome();
      };
      C.appendChild(b);
    });
    const tutte = document.createElement('button'); tutte.className = 'chip'; tutte.textContent = 'Tutte';
    tutte.setAttribute('aria-pressed', cats.length === catsSez().length);
    tutte.onclick = () => { cats = catsSez().map(c => c.id); salvaCats(); disegnaHome(); };
    C.appendChild(tutte);
  }
  const L = $('livelli'); L.innerHTML = '';
  LIVELLI.forEach(l => {
    const b = document.createElement('button'); b.className = 'liv liv-' + l.n;
    b.innerHTML = `<span class="liv-testa"><b>${l.nome}</b><span class="pips-liv" aria-hidden="true"><i></i><i></i><i></i></span></span><small>${l.desc(poolModo(modo, l.n, cats).length)}</small>`;
    b.setAttribute('aria-pressed', l.n === livello);
    b.onclick = () => { livello = l.n; mem.set('liv', livello); disegnaHome(); };
    L.appendChild(b);
  });
  const nPool = poolModo(modo, livello, cats).length;
  const Q = $('quantita'); Q.innerHTML = '';
  [[10, '10', 'domande'], [20, '20', 'domande'], [0, 'Tutti', 'gli elementi']].forEach(([n, t, sub]) => {
    const b = document.createElement('button'); b.innerHTML = `<b>${t}</b><small>${sub}</small>`;
    b.setAttribute('aria-pressed', n === quantita);
    b.onclick = () => { quantita = n; mem.set('qta', n); disegnaHome(); };
    Q.appendChild(b);
  });
  $('riepScelte').textContent = `${SZ.nome} · ${LIVELLI[livello - 1].nome} · ${quantita ? quantita + ' domande' : 'tutti gli elementi'}`.toUpperCase();
  // Studio: scheda grande con la cartina (politica per gli Stati, rilievo per la geografia fisica)
  const st = giochiHome().find(g => g.id === 'studio'), SB = $('studioBox'); SB.innerHTML = '';
  if (st) {
    const b = document.createElement('button'); b.className = 'studio-card';
    b.innerHTML = `<span class="studio-vista"></span><span class="studio-testo"><span class="tag-modo"><span class="ico" style="--c: var(--ciano)">${icona(st.ic)}</span><span class="hud-lbl" style="color: var(--ciano)">Esplorazione · senza punti</span></span>
      <b class="tit">${st.nome}</b><span class="d">${st.desc}</span><span class="vai">Apri la mappa ${icona('avanti')}</span></span>`;
    const vista = b.querySelector('.studio-vista');
    if (modo === 'fisico') vista.innerHTML = `<img src="${SZ.rilievo}" alt="">`; else vista.appendChild(miniMappa(pool(livello).map(p => p.id)));
    b.onclick = () => avvia('studio');
    SB.appendChild(b);
  }
  // simulazione della verifica: l'insegnante dà un codice (si scrive qui), oppure ci si allena con la verifica standard
  const VB = $('verificaBox'); VB.innerHTML = '';
  {
    const std = verNormalizza(verDefault()), rec = mp.get(SZ.rec + 'verifica', null), b = document.createElement('section'); b.className = 'verifica-card codice'; b.setAttribute('aria-labelledby', 'tVerCod');
    b.innerHTML = `<span class="ico">${icona('matita')}</span><div class="vc-testo"><span class="hud-lbl">Verifica dell'insegnante · ${SZ.nome}</span>
      <b id="tVerCod">Hai il codice della verifica?</b><span class="d">Scrivilo qui: fai la verifica preparata dal tuo insegnante. Come in classe, correzione e voto arrivano solo alla fine.</span>
      <form class="vc-form" id="formCodice"><input id="codVer" type="text" maxlength="20" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="Es. K7M2Q" value="${mem.get('verCod', '')}" aria-label="Codice della verifica"><button class="primario piccolo" type="submit">Inizia ${PLAY}</button></form>
      <p class="nota vc-esito" id="esitoCod" role="status"></p>
      <div class="vc-link"><button type="button" class="btn-testo" id="verStd">${icona('mirino')}Allenati con la simulazione standard (${verTot(std)} domande${rec === null ? '' : ' · miglior voto ' + votoTxt(votoDa(rec / 100))})</button>
      <button type="button" class="btn-testo" id="verInse">${icona('matita')}Sei l'insegnante? Prepara la verifica</button></div></div>`;
    VB.appendChild(b);
    $('formCodice').onsubmit = async e => { e.preventDefault(); const btn = e.target.querySelector('button'); btn.disabled = true; await cercaVerifica($('codVer').value); btn.disabled = false; };
    $('verStd').onclick = () => avviaVerifica();
    $('verInse').onclick = () => apriPrepara();
  }
  const G = $('giochi'); G.innerHTML = '';
  giochiHome().filter(g => g.id !== 'studio').forEach(g => {
    const b = document.createElement('button'); b.className = 'card card-' + g.id;
    const rec = g.punti === false ? null : mp.get(chiaveRec(g.id, modo, livello, cats), null);
    const vuoto = giocoVuoto(g, nPool);
    b.innerHTML = `<span class="card-testa"><span class="ico">${icona(g.ic)}</span>${rec !== null ? stelline(stelleDa(rec)) : ''}</span>
      <span class="card-corpo"><b>${g.nome}</b><span class="d">${vuoto ? 'Nessun elemento con queste scelte: cambia livello o categorie.' : g.desc}</span></span>
      <span class="card-piede"><span class="rec ${rec === null ? 'nuova' : ''}">${rec === null ? 'NUOVA SFIDA' : 'RECORD ' + rec + '%'}</span><span class="gioca">Gioca ${PLAY}</span></span>`;
    if (vuoto) { b.disabled = true; b.classList.add('spento'); }
    b.onclick = () => avvia(g.id);
    G.appendChild(b);
  });
  disegnaProfili();
}
$('rapida').onclick = () => {
  const nPool = poolModo(modo, livello, cats).length;
  const ok = giochiHome().filter(g => g.punti !== false && !giocoVuoto(g, nPool));
  avvia(ok.length ? ok[Math.random() * ok.length | 0].id : 'studio');
};
$('vaiGiochi').onclick = () => $('sezGiochi').scrollIntoView({ behavior: 'smooth' });
async function cambiaSezione(id) {
  $('sezioni').classList.add('carico');
  try { await impostaSezione(id); } catch (e) { $('sezioni').classList.remove('carico'); alert('Non riesco a caricare questa sezione. Controlla la connessione e riprova.'); return false; }
  $('sezioni').classList.remove('carico'); disegnaHome(); window.scrollTo(0, 0); return true;
}
function mostra(id) { if (id !== 'gioco' && $('gioco').classList.contains('schermo-intero')) schermoIntero(false); ['home', 'gioco', 'fine', 'progressi', 'prepara'].forEach(s => $(s).hidden = s !== id); $('panProfilo').hidden = true; window.scrollTo(0, 0); }

// ---------- profili ----------
function disegnaProfili() {
  const box = $('listaProfili'); box.innerHTML = '';
  profili.forEach(n => {
    const b = document.createElement('button'); b.className = 'chip'; b.textContent = n; b.setAttribute('aria-pressed', n === profilo);
    b.onclick = () => { profilo = n; mem.set('profilo', n); $('panProfilo').hidden = true; disegnaHome(); };
    box.appendChild(b);
  });
}
$('btnProfilo').onclick = () => { $('panProfilo').hidden = !$('panProfilo').hidden; };
$('aggiungiProfilo').onclick = () => {
  const n = $('nuovoProfilo').value.trim().slice(0, 20);
  if (!n) return;
  if (!profili.includes(n)) { profili.push(n); mem.set('profili', profili); }
  profilo = n; mem.set('profilo', n); $('nuovoProfilo').value = ''; $('panProfilo').hidden = true; disegnaHome();
};
const iconaTema = () => { $('btnTema').innerHTML = icona(tema === 'chiaro' ? 'luna' : 'sole'); $('btnTema').title = tema === 'chiaro' ? 'Tema scuro' : 'Tema chiaro'; };
$('btnTema').onclick = () => { tema = tema === 'chiaro' ? 'scuro' : 'chiaro'; mem.set('tema', tema); document.documentElement.dataset.tema = tema; iconaTema(); };
const iconaSuoni = () => { $('btnSuoni').innerHTML = icona(suoniAttivi() ? 'suono' : 'muto'); $('btnSuoni').title = suoniAttivi() ? 'Suoni attivi' : 'Suoni spenti'; };
iconaSuoni();
$('btnSuoni').onclick = () => { suonoImposta(!suoniAttivi()); iconaSuoni(); };
$('btnProgressi').onclick = () => { disegnaProgressi(); mostra('progressi'); };
$('logo').onclick = () => esciMenu();

// ---------- mappa ----------
const svg = $('mappa');
let vb = { x: 0, y: 0, w: 1000, h: 800 };
const elem = {};            // Stati: id -> [path, marker?]
const elemF = {};           // geografia fisica: id -> [elementi...]
const etich = {};           // id -> <text>
let gLabel, gMarker, gFMark, gPt, gArmate;
const crea = (tag, attr, parent, cls) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attr || {}).forEach(([k, v]) => e.setAttribute(k, v));
  if (cls) e.setAttribute('class', cls);
  if (parent) parent.appendChild(e);
  return e;
};

// cartina politica: a ogni Stato uno dei 6 colori, diverso da quelli degli Stati confinanti (colorazione «golosa», dai più collegati)
const polDi = {};
function coloraPolitica() {
  Object.keys(polDi).forEach(k => delete polDi[k]);
  const adj = {}; Object.keys(E.paesi).concat(MICRO).forEach(id => { adj[id] = adj[id] || new Set(); });
  const unisci = (a, b) => { if (adj[a] && adj[b] && a !== b) { adj[a].add(b); adj[b].add(a); } };
  if (E.conf) Object.entries(E.conf).forEach(([a, l]) => l.forEach(b => unisci(a, b)));
  const idNome = Object.fromEntries(P.map(p => [p.nome, p.id]));
  P.forEach(p => (p.conf || []).forEach(n => unisci(p.id, idNome[n])));
  const uso = [0, 0, 0, 0, 0, 0];
  Object.keys(adj).sort((a, b) => adj[b].size - adj[a].size).forEach(id => {
    const vietati = new Set([...adj[id]].map(x => polDi[x]).filter(x => x !== undefined));
    const liberi = uso.map((n, c) => c).filter(c => !vietati.has(c));
    const c = (liberi.length ? liberi : [0, 1, 2, 3, 4, 5]).sort((x, y) => uso[x] - uso[y])[0];
    polDi[id] = c; uso[c]++;
  });
}
function costruisciMappa() {
  svg.replaceChildren(); coloraPolitica();
  [elem, elemF, etich].forEach(o => Object.keys(o).forEach(k => delete o[k]));
  gArmate = null; vb = { x: 0, y: 0, w: E.W, h: E.H };
  svg.setAttribute('viewBox', `0 0 ${E.W} ${E.H}`); svg.setAttribute('aria-label', SZ.mappa);
  svg.parentElement.style.setProperty('--rapporto', E.W / E.H);
  $('zReset').title = SZ.vistaIntera; $('zReset').setAttribute('aria-label', SZ.vistaIntera);
  crea('rect', { width: E.W, height: E.H }, svg, 'mare');
  if (F.length) {
    crea('image', { href: SZ.rilievo, width: E.W, height: E.H, preserveAspectRatio: 'none' }, svg, 'rilievo');
    // ritaglio "solo mare": i mari evidenziati non devono coprire la terraferma, che nella carta fisica è trasparente
    const defs = crea('defs', {}, svg), clip = crea('clipPath', { id: 'soloMare' }, defs);
    crea('path', { 'clip-rule': 'evenodd', d: `M0 0H${E.W}V${E.H}H0Z` + Object.values(E.paesi).join('') }, clip);
  }
  const gSea = crea('g', {}, svg, 'gsea'), gT = crea('g', {}, svg), gPen = crea('g', {}, svg), gPoly = crea('g', {}, svg), gLines = crea('g', {}, svg);
  gPt = crea('g', {}, svg); gFMark = crea('g', {}, svg); gMarker = crea('g', {}, svg); gLabel = crea('g', {}, svg);
  Object.entries(E.paesi).forEach(([id, d]) => {
    const p = crea('path', { d }, gT, 'terra'); p.dataset.id = id;
    elem[id] = [p];
  });
  MICRO.forEach(id => {
    const c = E.centri[id]; if (!c) return;
    if (!elem[id]) { const p = crea('path', { d: '' }, gT, 'terra'); p.dataset.id = id; elem[id] = [p]; }
    const m = crea('circle', { cx: c[0], cy: c[1] }, gMarker, 'marker'); m.dataset.id = id;
    m.style.display = 'none'; elem[id].push(m);
  });
  P.forEach(p => {
    const c = E.centri[p.id]; if (!c) return;
    const t = crea('text', { x: c[0], y: c[1] }, gLabel, 'etichetta');
    t.dataset.id = p.id; t.textContent = p.nome; t.style.display = 'none'; etich[p.id] = t;
  });
  // geografia fisica: le linee più corte vanno sopra le più lunghe, così restano cliccabili
  const ordine = F.slice().sort((a, b) => (b.tipo === 'line' && a.tipo === 'line') ? b.d.length - a.d.length : 0);
  ordine.forEach(f => {
    const els = [], marca = e => { e.dataset.id = f.id; e.style.display = 'none'; els.push(e); return e; };
    if (f.tipo === 'poly') {
      marca(crea('path', { d: f.d }, (f.cat === 'mari' || f.cat === 'stretti') ? gSea : (f.cat === 'penisole' || f.cat === 'isole' || f.cat === 'pianure' || f.cat === 'deserti' || f.cat === 'monti') ? gPen : gPoly, `fis poly cat-${f.cat}`));
      if (f.small) marca(crea('circle', { cx: f.c[0], cy: f.c[1] }, gFMark, 'fmark' + (f.cat === 'laghi' ? ' fmark-lago' : '')));
    } else if (f.tipo === 'line') {
      marca(crea('path', { d: f.d }, gLines, `fis line cat-${f.cat}${f.cat === 'fiumi' && f.liv === 1 ? ' princ' : ''}`));
      marca(crea('path', { d: f.d }, gLines, 'fis hitline'));
      if (f.cat === 'stretti') marca(crea('circle', { cx: f.c[0], cy: f.c[1] }, gFMark, 'fmark'));
    } else {
      const tri = marca(crea('path', { d: 'M0,-9 L8,6 L-8,6 Z' }, gPt, `fis pt cat-${f.cat}`));
      tri.dataset.x = f.c[0]; tri.dataset.y = f.c[1];
      marca(crea('circle', { cx: f.c[0], cy: f.c[1] }, gFMark, 'fmark fmark-vetta'));
    }
    elemF[f.id] = els;
    const t = crea('text', { x: f.c[0], y: f.c[1] }, gLabel, `etichetta cat-${f.cat}`);
    t.dataset.id = f.id; t.textContent = f.nome; t.style.display = 'none'; etich[f.id] = t;
  });
}

function impostaPool(ids, modoMappa) {
  svg.dataset.modo = modoMappa || modoAttivo;
  const set = new Set(ids);
  Object.entries(elem).forEach(([id, [p, m]]) => {
    const att = set.has(id), micro = !!m;
    // Italia: le regioni restano colorate (ma non cliccabili) anche nei giochi sulle città
    const sfondo = !att && per[id] && !per[id].citta && ITA() && svg.dataset.modo === 'stati' ? ' sfondo pol-' + (polDi[id] || 0) : '';
    p.setAttribute('class', 'terra' + (att ? ' attiva pol-' + (polDi[id] || 0) : '') + sfondo + (att && micro ? ' micro' : ''));
    if (m) { m.setAttribute('class', citta(id) ? 'marker citta' + (per[id].capR ? ' capr' : '') : 'marker pol-' + (polDi[id] || 0)); m.style.display = att ? '' : 'none'; }
  });
  Object.entries(elemF).forEach(([id, els]) => els.forEach(e => {
    const att = set.has(id);
    e.classList.remove('evidenzia', 'sel', 'giusto', 'sbagliato', 'manca');
    e.classList.toggle('attivo', att); e.style.display = att ? '' : 'none';
  }));
  Object.values(etich).forEach(t => t.style.display = 'none');
}
function statoClasse(id, cls, on = true) {
  [...(elem[id] || []), ...(elemF[id] || [])].forEach(e => e.classList.toggle(cls, on));
  if (citta(id)) raggioMarker(elem[id][1], Math.max(vb.w / E.W, SZ.mk[1]));
}
// raggio dei segnaposto: più grande per i capoluoghi di regione e per il punto evidenziato (o appena scelto)
const MARCATI = ['evidenzia', 'sel', 'giusto', 'sbagliato', 'manca'];
const raggioMarker = (c, kk) => c.setAttribute('r', SZ.mk[0] * kk * (c.classList.contains('capr') ? 1.3 : 1) * (citta(c.dataset.id) && MARCATI.some(x => c.classList.contains(x)) ? 1.7 : 1));
function pulisciStati() {
  [...Object.values(elem), ...Object.values(elemF)].forEach(l => l.forEach(e => e.classList.remove('evidenzia', 'sel', 'giusto', 'sbagliato', 'manca', 'ue', ...CLS_CONT)));
  if (ITA()) gMarker.querySelectorAll('circle').forEach(c => raggioMarker(c, Math.max(vb.w / E.W, SZ.mk[1])));
}

// zoom e spostamento
function applicaVista() {
  vb.w = Math.min(E.W, Math.max(E.W / SZ.zmax, vb.w)); vb.h = vb.w * E.H / E.W;
  vb.x = Math.min(E.W - vb.w, Math.max(0, vb.x)); vb.y = Math.min(E.H - vb.h, Math.max(0, vb.y));
  svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  const k = vb.w / E.W;
  const kk = Math.max(k, SZ.mk[1]);
  gMarker.querySelectorAll('circle').forEach(c => raggioMarker(c, kk));
  gFMark.querySelectorAll('circle').forEach(c => c.setAttribute('r', (c.classList.contains('fmark-vetta') ? 5 : 10) * kk));
  gPt.querySelectorAll('path').forEach(t => t.setAttribute('transform', `translate(${t.dataset.x} ${t.dataset.y}) scale(${kk})`));
  if (gArmate) gArmate.querySelectorAll('g').forEach(g => g.setAttribute('transform', `translate(${g.dataset.x} ${g.dataset.y}) scale(${Math.max(k, 0.25)})`));
  const fs = 12 * k * (SZ.fs || 1);   // la carta d'Italia è più piccola sullo schermo: nomi più grandi
  if (SZ.etAdatt) return aggiornaEtichetteMondo(k, fs);
  Object.entries(etich).forEach(([id, t]) => {
    t.style.fontSize = fs + 'px'; t.style.strokeWidth = (3 * k) + 'px';
    if (t.dataset.micro) t.style.display = (etichetteOn && k < 0.4 && S && S.pool.includes(t.dataset.id)) ? '' : 'none';
  });
}
// Mondo e Italia: un nome compare se c'è posto per leggerlo e non copre un nome più importante (gli elementi più importanti hanno la precedenza)
function aggiornaEtichetteMondo(k, fs) {
  const candidate = [];
  Object.entries(etich).forEach(([id, t]) => {
    t.style.fontSize = fs + 'px'; t.style.strokeWidth = (fs / 4) + 'px';
    if (!etichetteOn || !S || !S.pool.includes(id)) { t.style.display = 'none'; return; }
    if (citta(id)) { // capoluoghi: il nome sta sopra il punto; prima quelli di regione
      t.setAttribute('y', E.centri[id][1] - SZ.mk[0] * Math.max(k, SZ.mk[1]) * 1.3 - fs * 0.3);
      candidate.push([id, t, per[id].capR ? 0.5 : 1 + per[id].liv, 0, t.textContent.length * 0.56 * fs]); return;
    }
    if (!t.dataset.bw) { const e = (elem[id] || elemF[id])[0], b = e.getBBox(); t.dataset.bw = e.classList.contains('pt') ? 25 : Math.max(b.width, b.height * 1.6); }
    const stato = !!per[id], largo = t.textContent.length * 0.56 * fs;
    if (stato && t.dataset.micro) { if (k >= 0.12) { t.style.display = 'none'; return; } }
    else if (stato && largo > t.dataset.bw * 1.25) { t.style.display = 'none'; return; }
    candidate.push([id, t, stato ? 0 : fis[id].liv, +t.dataset.bw, largo]);
  });
  candidate.sort((a, b) => a[2] - b[2] || b[3] - a[3]);
  const occupato = [], h = fs * 1.15;
  candidate.forEach(([id, t, , , largo]) => {
    const x = +t.getAttribute('x'), y = +t.getAttribute('y'), r = [x - largo / 2, y - h / 2, x + largo / 2, y + h / 2];
    const libero = !occupato.some(o => r[0] < o[2] && r[2] > o[0] && r[1] < o[3] && r[3] > o[1]);
    t.style.display = libero ? '' : 'none';
    if (libero) occupato.push(r);
  });
}
const aSvg = (cx, cy) => { const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
function zoomIn(f, cx, cy) {
  let px, py;
  if (cx === undefined) { px = vb.x + vb.w / 2; py = vb.y + vb.h / 2; } else { const q = aSvg(cx, cy); px = q.x; py = q.y; }
  const nw = Math.min(E.W, Math.max(E.W / SZ.zmax, vb.w * f)), r = nw / vb.w;
  vb.x = px - (px - vb.x) * r; vb.y = py - (py - vb.y) * r; vb.w = nw; applicaVista();
}
function vistaIntera() { vb = { x: 0, y: 0, w: E.W, h: E.H }; applicaVista(); }
function vaiA(id) {
  if (!per[id]) { // elemento fisico: inquadra il suo riquadro con un po' di margine
    const b = elemF[id][0].getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    const w = Math.max(SZ.minW, b.width * 1.6, b.height * 1.6 * E.W / E.H);
    if (w > E.W * 0.75) return vistaIntera();
    vb = { x: cx - w / 2, y: cy - w * E.H / E.W / 2, w, h: w * E.H / E.W }; return applicaVista();
  }
  const c = E.centri[id], b = elem[id][0].getBBox();
  if (ITA()) { // capoluogo: un riquadro intorno al punto; regione: tutta la regione con un po' di margine
    const w = citta(id) ? 330 : Math.min(E.W, Math.max(SZ.minW, b.width * 1.5, b.height * 1.5 * E.W / E.H));
    if (w > E.W * 0.8) return vistaIntera();
    const cx = citta(id) ? c[0] : b.x + b.width / 2, cy = citta(id) ? c[1] : b.y + b.height / 2;
    vb = { x: cx - w / 2, y: cy - w * E.H / E.W / 2, w, h: w * E.H / E.W }; return applicaVista();
  }
  if (SZ.id === 'mondo') { // inquadra lo Stato con un po' di margine; i più grandi si vedono sulla mappa intera
    const lato = Math.max(b.width, b.height * E.W / E.H), w = Math.max(90, lato * 3.4);
    if (!c || w > E.W * 0.55) return vistaIntera();
    const cx = lato < 8 ? c[0] : b.x + b.width / 2, cy = lato < 8 ? c[1] : b.y + b.height / 2;
    vb = { x: cx - w / 2, y: cy - w * E.H / E.W / 2, w, h: w * E.H / E.W }; return applicaVista();
  }
  if (!c || Math.max(b.width, b.height) > 45) return vistaIntera();
  const w = 240; vb = { x: c[0] - w / 2, y: c[1] - w * E.H / E.W / 2, w, h: w * E.H / E.W }; applicaVista();
}
$('zPiu').onclick = () => zoomIn(0.6); $('zMeno').onclick = () => zoomIn(1 / 0.6); $('zReset').onclick = vistaIntera;
// schermo intero: ingrandisce l'intera schermata di gioco (mappa, domanda e risposte); dove il browser non lo consente, riempie la finestra
let fsReale = false;
function schermoIntero(on) {
  const g = $('gioco');
  g.classList.toggle('schermo-intero', on);
  $('zFull').title = on ? 'Esci dallo schermo intero' : 'Schermo intero';
  $('zFull').setAttribute('aria-label', $('zFull').title);
  if (on) { try { if (g.requestFullscreen) g.requestFullscreen().catch(() => {}); } catch {} }
  else { try { if (document.fullscreenElement) document.exitFullscreen(); } catch {} fsReale = false; }
  window.scrollTo(0, 0);
}
$('zFull').onclick = () => schermoIntero(!$('gioco').classList.contains('schermo-intero'));
document.addEventListener('fullscreenchange', () => { if (document.fullscreenElement) fsReale = true; else if (fsReale) schermoIntero(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('gioco').classList.contains('schermo-intero')) schermoIntero(false); });
svg.addEventListener('wheel', e => { e.preventDefault(); zoomIn(e.deltaY < 0 ? 0.85 : 1 / 0.85, e.clientX, e.clientY); }, { passive: false });

const ptr = new Map(); let mosso = false, trascinato = 0, d0 = 0, w0 = 0;
const dist = () => { const [a, b] = [...ptr.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
svg.addEventListener('pointerdown', e => {
  ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptr.size === 1) { mosso = false; trascinato = 0; } else if (ptr.size === 2) { d0 = dist(); w0 = vb.w; mosso = true; }
});
window.addEventListener('pointermove', e => {
  const p = ptr.get(e.pointerId); if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (ptr.size === 1) {
    trascinato += Math.abs(dx) + Math.abs(dy);
    if (trascinato > 16) { mosso = true; const r = svg.getBoundingClientRect(); const s = Math.min(r.width / vb.w, r.height / vb.h); vb.x -= dx / s; vb.y -= dy / s; applicaVista(); }
  } else if (ptr.size === 2 && d0 > 0) {
    const [a, b] = [...ptr.values()], q = aSvg((a.x + b.x) / 2, (a.y + b.y) / 2);
    const nw = Math.min(E.W, Math.max(E.W / SZ.zmax, w0 * d0 / dist())), r = nw / vb.w;
    vb.x = q.x - (q.x - vb.x) * r; vb.y = q.y - (q.y - vb.y) * r; vb.w = nw; applicaVista();
  }
});
['pointerup', 'pointercancel'].forEach(t => window.addEventListener(t, e => ptr.delete(e.pointerId)));

let sulClic = null;
svg.addEventListener('click', e => {
  if (mosso || !sulClic) return;
  const el = e.target.closest('[data-id]'); if (!el || !el.matches('.attiva, .marker, .attivo')) return;
  sulClic(el.dataset.id);
});

// ---------- sessione di gioco ----------
let S = null, etichetteOn = false, timer = null, modoAttivo = 'stati';

function avvia(gioco, soloIds) {
  suonoSerie();
  clearInterval(timer);
  modoAttivo = modo;
  const gi = giocoDi(gioco, modo);
  let poolIds = soloIds
    ? (modo === 'stati' ? pool(3) : poolFis(3, catsSez().map(c => c.id))).map(p => p.id)
    : poolModo(modo, livello, cats).map(p => p.id);
  // Italia: ogni gioco è sulle regioni o sui capoluoghi (nel ripasso degli errori possono esserci entrambi)
  if (ITA() && modo === 'stati' && gi.ent && !soloIds) poolIds = poolIds.filter(id => citta(id) === (gi.ent === 'citta'));
  S = { gioco, base: gi.base || gioco, modo, cats: cats.slice(), liv: livello, pool: poolIds, i: 0, punti: 0, errori: [], t0: Date.now(), blocca: false, tent: 0, serie: 0, serieMax: 0, xp: 0, esiti: [] };
  $('hudNome').textContent = gi.nome;
  $('hudSub').textContent = gioco === 'studio' ? `${SZ.nome} · esplorazione` : `${SZ.nome} · ${LIVELLI[livello - 1].nome}`;
  $('hudPods').hidden = gioco === 'studio' || gioco === 'risiko';
  $('pips').hidden = true; $('progBox').hidden = true; $('stat').textContent = '';
  vistaIntera(); sulClic = null; etichetteOn = false;
  svg.parentElement.classList.remove('interattivo');
  mostra('gioco');
  if (gioco === 'risiko') return avviaRisiko();
  if (gioco === 'legami') return avviaLegami(soloIds);
  if (gioco === 'elementi') return avviaElementi(soloIds);
  impostaPool(poolIds); pulisciStati();
  if (gioco === 'studio') return avviaStudio();
  if (gioco === 'coloraUE') return avviaColoraUE();
  if (gioco === 'coloraCont') return avviaColoraCont();
  let coda = soloIds ? mescola(soloIds) : mescola(poolIds);
  if (gioco === 'continente') coda = coda.filter(id => !per[id].amb);   // gli Stati a cavallo tra due continenti non si chiedono
  if (!soloIds && quantita) coda = coda.slice(0, quantita);
  S.coda = coda;
  timer = setInterval(aggiornaStat, 1000);
  prossima();
}
function aggiornaStat() {
  if (!S) return;
  const s = Math.floor((Date.now() - S.t0) / 1000);
  $('hudTempo').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const pt = Math.round(S.punti * 10) / 10;
  $('hudXp').textContent = '+' + Math.round(S.xp);
  $('podSerie').hidden = $('podPunti').hidden = !S.coda || !!S.verifica; $('podXp').hidden = !!S.verifica;
  if (S.coda) {
    const n = S.coda.length, date = S.esiti.filter(x => x !== undefined).length;
    $('stat').innerHTML = `Domanda <b>${Math.min(S.i + 1, n)}</b> / ${n}`;
    $('hudPunti').innerHTML = `${pt}<span class="su">/${date}</span>`;
    $('hudSerie').textContent = '×' + S.serie; $('podSerie').classList.toggle('spenta', S.serie === 0);
    const pips = $('pips'), corte = n <= 30;
    pips.hidden = !corte; $('progBox').hidden = corte;
    if (corte) {
      if (pips.children.length !== n) { pips.innerHTML = '<i></i>'.repeat(n); pips.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`; }
      [...pips.children].forEach((x, k) => { x.className = S.verifica && S.esiti[k] !== undefined ? 'fatto' : S.esiti[k] === true ? 'ok' : S.esiti[k] === false ? 'ko' : k === S.i ? 'ora' : ''; });
      pips.setAttribute('role', 'img'); pips.setAttribute('aria-label', `${date} risposte date su ${n}` + (S.verifica ? '' : `: ${S.esiti.filter(x => x === true).length} giuste`));
    } else $('barraProg').style.width = `${100 * Math.min(S.i, n) / n}%`;
  } else {
    $('stat').textContent = S.stat ? S.stat() : '';
    $('progBox').hidden = S.gioco !== 'risiko';
  }
}
// esito di una domanda per serie, XP e barra dei progressi; restituisce l'etichetta del bonus serie (o '')
function segna(ok, xp = ok ? XP_RISPOSTA : 0) {
  if (ok) { S.serie++; S.serieMax = Math.max(S.serieMax, S.serie); } else S.serie = 0;
  const bonus = ok && S.serie >= 3 ? XP_SERIE : 0;
  S.xp += xp + bonus;
  if (S.coda) S.esiti[S.i] = ok;
  if (xp + bonus > 0) volaXp(xp + bonus);
  if (ok && S.serie >= 2) { const p = $('podSerie'); p.classList.remove('colpo'); void p.offsetWidth; p.classList.add('colpo'); }
  aggiornaStat();
  return bonus ? `<span class="bonus">SERIE ×${S.serie} · +${bonus} XP</span>` : '';
}
function volaXp(n) {
  const rif = $('hudXp').getBoundingClientRect(), r = rif.width ? rif : $('domanda').getBoundingClientRect();
  const d = document.createElement('div'); d.className = 'xp-volo'; d.textContent = `+${Math.round(n)} XP`;
  d.style.left = (r.left + (rif.width ? 0 : r.width - 90)) + 'px'; d.style.top = (r.top + (rif.width ? r.height : 0)) + 'px';
  document.body.appendChild(d); setTimeout(() => d.remove(), 1200);
}
const titoloEsito = (t, extra = '') => `<span class="esito-t">${t}${extra}</span>`;
// tastiera: 1-9 scelgono una risposta, Invio va avanti (o verifica)
document.addEventListener('keydown', e => {
  if ($('gioco').hidden || !S || e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input, textarea, select')) return;
  if (/^[1-9]$/.test(e.key)) {
    const b = $('pannello').querySelectorAll('.risposte .rispo')[+e.key - 1];
    if (b && !b.disabled) { b.click(); e.preventDefault(); }
  } else if (e.key === 'Enter' && !e.target.closest('button, a')) {
    const b = [...$('pannello').querySelectorAll('.primario')].pop();
    if (b && !b.disabled) { b.click(); e.preventDefault(); }
  }
});

function prossima() {
  if (S.i >= S.coda.length) return finisci();
  S.blocca = false; S.tent = 0; pulisciStati(); aggiornaStat();
  const id = S.coda[S.i], g = S.base;
  $('pannello').innerHTML = '';
  if (g === 'trova') {
    vistaIntera(); svg.parentElement.classList.add('interattivo');
    const cf = fis[id] && cat(fis[id].cat), tipo = cf ? cf.sing : ITA() ? (citta(id) ? 'città' : 'regione') : '';
    $('domanda').innerHTML = `Clicca su: <b>${nome(id)}</b>${tipo ? ` <span class="tipo">(${tipo})</span>` : ''}<small>Hai due tentativi.${cf && cf.id === 'mari' ? ' I mari si cliccano sull\'acqua.' : cf && cf.id === 'stretti' ? ' Gli stretti sono piccoli: puoi ingrandire la mappa.' : citta(id) ? ' Le città sono i punti bianchi: puoi ingrandire la mappa.' : ''}</small>`;
    sulClic = cl => rispondiTrova(id, cl);
    return;
  }
  svg.parentElement.classList.remove('interattivo'); sulClic = null;
  if (g === 'identita') return domandaIdentita(id);
  statoClasse(id, 'evidenzia'); vaiA(id);
  if (g === 'indovina' && fis[id]) {
    const cf = cat(fis[id].cat), a = fis[id].c;
    const dist = x => Math.hypot(a[0] - x.c[0], a[1] - x.c[1]);
    let cand = S.pool.map(x => fis[x]).filter(x => x.id !== id && x.cat === cf.id).sort((x, y) => dist(x) - dist(y)).slice(0, 9);
    // pochi elementi di questa categoria nel livello: si prendono dello stesso tipo dagli altri livelli, poi di altri tipi
    if (cand.length < 3) cand = cand.concat(F.filter(x => x.id !== id && x.cat === cf.id && !cand.includes(x)).sort((x, y) => dist(x) - dist(y)).slice(0, 3 - cand.length));
    if (cand.length < 3) cand = cand.concat(mescola(S.pool.map(x => fis[x]).filter(x => x.id !== id && x.cat !== cf.id)).slice(0, 3 - cand.length));
    const opz = mescola([fis[id], ...mescola(cand).slice(0, 3)]);
    $('domanda').textContent = cf.q;
    scegli(opz.map(o => ({ testo: o.nome, ok: o.id === id })), ok => esito(id, ok, infoElemento(fis[id]), id));
  } else if (g === 'indovina' || g === 'capitali') {
    // risposte sbagliate plausibili: i vicini dello stesso tipo (in Italia: regioni con regioni, città con città)
    const simili = P.filter(p => p.id !== id && citta(p.id) === citta(id) && E.centri[p.id]), nelPool = simili.filter(p => S.pool.includes(p.id));
    const vicini = (nelPool.length >= 3 ? nelPool : simili).map(p => {
      const a = E.centri[id], b = E.centri[p.id]; return { p, d: Math.hypot(a[0] - b[0], a[1] - b[1]) };
    }).sort((x, y) => x.d - y.d).slice(0, 9).map(o => o.p);
    const altri = mescola(vicini).slice(0, 3), opz = mescola([per[id], ...altri]);
    const chiave = g === 'indovina' ? 'nome' : 'cap';
    $('domanda').innerHTML = g === 'indovina' ? (ITA() ? (citta(id) ? 'Quale città è evidenziata?' : 'Quale regione è evidenziata?') : 'Quale Stato è evidenziato?')
      : ITA() ? `<b>${nome(id)}</b>: qual è il capoluogo di regione?` : `<b>${nome(id)}</b>: qual è la capitale?`;
    scegli(opz.map(o => ({ testo: o[chiave], ok: o.id === id })), ok => esito(id, ok, infoPaese(per[id]), g === 'capitali' ? id + '|cap' : id));
  } else if (g === 'regioneDi') {
    const p = per[id], a = E.centri[id];
    const vicine = P.filter(r => !r.citta && r.id !== p.reg).map(r => ({ r, d: Math.hypot(E.centri[r.id][0] - a[0], E.centri[r.id][1] - a[1]) }))
      .sort((x, y) => x.d - y.d).slice(0, 5).map(o => o.r);
    $('domanda').innerHTML = `<b>${p.nome}</b>: in quale regione si trova?`;
    scegli(mescola([per[p.reg], ...mescola(vicine).slice(0, 3)]).map(o => ({ testo: o.nome, ok: o.id === p.reg })), ok => esito(id, ok, infoPaese(p), id + '|reg'));
  } else if (g === 'continente') {
    const p = per[id];
    $('domanda').innerHTML = `<b>${p.nome}</b>: in quale continente si trova?`;
    $('pannello').innerHTML = '';
    scegli(SZ.aree.map(c => ({ testo: c, ok: c === p.cont })), ok => esito(id, ok, infoPaese(p) + (p.nota ? ` ${p.nota}` : ''), id + '|cont'));
  } else if (g === 'ue') {
    const p = per[id];
    $('domanda').innerHTML = `<b>${p.nome}</b> fa parte dell'Unione europea?`;
    scegli([{ testo: 'Sì, è nell\'UE', ok: p.ue }, { testo: 'No, è fuori dall\'UE', ok: !p.ue }], ok => esito(id, ok, infoPaese(p), id + '|ue'));
  }
}
function scegli(opzioni, fine) {
  const box = document.createElement('div'); box.className = 'risposte' + (opzioni.length > 4 ? ' molte' : '');
  opzioni.forEach(o => {
    const b = document.createElement('button'); b.className = 'rispo'; b.textContent = o.testo;
    b.onclick = () => {
      if (S.blocca) return; S.blocca = true;
      box.querySelectorAll('button').forEach((x, k) => { x.disabled = true; if (opzioni[k].ok) x.classList.add('giusto'); });
      if (!o.ok) b.classList.add('sbagliato');
      fine(o.ok);
    };
    box.appendChild(b);
  });
  $('pannello').appendChild(box);
}
function infoPaese(p) {
  if (ITA()) return p.citta ? `<b>${p.nome}</b> · ${ruoloCitta(p)}.` : `<b>${p.nome}</b> · capoluogo ${p.cap} · ${p.area}.`;
  if (SZ.id === 'mondo') return `<b>${p.nome}</b> · capitale ${p.cap} · ${p.cont}.`;
  return `<b>${p.nome}</b> · capitale ${p.cap} · ${p.ue ? 'membro dell\'UE' : 'non fa parte dell\'UE'}.`;
}
function infoElemento(p) {
  return `<b>${p.nome}</b> (${cat(p.cat).sing}).${p.info ? ' ' + p.info : ''}${p.chicca ? `<br><b>Lo sapevi?</b> ${p.chicca}` : ''}`;
}
function avanti() {
  const tok = S;
  const b = document.createElement('button'); b.className = 'primario'; b.innerHTML = 'Avanti <span class="tasto">INVIO</span>';
  b.onclick = () => { if (S === tok) { S.i++; prossima(); } };
  $('pannello').appendChild(b);
}
// mostra il risultato di una domanda: id = Stato/elemento evidenziato (o null), chiave = voce per le statistiche
function esito(id, ok, html, chiave) {
  if (id) { pulisciStati(); statoClasse(id, ok ? 'giusto' : 'sbagliato'); }
  if (ok) S.punti++; else S.errori.push(chiave || id);
  registra(chiave || id, ok); suono(ok ? 'ok' : 'ko');
  const bonus = segna(ok);
  const m = document.createElement('div'); m.className = 'msg ' + (ok ? 'ok' : 'ko');
  m.innerHTML = titoloEsito(ok ? 'Giusto!' : 'Non proprio.', bonus) + html;
  $('pannello').appendChild(m);
  if (ok) { const tok = S; setTimeout(() => { if (S === tok) { S.i++; prossima(); } }, 1400); } else avanti();
  aggiornaStat();
}
function rispondiTrova(id, cl) {
  if (S.blocca) return;
  const info = () => (per[id] ? infoPaese(per[id]) : infoElemento(fis[id]));
  if (cl === id) {
    S.blocca = true;
    if (S.tent === 0) S.punti++; else if (!S.errori.includes(id)) S.errori.push(id);
    registra(id, S.tent === 0); suono(S.tent === 0 ? 'ok' : 'trovato');
    const bonus = segna(S.tent === 0);
    statoClasse(id, 'giusto'); showMsg(titoloEsito(S.tent === 0 ? 'Giusto!' : 'Trovato.', bonus) + info(), 'ok');
    const tok = S; setTimeout(() => { if (S === tok) { S.i++; prossima(); } }, 1500);
  } else {
    S.tent++; suono(S.tent >= 2 ? 'ko' : 'ritenta'); statoClasse(cl, 'sbagliato'); setTimeout(() => statoClasse(cl, 'sbagliato', false), 700);
    if (S.tent >= 2) {
      S.blocca = true; S.errori.push(id); registra(id, false); statoClasse(id, 'manca'); segna(false);
      showMsg(titoloEsito(`Era ${nome(id)}`) + `Lo vedi evidenziato in arancione. ${per[id] ? '' : (fis[id].info || '')}`, 'ko');
      avanti();
    } else showMsg(`Quello è ${nome(cl)}. Riprova!`);
  }
  aggiornaStat();
}
function showMsg(html, cls) { $('pannello').innerHTML = `<div class="msg ${cls || ''}">${html}</div>`; }

// ---------- carta d'identità ----------
const ruoloCitta = p => `${p.id === 'c_rm' ? 'capitale d\'Italia e capoluogo di regione' : p.capR ? 'capoluogo di regione' : 'capoluogo di provincia'} · ${per[p.reg].nome}`;
function cartaStato(p) {
  if (ITA() && p.citta) {
    const r = per[p.reg];
    return `<div class="carta">
    <div class="carta-testa"><h3>${p.nome}</h3><span class="badge ${p.capR ? 'si' : 'no'}">${p.id === 'c_rm' ? 'Capitale d\'Italia' : p.capR ? 'Capoluogo di regione' : 'Capoluogo di provincia'}</span></div>
    <dl class="carta-griglia"><div><dt>Regione</dt><dd>${r.nome}</dd></div><div><dt>Area</dt><dd>${r.area}</dd></div>${p.capR ? '' : `<div><dt>Capoluogo della regione</dt><dd>${r.cap}</dd></div>`}</dl>
    ${p.chicca ? `<p class="chicca">${p.chicca}</p>` : ''}
  </div>`;
  }
  if (ITA()) {
    const righe = [['Capoluogo', p.cap], ['Area', p.area], ['Posizione', p.pos], ['Confina con', p.conf.length ? p.conf.join(', ') : 'Nessuna regione (isola)'],
      ['Bagnata da', p.mari || 'Nessun mare'], ['Superficie', fmtSup(p.sup)], ['Abitanti', fmtAb(p.ab)],
      [p.prov.length === 1 ? 'Capoluogo di provincia' : `Capoluoghi di provincia (${p.prov.length})`, p.prov.join(', ')]];
    return `<div class="carta">
    <div class="carta-testa"><h3>${p.nome}</h3><span class="badge ${p.speciale ? 'si' : 'no'}">${p.speciale ? 'Regione a statuto speciale' : 'Regione a statuto ordinario'}</span></div>
    <dl class="carta-griglia">${righe.map(([l, v]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <p class="chicca">${p.chicca}</p>
  </div>`;
  }
  if (SZ.id === 'mondo') {
    const r = [['🏛️', 'Capitale', p.cap], ['🌍', 'Continente', p.cont], ['📍', 'Posizione', p.pos], ['🧭', 'Confina con', p.conf.length ? p.conf.join(', ') : 'Nessuno Stato (isola)'],
      ['📐', 'Superficie', fmtSup(p.sup)], ['👥', 'Abitanti', fmtAb(p.ab)], ['💶', 'Moneta', p.mon], ['🗣️', 'Lingua', p.lin], ['⚖️', 'Governo', p.gov]];
    return `<div class="carta">
    <div class="carta-testa"><h3>${p.nome}</h3><span class="badge no">${p.cont}</span></div>
    <dl class="carta-griglia">${r.map(([, l, v]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>
    ${p.nota ? `<p class="nota-carta">${p.nota}</p>` : ''}
    <p class="chicca">${p.chicca}</p>
  </div>`;
  }
  const righe = [
    ['🏛️', 'Capitale', p.cap], ['📍', 'Posizione', p.pos], ['🧭', 'Confina con', p.conf.length ? p.conf.join(', ') : 'Nessuno Stato (isola)'],
    ['📐', 'Superficie', fmtSup(p.sup)], ['👥', 'Abitanti', fmtAb(p.ab)], ['💶', 'Moneta', p.mon],
    ['🗣️', 'Lingua', p.lin], ['⚖️', 'Governo', p.gov], ['🛂', 'Schengen', p.sch ? 'Sì' : 'No'],
  ];
  return `<div class="carta">
    <div class="carta-testa"><h3>${p.nome}</h3><span class="badge ${p.ue ? 'si' : 'no'}">${p.ue ? 'Membro UE · ' : ''}${p.ueTxt}</span></div>
    <dl class="carta-griglia">${righe.map(([, l, v]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>
    ${p.nota ? `<p class="nota-carta">${p.nota}</p>` : ''}
    <p class="chicca">${p.chicca}</p>
  </div>`;
}
function schedaElemento(p) {
  const stati = (p.s || []).map(nomeStato).join(', ');
  return `<div class="carta"><div class="carta-testa"><h3>${p.nome}</h3><span class="badge no">${cat(p.cat).sing}</span></div>
    ${p.info ? `<p>${p.info}</p>` : ''}
    ${stati ? `<p class="stati-lista"><b>${ITA() ? 'Regioni' : 'Stati collegati'}:</b> ${stati}</p>` : ''}
    ${p.chicca ? `<p class="chicca">${p.chicca}</p>` : ''}</div>`;
}

// domande sulla carta d'identità degli Stati
function domandaIdentita(id) {
  const p = per[id], altri = P.filter(x => S.pool.includes(x.id) && x.id !== id);
  const tipi = (ITA() ? ['area', 'abitanti', 'superficie'] : ['moneta', 'lingua', 'area', 'abitanti', 'superficie']).filter(x => !(x === 'area' && p.amb));
  const t = tipi[Math.random() * tipi.length | 0];
  const distinti = (valore, lista, n = 3) => mescola([...new Set(lista.filter(v => v !== valore))]).slice(0, n);
  if (t === 'moneta' || t === 'lingua') {
    const val = t === 'moneta' ? monetaBase(p) : p.lin;
    const tutti = P.map(x => (t === 'moneta' ? monetaBase(x) : x.lin));
    // per le lingue si scartano le risposte che contengono la stessa lingua (es. «Inglese» e «Inglese e francese»)
    const lingue = v => v.toLowerCase().split(/,| e /).map(x => x.trim());
    const diverse = t === 'moneta' ? tutti : tutti.filter(v => !lingue(v).some(l => lingue(val).includes(l)));
    const opz = mescola([val, ...distinti(val, diverse)]);
    statoClasse(id, 'evidenzia'); vaiA(id);
    $('domanda').innerHTML = t === 'moneta' ? `<b>${p.nome}</b>: qual è la moneta?` : `<b>${p.nome}</b>: qual è la lingua ufficiale?`;
    scegli(opz.map(o => ({ testo: o, ok: o === val })), ok => esito(id, ok, `<b>${p.nome}</b>: ${t === 'moneta' ? 'moneta' : 'lingua'} ${val.toLowerCase()}.`, id + '|' + t));
  } else if (t === 'area') {
    const opz = mescola([p.area, ...mescola(SZ.aree.filter(a => a !== p.area)).slice(0, 3)]);
    statoClasse(id, 'evidenzia'); vaiA(id);
    $('domanda').innerHTML = SZ.areaDom(p.nome);
    scegli(opz.map(o => ({ testo: o, ok: o === p.area })), ok => esito(id, ok, `<b>${p.nome}</b> si trova in: ${ITA() ? p.area : p.area.toLowerCase()}. ${p.pos}.`, id + '|area'));
  } else { // confronto numerico
    const campo = t === 'abitanti' ? 'ab' : 'sup';
    const gruppo = [p];
    for (const c of mescola(altri)) { if (gruppo.length >= 4) break; if (gruppo.every(g => Math.max(g[campo], c[campo]) / Math.min(g[campo], c[campo]) >= 1.25)) gruppo.push(c); }
    if (gruppo.length < 3) return domandaIdentita(id); // pool troppo piccolo/omogeneo: riprova con un altro tipo
    const vinc = gruppo.reduce((a, b) => (b[campo] > a[campo] ? b : a));
    const chi = ITA() ? 'queste regioni' : 'questi Stati';
    $('domanda').textContent = t === 'abitanti' ? `Quale di ${chi} ha più abitanti?` : `Quale di ${chi} ha la superficie più estesa?`;
    const elenco = gruppo.slice().sort((a, b) => b[campo] - a[campo]).map(g => `${g.nome}: ${t === 'abitanti' ? fmtAb(g.ab) : fmtSup(g.sup)}`).join(' · ');
    scegli(mescola(gruppo).map(g => ({ testo: g.nome, ok: g === vinc })), ok => esito(null, ok, elenco, id + '|' + t));
  }
}

// ---------- studio ----------
function avviaStudio() {
  const fisico = S.modo === 'fisico';
  $('stat').textContent = ''; $('barraProg').style.width = '0%';
  const cosa = fisico ? 'un elemento' : ITA() ? 'una regione o un capoluogo' : 'uno Stato', perArea = !fisico && SZ.id !== 'europa';
  $('domanda').innerHTML = `Esplora la mappa<small>Tocca ${cosa}. Trascina per spostarti, usa + e − (o pizzica) per ingrandire.</small>`;
  svg.parentElement.classList.add('interattivo');
  $('pannello').innerHTML = `<div class="opzioni"><label><input type="checkbox" id="optNomi" checked> Mostra i nomi</label>
    ${fisico ? '' : perArea ? `<label><input type="checkbox" id="optCont" ${ITA() ? '' : 'checked'}> ${ITA() ? 'Colora per area (Nord, Centro, Sud e Isole)' : 'Colora per continente'}</label>` : '<label><input type="checkbox" id="optUE" checked> Colora gli Stati dell\'UE</label>'}</div>
    ${perArea ? '<div class="legenda" id="legenda"></div>' : ''}
    <div id="scheda"><div class="carta vuota">Tocca ${cosa} per aprire la sua scheda.</div></div>`;
  const nomi = () => { etichetteOn = $('optNomi').checked;
    if (SZ.etAdatt) { Object.entries(etich).forEach(([id, t]) => { t.dataset.micro = MICRO.includes(id) ? '1' : ''; }); return applicaVista(); }
    Object.entries(etich).forEach(([id, t]) => { const micro = MICRO.includes(id); t.dataset.micro = micro ? '1' : '';
      t.style.display = etichetteOn && S.pool.includes(id) && !micro ? '' : 'none'; }); applicaVista(); };
  $('optNomi').onchange = nomi; nomi();
  if (perArea) {
    const col = () => {
      const on = $('optCont').checked;
      S.pool.filter(id => !citta(id)).forEach(id => SZ.aree.forEach((c, i) => statoClasse(id, 'cont-' + i, on && per[id].cont === c)));
      $('legenda').innerHTML = on ? SZ.aree.map((c, i) => `<span><i class="cont-${i}"></i>${c}</span>`).join('') : '';
    };
    $('optCont').onchange = col; col();
  } else if (!fisico) {
    const ue = () => S.pool.forEach(id => statoClasse(id, 'ue', $('optUE').checked && per[id].ue));
    $('optUE').onchange = ue; ue();
  }
  sulClic = id => {
    suono('cat', fisico ? fis[id].cat : 'stato');
    S.pool.forEach(x => statoClasse(x, 'evidenzia', x === id));
    $('scheda').innerHTML = fisico ? schedaElemento(fis[id]) : cartaStato(per[id]);
    const n = mp.get('schede', 0) + 1; mp.set('schede', n);
    if (n >= 30 && !medOttenute().esploratore) { sblocca('esploratore'); suono('fine', 100); avviso(`${icona('libro')}<span><b>Nuova medaglia: Esploratore</b><small>Hai aperto 30 schede in Studio.</small></span>`); }
  };
}

// ---------- componi l'UE / componi il continente ----------
// membri: Stati da selezionare; tolleranti: Stati ambigui che non danno né punti né penalità; chiave: voce per le statistiche
function giocoSelezione({ membri, tollerati, titolo, sotto, chiave, dimenticati: cosaManca }) {
  const sel = new Set();
  S.stat = () => `Selezionati ${sel.size}`;
  S.coda = null; S.t0 = Date.now(); timer = setInterval(aggiornaStat, 1000); aggiornaStat();
  $('domanda').innerHTML = `${titolo}<small>${sotto}</small>`;
  svg.parentElement.classList.add('interattivo');
  $('pannello').innerHTML = '<button class="primario" id="verifica">Verifica</button>';
  sulClic = id => { if (S.blocca) return; sel.has(id) ? sel.delete(id) : sel.add(id); statoClasse(id, 'sel', sel.has(id)); aggiornaStat(); };
  $('verifica').onclick = () => {
    S.blocca = true; clearInterval(timer);
    let giusti = 0, sbagliati = 0, dimenticati = 0; S.errori = [];
    S.pool.forEach(id => {
      const e = membri.has(id), s = sel.has(id); statoClasse(id, 'sel', false);
      if (tollerati.has(id)) { if (s) statoClasse(id, 'giusto'); return; }
      if (e && s) { giusti++; statoClasse(id, 'giusto'); registra(id + chiave, true); }
      else if (!e && s) { sbagliati++; S.errori.push(id + chiave); statoClasse(id, 'sbagliato'); registra(id + chiave, false); }
      else if (e && !s) { dimenticati++; S.errori.push(id + chiave); statoClasse(id, 'manca'); registra(id + chiave, false); }
    });
    S.punti = Math.max(0, giusti - sbagliati); S.totale = membri.size; suono(!sbagliati && !dimenticati ? 'ok' : 'ko');
    S.xp += S.punti * XP_RISPOSTA / 2; if (S.punti) volaXp(S.punti * XP_RISPOSTA / 2); aggiornaStat();
    $('pannello').innerHTML = `<div class="msg ${!sbagliati && !dimenticati ? 'ok' : ''}">${titoloEsito(!sbagliati && !dimenticati ? 'Perfetto!' : `${giusti} ${ITA() ? 'giuste' : 'giusti'} su ${membri.size}`)}Verde: ${ITA() ? 'giuste' : 'giusti'} (${giusti}) · Rosso: ${ITA() ? 'scelte' : 'scelti'} per errore (${sbagliati}) · Arancione: ${cosaManca} che avevi dimenticato (${dimenticati}).${tollerati.size ? ' Gli Stati a cavallo tra due continenti non cambiano il punteggio.' : ''}</div>
      <button class="primario" id="vaiFine">Vedi il risultato <span class="tasto">INVIO</span></button>`;
    $('vaiFine').onclick = finisci;
  };
}
function avviaColoraUE() {
  const eu = S.pool.filter(id => per[id].ue);
  giocoSelezione({ membri: new Set(eu), tollerati: new Set(), titolo: 'Seleziona tutti gli Stati dell\'Unione europea',
    sotto: `In questo livello ce ne sono ${eu.length}. Tocca di nuovo per togliere la selezione, poi premi Verifica.`, chiave: '|ue', dimenticati: 'Stati dell\'UE' });
}
function avviaColoraCont() {
  const certi = c => S.pool.filter(id => per[id].cont === c && !per[id].amb);
  const possibili = SZ.aree.filter(c => certi(c).length >= 4);
  const cont = possibili[Math.random() * possibili.length | 0], membri = certi(cont);
  S.cont = cont;
  giocoSelezione({ membri: new Set(membri), tollerati: new Set(S.pool.filter(id => per[id].amb && per[id].alt.includes(cont))),
    titolo: ITA() ? `Seleziona tutte le regioni di quest'area: <b>${cont}</b>` : `Seleziona tutti gli Stati di questo continente: <b>${cont}</b>`,
    sotto: `${ITA() ? 'In tutto sono' : 'In questo livello ce ne sono'} ${membri.length}. Tocca di nuovo per togliere la selezione, poi premi Verifica.`, chiave: '|cont',
    dimenticati: ITA() ? 'regioni dell\'area' : 'Stati del continente' });
}


// ---------- Costruisci il tuo Stato (Risiko didattico) ----------
// Idea: per essere uno Stato servono territorio, popolo e governo (+ riconoscimento).
// Conquistare è solo un pezzo: se prendi più territorio di quanto riesci a governare, si stacca.
const RK = {
  turni: 15, pa: 3,
  popolo: [
    ['cittadinanza', 'Cittadinanza', 'Si decide chi fa parte del popolo: diritti e doveri uguali per tutti.'],
    ['lingua', 'Lingua e scuola comune', 'Una lingua ufficiale e scuole per tutti permettono di capirsi e sentirsi comunità.'],
    ['simboli', 'Storia e simboli', 'Bandiera, inno e feste nazionali: ci si riconosce in una storia condivisa.'],
    ['anagrafe', 'Censimento e anagrafe', 'Sapere chi vive stabilmente sul territorio: lo Stato ha una popolazione permanente.'],
  ],
  governo: [
    ['costituzione', 'Costituzione', 'Le regole fondamentali: chi decide e quali sono i diritti.'],
    ['parlamento', 'Parlamento e leggi', 'Chi fa le leggi valide su tutto il territorio. Serve la Costituzione.'],
    ['tribunali', 'Tribunali', 'Chi giudica le controversie e fa rispettare le leggi. Serve la Costituzione.'],
    ['esercito', 'Esercito e polizia', 'Solo lo Stato può usare la forza legittima. Ogni turno +2 armate in più nella capitale.'],
    ['tasse', 'Tasse e moneta', 'Con le tasse lo Stato finanzia i servizi. Ogni turno hai 1 punto azione in più.'],
  ],
  req: { parlamento: 'costituzione', tribunali: 'costituzione' },
};
function avviaRisiko() {
  const lista = pool(Math.max(2, livello)).filter(p => !MICRO.includes(p.id));
  const ids = new Set(lista.map(p => p.id)), idPerNome = Object.fromEntries(P.map(p => [p.nome, p.id]));
  const adj = {}; lista.forEach(p => { adj[p.id] = p.conf.map(n => idPerNome[n]).filter(x => x && ids.has(x)); });
  lista.forEach(p => adj[p.id].forEach(q => { if (!adj[q].includes(p.id)) adj[q].push(p.id); }));
  const giocabili = lista.filter(p => adj[p.id].length).map(p => p.id);   // fuori le isole senza confini di terra
  const arm = {};
  giocabili.forEach(id => { const p = per[id]; arm[id] = Math.min(5, 2 + (p.ab > 2e7 ? 2 : p.ab > 8e6 ? 1 : 0) + (p.sup > 3e5 ? 1 : 0)); });
  impostaPool(giocabili); pulisciStati();
  Object.keys(etich).forEach(id => { etich[id].style.display = giocabili.includes(id) ? '' : 'none'; });
  if (gArmate) gArmate.remove();
  gArmate = crea('g', {}, svg); gArmate.setAttribute('pointer-events', 'none');
  const badge = {};
  giocabili.forEach(id => {
    const c = E.centri[id]; const g = crea('g', {}, gArmate, 'armate'); g.dataset.x = c[0]; g.dataset.y = c[1];
    crea('circle', { cx: 0, cy: -15, r: 9 }, g, 'armate-c'); const t = crea('text', { x: 0, y: -11.5 }, g, 'armate-t'); badge[id] = t;
  });
  const R = { giocabili, adj, arm, mio: new Set(), cap: null, sel: null, t: 1, pa: RK.pa, fatto: new Set(), confini: false, msg: '', log: [], fine: false };
  S.stat = () => R.cap ? `Turno ${R.t}/${RK.turni} · Punti azione ${R.pa}` : 'Scegli da dove partire';
  S.coda = null; S.blocca = false; svg.parentElement.classList.add('interattivo'); sulClic = null;
  const nome_ = id => per[id].nome;
  const compMax = () => {   // numero di territori collegati tra loro (il blocco più grande)
    const vis = new Set(); let max = 0;
    R.mio.forEach(s => { if (vis.has(s)) return; let n = 0; const st = [s]; vis.add(s);
      while (st.length) { const x = st.pop(); n++; adj[x].forEach(y => { if (R.mio.has(y) && !vis.has(y)) { vis.add(y); st.push(y); } }); }
      max = Math.max(max, n); });
    return max;
  };
  const nPop = () => RK.popolo.filter(x => R.fatto.has(x[0])).length, nGov = () => RK.governo.filter(x => R.fatto.has(x[0])).length;
  const governabili = () => 2 + nPop() + nGov();
  const disegna = () => {
    giocabili.forEach(id => {
      statoClasse(id, 'mio', R.mio.has(id)); statoClasse(id, 'capitale', id === R.cap); statoClasse(id, 'scelto', id === R.sel);
      statoClasse(id, 'bersaglio', !!R.sel && !R.mio.has(id) && adj[R.sel].includes(id));
      badge[id].textContent = arm[id];
      badge[id].parentNode.classList.toggle('mia', R.mio.has(id));
    });
    aggiornaStat(); $('barraProg').style.width = `${100 * (R.t - 1) / RK.turni}%`;
    if (!R.cap) return;
    const barra = (ico, tit, n, tot, sub) => `<div class="pilastro ${n >= tot ? 'ok' : ''}"><b>${ico} ${tit}</b><div class="pil-b"><i style="width:${100 * n / tot}%"></i></div><small>${sub}</small></div>`;
    const terr = compMax();
    const instab = R.mio.size > governabili();
    const btn = (key, tit, desc) => {
      const fatto = R.fatto.has(key), manca = RK.req[key] && !R.fatto.has(RK.req[key]);
      return `<button class="az ${fatto ? 'fatto' : ''}" data-k="${key}" ${fatto || manca || R.pa < 1 ? 'disabled' : ''}><b>${fatto ? '✅' : '▫️'} ${tit}</b><small>${manca ? 'Prima serve: ' + RK.governo.find(x => x[0] === RK.req[key])[1] : desc}</small></button>`;
    };
    const pronto = R.confini && nPop() === RK.popolo.length && nGov() === RK.governo.length;
    $('pannello').innerHTML = `
      <div class="pilastri">
        ${barra('🗺️', 'Territorio', Math.min(terr, 5), 5, R.confini ? 'Confini fissati ✅' : `${terr}/5 territori collegati`)}
        ${barra('👥', 'Popolo', nPop(), RK.popolo.length, `${nPop()}/${RK.popolo.length} elementi`)}
        ${barra('🏛️', 'Governo', nGov(), RK.governo.length, `${nGov()}/${RK.governo.length} istituzioni`)}
      </div>
      <p class="rk-stab ${instab ? 'ko' : ''}">Territori posseduti: <b>${R.mio.size}</b> · Quanti riesci a governare: <b>${governabili()}</b> ${instab ? '⚠️ Troppi! A fine turno uno si stacca.' : ''}</p>
      <div class="msg ${R.msg.cls || ''}">${R.msg.t || ''}</div>
      <p class="rk-tit">⚔️ Mappa: tocca un tuo territorio (blu) e poi uno confinante (arancione) per attaccare. Ogni clic è un lancio di dadi.</p>
      <div class="azioni-riga">
        <button class="secondario" id="rkRinforza" ${R.sel && R.pa >= 1 ? '' : 'disabled'}>➕ Rinforza (+3 armate, 1 PA)</button>
        <button class="secondario" id="rkConfini" ${terr >= 5 && !R.confini && R.pa >= 1 ? '' : 'disabled'}>📍 Fissa i confini (1 PA)</button>
      </div>
      <p class="rk-tit">👥 Popolo</p><div class="az-griglia">${RK.popolo.map(x => btn(...x)).join('')}</div>
      <p class="rk-tit">🏛️ Governo</p><div class="az-griglia">${RK.governo.map(x => btn(...x)).join('')}</div>
      <div class="azioni-riga">
        <button class="primario" id="rkRico" ${pronto && R.pa >= 1 ? '' : 'disabled'}>🌍 Chiedi il riconoscimento (1 PA)</button>
        <button class="secondario" id="rkFine">Fine turno →</button>
      </div>`;
    $('pannello').querySelectorAll('.az').forEach(b => b.onclick = () => { R.pa--; R.fatto.add(b.dataset.k); const x = [...RK.popolo, ...RK.governo].find(y => y[0] === b.dataset.k); msg(`<b>${x[1]}.</b> ${x[2]}`, 'ok'); });
    $('rkRinforza').onclick = () => { R.pa--; arm[R.sel] += 3; msg(`+3 armate in ${nome_(R.sel)}.`); };
    $('rkConfini').onclick = () => { R.pa--; R.confini = true; msg('<b>Confini fissati.</b> Un territorio ha confini definiti: dentro vale il tuo governo, fuori quello degli altri.', 'ok'); };
    $('rkRico').onclick = () => { R.pa--; vittoria(); };
    $('rkFine').onclick = fineTurno;
  };
  const msg = (t, cls) => { R.msg = { t, cls }; disegna(); };
  const dado = () => 1 + (Math.random() * 6 | 0);
  const attacca = (da, a) => {
    const na = Math.min(3, arm[da] - 1), nd = Math.min(2, arm[a]);
    const A = Array.from({ length: na }, dado).sort((x, y) => y - x), D = Array.from({ length: nd }, dado).sort((x, y) => y - x);
    let pa = 0, pd = 0; for (let i = 0; i < Math.min(na, nd); i++) { if (A[i] > D[i]) pd++; else pa++; }
    arm[da] -= pa; arm[a] -= pd;
    let t = `🎲 ${nome_(da)} ${A.join(' ')} contro ${nome_(a)} ${D.join(' ')}: `;
    if (arm[a] <= 0) {
      const mv = Math.max(na, Math.min(3, arm[da] - 1)); arm[da] -= mv; arm[a] = mv; R.mio.add(a);
      t += `<b>conquistato ${nome_(a)}!</b> ${R.mio.size > governabili() ? 'Attenzione: ora hai più territori di quelli che riesci a governare.' : ''}`;
      return msg(t, 'ok');
    }
    msg(t + `perdi ${pa}, loro perdono ${pd}.`);
  };
  sulClic = id => {
    if (R.fine) return;
    if (!R.cap) {
      R.cap = id; R.mio.add(id); arm[id] = 4; R.sel = id;
      $('domanda').innerHTML = `Costruisci il tuo Stato<small>Tre pilastri: <b>territorio</b>, <b>popolo</b>, <b>governo</b>. Poi gli altri Stati devono riconoscerti. Hai ${RK.turni} turni.</small>`;
      return msg(`Sei partito da <b>${nome_(id)}</b>: è la tua capitale e non si staccherà mai. Per cominciare puoi attaccare un vicino, ma ricorda che conquistare non basta per essere uno Stato.`);
    }
    if (R.mio.has(id)) { R.sel = id; return msg(`Selezionato: ${nome_(id)} (${arm[id]} armate).`); }
    if (!R.sel) return msg('Prima tocca un tuo territorio blu.', 'ko');
    if (!adj[R.sel].includes(id)) return msg(`${nome_(id)} non confina con ${nome_(R.sel)}: si attacca solo dai confini.`, 'ko');
    if (arm[R.sel] < 2) return msg('Servono almeno 2 armate per attaccare: rinforza!', 'ko');
    attacca(R.sel, id);
  };
  const fineTurno = () => {
    let t = '';
    arm[R.cap] += 1 + (R.fatto.has('esercito') ? 2 : 0);
    if (R.mio.size > governabili()) {
      const c = [...R.mio].filter(x => x !== R.cap).sort((a, b) => arm[a] - arm[b])[0];
      if (c) { R.mio.delete(c); arm[c] = 2; if (R.sel === c) R.sel = R.cap; t = `<b>${nome_(c)} si è staccato!</b> Avevi più territorio di quanto riuscissi a governare: senza popolo che si riconosce in te e senza istituzioni, la forza non basta a tenerlo.`; }
    }
    if (R.confini && compMax() < 5) { R.confini = false; t += ' I confini non sono più validi: il territorio è cambiato.'; }
    R.t++;
    if (R.t > RK.turni) return sconfitta();
    R.pa = RK.pa + (R.fatto.has('tasse') ? 1 : 0);
    msg(t || `Turno ${R.t}.`, t ? 'ko' : '');
  };
  const fineSchermata = (vinto, titolo, corpo) => {
    R.fine = true; clearInterval(timer);
    const rec = mp.get('rec_risiko', null), turni = R.t;
    if (vinto && (rec === null || turni < rec)) mp.set('rec_risiko', turni);
    $('fine').innerHTML = `<div class="card-fine"><h1>${vinto ? '🏆' : '🌫️'} ${titolo}</h1>${corpo}
      <div class="lista"><b>Che cos'è uno Stato?</b><ul>
        <li>🗺️ <b>Territorio</b> con confini definiti</li><li>👥 <b>Popolo</b>: una popolazione stabile che si riconosce in una comunità</li>
        <li>🏛️ <b>Governo</b> sovrano, con leggi, tribunali e forza legittima</li><li>🌍 <b>Riconoscimento</b>: la capacità di avere relazioni con gli altri Stati</li></ul>
        <small>Sono i criteri della Convenzione di Montevideo (1933), usati ancora oggi nel diritto internazionale.</small></div>
      <div class="azioni"><button class="primario" id="ancora">Rigioca</button><button class="secondario" id="menu">Menu</button></div></div>`;
    mostra('fine'); $('ancora').onclick = () => avvia('risiko'); $('menu').onclick = esciMenu;
  };
  const vittoria = () => fineSchermata(true, 'Sei uno Stato!', `<p>In <b>${R.t}</b> turni hai riunito territorio (${R.mio.size} territori), popolo e governo, e ti hanno riconosciuto. ${R.mio.size < 6 ? 'Nota: ti sono bastati pochi territori. Grande non vuol dire più Stato: lo dimostrano Lussemburgo, Malta o San Marino.' : ''}</p>`);
  const sconfitta = () => {
    const m = []; if (!R.confini) m.push('confini non fissati'); if (nPop() < 4) m.push('popolo incompleto'); if (nGov() < 5) m.push('governo incompleto');
    fineSchermata(false, 'Tempo scaduto', `<p>Non sei riuscito a diventare uno Stato: ${m.join(', ') || 'manca il riconoscimento'}. Uno Stato non nasce solo con la forza: servono tutti gli elementi insieme.</p>`);
  };
  $('domanda').innerHTML = 'Costruisci il tuo Stato<small>Tocca un territorio per iniziare da lì: sarà la tua capitale.</small>';
  $('pannello').innerHTML = '<div class="msg">Ogni territorio ha un numero di armate (la difesa). I più grandi e popolosi sono più difficili da conquistare.</div>';
  aggiornaStat(); $('barraProg').style.width = '0%'; applicaVista();
}

// ---------- stati collegati (elementi fisici ↔ Stati) ----------
// Lo studente legge solo il nome dell'elemento: la mappa non lo mostra (salvo che chieda aiuto, a metà punteggio).
function avviaLegami(soloIds) {
  const statiPool = poolTerr(Math.max(2, S.liv)).map(p => p.id), set = new Set(statiPool);
  let elementi = poolFis(S.liv, S.cats).filter(f => f.s && f.s.some(x => set.has(x)));
  if (soloIds) elementi = F.filter(f => soloIds.includes(f.id) && f.s && f.s.some(x => set.has(x)));
  let coda = mescola(elementi.map(f => f.id));
  if (!soloIds && quantita) coda = coda.slice(0, quantita);
  S.coda = coda; S.pool = statiPool;
  impostaPool(statiPool, 'misto'); pulisciStati();
  timer = setInterval(aggiornaStat, 1000);
  const prox = () => {
    if (S.i >= S.coda.length) return finisci();
    S.blocca = false; pulisciStati(); aggiornaStat(); vistaIntera();
    Object.values(elemF).forEach(l => l.forEach(e => { e.style.display = 'none'; }));
    const id = S.coda[S.i], f = fis[id], ok = f.s.filter(x => set.has(x)), tol = (f.t || []), sel = new Set();
    let aiuto = false;
    const mostraElemento = () => { elemF[id].forEach(e => { e.style.display = ''; }); statoClasse(id, 'evidenzia'); };
    svg.parentElement.classList.add('interattivo');
    const reg = ITA(), giuste = ok.length === 1 ? (reg ? 'C\'è una sola regione giusta.' : 'C\'è un solo Stato giusto.') : reg ? `Le regioni giuste sono ${ok.length}.` : `Gli Stati giusti sono ${ok.length}.`;
    $('domanda').innerHTML = `${f.q || `Quali Stati tocca: ${f.nome}?`}<small>${cat(f.cat).sing[0].toUpperCase() + cat(f.cat).sing.slice(1)}: <b>${f.nome}</b> — seleziona ${reg ? 'le regioni' : 'gli Stati'} sulla mappa, poi premi Verifica.${S.liv === 1 ? ' ' + giuste : ''}</small>`;
    $('pannello').innerHTML = '<div class="azioni-riga"><button class="primario" id="verifica">Verifica</button><button class="secondario" id="aiuto">Mostrami l\'elemento (mezzo punto)</button></div>';
    sulClic = sid => { if (S.blocca || !set.has(sid)) return; sel.has(sid) ? sel.delete(sid) : sel.add(sid); statoClasse(sid, 'sel', sel.has(sid)); };
    $('aiuto').onclick = () => { aiuto = true; mostraElemento(); $('aiuto').disabled = true; };
    $('verifica').onclick = () => {
      if (S.blocca) return; S.blocca = true;
      const giusti = ok.filter(x => sel.has(x)), mancanti = ok.filter(x => !sel.has(x)), sbagliati = [...sel].filter(x => !ok.includes(x) && !tol.includes(x));
      mostraElemento();
      [...sel].forEach(x => { statoClasse(x, 'sel', false); statoClasse(x, ok.includes(x) || tol.includes(x) ? 'giusto' : 'sbagliato'); });
      mancanti.forEach(x => statoClasse(x, 'manca'));
      const frazione = Math.max(0, (giusti.length - sbagliati.length) / ok.length) * (aiuto ? 0.5 : 1), perfetto = !mancanti.length && !sbagliati.length && !aiuto;
      S.punti += frazione; registra(id + '|stati', perfetto); suono(perfetto ? 'ok' : 'ko'); if (!perfetto) S.errori.push(id + '|stati');
      const bonus = segna(perfetto, Math.round(XP_RISPOSTA * frazione));
      const nomi = a => a.map(nomeStato).join(', ');
      const m = document.createElement('div'); m.className = 'msg ' + (perfetto ? 'ok' : 'ko');
      m.innerHTML = titoloEsito(perfetto ? 'Perfetto!' : `Ne hai ${ITA() ? 'trovate' : 'trovati'} ${giusti.length} su ${ok.length}`, bonus) + (aiuto ? 'Con aiuto: mezzo punto. ' : '') + `${ITA() ? 'Regioni giuste' : 'Stati corretti'}: <b>${nomi(ok)}</b>.` +
        (sbagliati.length ? `<br>Da togliere: ${nomi(sbagliati)}.` : '') + (mancanti.length ? `<br>Ti mancava: ${nomi(mancanti)}.` : '') +
        (f.chicca ? `<br><b>Lo sapevi?</b> ${f.chicca}` : (f.info ? `<br>${f.info}` : ''));
      $('pannello').innerHTML = ''; $('pannello').appendChild(m);
      const tok = S; const b = document.createElement('button'); b.className = 'primario'; b.innerHTML = 'Avanti <span class="tasto">INVIO</span>';
      b.onclick = () => { if (S === tok) { S.i++; prox(); } }; $('pannello').appendChild(b);
      aggiornaStat();
    };
  };
  prox();
}

// ---------- cosa lo tocca? (Stato → elementi fisici) ----------
function statiConElementi(elementi, statiIds) {
  const m = {};
  elementi.forEach(f => (f.s || []).forEach(x => { (m[x] = m[x] || []).push(f); }));
  return statiIds.filter(id => (m[id] || []).length >= 2);
}
function avviaElementi(soloIds) {
  const statiPool = poolTerr(Math.max(2, S.liv)).map(p => p.id), set = new Set(statiPool);
  const elementi = poolFis(S.liv, S.cats);
  const rel = {};
  elementi.forEach(f => (f.s || []).forEach(x => { (rel[x] = rel[x] || []).push(f); }));
  let stati = statiConElementi(elementi, statiPool);
  if (soloIds) stati = stati.filter(x => soloIds.includes(x));
  let coda = mescola(stati);
  if (!soloIds && quantita) coda = coda.slice(0, quantita);
  S.coda = coda; S.pool = statiPool;
  impostaPool(statiPool, 'misto'); pulisciStati();
  timer = setInterval(aggiornaStat, 1000);
  const prox = () => {
    if (S.i >= S.coda.length) return finisci();
    S.blocca = false; pulisciStati(); aggiornaStat();
    Object.values(elemF).forEach(l => l.forEach(e => { e.style.display = 'none'; }));
    const id = S.coda[S.i], tutti = rel[id];
    const giuste = mescola(tutti).slice(0, Math.min(tutti.length, 2 + (Math.random() * 2 | 0)));
    const estranei = mescola(elementi.filter(f => !(f.s || []).includes(id) && !(f.t || []).includes(id)));
    const nDistr = Math.max(3, 7 - giuste.length);
    const opzioni = mescola([...giuste, ...estranei.slice(0, nDistr)]);
    const scelte = new Set();
    statoClasse(id, 'evidenzia'); vaiA(id);
    svg.parentElement.classList.remove('interattivo'); sulClic = null;
    $('domanda').innerHTML = `Quali di questi elementi si trovano ${ITA() ? 'nella regione evidenziata' : 'nello Stato evidenziato'}?<small>${ITA() ? 'Regione' : 'Stato'}: <b>${nome(id)}</b>. Seleziona quelli che pensi giusti (possono essere più di uno), poi premi Verifica.</small>`;
    const box = document.createElement('div'); box.className = 'risposte molte';
    opzioni.forEach(o => {
      const b = document.createElement('button'); b.className = 'rispo'; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<span>${o.nome}<br><small class="tipo">${cat(o.cat).sing}</small></span>`;
      b.onclick = () => { if (S.blocca) return; scelte.has(o.id) ? scelte.delete(o.id) : scelte.add(o.id); b.setAttribute('aria-pressed', scelte.has(o.id)); };
      b.dataset.id = o.id; box.appendChild(b);
    });
    $('pannello').innerHTML = ''; $('pannello').appendChild(box);
    const v = document.createElement('button'); v.className = 'primario'; v.textContent = 'Verifica'; $('pannello').appendChild(v);
    v.onclick = () => {
      if (S.blocca) return; S.blocca = true; v.remove();
      const gIds = giuste.map(g => g.id), hit = gIds.filter(x => scelte.has(x)), manc = gIds.filter(x => !scelte.has(x)), err = [...scelte].filter(x => !gIds.includes(x));
      box.querySelectorAll('button').forEach(b => {
        b.disabled = true; const oid = b.dataset.id;
        if (gIds.includes(oid)) b.classList.add(scelte.has(oid) ? 'giusto' : 'manca'); else if (scelte.has(oid)) b.classList.add('sbagliato');
      });
      giuste.forEach(g => elemF[g.id].forEach(e => { e.style.display = ''; }));
      const frazione = Math.max(0, (hit.length - err.length) / gIds.length), perfetto = !manc.length && !err.length;
      S.punti += frazione; registra(id + '|elementi', perfetto); suono(perfetto ? 'ok' : 'ko'); if (!perfetto) S.errori.push(id + '|elementi');
      const bonus = segna(perfetto, Math.round(XP_RISPOSTA * frazione));
      const nomi = a => a.map(x => fis[x].nome).join(', '), altri = tutti.map(t => t.id).filter(x => !gIds.includes(x));
      const m = document.createElement('div'); m.className = 'msg ' + (perfetto ? 'ok' : 'ko');
      m.innerHTML = titoloEsito(perfetto ? 'Perfetto!' : `Ne hai trovati ${hit.length} su ${gIds.length}`, bonus) + `Elementi giusti: <b>${nomi(gIds)}</b>.` +
        (err.length ? `<br>Non si trovano lì: ${nomi(err)}.` : '') +
        (altri.length ? `<br>${ITA() ? 'Nella stessa regione' : 'Nello stesso Stato'} troviamo anche: ${nomi(altri)}.` : '');
      $('pannello').appendChild(m);
      const tok = S; const b = document.createElement('button'); b.className = 'primario'; b.innerHTML = 'Avanti <span class="tasto">INVIO</span>';
      b.onclick = () => { if (S === tok) { S.i++; prox(); } }; $('pannello').appendChild(b);
      aggiornaStat();
    };
  };
  prox();
}

// ---------- simulazione della verifica (Europa e Mondo) ----------
// Come in classe: niente aiuti né correzioni durante la prova; alla fine il voto in decimi e la correzione domanda per domanda.
// Ogni insegnante prepara la propria verifica dal sito («Prepara la verifica»): è salvata online (api/verifica.js) con un codice, e gli studenti la aprono scrivendo il codice.
// ent (solo Italia): su quali voci della lista «stati» si fanno le domande (regioni o capoluoghi); it: nomi diversi nella sezione Italia
const VER_TIPI = [
  { id: 'fisica', fis: true, nome: 'Riconosci l\'elemento fisico', breve: 'Riconosci', frase: n => `${n} ${n === 1 ? 'elemento fisico' : 'elementi fisici'} da riconoscere` },
  { id: 'trovaFis', fis: true, nome: 'Trova l\'elemento fisico sulla carta', breve: 'Trova elemento', frase: n => `${n} ${n === 1 ? 'elemento fisico' : 'elementi fisici'} da trovare sulla carta` },
  { id: 'trova', nome: 'Trova lo Stato sulla carta', breve: 'Trova Stato', frase: n => `${n} ${n === 1 ? 'Stato' : 'Stati'} da trovare sulla carta`,
    it: { ent: 'reg', nome: 'Trova la regione sulla carta', breve: 'Trova regione', frase: n => `${n} ${n === 1 ? 'regione' : 'regioni'} da trovare sulla carta` } },
  { id: 'indovina', nome: 'Riconosci lo Stato evidenziato', breve: 'Che Stato è', frase: n => `${n} ${n === 1 ? 'Stato' : 'Stati'} da riconoscere`,
    it: { ent: 'reg', nome: 'Riconosci la regione evidenziata', breve: 'Che regione è', frase: n => `${n} ${n === 1 ? 'regione' : 'regioni'} da riconoscere` } },
  { id: 'capitali', nome: 'Scegli la capitale', breve: 'Capitali', frase: n => `${n} ${n === 1 ? 'capitale' : 'capitali'}`,
    it: { ent: 'reg', nome: 'Scegli il capoluogo di regione', breve: 'Capoluoghi', frase: n => `${n} ${n === 1 ? 'capoluogo' : 'capoluoghi'} di regione` } },
  { id: 'trovaCitta', sez: 'italia', ent: 'citta', nome: 'Trova la città sulla carta', breve: 'Trova città', frase: n => `${n} ${n === 1 ? 'città' : 'città'} da trovare sulla carta` },
  { id: 'regioneDi', sez: 'italia', ent: 'citta', nome: 'In quale regione si trova la città?', breve: 'Città e regioni', frase: n => `${n} ${n === 1 ? 'città' : 'città'} da collocare nella sua regione` },
  { id: 'ue', sez: 'europa', nome: 'È nell\'Unione europea?', breve: 'UE', frase: n => `${n} ${n === 1 ? 'domanda' : 'domande'} sull'Unione europea` },
  { id: 'continente', sez: 'mondo', nome: 'In quale continente si trova?', breve: 'Continenti', frase: n => `${n} ${n === 1 ? 'Stato' : 'Stati'} da collocare in un continente` },
];
const verTipi = () => VER_TIPI.filter(t => !t.sez || t.sez === SZ.id).map(t => (ITA() && t.it ? { ...t, ...t.it } : t));
const verTipo = id => verTipi().find(t => t.id === id) || VER_TIPI.find(t => t.id === id);
// voci della lista «stati» su cui si può fare una domanda di questo tipo
const statiPerTipo = (t, stati) => (t.ent ? stati.filter(id => citta(id) === (t.ent === 'citta')) : stati);
const VER_EXTRA = ['NOR', 'ISL', 'GBR', 'UKR'];
// verifica predefinita (per allenarsi senza codice): Europa = fisica del livello Facile, Stati UE (senza Malta) + Norvegia, Islanda, Regno Unito, Ucraina;
// Mondo = elementi fisici e Stati del livello Facile. I livelli degli elementi fisici si leggono al momento: vengono dai dati della sezione, applicati in impostaSezione()
const verDefault = () => ITA()
  ? { v: 2, sez: 'italia', titolo: '', parti: { fisica: 7, trovaFis: 4, trova: 5, indovina: 0, capitali: 5, trovaCitta: 4, regioneDi: 0 },
    stati: P.filter(p => p.liv === 1).map(p => p.id), fisici: F.filter(f => f.liv === 1).map(f => f.id), agg: 0 }
  : SZ.id === 'mondo'
  ? { v: 2, sez: 'mondo', titolo: '', parti: { fisica: 8, trovaFis: 0, trova: 6, indovina: 0, capitali: 0, continente: 4 },
    stati: P.filter(p => p.liv === 1 && !MICRO.includes(p.id)).map(p => p.id), fisici: F.filter(f => f.liv === 1).map(f => f.id), agg: 0 }
  : { v: 2, sez: 'europa', titolo: '', parti: { fisica: 13, trovaFis: 0, trova: 7, indovina: 0, capitali: 0, ue: 5 },
    stati: P.filter(p => (p.ue || VER_EXTRA.includes(p.id)) && p.id !== 'MLT').map(p => p.id), fisici: F.filter(f => f.liv === 1).map(f => f.id), agg: 0 };
const VER_API = 'api/verifica';
const pulisciCodice = c => String(c || '').trim().toUpperCase().replace(/\s+/g, '');
const codiceValido = c => /^[A-Z0-9-]{3,20}$/.test(c);
// scarica la verifica con questo codice (con un tempo massimo)
async function caricaVerifica(codice, ms = 6000) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(`${VER_API}?codice=${encodeURIComponent(codice)}`, { cache: 'no-store', signal: ctl.signal });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.config) return { ok: true, codice: j.codice, config: j.config };
    return { ok: false, errore: r.status === 404 ? 'Non trovo nessuna verifica con questo codice: controlla di averlo scritto bene.'
      : r.status === 503 ? 'Le verifiche online non sono ancora attive (database non collegato su Vercel).' : 'Non riesco a caricare la verifica. Riprova.' };
  } catch { return { ok: false, errore: 'Non riesco a raggiungere il server: controlla la connessione e riprova.' }; } finally { clearTimeout(t); }
}
// apre la verifica con questo codice, cambiando sezione se serve; scrive l'esito nella scheda della home
async function cercaVerifica(codice) {
  codice = pulisciCodice(codice);
  const esito = $('esitoCod'), dica = t => { if (esito) esito.textContent = t; };
  if (!codiceValido(codice)) return dica('Scrivi il codice che ti ha dato l\'insegnante.');
  dica('Cerco la verifica…');
  const r = await caricaVerifica(codice);
  if (!r.ok) return dica(r.errore);
  try { if (r.config.sez !== SZ.id) await impostaSezione(r.config.sez); } catch { return dica('Non riesco a caricare la sezione di questa verifica. Controlla la connessione e riprova.'); }
  mem.set('verCod', r.codice); dica('');
  avviaVerifica(r.config, { codice: r.codice });
}
// Stati giusti per una domanda sul continente (quelli a cavallo tra due continenti ne hanno due)
const contGiusti = id => [...new Set([per[id].area, ...(per[id].alt || [])])];
// solo id che esistono ancora nei dati, e numeri di domande che ci stanno
function verNormalizza(c) {
  const stati = (c.stati || []).filter(id => per[id]), fisici = (c.fisici || []).filter(id => fis[id]), parti = {};
  verTipi().forEach(t => { parti[t.id] = Math.min(Math.max(0, +c.parti[t.id] || 0), t.fis ? fisici.length : statiPerTipo(t, stati).length); });
  if (parti.ue) parti.ue = Math.min(parti.ue, stati.length);
  return { ...c, stati, fisici, parti };
}
const verTot = c => VER_TIPI.reduce((s, t) => s + (c.parti[t.id] || 0), 0);
const verFrasi = c => { const l = verTipi().filter(t => c.parti[t.id]).map(t => t.frase(c.parti[t.id])); return l.length > 1 ? l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1] : l[0] || ''; };
const votoDa = frazione => Math.max(4, Math.round(frazione * 20) / 2);   // a mezzi voti, 4 è il voto più basso
const votoTxt = v => Number.isInteger(v) ? String(v) : `${Math.floor(v)}½`;
const giudizio = v => v >= 9.5 ? 'Ottimo' : v >= 8.5 ? 'Distinto' : v >= 7.5 ? 'Buono' : v >= 6 ? 'Sufficiente' : 'Non sufficiente';
// n elementi a caso da lista, evitando quando possibile quelli già usati in altre parti
const prendi = (lista, n, usati) => { const l = [...mescola(lista.filter(x => !usati.has(x))), ...mescola(lista.filter(x => usati.has(x)))].slice(0, n); l.forEach(x => usati.add(x)); return l; };

// opz.prova: anteprima dell'insegnante (non conta per record, esperienza e medaglie); opz.codice: codice della verifica, per tenere separato il miglior voto
function avviaVerifica(cfgIn, opz = {}) {
  const prova = !!opz.prova;
  const cfg = verNormalizza(cfgIn || verDefault());
  if (!verTot(cfg)) return alert('Questa verifica non ha domande.');
  suonoSerie(); clearInterval(timer);
  const P_ = cfg.parti, usatiS = new Set(), usatiF = new Set(), coda = [];
  const aggiungi = (tipo, ids) => ids.forEach(id => coda.push({ tipo, id }));
  aggiungi('fisica', prendi(cfg.fisici, P_.fisica, usatiF));
  aggiungi('trovaFis', prendi(cfg.fisici, P_.trovaFis, usatiF));
  const st = id => statiPerTipo(verTipo(id), cfg.stati);
  aggiungi('trova', prendi(st('trova'), P_.trova, usatiS));
  aggiungi('indovina', prendi(st('indovina'), P_.indovina, usatiS));
  aggiungi('capitali', prendi(st('capitali'), P_.capitali, usatiS));
  if (P_.trovaCitta) aggiungi('trovaCitta', prendi(st('trovaCitta'), P_.trovaCitta, usatiS));
  if (P_.regioneDi) aggiungi('regioneDi', prendi(st('regioneDi'), P_.regioneDi, usatiS));
  if (P_.ue) { // UE: un po' di Stati fuori dall'UE (se ce ne sono), così la risposta non è sempre «sì»
    const fuori = cfg.stati.filter(id => !per[id].ue), dentro = cfg.stati.filter(id => per[id].ue);
    const nFuori = Math.min(fuori.length, Math.max(1, Math.round(P_.ue * (0.25 + Math.random() * 0.3))), P_.ue);
    const scelti = [...prendi(fuori, nFuori, usatiS), ...prendi(dentro, P_.ue - nFuori, usatiS)];
    aggiungi('ue', mescola(scelti.length < P_.ue ? [...scelti, ...prendi(fuori.filter(x => !scelti.includes(x)), P_.ue - scelti.length, usatiS)] : scelti));
  }
  if (P_.continente) aggiungi('continente', prendi(cfg.stati, P_.continente, usatiS));
  modoAttivo = 'stati';
  S = { gioco: 'verifica', modo: 'verifica', cats: [], liv: 1, pool: [], cfg, i: 0, punti: 0, errori: [], t0: Date.now(), blocca: false, tent: 0, serie: 0, serieMax: 0, xp: 0, esiti: [],
    verifica: true, prova, codice: opz.codice || null, coda, risposte: [], mappa: null,
    clicStati: P.filter(p => !MICRO.includes(p.id) || cfg.stati.includes(p.id)).map(p => p.id) };
  if (ITA()) { // regioni e capoluoghi su due carte diverse; si vedono i capoluoghi fino al livello più alto tra quelli della verifica
    const livMax = Math.max(1, ...cfg.stati.filter(citta).map(id => per[id].liv));
    S.clicStati = P.filter(p => !p.citta).map(p => p.id); S.clicCitta = P.filter(p => p.citta && p.liv <= livMax).map(p => p.id);
  }
  $('hudNome').textContent = prova ? 'Anteprima della verifica' : (cfg.titolo || 'Simulazione della verifica');
  $('hudSub').textContent = `${SZ.nome} · ${coda.length} domande`;
  $('hudPods').hidden = false; $('stat').textContent = '';
  vistaIntera(); sulClic = null; etichetteOn = false;
  svg.parentElement.classList.remove('interattivo');
  mostra('gioco');
  timer = setInterval(aggiornaStat, 1000);
  domandaVerifica();
}
// cambia cartina solo quando si passa dalla geografia fisica a quella politica (in Italia anche tra regioni e capoluoghi)
function mappaVerifica(m) {
  if (S.mappa === m) return;
  S.mappa = m; modoAttivo = m === 'fisico' ? 'fisico' : 'stati';
  impostaPool(m === 'fisico' ? S.cfg.fisici : m === 'citta' ? S.clicCitta : S.clicStati, modoAttivo);
}
function domandaVerifica() {
  if (S.i >= S.coda.length) return finisciVerifica();
  const { tipo, id } = S.coda[S.i], ultima = S.i === S.coda.length - 1;
  const fisico = VER_TIPI.find(t => t.id === tipo).fis;
  S.blocca = false; pulisciStati(); aggiornaStat();
  $('pannello').innerHTML = ''; sulClic = null; svg.parentElement.classList.remove('interattivo');
  let scelta = null;
  const conferma = document.createElement('button'); conferma.className = 'primario'; conferma.disabled = true;
  conferma.innerHTML = `${ultima ? 'Consegna la verifica' : 'Conferma e vai avanti'} <span class="tasto">INVIO</span>`;
  conferma.onclick = () => {
    if (scelta === null || S.blocca) return;
    S.blocca = true; S.risposte[S.i] = scelta;
    S.esiti[S.i] = tipo === 'ue' ? scelta === per[id].ue : tipo === 'continente' ? contGiusti(id).includes(scelta) : tipo === 'regioneDi' ? scelta === per[id].reg : scelta === id;
    S.i++; domandaVerifica();
  };
  const scegliUna = opz => {
    const box = document.createElement('div'); box.className = 'risposte';
    opz.forEach(o => {
      const b = document.createElement('button'); b.className = 'rispo'; b.textContent = o.testo; b.setAttribute('aria-pressed', 'false');
      b.onclick = () => { if (S.blocca) return; scelta = o.v; box.querySelectorAll('.rispo').forEach(x => x.setAttribute('aria-pressed', x === b)); conferma.disabled = false; };
      box.appendChild(b);
    });
    $('pannello').appendChild(box);
  };
  // clic sulla mappa: si sceglie (e si può cambiare) finché non si conferma; il nome di ciò che si clicca non viene mostrato
  const cliccaSullaMappa = (cosa, f = false) => { // f: nome femminile (regione, città)
    svg.parentElement.classList.add('interattivo');
    const msg = document.createElement('div'); msg.className = 'msg'; msg.textContent = `${f ? 'Nessuna' : 'Nessun'} ${cosa} ${f ? 'selezionata' : 'selezionato'}.`;
    $('pannello').appendChild(msg);
    sulClic = cl => {
      if (S.blocca) return;
      if (scelta) statoClasse(scelta, 'sel', false);
      scelta = cl; statoClasse(cl, 'sel'); conferma.disabled = false;
      msg.textContent = `${cosa[0].toUpperCase() + cosa.slice(1)} ${f ? 'selezionata' : 'selezionato'} (in azzurro). Conferma o clicca altrove per cambiare.`;
    };
  };
  const tipiFis = S.coda.some(q => VER_TIPI.find(t => t.id === q.tipo).fis), tipiPol = S.coda.some(q => !VER_TIPI.find(t => t.id === q.tipo).fis);
  const parte = `<span class="ver-parte">${tipiFis && tipiPol ? `Parte ${fisico ? 1 : 2} · ` : ''}Geografia ${fisico ? 'fisica' : 'politica'}</span>`;
  // nomi di altri Stati vicini (per le risposte sbagliate plausibili)
  const vicini = () => P.filter(p => p.id !== id && !MICRO.includes(p.id) && E.centri[p.id]).map(p => {
    const a = E.centri[id], b = E.centri[p.id]; return { p, d: Math.hypot(a[0] - b[0], a[1] - b[1]) };
  }).sort((x, y) => x.d - y.d).slice(0, 9).map(o => o.p);
  if (tipo === 'fisica') {
    mappaVerifica('fisico'); statoClasse(id, 'evidenzia'); vaiA(id);
    const f = fis[id], cf = cat(f.cat), dist = x => Math.hypot(f.c[0] - x.c[0], f.c[1] - x.c[1]);
    const altri = F.filter(x => x.id !== id && (x.liv <= Math.max(f.liv, 1) || S.cfg.fisici.includes(x.id)));
    let cand = altri.filter(x => x.cat === f.cat).sort((x, y) => dist(x) - dist(y)).slice(0, 9);
    if (cand.length < 3) cand = cand.concat(F.filter(x => x.id !== id && x.cat === f.cat && !cand.includes(x)).sort((x, y) => dist(x) - dist(y)).slice(0, 3 - cand.length));
    if (cand.length < 3) cand = cand.concat(mescola(altri.filter(x => x.cat !== f.cat)).slice(0, 3 - cand.length));
    $('domanda').innerHTML = `${parte}${cf.q}<small>Riconosci l'elemento evidenziato sulla carta fisica.</small>`;
    scegliUna(mescola([f, ...mescola(cand).slice(0, 3)]).map(o => ({ testo: o.nome, v: o.id })));
  } else if (tipo === 'trovaFis') {
    mappaVerifica('fisico'); vistaIntera();
    const cf = cat(fis[id].cat);
    $('domanda').innerHTML = `${parte}Trova sulla carta: <b>${nome(id)}</b> <span class="tipo">(${cf.sing})</span><small>Clicca l'elemento, poi conferma.${cf.id === 'mari' ? ' I mari si cliccano sull\'acqua.' : cf.id === 'stretti' ? ' Gli stretti sono piccoli: puoi ingrandire la mappa.' : ''}</small>`;
    cliccaSullaMappa('elemento');
  } else if (tipo === 'trova') {
    mappaVerifica('stati'); vistaIntera();
    $('domanda').innerHTML = `${parte}Trova sulla carta: <b>${nome(id)}</b><small>Clicca ${ITA() ? 'la regione' : 'lo Stato'}, poi conferma. Finché non confermi puoi cambiare idea.</small>`;
    cliccaSullaMappa(ITA() ? 'regione' : 'Stato', ITA());
  } else if (tipo === 'trovaCitta') {
    mappaVerifica('citta'); vistaIntera();
    $('domanda').innerHTML = `${parte}Trova sulla carta: <b>${nome(id)}</b> <span class="tipo">(città)</span><small>Clicca il punto della città, poi conferma. Puoi ingrandire la mappa.</small>`;
    cliccaSullaMappa('città', true);
  } else if (tipo === 'indovina') {
    mappaVerifica('stati'); statoClasse(id, 'evidenzia'); vaiA(id);
    $('domanda').innerHTML = `${parte}${ITA() ? 'Quale regione è evidenziata?' : 'Quale Stato è evidenziato?'}`;
    scegliUna(mescola([per[id], ...mescola(vicini()).slice(0, 3)]).map(o => ({ testo: o.nome, v: o.id })));
  } else if (tipo === 'capitali') {
    mappaVerifica('stati'); statoClasse(id, 'evidenzia'); vaiA(id);
    $('domanda').innerHTML = `${parte}<b>${nome(id)}</b> ${ITA() ? '(evidenziata): qual è il capoluogo di regione?' : '(evidenziato): qual è la capitale?'}`;
    scegliUna(mescola([per[id], ...mescola(vicini()).slice(0, 3)]).map(o => ({ testo: o.cap, v: o.id })));
  } else if (tipo === 'regioneDi') {
    mappaVerifica('citta'); statoClasse(id, 'evidenzia'); vaiA(id);
    const p = per[id], a = E.centri[id];
    const vicine = P.filter(r => !r.citta && r.id !== p.reg).map(r => ({ r, d: Math.hypot(E.centri[r.id][0] - a[0], E.centri[r.id][1] - a[1]) })).sort((x, y) => x.d - y.d).slice(0, 5).map(o => o.r);
    $('domanda').innerHTML = `${parte}<b>${p.nome}</b> (evidenziata): in quale regione si trova?`;
    scegliUna(mescola([per[p.reg], ...mescola(vicine).slice(0, 3)]).map(o => ({ testo: o.nome, v: o.id })));
  } else if (tipo === 'continente') {
    mappaVerifica('stati'); statoClasse(id, 'evidenzia'); vaiA(id);
    $('domanda').innerHTML = `${parte}<b>${nome(id)}</b> (evidenziato): in quale continente si trova?`;
    const giusti = contGiusti(id), altri = mescola(SZ.aree.filter(c => !giusti.includes(c))).slice(0, Math.max(2, 4 - giusti.length));
    scegliUna(mescola([...giusti, ...altri]).map(c => ({ testo: c, v: c })));
  } else {
    mappaVerifica('stati'); statoClasse(id, 'evidenzia'); vaiA(id);
    $('domanda').innerHTML = `${parte}<b>${nome(id)}</b> (evidenziato) fa parte dell'Unione europea?`;
    scegliUna([{ testo: 'Sì, è nell\'UE', v: true }, { testo: 'No, è fuori dall\'UE', v: false }]);
  }
  $('pannello').appendChild(conferma);
}
function finisciVerifica() {
  clearInterval(timer); sulClic = null; pulisciStati();
  const righe = S.coda.map((q, k) => ({ ...q, r: S.risposte[k], ok: S.esiti[k] }));
  const tot = righe.length, punti = righe.filter(q => q.ok).length, perc = Math.round(100 * punti / tot);
  const voto = votoDa(punti / tot), sec = Math.floor((Date.now() - S.t0) / 1000);
  const chiaveTipo = { trova: '', fisica: '', trovaFis: '', indovina: '', capitali: '|cap', ue: '|ue', continente: '|area', trovaCitta: '', regioneDi: '|reg' };
  let serie = 0;
  righe.forEach(q => {
    const ch = q.id + chiaveTipo[q.tipo];
    if (!S.prova) registra(ch, q.ok);
    if (!q.ok) S.errori.push(ch);
    serie = q.ok ? serie + 1 : 0; S.serieMax = Math.max(S.serieMax, serie);
  });
  // l'anteprima dell'insegnante non conta per record, esperienza e medaglie
  let ld = null, salito = false, guadagno = 0, nuove = [], rec = null, nuovoRec = false;
  if (!S.prova) {
    const chiave = SZ.rec + 'verifica' + (S.codice ? '_' + S.codice : ''); rec = mp.get(chiave, null); nuovoRec = rec === null || perc > rec;
    if (nuovoRec) mp.set(chiave, perc);
    const sess = mp.get(kSess(), []);
    sess.push({ t: Date.now(), g: 'verifica', m: 'verifica', l: 1, c: [], p: perc, n: tot, s: sec });
    mp.set(kSess(), sess.slice(-300));
    const bRec = nuovoRec && rec !== null ? XP_RECORD : 0, bPerf = perc === 100 ? XP_PERFETTO : 0;
    guadagno = punti * XP_RISPOSTA + bRec + bPerf; const xpPrima = xpTot(), xpDopo = xpPrima + guadagno; mp.set('xp', xpDopo);
    ld = infoLiv(xpDopo); salito = ld.n > infoLiv(xpPrima).n;
    nuove = controllaMedaglie({ perc, stelle: stelleDa(perc), tot, xp: xpDopo });
  }
  const parti = verTipi().filter(t => righe.some(q => q.tipo === t.id)).map(t => {
    const q = righe.filter(x => x.tipo === t.id), g = q.filter(x => x.ok).length;
    return `<div><span class="hud-lbl">${t.breve}</span><b>${g}<span class="su">/${q.length}</span></b></div>`;
  }).join('');
  const testoDom = q => ({ fisica: () => cat(fis[q.id].cat).q, trovaFis: () => `Trova: <b>${nome(q.id)}</b>`, trova: () => `Trova: <b>${nome(q.id)}</b>`, trovaCitta: () => `Trova: <b>${nome(q.id)}</b>`,
    indovina: () => ITA() ? 'Quale regione è evidenziata?' : 'Quale Stato è evidenziato?', capitali: () => `<b>${nome(q.id)}</b>: qual è ${ITA() ? 'il capoluogo' : 'la capitale'}?`,
    regioneDi: () => `<b>${nome(q.id)}</b>: in quale regione si trova?`, continente: () => `<b>${nome(q.id)}</b>: in quale continente si trova?`, ue: () => `<b>${nome(q.id)}</b> è nell'UE?` })[q.tipo]();
  const giusta = q => q.tipo === 'continente' ? contGiusti(q.id).join(' / ') : q.tipo === 'capitali' ? per[q.id].cap : q.tipo === 'ue' ? (per[q.id].ue ? 'Sì' : 'No') : q.tipo === 'regioneDi' ? per[per[q.id].reg].nome : nome(q.id);
  const tua = q => q.tipo === 'continente' ? q.r : q.tipo === 'capitali' ? per[q.r].cap : q.tipo === 'ue' ? (q.r ? 'Sì' : 'No') : per[q.r] ? per[q.r].nome : fis[q.r] ? fis[q.r].nome : q.r;
  const correzione = righe.map((q, k) => `<li class="${q.ok ? 'ok' : 'ko'}"><span class="n">${k + 1}</span><span class="cr-testo">${testoDom(q)}
    <small>${q.ok ? `Risposta: ${giusta(q)}` : `Hai risposto: ${tua(q)} · Giusta: <b>${giusta(q)}</b>`}</small></span></li>`).join('');
  const errStati = [...new Set(righe.filter(q => !q.ok && !fis[q.id]).map(q => q.id))], errFis = [...new Set(righe.filter(q => !q.ok && fis[q.id]).map(q => q.id))];
  const mm = Math.floor(sec / 60), ss = String(sec % 60).padStart(2, '0');
  const prova = S.prova, cfgProva = S.cfg, codiceV = S.codice;
  $('fine').innerHTML = `<div class="fine-griglia">
    <section class="fine-esito" aria-labelledby="titoloFine">
      <span class="hud-lbl">${prova ? 'Anteprima della verifica' : (S.cfg.titolo || 'Simulazione della verifica')} · ${SZ.nome}</span>
      <div class="voto ${voto >= 8 ? 'p-alto' : voto >= 6 ? 'p-medio' : 'p-basso'}" role="img" aria-label="Voto ${votoTxt(voto).replace('½', ' e mezzo')}"><small>VOTO</small><b>${votoTxt(voto)}</b></div>
      <h1 id="titoloFine">${giudizio(voto)}</h1>
      <div class="punteggio"><b>${punti}<span class="su">/${tot}</span></b><span>${perc}%</span></div>
      <div class="mini-stat ver-parti">${parti}</div>
      ${prova ? '<span class="hud-lbl">Anteprima: non conta per record, esperienza e medaglie</span>'
        : nuovoRec && rec !== null ? `<span class="nastro">${icona('trofeo')}NUOVO RECORD · PRIMA ${votoTxt(votoDa(rec / 100))}</span>` : rec === null ? `<span class="nastro">${icona('trofeo')}PRIMA VERIFICA</span>` : `<span class="hud-lbl">Miglior voto: ${votoTxt(votoDa(rec / 100))}</span>`}
      <div class="xp-box">
        ${ld ? `<div class="xp-riga"><span>LIV ${ld.n} · ${ld.dentro} / ${ld.serve} XP</span><span class="piu">+${guadagno} XP</span></div>
        <div class="xpbar grande" role="img" aria-label="Esperienza: ${ld.dentro} su ${ld.serve} per il livello ${ld.n + 1}"><i class="nuova" style="width:${ld.perc}%"></i></div>` : ''}
        <small>Tempo: ${mm}:${ss}. Il voto è calcolato in decimi a mezzi voti (minimo 4): per la verifica vera fanno fede i criteri dell'insegnante.</small>
        ${salito ? `<div class="livello-su">Sei salito al livello ${ld.n}!</div>` : ''}
      </div>
    </section>
    <div class="fine-dx">
      ${nuove.length ? `<section class="riquadro" aria-labelledby="tNuove"><div class="riq-testa"><h2 id="tNuove">${nuove.length > 1 ? 'Nuove medaglie!' : 'Nuova medaglia!'}</h2></div>
        <div class="medaglie compatte">${nuove.map(id => medagliaHtml(MEDAGLIE.find(m => m.id === id), true, true)).join('')}</div></section>` : ''}
      <section class="riquadro" aria-labelledby="tCorr">
        <div class="riq-testa"><h2 id="tCorr">Correzione</h2><span class="hud-lbl">${tot - punti} ${tot - punti === 1 ? 'errore' : 'errori'}</span></div>
        <ol class="correzione">${correzione}</ol>
      </section>
      <div class="azioni-fine">
        <button class="primario" id="ancora">${icona('ricarica')}${prova ? 'Rifai l\'anteprima' : 'Rifai la verifica'}</button>
        ${prova ? '<button class="secondario" id="tornaPrepara">Torna a «Prepara la verifica»</button>' : ''}
        ${!prova && errStati.length ? `<button class="secondario rosso" id="ripStati">${ITA() ? 'Ripassa regioni e città sbagliate' : 'Ripassa gli Stati sbagliati'}</button>` : ''}
        ${!prova && errFis.length ? '<button class="secondario rosso" id="ripFis">Ripassa gli elementi sbagliati</button>' : ''}
        <button class="secondario" id="menu">Menu</button>
      </div>
    </div></div>`;
  mostra('fine'); suono('fine', perc); aggiornaProfilo();
  $('ancora').onclick = () => avviaVerifica(cfgProva, { prova, codice: codiceV });
  if ($('tornaPrepara')) $('tornaPrepara').onclick = () => apriPrepara(true);
  if ($('ripStati')) $('ripStati').onclick = () => { modo = 'stati'; mem.set('modo', modo); avvia('trova', errStati); };
  if ($('ripFis')) $('ripFis').onclick = () => { modo = 'fisico'; mem.set('modo', modo); avvia('indovina', errFis); };
  $('menu').onclick = esciMenu;
  $('ancora').focus({ preventScroll: true });
}

// ---------- prepara la verifica (insegnante) ----------
// Le password restano solo in memoria finché la pagina è aperta; il server le controlla a ogni salvataggio.
// verSess: null = schermata di accesso; altrimenti { nuova, sez, passDocenti (solo se nuova), codice, password } della verifica che si sta preparando.
let verSess = null, bozza = null, bozzaCod = { scelta: 'auto', codice: '', password: '' };
const copiaCfg = c => JSON.parse(JSON.stringify(c));
function apriPrepara(riprendi) {
  if (!riprendi || !verSess) { verSess = null; bozza = null; bozzaCod = { scelta: 'auto', codice: '', password: '' }; }
  mostra('prepara'); disegnaPrepara();
}
const linkVerifica = codice => `${location.origin}${location.pathname}?v=${encodeURIComponent(codice)}`;
async function copiaTesto(testo, campo) {
  try { await navigator.clipboard.writeText(testo); return true; } catch {}
  try { campo.focus(); campo.select(); return document.execCommand('copy'); } catch { return false; }
}
function disegnaPrepara(avvisoHtml, mostraCodice) {
  const box = $('prepara');
  if (!verSess) {
    let sezNuova = SZ.id;
    box.innerHTML = `<div class="prog-barra"><button class="btn-testo" id="prepIndietro">${icona('freccia')}Menu</button></div>
      <h1 id="tPrep">Prepara la verifica</h1>
      <p class="nota">Pagina per gli insegnanti. Ogni verifica ha un proprio <b>codice</b>: gli studenti lo scrivono nella home e fanno la tua verifica, senza toccare quelle dei colleghi.</p>
      <div class="prep-griglia">
        <section class="riquadro" aria-labelledby="tNuova">
          <h2 id="tNuova">Nuova verifica</h2>
          <form class="prep-form" id="formNuova">
            <span class="hud-lbl">Di quale sezione?</span>
            <div class="seg" role="group" aria-label="Sezione della verifica">${['italia', 'europa', 'mondo'].map(id => `<button type="button" data-sezn="${id}" aria-pressed="${id === sezNuova}">${SEZIONI[id].nome} · ${SEZIONI[id].classe.toLowerCase()}</button>`).join('')}</div>
            <label><span class="hud-lbl">Password degli insegnanti</span><input id="passDocenti" type="password" autocomplete="current-password" aria-label="Password degli insegnanti"></label>
            <button class="primario" type="submit">Continua</button>
            <p class="nota" id="esitoNuova" role="status"></p>
          </form>
        </section>
        <section class="riquadro" aria-labelledby="tModifica">
          <h2 id="tModifica">Modifica una tua verifica</h2>
          <form class="prep-form" id="formModifica">
            <label><span class="hud-lbl">Codice della verifica</span><input id="modCodice" type="text" maxlength="20" autocapitalize="characters" autocomplete="off" spellcheck="false" value="${mem.get('verCod', '')}" aria-label="Codice della verifica"></label>
            <label><span class="hud-lbl">Password di questa verifica</span><input id="modPass" type="password" autocomplete="off" aria-label="Password della verifica"></label>
            <button class="primario" type="submit">Apri</button>
            <p class="nota" id="esitoModifica" role="status">${avvisoHtml || ''}</p>
          </form>
        </section>
      </div>`;
    $('prepIndietro').onclick = esciMenu;
    box.querySelectorAll('[data-sezn]').forEach(b => b.onclick = () => { sezNuova = b.dataset.sezn; box.querySelectorAll('[data-sezn]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    $('formNuova').onsubmit = async e => {
      e.preventDefault();
      const p = $('passDocenti').value; if (!p) return;
      $('esitoNuova').textContent = 'Controllo…';
      const r = await chiamaVerifica({ azione: 'prova', passwordDocenti: p });
      if (!r.ok) return ($('esitoNuova').textContent = r.errore);
      try { if (sezNuova !== SZ.id) { $('esitoNuova').textContent = 'Carico la sezione…'; await impostaSezione(sezNuova); } } catch { return ($('esitoNuova').textContent = 'Non riesco a caricare questa sezione. Riprova.'); }
      bozza = verDefault(); bozzaCod = { scelta: 'auto', codice: '', password: '' };
      verSess = { nuova: true, sez: sezNuova, passDocenti: p, codice: null, password: null }; disegnaPrepara();
    };
    $('formModifica').onsubmit = async e => {
      e.preventDefault();
      const codice = pulisciCodice($('modCodice').value), password = $('modPass').value;
      if (!codiceValido(codice) || !password) return ($('esitoModifica').textContent = 'Scrivi il codice e la password della verifica.');
      $('esitoModifica').textContent = 'Controllo…';
      const r = await chiamaVerifica({ azione: 'accedi', codice, password });
      if (!r.ok) return ($('esitoModifica').textContent = r.errore);
      try { if (r.config.sez !== SZ.id) { $('esitoModifica').textContent = 'Carico la sezione…'; await impostaSezione(r.config.sez); } } catch { return ($('esitoModifica').textContent = 'Non riesco a caricare la sezione di questa verifica. Riprova.'); }
      mem.set('verCod', r.codice); bozza = copiaCfg(r.config);
      verSess = { nuova: false, sez: r.config.sez, passDocenti: null, codice: r.codice, password }; disegnaPrepara();
    };
    $('passDocenti').focus();
    return;
  }
  const c = bozza, nS = c.stati.length, nF = c.fisici.length, tot = verTot(verNormalizza(c)), mondo = SZ.id !== 'europa', nuova = verSess.nuova;
  const max = t => t.fis ? nF : statiPerTipo(t, c.stati).length;
  const tipiHtml = verTipi().map(t => `<label class="prep-tipo"><span><b>${t.nome}</b><small>${t.fis ? 'Geografia fisica' : 'Geografia politica'} · massimo ${max(t)}</small></span>
    <input type="number" min="0" max="${max(t)}" step="1" inputmode="numeric" data-tipo="${t.id}" value="${c.parti[t.id] || 0}" aria-label="${t.nome}: numero di domande"></label>`).join('');
  const statiOrd = P.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
  const chipStato = p => `<button class="chip piccolo" data-stato="${p.id}" aria-pressed="${c.stati.includes(p.id)}">${p.nome}${p.ue ? '<span class="n">UE</span>' : mondo ? `<span class="n">${'●'.repeat(p.liv)}</span>` : ''}</button>`;
  // gruppi di chip: Mondo per continente; Italia prima le regioni, poi i capoluoghi divisi per area
  const gruppi = ITA() ? ['Regioni', ...SZ.aree] : SZ.aree;
  const inGruppo = (p, k) => ITA() ? (k === 'Regioni' ? !p.citta : p.citta && p.area === k) : p.area === k;
  const statiHtml = mondo
    ? gruppi.map(k => {
      const el = statiOrd.filter(p => inGruppo(p, k)), n = el.filter(p => c.stati.includes(p.id)).length;
      return `<details class="prep-cat"><summary><b>${ITA() && k !== 'Regioni' ? 'Capoluoghi · ' + k : k}</b><span class="hud-lbl">${n} / ${el.length}</span></summary>
        <div class="chips">${el.map(chipStato).join('')}</div>
        <div class="azioni-riga"><button class="btn-testo" data-contTutti="${k}">Tutti</button><button class="btn-testo" data-contNessuno="${k}">Nessuno</button></div></details>`;
    }).join('')
    : `<div class="chips">${statiOrd.map(chipStato).join('')}</div>`;
  const rapidiStati = mondo
    ? '<button class="secondario piccolo" data-sliv="1">Livello Facile</button><button class="secondario piccolo" data-sliv="2">Facile + Medio</button><button class="secondario piccolo" data-sliv="3">Tutti</button><button class="secondario piccolo" data-sliv="0">Nessuno</button>'
    : '<button class="secondario piccolo" id="sDef">UE + Norvegia, Islanda, Regno Unito, Ucraina</button><button class="secondario piccolo" id="sUE">Solo UE</button><button class="secondario piccolo" id="sTutti">Tutti</button><button class="secondario piccolo" id="sNessuno">Nessuno</button>';
  const fisHtml = catsSez().map(k => {
    const el = F.filter(f => f.cat === k.id).sort((a, b) => a.liv - b.liv || a.nome.localeCompare(b.nome, 'it'));
    const n = el.filter(f => c.fisici.includes(f.id)).length;
    return `<details class="prep-cat"><summary><b>${k.nome}</b><span class="hud-lbl">${n} / ${el.length}</span></summary>
      <div class="chips">${el.map(f => `<button class="chip piccolo" data-fis="${f.id}" aria-pressed="${c.fisici.includes(f.id)}">${f.nome}<span class="n">${'●'.repeat(f.liv)}</span></button>`).join('')}</div>
      <div class="azioni-riga"><button class="btn-testo" data-catTutti="${k.id}">Tutti</button><button class="btn-testo" data-catNessuno="${k.id}">Nessuno</button></div></details>`;
  }).join('');
  const agg = c.agg ? new Date(c.agg).toLocaleString('it-IT', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : null;
  const codiceHtml = !nuova ? '' : `<section class="riquadro prep-largo" aria-labelledby="tCod">
        <div class="riq-testa"><h2 id="tCod">Codice e password</h2></div>
        <div class="prep-codici">
          <div><span class="hud-lbl">Codice della verifica</span>
            <div class="seg" role="group" aria-label="Come scegliere il codice"><button type="button" data-scelta="auto" aria-pressed="${bozzaCod.scelta === 'auto'}">Lo sceglie il sito</button><button type="button" data-scelta="mio" aria-pressed="${bozzaCod.scelta === 'mio'}">Lo scelgo io</button></div>
            ${bozzaCod.scelta === 'mio' ? `<input id="prepCodice" class="prep-input" type="text" maxlength="20" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="Es. 2B-GEO" value="${bozzaCod.codice.replace(/"/g, '&quot;')}" aria-label="Codice scelto da te">
            <small class="nota">Da 3 a 20 tra lettere, numeri e trattini. Se esiste già te lo diciamo.</small>` : '<small class="nota">Un codice di 5 caratteri, facile da leggere e scrivere (per esempio K7M2Q).</small>'}</div>
          <label><span class="hud-lbl">Password di questa verifica</span><input id="prepPass" class="prep-input" type="password" autocomplete="new-password" value="${bozzaCod.password.replace(/"/g, '&quot;')}" aria-label="Password di questa verifica">
            <small class="nota">Almeno 4 caratteri. Serve solo a te per modificare la verifica: gli studenti usano solo il codice.</small></label>
        </div>
      </section>`;
  const codiceSalvato = !mostraCodice || !verSess.codice ? '' : `<section class="riquadro prep-codice" aria-labelledby="tSalvata" role="status">
      <span class="hud-lbl" id="tSalvata">Verifica salvata · ${SZ.nome}</span>
      <div class="codice-grande" aria-label="Codice: ${verSess.codice.split('').join(' ')}">${verSess.codice}</div>
      <p><b>Salvati questo codice per accedere in seguito alla verifica e modificarla</b>, insieme alla password della verifica. Gli studenti lo scrivono nella home del sito, oppure aprono questo link:</p>
      <input class="prep-input" id="linkVer" type="text" readonly value="${linkVerifica(verSess.codice)}" aria-label="Link per gli studenti">
      <div class="azioni-riga"><button class="secondario piccolo" id="copiaCodice">Copia il codice</button><button class="secondario piccolo" id="copiaLink">Copia il link</button></div>
      <p class="nota" id="esitoCopia" role="status"></p></section>`;
  box.innerHTML = `<div class="prog-barra"><button class="btn-testo" id="prepIndietro">${icona('freccia')}Menu</button>
      <span class="hud-lbl">${nuova ? 'Nuova verifica · ' + SZ.nome : `Verifica ${verSess.codice} · ${SZ.nome}${agg ? ' · salvata il ' + agg : ''}`}</span></div>
    ${codiceSalvato}
    <h1>${nuova ? 'Prepara la verifica' : 'Modifica la verifica'}</h1>
    <p class="nota">${nuova ? `Scegli quante domande fare, su quali ${ITA() ? 'regioni e città' : 'Stati'} e su quali elementi fisici. Con «Prova» la fai tu, senza salvarla.` : 'Le modifiche valgono per gli studenti solo dopo «Salva le modifiche». Con «Prova» la fai tu, senza salvarla.'}</p>
    <div class="prep-griglia">
      <section class="riquadro" aria-labelledby="tTipi">
        <div class="riq-testa"><h2 id="tTipi">Domande</h2><span class="hud-lbl" id="prepTot">Totale ${tot}</span></div>
        <label class="prep-titolo"><span class="hud-lbl">Titolo (facoltativo)</span><input id="prepTitolo" type="text" maxlength="80" placeholder="Es. Verifica di geografia del 24 ottobre" value="${(c.titolo || '').replace(/"/g, '&quot;')}"></label>
        <div class="prep-tipi">${tipiHtml}</div>
        <p class="nota">Metti 0 per togliere un tipo di domanda. Le domande di geografia fisica vengono prima, poi quelle di politica.</p>
      </section>
      <section class="riquadro" aria-labelledby="tStati">
        <div class="riq-testa"><h2 id="tStati">${ITA() ? 'Regioni e città' : 'Stati'}</h2><span class="hud-lbl">${nS} scelti${mondo ? ' · ● facile ●● medio ●●● difficile' : ''}</span></div>
        <div class="azioni-riga prep-rapidi">${rapidiStati}</div>
        ${statiHtml}
      </section>
      <section class="riquadro prep-largo" aria-labelledby="tFis">
        <div class="riq-testa"><h2 id="tFis">Elementi fisici</h2><span class="hud-lbl">${nF} scelti · ● facile ●● medio ●●● difficile</span></div>
        <div class="azioni-riga prep-rapidi">
          <button class="secondario piccolo" data-liv="1">Livello Facile</button><button class="secondario piccolo" data-liv="2">Facile + Medio</button>
          <button class="secondario piccolo" data-liv="3">Tutti</button><button class="secondario piccolo" data-liv="0">Nessuno</button>
        </div>
        ${fisHtml}
      </section>
      ${codiceHtml}
    </div>
    <div class="prep-barra">
      <p class="nota" id="prepEsito" role="status">${avvisoHtml || ''}</p>
      <div class="azioni-riga">
        <button class="secondario" id="prepDefault">Torna alla predefinita</button>
        <button class="secondario" id="prepProva">${icona('mirino')}Prova</button>
        <button class="primario" id="prepSalva">${nuova ? 'Crea la verifica' : 'Salva le modifiche'}</button>
      </div>
    </div>`;
  // le categorie aperte restano aperte quando si ridisegna
  const aperte = disegnaPrepara.aperte || new Set();
  box.querySelectorAll('.prep-cat').forEach((d, k) => { if (aperte.has(k)) d.open = true; d.ontoggle = () => { d.open ? aperte.add(k) : aperte.delete(k); disegnaPrepara.aperte = aperte; }; });
  const ridisegna = () => { const y = window.scrollY; disegnaPrepara(); window.scrollTo(0, y); };
  $('prepIndietro').onclick = esciMenu;
  $('prepTitolo').oninput = e => { c.titolo = e.target.value; };
  box.querySelectorAll('[data-tipo]').forEach(i => i.oninput = () => {
    c.parti[i.dataset.tipo] = Math.max(0, Math.min(+i.max, Math.round(+i.value || 0)));
    $('prepTot').textContent = 'Totale ' + verTot(verNormalizza(c));
  });
  box.querySelectorAll('[data-tipo]').forEach(i => i.onchange = ridisegna);
  const alterna = (lista, id) => lista.includes(id) ? lista.filter(x => x !== id) : [...lista, id];
  box.querySelectorAll('[data-stato]').forEach(b => b.onclick = () => { c.stati = alterna(c.stati, b.dataset.stato); ridisegna(); });
  box.querySelectorAll('[data-fis]').forEach(b => b.onclick = () => { c.fisici = alterna(c.fisici, b.dataset.fis); ridisegna(); });
  box.querySelectorAll('[data-cattutti]').forEach(b => b.onclick = () => { c.fisici = [...new Set([...c.fisici, ...F.filter(f => f.cat === b.dataset.cattutti).map(f => f.id)])]; ridisegna(); });
  box.querySelectorAll('[data-catnessuno]').forEach(b => b.onclick = () => { c.fisici = c.fisici.filter(id => fis[id].cat !== b.dataset.catnessuno); ridisegna(); });
  box.querySelectorAll('[data-conttutti]').forEach(b => b.onclick = () => { c.stati = [...new Set([...c.stati, ...P.filter(p => inGruppo(p, b.dataset.conttutti)).map(p => p.id)])]; ridisegna(); });
  box.querySelectorAll('[data-contnessuno]').forEach(b => b.onclick = () => { c.stati = c.stati.filter(id => !inGruppo(per[id], b.dataset.contnessuno)); ridisegna(); });
  box.querySelectorAll('[data-sliv]').forEach(b => b.onclick = () => { c.stati = P.filter(p => p.liv <= +b.dataset.sliv).map(p => p.id); ridisegna(); });
  box.querySelectorAll('[data-liv]').forEach(b => b.onclick = () => { c.fisici = F.filter(f => f.liv <= +b.dataset.liv).map(f => f.id); ridisegna(); });
  if (!mondo) {
    $('sDef').onclick = () => { c.stati = verDefault().stati; ridisegna(); };
    $('sUE').onclick = () => { c.stati = P.filter(p => p.ue).map(p => p.id); ridisegna(); };
    $('sTutti').onclick = () => { c.stati = P.map(p => p.id); ridisegna(); };
    $('sNessuno').onclick = () => { c.stati = []; ridisegna(); };
  }
  if (nuova) {
    box.querySelectorAll('[data-scelta]').forEach(b => b.onclick = () => { bozzaCod.scelta = b.dataset.scelta; ridisegna(); });
    $('prepPass').oninput = e => { bozzaCod.password = e.target.value; };
    if ($('prepCodice')) $('prepCodice').oninput = e => { bozzaCod.codice = e.target.value; };
  }
  if ($('copiaCodice')) {
    const esito = ok => { $('esitoCopia').textContent = ok ? 'Copiato!' : 'Non riesco a copiare: selezionalo e copialo a mano.'; };
    $('copiaCodice').onclick = async () => esito(await copiaTesto(verSess.codice, $('linkVer')));
    $('copiaLink').onclick = async () => esito(await copiaTesto($('linkVer').value, $('linkVer')));
    $('linkVer').onfocus = e => e.target.select();
  }
  $('prepDefault').onclick = () => { const { titolo } = bozza; bozza = { ...verDefault(), titolo }; ridisegna(); $('prepEsito').textContent = 'Ripristinata la verifica predefinita.'; };
  $('prepProva').onclick = () => { if (!verTot(verNormalizza(c))) return ($('prepEsito').textContent = 'Aggiungi almeno una domanda.'); avviaVerifica(copiaCfg(c), { prova: true }); };
  $('prepSalva').onclick = async () => {
    const cfg = verNormalizza(c), esito = $('prepEsito');
    if (!verTot(cfg)) return (esito.textContent = 'Aggiungi almeno una domanda.');
    const config = { sez: verSess.sez, titolo: cfg.titolo, parti: cfg.parti, stati: cfg.stati, fisici: cfg.fisici };
    let corpo;
    if (nuova) {
      const codice = bozzaCod.scelta === 'mio' ? pulisciCodice(bozzaCod.codice) : '';
      if (bozzaCod.scelta === 'mio' && !codiceValido(codice)) return (esito.textContent = 'Il codice deve avere da 3 a 20 tra lettere, numeri e trattini.');
      if (bozzaCod.password.length < 4) return (esito.textContent = 'Scegli una password per questa verifica (almeno 4 caratteri).');
      corpo = { azione: 'crea', passwordDocenti: verSess.passDocenti, passwordVerifica: bozzaCod.password, codice, config };
    } else corpo = { azione: 'salva', codice: verSess.codice, password: verSess.password, config };
    $('prepSalva').disabled = true; esito.textContent = 'Salvataggio…';
    const r = await chiamaVerifica(corpo);
    if (r.ok) {
      if (nuova) { verSess = { nuova: false, sez: verSess.sez, passDocenti: null, codice: r.codice, password: bozzaCod.password }; mem.set('verCod', r.codice); }
      bozza = copiaCfg(r.config); disegnaPrepara(`Salvata: ${verTot(verNormalizza(r.config))} domande.`, true);
      $('tSalvata').scrollIntoView({ block: 'center' });
    } else if (r.stato === 401) { verSess = null; disegnaPrepara('Password non più valida: rientra.'); }
    else { $('prepSalva').disabled = false; esito.textContent = r.errore; }
  };
}
async function chiamaVerifica(corpo) {
  try {
    const r = await fetch(VER_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) return { ok: true, codice: j.codice, config: j.config };
    return { ok: false, stato: r.status, errore: r.status === 503 ? 'Il salvataggio online non è ancora attivo (database non collegato su Vercel).' : j.errore ? j.errore + '.' : 'Errore. Riprova.' };
  } catch { return { ok: false, errore: 'Non riesco a raggiungere il server: controlla la connessione e riprova.' }; }
}

// ---------- fine partita ----------
// controlla le medaglie a fine partita; restituisce gli id di quelle appena ottenute
function controllaMedaglie({ perc, stelle, tot, xp }) {
  const nuove = [], sb = id => sblocca(id, nuove);
  sb('prima');
  if (S.serieMax >= 10) sb('serie10');
  if (perc === 100 && tot >= 10) sb('perfetto');
  if (S.gioco === 'capitali' && stelle === 3) sb('capitali');
  if (S.liv === 3 && stelle === 3) sb('difficile');
  if (S.gioco === 'coloraUE' && perc === 100 && !S.errori.length) sb('ue');
  if (S.gioco === 'coloraCont' && perc === 100 && !S.errori.length) sb('continente');
  if (S.modo === 'fisico' && stelle === 3) sb('fisico');
  if (mp.get('sess', []).length + mp.get('sess_m', []).length + mp.get('sess_i', []).length >= 25) sb('maratona');
  const giocati = new Set(mp.get(kSess(), []).map(x => x.g + '|' + x.m));
  if (GIOCHI.filter(g => g.sez.includes(SZ.id) && g.punti !== false).every(g => giocati.has(g.id + '|' + g.modo))) sb('tutti');
  if (livDa(xp) >= 10) sb('liv10');
  return nuove;
}
function finisci() {
  clearInterval(timer);
  const g = giocoDi(S.gioco, S.modo), tot = S.totale || S.coda.length;
  const pt = Math.round(S.punti * 10) / 10;
  const perc = Math.round(100 * S.punti / tot), sec = Math.floor((Date.now() - S.t0) / 1000);
  const chiave = chiaveRec(S.gioco, S.modo, S.liv, S.cats), rec = mp.get(chiave, null);
  const nuovoRec = rec === null || perc > rec; if (nuovoRec) mp.set(chiave, perc);
  const sess = mp.get(kSess(), []);
  sess.push({ t: Date.now(), g: S.gioco, m: S.modo, l: S.liv, c: S.modo === 'fisico' ? S.cats : [], p: perc, n: tot, s: sec });
  mp.set(kSess(), sess.slice(-300));
  const stelle = stelleDa(perc);
  // esperienza: risposte e serie + bonus record e partita perfetta
  const bRec = nuovoRec && rec !== null ? XP_RECORD : 0, bPerf = perc === 100 && tot >= 5 ? XP_PERFETTO : 0;
  const base = Math.round(S.xp), guadagno = base + bRec + bPerf;
  const xpPrima = xpTot(), xpDopo = xpPrima + guadagno; mp.set('xp', xpDopo);
  const lp = infoLiv(xpPrima), ld = infoLiv(xpDopo), salito = ld.n > lp.n;
  const nuove = controllaMedaglie({ perc, stelle, tot, xp: xpDopo });
  const titolo = perc === 100 ? 'Perfetto!' : perc >= 80 ? 'Ottimo lavoro!' : perc >= 60 ? 'Bene!' : 'Non mollare!';
  const sotto = perc === 100 ? 'Nessun errore: sei pronto per il livello successivo.' : perc >= 80 ? 'Ancora qualche ripasso e sarà perfetto.' : perc >= 60 ? 'Un po\' di ripasso e migliori subito.' : 'Continua ad allenarti: ce la farai!';
  const err = [...new Set(S.errori)];
  const ripasso = err.map(baseId).filter((x, i, a) => a.indexOf(x) === i);
  const parti = [`${base} per le risposte`, bRec ? `${bRec} per il record` : '', bPerf ? `${bPerf} per la partita perfetta` : ''].filter(Boolean).join(', ');
  const barra = salito ? `<i class="nuova" style="width:${ld.perc}%"></i>` : `<i class="prima" style="width:${100 * lp.dentro / ld.serve}%"></i><i class="nuova" style="width:${100 * guadagno / ld.serve}%"></i>`;
  const mm = Math.floor(sec / 60), ss = String(sec % 60).padStart(2, '0');
  $('fine').innerHTML = `<div class="fine-griglia">
    <section class="fine-esito" aria-labelledby="titoloFine">
      <span class="hud-lbl">${g.nome} · ${SZ.nome} · ${LIVELLI[S.liv - 1].nome}</span>
      <div class="stelle-big" role="img" aria-label="${stelle} stelle su 3">${[1, 2, 3].map(k => `<svg viewBox="0 0 24 24" class="${k <= stelle ? 'on' : ''}" aria-hidden="true">${STELLA}</svg>`).join('')}</div>
      <h1 id="titoloFine">${titolo}</h1>
      <div class="punteggio"><b>${pt}<span class="su">/${tot}</span></b><span class="${perc >= 80 ? 'p-alto' : perc >= 60 ? 'p-medio' : 'p-basso'}">${perc}%</span></div>
      <p class="nota" style="margin:0">${sotto}</p>
      ${nuovoRec && rec !== null ? `<span class="nastro">${icona('trofeo')}NUOVO RECORD · PRIMA ${rec}%</span>` : rec === null ? `<span class="nastro">${icona('trofeo')}PRIMO RECORD</span>` : `<span class="hud-lbl">Record: ${rec}%</span>`}
      <div class="xp-box">
        <div class="xp-riga"><span>LIV ${ld.n} · ${ld.dentro} / ${ld.serve} XP</span><span class="piu">+${guadagno} XP</span></div>
        <div class="xpbar grande" role="img" aria-label="Esperienza: ${ld.dentro} su ${ld.serve} per il livello ${ld.n + 1}">${barra}</div>
        <small>${parti}. Mancano ${ld.manca} XP al livello ${ld.n + 1}.</small>
        ${salito ? `<div class="livello-su">Sei salito al livello ${ld.n}!</div>` : ''}
      </div>
    </section>
    <div class="fine-dx">
      <div class="mini-stat">
        <div><span class="hud-lbl">Tempo</span><b>${mm}:${ss}</b></div>
        <div class="serie-box"><span class="hud-lbl">Serie migliore</span><b>×${S.serieMax}</b></div>
        <div><span class="hud-lbl">Record</span><b>${Math.max(perc, rec || 0)}%</b></div>
      </div>
      ${nuove.length ? `<section class="riquadro" aria-labelledby="tNuove"><div class="riq-testa"><h2 id="tNuove">${nuove.length > 1 ? 'Nuove medaglie!' : 'Nuova medaglia!'}</h2></div>
        <div class="medaglie compatte">${nuove.map(id => medagliaHtml(MEDAGLIE.find(m => m.id === id), true, true)).join('')}</div></section>` : ''}
      <section class="riquadro" aria-labelledby="tRip">
        <div class="riq-testa"><h2 id="tRip">Da ripassare</h2><span class="hud-lbl">${err.length} ${err.length === 1 ? 'errore' : 'errori'}</span></div>
        ${err.length ? `<ul class="errori-lista">${err.map(k => `<li><span>${etichettaChiave(k)}</span></li>`).join('')}</ul>` : '<p class="tutto-giusto">Nessun errore: complimenti!</p>'}
      </section>
      <div class="azioni-fine">
        <button class="primario" id="ancora">${icona('ricarica')}Rigioca</button>
        ${ripasso.length && !['coloraUE', 'coloraCont'].includes(S.gioco) ? '<button class="secondario rosso" id="ripassa">Ripassa solo gli errori</button>' : '<span></span>'}
        <button class="secondario" id="vaiProg">${icona('grafico')}I miei progressi</button>
        <button class="secondario" id="menu">Menu</button>
      </div>
    </div></div>`;
  mostra('fine'); suono('fine', perc); aggiornaProfilo();
  const giocoRipasso = S.gioco, modoRipasso = S.modo;
  $('ancora').onclick = () => avvia(S.gioco);
  if ($('ripassa')) $('ripassa').onclick = () => { modo = modoRipasso; avvia(giocoRipasso === 'identita' ? 'indovina' : giocoRipasso, ripasso); };
  $('vaiProg').onclick = () => { disegnaProgressi(); mostra('progressi'); };
  $('menu').onclick = esciMenu;
  $('ancora').focus({ preventScroll: true });
}
function esciMenu() { if ($('gioco').classList.contains('schermo-intero')) schermoIntero(false); clearInterval(timer); S = null; disegnaHome(); mostra('home'); }
$('esci').onclick = esciMenu;

// ---------- i miei progressi ----------
function disegnaProgressi() {
  const st = mp.get(kStat(), {}), sess = mp.get(kSess(), []);
  const box = $('progressi');
  const nSess = sess.length, ultime = sess.slice(-5), prime = sess.slice(0, 5);
  const media = a => a.length ? Math.round(a.reduce((s, x) => s + x.p, 0) / a.length) : null;
  const mU = media(ultime), mP = media(prime);
  const trend = nSess >= 6 && mU !== null ? mU - mP : null;
  const tempoTot = Math.round(sess.reduce((s, x) => s + x.s, 0) / 60);
  const tempoTxt = tempoTot >= 60 ? `${Math.floor(tempoTot / 60)}h ${tempoTot % 60}m` : `${tempoTot} min`;
  const ultime20 = sess.slice(-20);
  const barre = ultime20.map(x => {
    const gioco = (giocoDi(x.g, x.m) || {}).nome || x.g;
    const dt = new Date(x.t).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    return `<div class="barra-col" title="${dt} · ${gioco} · ${x.p}%"><div class="barra-v ${x.p >= 80 ? 'alto' : x.p >= 60 ? 'medio' : 'basso'}" style="height:${Math.max(x.p, 3)}%"></div></div>`;
  }).join('');
  const righe = Object.entries(st).filter(([, r]) => r.e > 0).sort((a, b) => b[1].e - a[1].e || (b[1].e / b[1].n) - (a[1].e / a[1].n)).slice(0, 12);
  const puntini = r => r.r.map(x => `<i class="${x ? 'p-ok' : 'p-ko'}"></i>`).join('');
  const tabErr = righe.length ? `<table class="tab-err"><thead><tr><th>Elemento</th><th>Errori</th><th>Ultime risposte</th></tr></thead><tbody>${righe.map(([k, r]) =>
    `<tr><td>${etichettaChiave(k)}<br><span class="grp">${gruppoChiave(k)}</span></td><td>${r.e} su ${r.n}</td><td><span class="puntini" role="img" aria-label="Ultime risposte: ${r.r.map(x => x ? 'giusta' : 'sbagliata').join(', ')}">${puntini(r)}</span></td></tr>`).join('')}</tbody></table>` : '<p class="tutto-giusto">Nessun errore registrato: continua così!</p>';
  const gruppi = {};
  Object.entries(st).forEach(([k, r]) => { const g = gruppoChiave(k); (gruppi[g] = gruppi[g] || { n: 0, e: 0 }); gruppi[g].n += r.n; gruppi[g].e += r.e; });
  const gruppiHtml = Object.entries(gruppi).sort((a, b) => b[1].n - a[1].n).map(([g, r]) => {
    const pc = Math.round(100 * (r.n - r.e) / r.n);
    return `<div class="gruppo"><span>${g}</span><div class="gr-barra"><div class="${pc >= 80 ? 'alto' : pc >= 60 ? 'medio' : 'basso'}" style="width:${pc}%"></div></div><b>${pc}%</b><small>${r.n} risposte</small></div>`;
  }).join('') || '<p class="nota">Ancora nessun dato.</p>';
  const dachi = [...new Set(righe.map(([k]) => baseId(k)))];
  const daStati = dachi.filter(i => per[i]), daFis = dachi.filter(i => fis[i]);
  const l = infoLiv(xpTot()), med = medOttenute(), nMed = MEDAGLIE.filter(m => med[m.id]).length;
  box.innerHTML = `<div class="prog-barra"><button class="btn-testo" id="progIndietro">${icona('freccia')}Menu</button>
      <div class="seg" role="group" aria-label="Sezione">${['italia', 'europa', 'mondo'].map(id => `<button data-sez="${id}" aria-pressed="${id === SZ.id}">${SEZIONI[id].nome}</button>`).join('')}</div></div>
    <section class="profilo-testa" aria-labelledby="tProf">
      <span class="avatar">${profilo.trim()[0] || '?'}</span>
      <div class="profilo-info">
        <h1 id="tProf">${profilo}<span class="liv-n">LIVELLO ${l.n}</span></h1>
        <div class="xpbar" role="img" aria-label="Esperienza: ${l.dentro} su ${l.serve}"><i style="width:${l.perc}%"></i></div>
        <small>${l.dentro} / ${l.serve} XP · mancano ${l.manca} XP al livello ${l.n + 1}</small>
      </div>
      <div class="riepilogo">
        <div class="num"><b>${nSess}</b><span>partite · ${SZ.nome}</span></div>
        <div class="num"><b>${tempoTxt}</b><span>tempo di gioco</span></div>
        <div class="num"><b>${mU === null ? '–' : mU + '%'}</b><span>media ultime 5</span></div>
        <div class="num ${trend > 0 ? 'su' : ''}"><b>${trend === null ? '–' : (trend > 0 ? '+' : '') + trend}</b><span>${trend === null ? 'miglioramento (servono 6 partite)' : 'punti rispetto alle prime 5'}</span></div>
      </div>
    </section>
    <div class="prog-griglia">
      <div class="prog-col">
        <section class="riquadro" aria-labelledby="tUlt"><div class="riq-testa"><h2 id="tUlt">Ultime partite</h2></div>
          ${ultime20.length ? `<div class="grafico" role="img" aria-label="Risultati delle ultime ${ultime20.length} partite">${barre}</div>
          <div class="legenda-grafico"><span><i class="alto"></i>80% e oltre</span><span><i class="medio"></i>60–79%</span><span><i class="basso"></i>sotto il 60%</span></div>` : '<p class="nota">Gioca qualche partita per vedere il grafico.</p>'}
        </section>
        <section class="riquadro" aria-labelledby="tGr"><h2 id="tGr">Dove vai meglio e dove peggio</h2>${gruppiHtml}</section>
      </div>
      <div class="prog-col">
        <section class="riquadro" aria-labelledby="tMed"><div class="riq-testa"><h2 id="tMed">Medaglie</h2><span class="hud-lbl">${nMed} / ${MEDAGLIE.length}</span></div>
          <div class="medaglie">${MEDAGLIE.map(m => medagliaHtml(m, !!med[m.id])).join('')}</div></section>
        <section class="riquadro" aria-labelledby="tErr"><h2 id="tErr">Errori ricorrenti</h2>${tabErr}
          <div class="azioni-riga" style="margin-top:14px">
            ${daStati.length ? `<button class="secondario rosso" id="allenaStati">${ITA() ? 'Allena regioni e città sbagliate' : 'Allena gli Stati sbagliati'}</button>` : ''}
            ${daFis.length ? '<button class="secondario rosso" id="allenaFis">Allena gli elementi fisici sbagliati</button>' : ''}
          </div></section>
      </div>
    </div>
    <section class="riquadro gestione" aria-labelledby="tGest"><h2 id="tGest">Gestione dati</h2>
      <p class="nota">I progressi sono salvati su questo dispositivo, nel profilo «${profilo}». Se cancelli i dati del browser si perdono. Qui sopra vedi le statistiche della sezione ${SZ.nome}; esperienza e medaglie valgono per tutte le sezioni.</p>
      <div class="azioni"><button class="secondario" id="copiaCsv">Copia il riepilogo</button><button class="secondario" id="azzera">Azzera i progressi di ${profilo} (${SZ.nome})</button></div>
      <p class="nota" id="esitoCopia"></p><textarea id="areaCsv" class="area-csv" rows="6" readonly hidden aria-label="Riepilogo da copiare"></textarea>
    </section>`;
  $('progIndietro').onclick = esciMenu;
  box.querySelectorAll('[data-sez]').forEach(b => b.onclick = async () => { if (b.dataset.sez !== SZ.id && await cambiaSezione(b.dataset.sez)) disegnaProgressi(); });
  if ($('allenaStati')) $('allenaStati').onclick = () => { modo = 'stati'; mem.set('modo', modo); avvia('trova', daStati.slice(0, 10)); };
  if ($('allenaFis')) $('allenaFis').onclick = () => { modo = 'fisico'; mem.set('modo', modo); avvia('trova', daFis.slice(0, 10)); };
  $('copiaCsv').onclick = () => {
    const rows = [['elemento', 'tipo', 'gruppo', 'risposte', 'errori']];
    Object.entries(st).forEach(([k, r]) => rows.push([nome(baseId(k)), TIPI[k.split('|')[1]] || 'nome', gruppoChiave(k), r.n, r.e]));
    rows.push([], ['data', 'gioco', 'modo', 'livello', 'percentuale', 'domande', 'secondi']);
    sess.forEach(x => rows.push([new Date(x.t).toISOString().slice(0, 16).replace('T', ' '), x.g, x.m, x.l, x.p, x.n, x.s]));
    const csv = rows.map(r => r.join('\t')).join('\n');
    const mostraTesto = () => { $('areaCsv').hidden = false; $('areaCsv').value = csv; $('areaCsv').focus(); $('areaCsv').select(); $('esitoCopia').textContent = 'Seleziona il testo e copialo (Ctrl+C o Cmd+C).'; };
    try { navigator.clipboard.writeText(csv).then(() => { $('esitoCopia').textContent = 'Riepilogo copiato! Incollalo in un foglio di calcolo o in un messaggio.'; }, mostraTesto); } catch { mostraTesto(); }
  };
  let conferma = null;
  $('azzera').onclick = () => {
    if (conferma === null) {
      $('azzera').textContent = `Sicuro? Clicca di nuovo per cancellare i dati di ${profilo}`;
      conferma = setTimeout(() => { conferma = null; $('azzera').textContent = `Azzera i progressi di ${profilo} (${SZ.nome})`; }, 5000);
      return;
    }
    clearTimeout(conferma); mp.del(kStat()); mp.del(kSess());
    Object.keys(localStorage).filter(k => k.startsWith(`eg_p_${profilo}_${SZ.rec}`)).forEach(k => localStorage.removeItem(k));
    disegnaProgressi();
  };
}

// avvio: si carica l'ultima sezione usata (Mondo solo se i suoi dati sono disponibili)
impostaSezione(sezione).catch(() => impostaSezione('europa')).then(() => {
  disegnaHome();
  // link per gli studenti (…/?v=CODICE): apre subito la verifica
  const v = new URLSearchParams(location.search).get('v');
  if (v) { history.replaceState(null, '', location.pathname); $('codVer').value = pulisciCodice(v); cercaVerifica(v); }
});
})();
