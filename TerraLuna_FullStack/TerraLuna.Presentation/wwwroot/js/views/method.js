/* View: method */
V.method = {
  h: () => {
    const sources = S.methodology?.dataSources || [
      { name: 'NASA Moon Fact Sheet', description: 'Official lunar gravity, temperature, topography, and exosphere parameters', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html' },
      { name: 'NASA Mars Fact Sheet', description: 'Official Martian gravity, atmospheric pressure, solar irradiance, and climate parameters', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html' },
      { name: 'NASA Planetary Analogs', description: 'Official NASA Earth terrestrial analog field sites', url: 'https://science.nasa.gov/solar-system/planetary-analogs/' }
    ];
    return `<section class="wrap">
      <h2>HOW TERRALUNA WORKS</h2>
      <p class="mu">From NASA planetary datasets to terrestrial analog scoring.</p>
      <div class="g4" style="margin:20px 0">
        ${['Select Destination (Moon / Mars)', 'Define Mission Profile', 'Select NASA Target Region', 'Compute Weighted Analog Score'].map((t, i) => `<div class="card"><div class="ic">${i + 1}</div><p style="margin-top:10px">${t}</p></div>`).join('')}
      </div>
      <div class="g2" style="align-items:stretch">
        <div class="card">
          <p class="eyebrow">Analog score formula (${S.profile})</p>
          <p style="margin:10px 0">Score = Σ (Factor Similarity × Weight)</p>
          <table>${FN.map((f, i) => `<tr><td>${f}</td><td style="text-align:right">× ${W[i].toFixed(2)}</td></tr>`).join('')}</table>
          <p class="mu" style="font-size:12px;margin-top:10px">The weighting is a prototype methodology developed by the Orbital Minds team and is not an official NASA scoring system.</p>
        </div>
        <div class="card">
          <p class="eyebrow">NASA & Scientific Data Sources</p>
          ${sources.map(d => `<div class="row" style="display:block;padding:10px 0"><b><a href="${d.url}" target="_blank" style="color:var(--ac2)">${d.name} ↗</a></b><br><span>${d.description}</span></div>`).join('')}
        </div>
      </div>
    </section>`;
  },
  m: async () => { await ensureBackendData(); }
};
