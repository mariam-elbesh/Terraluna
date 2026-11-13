/* View: results */
V.results = {
  h: () => `<section class="wrap">
    <h2>EARTH ANALOGS FOUND</h2>
    <p class="mu">Ranked by weighted similarity for <b>${S.targetName || S.body}</b> (${S.body} · ${S.profile}).</p>
    <div class="g2" style="margin-top:20px;align-items:stretch">
      ${SITES.map((s, i) => `<div class="card k" onclick="S.site=${i};location.hash='#site'" style="--a:${s.a};--b:${s.b}">
        ${landImg(s)}
        <div style="display:flex;gap:16px;align-items:center;margin-top:14px">
          ${ring(s.s)}
          <div>
            <b>${s.n.toUpperCase()}</b>
            <div class="mu" style="font-size:12px">${s.c} · ${s.co}</div>
            <div style="margin-top:6px">${s.t.map(t => `<span class="tg">${t}</span>`).join('')}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </section>`,
  m: async () => {
    if (!SITES.length) {
      await ensureBackendData();
      await runMatchingApi();
      if (location.hash === '#results') $('#app').innerHTML = `<div class="v">${V.results.h()}${foot()}</div>`;
    }
  }
};
