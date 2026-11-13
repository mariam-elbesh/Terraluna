/* View: explorer — NASA target regions + interactive planetary map */
V.explorer = {
  h: () => {
    const planetTargets = (S.targets || []).filter(t => t.planet.toLowerCase() === S.body.toLowerCase());
    return `<section class="wrap">
      <p class="eyebrow">${S.body} · Mission: ${S.profile}</p>
      ${planetTargets.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px">
        ${planetTargets.map(t => `<button class="chip ${S.targetRegionId === t.id ? 'on' : ''}" data-tid="${t.id}" style="cursor:pointer">${t.name}</button>`).join('')}
      </div>` : ''}
      <div class="ex" style="margin-top:12px">
        <div class="card mapc">
          <canvas id="map" width="1024" height="512"></canvas>
          <i id="pin" class="pin" style="left:50%;top:50%"></i>
          <div class="chips">${['Terrain', 'Elevation', 'Slope', 'Geology', 'Illumination'].map(l => `<span class="chip ${l == S.layer ? 'on' : ''}" data-l="${l}">${l}</span>`).join('')}</div>
        </div>
        <div class="card">
          <p class="eyebrow" id="tname">Target region</p>
          <div id="info" style="margin:10px 0 16px"></div>
          <a class="btn" href="#analysis" style="width:100%;text-align:center">FIND EARTH ANALOGS →</a>
          <p class="mu" style="font-size:12px;margin-top:12px">Select a NASA candidate region above or click anywhere on the map.</p>
        </div>
      </div>
    </section>`;
  },
  m: async () => {
    await ensureBackendData();
    const b = S.body.toLowerCase(), cv = $('#map');
    cv.getContext('2d').drawImage(TX(b), 0, 0, 1024, 512);
    const F = {
      Terrain: 'none',
      Elevation: 'contrast(1.5) hue-rotate(200deg) saturate(2)',
      Slope: 'grayscale(1) contrast(2)',
      Geology: 'sepia(1) saturate(3)',
      Illumination: 'brightness(1.5) contrast(1.1)'
    };

    const planetTargets = (S.targets || []).filter(t => t.planet.toLowerCase() === b);

    const renderTarget = (t) => {
      S.targetRegionId = t.id;
      S.targetName = t.name;
      S.lat = t.latitude;
      S.lon = t.longitude;
      S.targetFeatures = t.features;
      const fx = Math.max(0.02, Math.min(0.98, (t.longitude + 180) / 360));
      const fy = Math.max(0.02, Math.min(0.98, (90 - t.latitude) / 180));
      $('#pin').style.left = (fx * 100) + '%';
      $('#pin').style.top = (fy * 100) + '%';
      $('#tname').textContent = t.name.toUpperCase();
      const R = [
        ['Coordinates', t.coordinates],
        ['Terrain', t.terrainType],
        ['Elevation', `${t.elevationM.toLocaleString()} m`],
        ['Slope', `${t.slopeDeg}°`],
        ['Thermal', t.tempRangeC],
        ['Geology', t.geologyType],
        ['Aridity', t.aridityLabel],
        ['Source', `<a href="${t.sourceUrl}" target="_blank" style="color:var(--ac2)">${t.sourceName} ↗</a>`]
      ];
      $('#info').innerHTML = R.map(r => `<div class="row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
      document.querySelectorAll('[data-tid]').forEach(btn => btn.classList.toggle('on', btn.dataset.tid === t.id));
    };

    const upCustom = (fx, fy) => {
      const p = TX(b).getContext('2d').getImageData(Math.min(511, fx * 512 | 0), Math.min(255, fy * 256 | 0), 1, 1).data;
      const v = (p[0] + p[1] + p[2]) / 765, m = S.body === 'Moon';
      const lat = 90 - fy * 180, lon = fx * 360 - 180;
      S.targetRegionId = null;
      S.targetName = `Custom ${S.body} Coordinates`;
      S.lat = Number(lat.toFixed(2));
      S.lon = Number(lon.toFixed(2));
      S.targetFeatures = {
        terrain: Math.round(70 + v * 25),
        geology: Math.round(72 + v * 22),
        thermal: m ? 90 : 86,
        aridity: m ? 96 : 93,
        slope: Math.round(92 - v * 25),
        isolation: 90
      };
      $('#tname').textContent = S.targetName.toUpperCase();
      const R = [
        ['Latitude', Math.abs(lat).toFixed(1) + '°' + (lat < 0 ? 'S' : 'N')],
        ['Longitude', Math.abs(lon).toFixed(1) + '°' + (lon < 0 ? 'W' : 'E')],
        ['Terrain', v > .5 ? 'Highlands' : m ? 'Cratered Plains' : 'Smooth Plains'],
        ['Elevation', Math.round((v - .35) * 9000) + ' m'],
        ['Slope', (v * 14).toFixed(1) + '°'],
        ['Thermal', m ? '−178°C to +117°C' : '−140°C to +20°C'],
        ['Geology', m ? (v > .5 ? 'Anorthositic' : 'Basaltic') : (v > .5 ? 'Volcanic' : 'Sedimentary')],
        ['Aridity', m ? 'Ultra-High Vacuum' : 'Hyperarid (6.36 mbar CO₂)']
      ];
      $('#info').innerHTML = R.map(r => `<div class="row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
      $('#pin').style.left = fx * 100 + '%';
      $('#pin').style.top = (fy * 100) + '%';
      document.querySelectorAll('[data-tid]').forEach(btn => btn.classList.remove('on'));
    };

    if (planetTargets.length) {
      const initial = planetTargets.find(t => t.id === S.targetRegionId) || planetTargets[0];
      renderTarget(initial);
    } else {
      upCustom(.56, .28);
    }

    document.querySelectorAll('[data-tid]').forEach(btn => {
      btn.onclick = () => {
        const found = planetTargets.find(t => t.id === btn.dataset.tid);
        if (found) renderTarget(found);
      };
    });

    cv.onclick = e => {
      const r = cv.getBoundingClientRect();
      upCustom((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    };

    document.querySelectorAll('.chip[data-l]').forEach(c => c.onclick = () => {
      S.layer = c.dataset.l;
      document.querySelectorAll('.chip[data-l]').forEach(x => x.classList.toggle('on', x == c));
      cv.style.filter = F[S.layer];
    });
  }
};
