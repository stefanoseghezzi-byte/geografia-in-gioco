// Dati delle regioni italiane e dei capoluoghi (sezione Italia, prima media). Valori arrotondati, aggiornati a circa il 2024-2025.
// Regioni: tutte nel livello 1 (facile). Città: 1 = capoluoghi di regione, 2 = capoluoghi di provincia più conosciuti, 3 = tutti gli altri.
// area: Italia settentrionale, centrale, meridionale o insulare (come nei libri di testo).
// Le coordinate delle città (lat, lon) servono solo a tools/build-italia.mjs per disegnare la mappa.
// I confini tra regioni ("Confina con") si calcolano dalla mappa.
(function () {
  const P = [];
  const NORD = 'Italia settentrionale', CENTRO = 'Italia centrale', SUD = 'Italia meridionale', ISOLE = 'Italia insulare';
  const R = (id, nome, cap, area, pos, sup, ab, mari, speciale, chicca) =>
    P.push({ id, nome, cap, liv: 1, area, pos, sup, ab, mari, speciale: !!speciale, chicca });

  R('PIE', 'Piemonte', 'Torino', NORD, 'Nord-ovest, ai piedi delle Alpi', 25387, 4250000, '', false,
    'Il nome significa «ai piedi dei monti»: le Alpi lo circondano su tre lati. Nel Piemonte nasce il Po, il fiume più lungo d\'Italia.');
  R('VDA', 'Valle d\'Aosta', 'Aosta', NORD, 'Nord-ovest, al confine con Francia e Svizzera', 3261, 123000, '', true,
    'È la regione più piccola e meno abitata d\'Italia. Qui si trovano le vette più alte delle Alpi, come il Monte Bianco e il Cervino, e si parla anche il francese.');
  R('LOM', 'Lombardia', 'Milano', NORD, 'Nord, tra le Alpi e il Po', 23864, 10000000, '', false,
    'È la regione più popolata d\'Italia: ci vive circa un italiano su sei. Ha molti grandi laghi, come il Lago Maggiore, il Lago di Como e il Lago di Garda.');
  R('TAA', 'Trentino-Alto Adige', 'Trento', NORD, 'Nord-est, sulle Alpi, al confine con Austria e Svizzera', 13605, 1080000, '', true,
    'È formata da due province autonome, Trento e Bolzano. In Alto Adige la maggior parte degli abitanti parla tedesco.');
  R('VEN', 'Veneto', 'Venezia', NORD, 'Nord-est, tra le Dolomiti e il Mar Adriatico', 18345, 4850000, 'Mar Adriatico', false,
    'Venezia è costruita su più di cento isolette della laguna, collegate da circa 400 ponti. Il Veneto è la regione italiana più visitata dai turisti.');
  R('FVG', 'Friuli-Venezia Giulia', 'Trieste', NORD, 'Nord-est, al confine con Austria e Slovenia', 7932, 1190000, 'Mar Adriatico', true,
    'È la regione più a nord-est d\'Italia. Oltre all\'italiano si parlano il friulano, lo sloveno e il tedesco.');
  R('LIG', 'Liguria', 'Genova', NORD, 'Nord-ovest, una stretta striscia tra i monti e il Mar Ligure', 5416, 1510000, 'Mar Ligure', false,
    'Ha la forma di un arco stretto tra i monti e il mare: la parte a ovest di Genova si chiama Riviera di Ponente, quella a est Riviera di Levante.');
  R('EMR', 'Emilia-Romagna', 'Bologna', NORD, 'Nord, tra il Po, gli Appennini e il Mar Adriatico', 22446, 4450000, 'Mar Adriatico', false,
    'È attraversata dalla Via Emilia, una strada costruita dai Romani più di 2000 anni fa: lungo il suo percorso sorgono quasi tutti i capoluoghi della regione.');
  R('TOS', 'Toscana', 'Firenze', CENTRO, 'Centro, tra gli Appennini e il Mar Tirreno', 22987, 3660000, 'Mar Ligure e Mar Tirreno', false,
    'È la culla della lingua italiana: Dante, Petrarca e Boccaccio erano toscani. Davanti alle sue coste si trova l\'Arcipelago toscano, con l\'Isola d\'Elba.');
  R('UMB', 'Umbria', 'Perugia', CENTRO, 'Centro, nel cuore della penisola', 8464, 855000, '', false,
    'È chiamata «il cuore verde d\'Italia». È l\'unica regione dell\'Italia peninsulare che non si affaccia sul mare.');
  R('MAR', 'Marche', 'Ancona', CENTRO, 'Centro, tra gli Appennini e il Mar Adriatico', 9401, 1480000, 'Mar Adriatico', false,
    'Il nome viene dalle «marche», le terre di confine del Medioevo. È l\'unica regione italiana con il nome al plurale.');
  R('LAZ', 'Lazio', 'Roma', CENTRO, 'Centro, sul Mar Tirreno', 17232, 5720000, 'Mar Tirreno', false,
    'Qui si trova Roma, la capitale d\'Italia. Dentro Roma c\'è la Città del Vaticano, lo Stato più piccolo del mondo.');
  R('ABR', 'Abruzzo', 'L\'Aquila', SUD, 'Centro-sud, tra gli Appennini e il Mar Adriatico', 10832, 1270000, 'Mar Adriatico', false,
    'È detta «la regione verde d\'Europa»: circa un terzo del suo territorio è protetto da parchi. Qui si trova il Gran Sasso, la vetta più alta degli Appennini.');
  R('MOL', 'Molise', 'Campobasso', SUD, 'Sud, tra gli Appennini e il Mar Adriatico', 4461, 290000, 'Mar Adriatico', false,
    'È la regione più giovane d\'Italia: fino al 1963 formava un\'unica regione con l\'Abruzzo. Dopo la Valle d\'Aosta è la meno abitata.');
  R('CAM', 'Campania', 'Napoli', SUD, 'Sud, sul Mar Tirreno', 13671, 5590000, 'Mar Tirreno', false,
    'È la regione più densamente popolata d\'Italia. Qui si trovano il Vesuvio, gli scavi di Pompei e le isole di Capri e Ischia.');
  R('PUG', 'Puglia', 'Bari', SUD, 'Sud-est, il «tacco» dello Stivale', 19541, 3890000, 'Mar Adriatico e Mar Ionio', false,
    'Ha più di 800 km di coste ed è la regione più pianeggiante del Sud, con il Tavoliere delle Puglie. È famosa per i trulli di Alberobello.');
  R('BAS', 'Basilicata', 'Potenza', SUD, 'Sud, tra il Mar Tirreno e il Mar Ionio', 10073, 535000, 'Mar Tirreno e Mar Ionio', false,
    'Si affaccia su due mari. Matera, con i suoi Sassi (antiche case scavate nella roccia), è patrimonio dell\'UNESCO.');
  R('CAL', 'Calabria', 'Catanzaro', SUD, 'Sud, la «punta» dello Stivale', 15222, 1840000, 'Mar Tirreno e Mar Ionio', false,
    'È la punta dello Stivale: lo Stretto di Messina la separa dalla Sicilia per pochi chilometri. Ha montagne come la Sila e l\'Aspromonte.');
  R('SIC', 'Sicilia', 'Palermo', ISOLE, 'Isola a sud della penisola, al centro del Mediterraneo', 25832, 4790000, 'Mar Tirreno, Mar Ionio e Mar Mediterraneo', true,
    'È la regione più estesa d\'Italia e la più grande isola del Mediterraneo. Qui si trova l\'Etna, il vulcano attivo più alto d\'Europa.');
  R('SAR', 'Sardegna', 'Cagliari', ISOLE, 'Isola a ovest della penisola, nel Mar Mediterraneo', 24100, 1560000, 'Mar Tirreno e Mar di Sardegna', true,
    'È la seconda isola del Mediterraneo per estensione. È famosa per il mare cristallino e per i nuraghi, antiche torri di pietra costruite più di 3000 anni fa.');

  const regDi = Object.fromEntries(P.map(p => [p.id, p]));
  // [id, nome, regione, livello, lat, lon, curiosità]
  const C = (id, nome, reg, liv, lat, lon, chicca) =>
    P.push({ id: 'c_' + id, nome, citta: true, reg, liv, area: regDi[reg].area, capR: regDi[reg].cap === nome, ll: [lat, lon], chicca: chicca || '' });

  // Piemonte
  C('to', 'Torino', 'PIE', 1, 45.070, 7.686, 'Fu la prima capitale del Regno d\'Italia (1861-1865). Il suo simbolo è la Mole Antonelliana.');
  C('al', 'Alessandria', 'PIE', 2, 44.913, 8.615, 'Sorge nella pianura tra i fiumi Tanaro e Bormida.');
  C('no', 'Novara', 'PIE', 2, 45.446, 8.622, 'È al centro di una zona famosa per le risaie.');
  C('cn', 'Cuneo', 'PIE', 3, 44.384, 7.543, 'Il nome viene dalla sua forma a cuneo, tra due fiumi.');
  C('at', 'Asti', 'PIE', 3, 44.900, 8.207, 'È famosa per i vini delle colline del Monferrato.');
  C('bi', 'Biella', 'PIE', 3, 45.566, 8.054, 'È nota da secoli per la lavorazione della lana.');
  C('vc', 'Vercelli', 'PIE', 3, 45.320, 8.419, 'È la «capitale» del riso: intorno alla città si estendono le risaie.');
  C('vb', 'Verbania', 'PIE', 3, 45.922, 8.552, 'Si affaccia sul Lago Maggiore.');
  // Valle d'Aosta
  C('ao', 'Aosta', 'VDA', 1, 45.737, 7.315, 'Fondata dai Romani con il nome di Augusta Praetoria, conserva ancora mura e porte romane.');
  // Lombardia
  C('mi', 'Milano', 'LOM', 1, 45.464, 9.190, 'È il principale centro economico d\'Italia. Il suo Duomo è una delle chiese gotiche più grandi del mondo.');
  C('bg', 'Bergamo', 'LOM', 2, 45.698, 9.677, 'Ha una «Città alta» circondata da mura veneziane, patrimonio dell\'UNESCO.');
  C('bs', 'Brescia', 'LOM', 2, 45.541, 10.212, 'È la seconda città della Lombardia per numero di abitanti.');
  C('co', 'Como', 'LOM', 2, 45.808, 9.085, 'Si affaccia sul Lago di Como ed è famosa per la lavorazione della seta.');
  C('va', 'Varese', 'LOM', 2, 45.820, 8.825, 'È detta «città giardino» per i suoi parchi e le sue ville.');
  C('mb', 'Monza', 'LOM', 2, 45.584, 9.274, 'Nel suo grande parco si trova l\'autodromo dove si corre il Gran Premio d\'Italia di Formula 1.');
  C('pv', 'Pavia', 'LOM', 2, 45.185, 9.159, 'Sorge sul Ticino ed è sede di un\'antica università.');
  C('mn', 'Mantova', 'LOM', 2, 45.156, 10.791, 'È circondata su tre lati da laghi formati dal fiume Mincio.');
  C('cr', 'Cremona', 'LOM', 3, 45.133, 10.023, 'È la città dei violini: qui lavorava il liutaio Antonio Stradivari.');
  C('lc', 'Lecco', 'LOM', 3, 45.856, 9.398, 'È la città dei Promessi sposi di Alessandro Manzoni, sul ramo del Lago di Como.');
  C('lo', 'Lodi', 'LOM', 3, 45.314, 9.503, 'Sorge sul fiume Adda, nella pianura lombarda.');
  C('so', 'Sondrio', 'LOM', 3, 46.170, 9.872, 'È il capoluogo della Valtellina, una valle alpina attraversata dall\'Adda.');
  // Trentino-Alto Adige
  C('tn', 'Trento', 'TAA', 1, 46.067, 11.121, 'Nel Cinquecento ospitò il Concilio di Trento, uno dei più importanti della storia della Chiesa.');
  C('bz', 'Bolzano', 'TAA', 2, 46.498, 11.354, 'È una città bilingue: i cartelli sono scritti in italiano e in tedesco.');
  // Veneto
  C('ve', 'Venezia', 'VEN', 1, 45.438, 12.327, 'È la città sull\'acqua: ci si muove a piedi o in barca, lungo canali come il Canal Grande.');
  C('vr', 'Verona', 'VEN', 2, 45.438, 10.992, 'È la città di Romeo e Giulietta; nella sua Arena romana si tengono ancora spettacoli.');
  C('pd', 'Padova', 'VEN', 2, 45.406, 11.876, 'Ha una delle università più antiche del mondo (1222) e la Basilica di Sant\'Antonio.');
  C('vi', 'Vicenza', 'VEN', 2, 45.548, 11.546, 'È la città dell\'architetto Andrea Palladio, che vi costruì palazzi e ville famosi.');
  C('tv', 'Treviso', 'VEN', 2, 45.667, 12.245, 'È attraversata da canali e dal fiume Sile.');
  C('bl', 'Belluno', 'VEN', 3, 46.140, 12.217, 'Sorge sul Piave, circondata dalle Dolomiti.');
  C('ro', 'Rovigo', 'VEN', 3, 45.070, 11.790, 'Si trova nel Polesine, la pianura tra il Po e l\'Adige.');
  // Friuli-Venezia Giulia
  C('ts', 'Trieste', 'FVG', 1, 45.650, 13.777, 'È un grande porto sull\'Adriatico: fu a lungo il porto principale dell\'Impero austro-ungarico.');
  C('ud', 'Udine', 'FVG', 2, 46.063, 13.235, 'È la città più grande del Friuli.');
  C('pn', 'Pordenone', 'FVG', 3, 45.956, 12.660, 'Sorge nella pianura friulana, sul fiume Noncello.');
  C('go', 'Gorizia', 'FVG', 3, 45.941, 13.622, 'È attaccata alla città slovena di Nova Gorica: nel 2025 sono state insieme Capitale europea della cultura.');
  // Liguria
  C('ge', 'Genova', 'LIG', 1, 44.405, 8.946, 'Ha uno dei porti più importanti del Mediterraneo. Qui è nato Cristoforo Colombo.');
  C('sp', 'La Spezia', 'LIG', 2, 44.102, 9.824, 'Si affaccia sul Golfo dei Poeti, vicino alle Cinque Terre.');
  C('sv', 'Savona', 'LIG', 3, 44.309, 8.477, 'È un porto della Riviera di Ponente.');
  C('im', 'Imperia', 'LIG', 3, 43.889, 8.039, 'È la provincia della Riviera dei Fiori, famosa per l\'olio d\'oliva.');
  // Emilia-Romagna
  C('bo', 'Bologna', 'EMR', 1, 44.494, 11.343, 'Ha l\'università più antica del mondo occidentale (1088) ed è famosa per i suoi portici.');
  C('mo', 'Modena', 'EMR', 2, 44.647, 10.925, 'È famosa per l\'aceto balsamico e per le automobili sportive.');
  C('pr', 'Parma', 'EMR', 2, 44.801, 10.328, 'È nota in tutto il mondo per il prosciutto e il formaggio Parmigiano Reggiano.');
  C('re', 'Reggio Emilia', 'EMR', 2, 44.698, 10.631, 'Qui nel 1797 nacque il tricolore, la bandiera italiana.');
  C('fe', 'Ferrara', 'EMR', 2, 44.838, 11.620, 'È circondata da mura rinascimentali ed è detta la «città delle biciclette».');
  C('ra', 'Ravenna', 'EMR', 2, 44.418, 12.204, 'Fu capitale dell\'Impero romano d\'Occidente; è famosa per i mosaici bizantini.');
  C('rn', 'Rimini', 'EMR', 2, 44.060, 12.566, 'È una delle località balneari più famose della riviera adriatica.');
  C('pc', 'Piacenza', 'EMR', 2, 45.052, 9.693, 'Sorge sul Po, al confine con la Lombardia.');
  C('fc', 'Forlì', 'EMR', 3, 44.222, 12.041, 'È capoluogo, insieme a Cesena, della provincia di Forlì-Cesena.');
  // Toscana
  C('fi', 'Firenze', 'TOS', 1, 43.770, 11.255, 'È la culla del Rinascimento: vi lavorarono artisti come Michelangelo, Leonardo e Brunelleschi.');
  C('pi', 'Pisa', 'TOS', 2, 43.716, 10.402, 'È famosa in tutto il mondo per la sua Torre pendente.');
  C('li', 'Livorno', 'TOS', 2, 43.548, 10.311, 'È il principale porto della Toscana.');
  C('lu', 'Lucca', 'TOS', 2, 43.843, 10.505, 'È circondata da mura rinascimentali così larghe che ci si passeggia sopra.');
  C('si', 'Siena', 'TOS', 2, 43.318, 11.331, 'Nella sua Piazza del Campo si corre il Palio, una famosa corsa di cavalli.');
  C('ar', 'Arezzo', 'TOS', 2, 43.463, 11.880, 'È famosa per la lavorazione dell\'oro.');
  C('po', 'Prato', 'TOS', 2, 43.880, 11.097, 'È uno dei centri più importanti d\'Europa per la lavorazione dei tessuti.');
  C('pt', 'Pistoia', 'TOS', 3, 43.933, 10.917, 'È famosa per i vivai di piante e fiori.');
  C('gr', 'Grosseto', 'TOS', 3, 42.760, 11.114, 'È il capoluogo della Maremma.');
  C('ms', 'Massa', 'TOS', 3, 44.035, 10.140, 'Ai piedi delle Alpi Apuane, da cui si estrae il marmo di Carrara.');
  // Umbria
  C('pg', 'Perugia', 'UMB', 1, 43.112, 12.389, 'È una città medievale su un colle. Ha un\'Università per stranieri, dove si viene a studiare l\'italiano.');
  C('tr', 'Terni', 'UMB', 2, 42.563, 12.643, 'Vicino alla città si trova la Cascata delle Marmore, una delle più alte d\'Europa.');
  // Marche
  C('an', 'Ancona', 'MAR', 1, 43.616, 13.519, 'È un porto sull\'Adriatico, con traghetti per la Croazia e la Grecia.');
  C('pu', 'Pesaro', 'MAR', 2, 43.910, 12.913, 'È la città natale del compositore Gioachino Rossini. È capoluogo di provincia insieme a Urbino.');
  C('mc', 'Macerata', 'MAR', 3, 43.300, 13.453, 'Nel suo Sferisterio, un grande teatro all\'aperto, si tiene un famoso festival d\'opera.');
  C('ap', 'Ascoli Piceno', 'MAR', 3, 42.854, 13.575, 'È famosa per le olive ripiene fritte, dette «olive all\'ascolana».');
  C('fm', 'Fermo', 'MAR', 3, 43.160, 13.718, 'Sorge su un colle a pochi chilometri dal mare Adriatico.');
  // Lazio
  C('rm', 'Roma', 'LAZ', 1, 41.893, 12.483, 'È la capitale d\'Italia, detta «la Città eterna». Qui si trovano il Colosseo e la Città del Vaticano.');
  C('lt', 'Latina', 'LAZ', 2, 41.467, 12.904, 'È una città giovane: fu fondata nel 1932, dopo la bonifica delle paludi dell\'Agro Pontino.');
  C('vt', 'Viterbo', 'LAZ', 3, 42.420, 12.108, 'È detta la «città dei Papi»: nel Medioevo fu per alcuni anni sede papale.');
  C('fr', 'Frosinone', 'LAZ', 3, 41.640, 13.350, 'È il capoluogo della Ciociaria.');
  C('ri', 'Rieti', 'LAZ', 3, 42.404, 12.857, 'È considerata il centro geografico d\'Italia.');
  // Abruzzo
  C('aq', 'L\'Aquila', 'ABR', 1, 42.350, 13.399, 'È circondata dalle montagne del Gran Sasso. Fu duramente colpita dal terremoto del 2009.');
  C('pe', 'Pescara', 'ABR', 2, 42.461, 14.214, 'È la città più popolosa dell\'Abruzzo e sorge alla foce del fiume Pescara.');
  C('ch', 'Chieti', 'ABR', 3, 42.351, 14.168, 'È una delle città più antiche d\'Italia, su un colle vicino al mare.');
  C('te', 'Teramo', 'ABR', 3, 42.659, 13.704, 'Sorge tra il Gran Sasso e il mare Adriatico.');
  // Molise
  C('cb', 'Campobasso', 'MOL', 1, 41.561, 14.668, 'È il capoluogo del Molise, nell\'interno appenninico, dominato dal Castello Monforte.');
  C('is', 'Isernia', 'MOL', 3, 41.596, 14.233, 'Vicino alla città si trova uno dei più antichi insediamenti umani d\'Europa.');
  // Campania
  C('na', 'Napoli', 'CAM', 1, 40.852, 14.268, 'Si affaccia sull\'omonimo golfo, di fronte al Vesuvio. È la città della pizza.');
  C('sa', 'Salerno', 'CAM', 2, 40.683, 14.768, 'Nel Medioevo ospitò la Scuola medica salernitana, la prima scuola di medicina d\'Europa.');
  C('ce', 'Caserta', 'CAM', 2, 41.074, 14.333, 'È famosa per la Reggia, il palazzo dei re di Napoli, con un enorme parco.');
  C('av', 'Avellino', 'CAM', 3, 40.914, 14.790, 'Sorge nell\'Irpinia, una zona di colline e montagne.');
  C('bn', 'Benevento', 'CAM', 3, 41.130, 14.782, 'Conserva un grande arco romano, l\'Arco di Traiano.');
  // Puglia
  C('ba', 'Bari', 'PUG', 1, 41.117, 16.872, 'È un grande porto sull\'Adriatico. Nella sua basilica sono custodite le reliquie di San Nicola.');
  C('ta', 'Taranto', 'PUG', 2, 40.464, 17.247, 'Si affaccia sull\'omonimo golfo, nel Mar Ionio; fu fondata dagli antichi Greci.');
  C('le', 'Lecce', 'PUG', 2, 40.352, 18.172, 'È detta la «Firenze del Sud» per le sue chiese barocche in pietra leccese.');
  C('fg', 'Foggia', 'PUG', 2, 41.462, 15.544, 'È al centro del Tavoliere delle Puglie, la grande pianura coltivata a grano.');
  C('br', 'Brindisi', 'PUG', 2, 40.632, 17.936, 'Qui finiva la Via Appia, l\'antica strada che partiva da Roma.');
  C('bt', 'Barletta', 'PUG', 3, 41.320, 16.282, 'È capoluogo, insieme ad Andria e Trani, della provincia di Barletta-Andria-Trani.');
  // Basilicata
  C('pz', 'Potenza', 'BAS', 1, 40.640, 15.806, 'È il capoluogo di regione più alto d\'Italia: si trova a circa 800 metri sul livello del mare.');
  C('mt', 'Matera', 'BAS', 2, 40.666, 16.604, 'È famosa per i Sassi, antiche case scavate nella roccia, patrimonio dell\'UNESCO.');
  // Calabria
  C('cz', 'Catanzaro', 'CAL', 1, 38.905, 16.594, 'Sorge nel punto più stretto della penisola: tra il Mar Tirreno e il Mar Ionio ci sono solo circa 30 km.');
  C('rc', 'Reggio Calabria', 'CAL', 2, 38.111, 15.647, 'È affacciata sullo Stretto di Messina. Nel suo museo si trovano i Bronzi di Riace.');
  C('cs', 'Cosenza', 'CAL', 2, 39.300, 16.251, 'Sorge alla confluenza dei fiumi Crati e Busento, ai piedi della Sila.');
  C('kr', 'Crotone', 'CAL', 3, 39.081, 17.127, 'Fu una colonia greca: qui visse il matematico Pitagora.');
  C('vv', 'Vibo Valentia', 'CAL', 3, 38.676, 16.101, 'Domina dall\'alto la costa tirrenica della Calabria.');
  // Sicilia
  C('pa', 'Palermo', 'SIC', 1, 38.116, 13.361, 'Fu capitale di un regno per secoli: le sue chiese e i suoi palazzi mescolano arte araba, normanna e barocca.');
  C('ct', 'Catania', 'SIC', 2, 37.502, 15.087, 'Sorge ai piedi dell\'Etna ed è stata ricostruita più volte dopo eruzioni e terremoti.');
  C('me', 'Messina', 'SIC', 2, 38.193, 15.554, 'Si affaccia sullo Stretto che porta il suo nome, di fronte alla Calabria.');
  C('sr', 'Siracusa', 'SIC', 2, 37.075, 15.287, 'Fu una delle più grandi città greche: qui visse lo scienziato Archimede.');
  C('ag', 'Agrigento', 'SIC', 2, 37.311, 13.577, 'È famosa per la Valle dei Templi, con templi greci di più di 2400 anni fa.');
  C('tp', 'Trapani', 'SIC', 3, 38.018, 12.514, 'Di fronte alla città si trovano le Isole Egadi; è famosa per le saline.');
  C('rg', 'Ragusa', 'SIC', 3, 36.926, 14.725, 'Fu ricostruita in stile barocco dopo il terremoto del 1693.');
  C('cl', 'Caltanissetta', 'SIC', 3, 37.490, 14.062, 'Fu un importante centro per l\'estrazione dello zolfo.');
  C('en', 'Enna', 'SIC', 3, 37.567, 14.279, 'È il capoluogo di provincia più alto d\'Italia (quasi 1000 metri) ed è detta «l\'ombelico della Sicilia».');
  // Sardegna (i quattro capoluoghi storici: l'organizzazione delle province sarde è cambiata più volte)
  C('ca', 'Cagliari', 'SAR', 1, 39.224, 9.122, 'Si affaccia sul golfo omonimo; nei suoi stagni vivono i fenicotteri rosa.');
  C('ss', 'Sassari', 'SAR', 2, 40.727, 8.560, 'È la seconda città della Sardegna per numero di abitanti.');
  C('nu', 'Nuoro', 'SAR', 3, 40.321, 9.331, 'È la città della scrittrice Grazia Deledda, premio Nobel per la letteratura nel 1926.');
  C('or', 'Oristano', 'SAR', 3, 39.904, 8.592, 'Ogni anno a Carnevale ospita la Sartiglia, una giostra a cavallo.');

  // province di ogni regione (dai capoluoghi)
  P.filter(p => !p.citta).forEach(r => { r.prov = P.filter(c => c.citta && c.reg === r.id).map(c => c.nome); });
  window.PAESI_ITALIA = P;
  window.AREE_ITALIA = [NORD, CENTRO, SUD, ISOLE];
})();
