/* View: compare */
V.compare = {
  h: () => {
    const s = SITES[S.site] || SITES[0];
    if (!s) return `<section class="wrap"><p class="mu">Loading comparison…</p></section>`;
    const tv = s.tv || s.f;
    const sims = s.similarities && s.similarities.length
      ? s.similarities.map(k => [k.factor, k.summary])
      : [['Terrain', 'Comparable surface morphology and regolith characteristics.'], ['Geology', s.geology], ['Thermal', `Mean temp ${s.temp}°C (${s.aridity}).`]];

    return `<section class="wrap">
      <h2>HOW CLOSE IS THE MATCH?</h2>
      <p class="mu">Compare ${s.n} with ${S.targetName || S.body} on ${S.body}.</p>
      <div class="g2" style="margin:20px 0">
        <div class="card" style="--a:${s.a};--b:${s.b}"><p class="eyebrow">Earth analog</p>${landImg(s)}<b>${s.n}</b></div>
        <div class="c">${ring(s.s, 1)}</div>
        <div class="card"><p class="eyebrow">Target region</p><div class="land" style="background:url(${TX(S.body.toLowerCase()).toDataURL()}) center/cover"></div><b>${S.targetName || S.body} · ${S.profile}</b></div>
      </div>
      <div class="g2" style="align-items:stretch">
        <div class="card">
          <p class="eyebrow">Factor · Earth vs ${S.body}</p>
          ${FN.map((f, i) => `<div style="margin:12px 0">
            <div class="row" style="border:0;padding:0"><span>${f}</span><b>${s.f[i]}% / ${tv[i]}%</b></div>
            <div class="bar" style="grid-template-columns:1fr;margin:3px 0"><u><i style="--w:${s.f[i]}%"></i></u></div>
            <div class="bar" style="grid-template-columns:1fr;margin:3px 0"><u><i style="--w:${tv[i]}%;background:linear-gradient(90deg,#8a8aa0,#d8d8e8)"></i></u></div>
          </div>`).join('')}
        </div>
        <div class="card">
          <p class="eyebrow">Key similarities</p>
          ${sims.map(k => `<div class="row" style="display:block;padding:12px 0"><b>${k[0]}</b><br><span>${k[1]}</span></div>`).join('')}
          <p style="margin-top:14px"><a class="btn g" href="#results">← BACK TO RESULTS</a></p>
        </div>
      </div>
    </section>`;
  }
};
