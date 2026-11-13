/* ---------- helpers ---------- */
const ring=(v,big)=>`<div class="ring ${big?'big':''}" style="--p:${v}"><div>${v.toFixed(1)}%<small>ANALOG MATCH</small></div></div>`;
const bars=(a,v)=>a.map((x,i)=>`<div class="bar"><span>${FN[i]}</span><u><i style="--w:${x}%"></i></u><em>${x}%</em></div>`).join('');
const foot=()=>`<footer><div class="wrap"><div><b style="color:var(--tx);letter-spacing:.2em">◎ TERRALUNA</b><br>Earth Analog Intelligence for Humanity’s Next Worlds.</div><div><a href="#destination">Explore</a><a href="#results">Analogs</a><a href="#method">Methodology</a><a href="#about">About</a></div><div>© 2026 TerraLuna · NASA Space Apps Challenge</div></div></footer>`;
function clearMatchState() {
  S.targetRegionId = null;
  S.targetName = '';
  S.lat = null;
  S.lon = null;
  S.targetFeatures = null;
  S.analysisResponse = null;
  S.site = 0;
  SITES = [];
}

function pick(body) {
  if (S.body !== body) clearMatchState();
  S.body = body;
  location.hash = '#profile';
}

function pickProfile(profile) {
  if (S.profile !== profile) {
    S.profile = profile;
    S.analysisResponse = null;
    S.site = 0;
    SITES = [];
  }
  location.hash = '#explorer';
}

const V={};
