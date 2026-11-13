const $ = s => document.querySelector(s);
let TM = [];

const API_BASE = '/api';

const S = {
  body: 'Moon',
  profile: 'Permanent Habitat',
  site: 0,
  layer: 'Terrain',
  targetRegionId: 'moon-shackleton',
  targetName: 'Shackleton Crater Rim',
  lat: -89.9,
  lon: 0.0,
  targetFeatures: { terrain: 84, geology: 80, thermal: 92, aridity: 98, slope: 76, isolation: 95 },
  analysisResponse: null,
  planets: [],
  missions: [],
  targets: [],
  sites: [],
  methodology: null,
  team: [],
  ready: false
};

const FN = ['Terrain', 'Geology', 'Thermal', 'Aridity', 'Slope', 'Isolation'];
let W = [0.20, 0.15, 0.25, 0.10, 0.10, 0.20];
let SITES = [];
const IMG_CREDITS = {
  atacama: { author: 'L. Honnorat / ESO', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Atacama_Desert_Landscape_(iced_moment_870-CC).jpg' },
  haughton: { author: 'Denni', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Haughton_impact_crater_radar_image.jpg' },
  'death-valley': { author: 'Brocken Inaglory', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Mesquite_Sand_Dunes_in_Death_Valley.jpg' },
  mcmurdo: { author: 'owamux', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Taylor_Valley,_Antarctica.jpg' },
  'mauna-kea': { author: 'Vadim Kurland', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Mauna_Kea_from_the_ocean.jpg' },
  'iceland-holuhraun': { author: 'Michael Ryan / USGS', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Askja.jpg' },
  'rio-tinto': { author: 'Carol Stoker / NASA', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Rio_tinto_river_CarolStoker_NASA_Ames_Research_Center.jpg' },
  'lonar-crater': { author: 'Aditya Laghate', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Lonar_Crater,_Panorama.jpg' },
  'ladakh-puga': { author: 'Timothy A. Gonsalves', license: 'See source page', source: 'https://commons.wikimedia.org/wiki/File:Road_Padum_Zanskar_Range_Jun24_A7CR_00818.jpg' },
  'thar-desert': { author: 'Sushmita Balasubramani', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Thar_desert_Rajasthan_India.jpg' },
  'deccan-traps': { author: 'GeoDIL', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Basalts_of_Deccan_Traps_(GeoDIL_number_-_88).jpg' },
  'sambhar-lake': { author: 'Kalidas Singh', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Sambhar_lake_a_salted_bed.jpg' }
};
let matchRequestVersion = 0;
let PROF = [
  ['⌂', 'Permanent Habitat', 'Find locations suitable for long-duration base operations and living conditions.', ['Thermal', 'Terrain', 'Isolation', 'Geology']],
  ['⚙', 'Rover Operations', 'Identify sites for testing and operating robotic and manned vehicles.', ['Terrain', 'Slope', 'Geology', 'Thermal']],
  ['✦', 'Scientific Research', 'Find environments for geological and scientific studies.', ['Geology', 'Terrain', 'Aridity', 'Thermal']],
  ['⛏', 'Surface Operations', 'Locate areas for testing equipment and surface operations.', ['Terrain', 'Slope', 'Thermal', 'Aridity']]
];

function mapResultToSite(r) {
  const f = r.factorBreakdown ? r.factorBreakdown.map(b => Math.round(b.earthValue)) : [85, 85, 85, 85, 85, 85];
  const tv = r.factorBreakdown ? r.factorBreakdown.map(b => Math.round(b.targetValue)) : [85, 85, 85, 85, 85, 85];
  return {
    id: r.id,
    n: r.name,
    c: r.country,
    co: r.coordinates,
    env: r.environmentType,
    t: r.tags || [],
    f,
    tv,
    s: r.analogScore,
    a: r.colorA || '#e8b88a',
    b: r.colorB || '#a4512f',
    why: r.whyThisSite,
    desc: r.description,
    geology: r.geologyType,
    aridity: r.aridityIndex,
    elevation: r.elevationM,
    slope: r.slopeDeg,
    temp: r.meanTempC,
    ref: r.nasaReference,
    url: r.sourceUrl,
    similarities: r.keySimilarities || [],
    breakdown: r.factorBreakdown || [],
    photoCredit: IMG_CREDITS[r.id]
  };
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json();
}

async function apiPost(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json();
}

async function ensureBackendData() {
  if (S.ready) return;
  try {
    const [planets, missions, targets, methodology, team] = await Promise.all([
      apiGet('/planets'),
      apiGet('/missions'),
      apiGet('/targets'),
      apiGet('/methodology'),
      apiGet('/team')
    ]);
    S.planets = planets;
    S.missions = missions;
    S.targets = targets;
    S.methodology = methodology;
    S.team = team;

    if (missions.length) {
      PROF = missions.map(m => [m.icon, m.name, m.description, m.keyFactors]);
    }
    S.ready = true;
  } catch (err) {
    console.warn('Backend API unreachable or still starting:', err);
  }
}

async function runMatchingApi() {
  const requestVersion = ++matchRequestVersion;
  try {
    const payload = {
      planet: S.body,
      missionProfile: S.profile,
      targetRegionId: S.targetRegionId || null,
      targetRegionName: S.targetName || null,
      latitude: S.lat,
      longitude: S.lon,
      targetFeatures: S.targetFeatures
    };
    const resp = await apiPost('/match', payload);
    // Ignore an older response that arrives after the user has made a new selection.
    if (requestVersion !== matchRequestVersion) return null;
    S.analysisResponse = resp;
    if (resp.weightsUsed) {
      const w = resp.weightsUsed;
      W = [w.terrain, w.geology, w.thermal, w.aridity, w.slope, w.isolation];
    }
    SITES = Array.isArray(resp.results) ? resp.results.map(mapResultToSite) : [];
    S.site = 0;
    loadSiteImages(SITES);
    return resp;
  } catch (err) {
    if (requestVersion === matchRequestVersion) S.analysisResponse = null;
    console.warn('Matching API failed:', err);
    return null;
  }
}

/* ---------- Real photos for Earth analog sites (Wikipedia / Wikimedia Commons) ---------- */
/* Override any site with a fixed photo: put its direct URL in IMG_FIXED['site-id']. */
const IMG_FIXED = {
  'deccan-traps': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Basalts_of_Deccan_Traps_%28GeoDIL_number_-_88%29.jpg'
};
const IMG_QUERY = {
  'atacama': 'Atacama Desert',
  'haughton': 'Haughton impact structure',
  'death-valley': 'Death Valley National Park',
  'mcmurdo': 'McMurdo Dry Valleys',
  'mauna-kea': 'Mauna Kea',
  'iceland-holuhraun': 'Askja',
  'rio-tinto': 'Rio Tinto river Spain Huelva',
  'lonar-crater': 'Lonar crater',
  'ladakh-puga': 'Ladakh',
  'deccan-traps': 'Deccan Traps',
  'thar-desert': 'Thar Desert',
  'sambhar-lake': 'Sambhar Lake',
  'ibn-battuta': 'Ibn Battuta Centre Morocco',
  'gorgona-island': 'Gorgona Island Colombia',
  'east-uweinat-kamil': 'Gebel Kamil crater Egypt',
  'gebel-qatrani': 'Gebel Qatrani Fayoum basalt'
};
const imgCache = JSON.parse(localStorage.getItem('tl_imgs') || '{}');

async function fetchSiteImage(site) {
  if (IMG_FIXED[site.id]) return IMG_FIXED[site.id];
  if (imgCache[site.id]) return imgCache[site.id];
  const q = IMG_QUERY[site.id] || `${site.n} ${site.c}`;
  const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search'
    + `&gsrsearch=${encodeURIComponent(q)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=1000`;
  const r = await fetch(url);
  const j = await r.json();
  const pages = j.query && j.query.pages ? Object.values(j.query.pages) : [];
  const src = pages[0] && pages[0].thumbnail && pages[0].thumbnail.source;
  if (src) { imgCache[site.id] = src; localStorage.setItem('tl_imgs', JSON.stringify(imgCache)); }
  return src || null;
}

function applySiteImage(site) {
  document.querySelectorAll(`[data-sid="${site.id}"]`).forEach(el => {
    el.style.backgroundImage = `url('${site.img}')`;
    el.classList.add('has');
  });
}

function tryImg(src) {
  return new Promise(res => { const im = new Image(); im.onload = () => res(src); im.onerror = () => res(null); im.src = src; });
}

/* Local file first (wwwroot/img/<site-id>.jpg), then Wikipedia as a fallback. */
function loadSiteImages(list) {
  list.forEach(async site => {
    try {
      let src = IMG_FIXED[site.id]
        ? await tryImg(IMG_FIXED[site.id])
        : await tryImg(`img/${site.id}.jpg`);
      if (!src && !IMG_FIXED[site.id]) { const w = await fetchSiteImage(site); if (w) src = await tryImg(w); }
      if (src) { site.img = src; applySiteImage(site); }
    } catch (e) { console.warn('Image lookup failed for', site.id, e); }
  });
}

/* placeholder gradient first, replaced by the photo when it loads */
function landImg(s, cls = '') {
  const has = s.img ? ` has" style="background-image:url('${s.img}')` : '';
  return `<div class="land ${cls}${has}" data-sid="${s.id}"></div>`;
}
