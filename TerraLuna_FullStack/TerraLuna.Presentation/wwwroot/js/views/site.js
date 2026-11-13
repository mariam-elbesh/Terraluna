/* View: site */
V.site = {
  h: () => {
    const s = SITES[S.site] || SITES[0];
    if (!s) return `<section class="wrap"><p class="mu">Loading site details…</p></section>`;
    return `<section class="wrap">
      <div class="g2" style="align-items:stretch">
        <div class="card" style="--a:${s.a};--b:${s.b}">
          ${landImg(s, 'l')}
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;gap:12px">
            <div>
              <h2>${s.n.toUpperCase()}</h2>
              <div class="mu">${s.c} · ${s.co}</div>
              ${s.photoCredit ? `<div class="mu" style="font-size:11px;margin-top:2px">Image: <a href="${s.photoCredit.source}" target="_blank" rel="noopener noreferrer" style="color:var(--ac2)">${s.photoCredit.author} · ${s.photoCredit.license}</a></div>` : ''}
              <div class="mu" style="font-size:12px;margin-top:4px">${s.env} · Elev: ${s.elevation} m · Slope: ${s.slope}° · Mean Temp: ${s.temp}°C</div>
              <div style="margin-top:8px">${s.t.map(t => `<span class="tg">${t}</span>`).join('')}</div>
            </div>
            ${ring(s.s, 1)}
          </div>
        </div>
        <div class="card">
          <p class="eyebrow">Environmental factors</p>
          ${bars(s.f)}
          <div class="row" style="margin-top:14px"><span>Geology</span><b>${s.geology}</b></div>
          <div class="row"><span>Aridity</span><b>${s.aridity}</b></div>
          <div class="row"><span>Source</span><b><a href="${s.url}" target="_blank" style="color:var(--ac2)">${s.ref} ↗</a></b></div>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <p class="eyebrow">Why this site?</p>
        <p class="mu" style="margin:8px 0 16px">${s.why}</p>
        <a class="btn" href="#compare">VIEW COMPARISON →</a>
      </div>
    </section>`;
  }
};
