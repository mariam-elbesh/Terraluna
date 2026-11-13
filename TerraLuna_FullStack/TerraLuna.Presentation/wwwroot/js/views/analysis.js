/* View: analysis — executes real POST /api/match scoring on ASP.NET Core */
V.analysis = {
  h: () => `<section class="wrap c">
    <h2>ANALYZING PLANETARY CONDITIONS</h2>
    <p class="mu">Running ASP.NET Core matching engine for <b>${S.targetName || S.body}</b> (${S.profile})…</p>
    <div class="g2" style="margin-top:24px">
      <div id="ap" class="pl" style="max-width:380px;margin:auto"></div>
      <div style="text-align:left">
        ${['Terrain', 'Geology', 'Thermal', 'Aridity', 'Slope', 'Isolation'].map(s => `<div class="st"><div class="ic">◈</div>Analyzing ${s}</div>`).join('')}
        <p style="font-size:34px;font-weight:600;margin-top:14px" id="cnt">0</p>
        <p class="mu">EARTH ANALOG SITES EVALUATED</p>
      </div>
    </div>
  </section>`,
  m: async () => {
    planet($('#ap'), S.body.toLowerCase(), { sp: .006 });
    const st = document.querySelectorAll('.st');
    st.forEach((e, i) => TM.push(setTimeout(() => e.classList.add('d'), 500 * (i + 1))));

    const started = performance.now();
    const resp = await runMatchingApi();
    if (!resp) {
      const count = $('#cnt');
      if (count) count.textContent = '—';
      const note = document.querySelector('.mu:last-child');
      if (note) note.textContent = 'Unable to reach the matching service. Please return to Explorer and try again.';
      return;
    }

    const total = Math.max(0, Number(resp.totalSitesAnalyzed) || 0);
    const duration = Math.max(700, Math.min(2400, total * 115));
    await new Promise(resolve => {
      const tick = now => {
        const progress = Math.min(1, (now - started) / duration);
        const count = $('#cnt');
        if (count) count.textContent = Math.round(total * progress).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick); else resolve();
      };
      requestAnimationFrame(tick);
    });
    if (location.hash === '#analysis') location.hash = '#results';
  }
};
