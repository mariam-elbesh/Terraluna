/* View: about */
V.about = {
  h: () => {
    const team = (S.team && S.team.length) ? S.team : [
      { name: 'Rawan Alsaid Alsedek', role: 'Full Stack & Backend Lead', responsibility: 'ASP.NET Core Web API, Matching Engine & Integration' },
      { name: 'Nada Elhenawy', role: 'Frontend Developer', responsibility: 'UI/UX Design & Interactive Frontend' },
      { name: 'Mariam Elbesh', role: 'Frontend & AI Developer', responsibility: 'UI/UX Design, Frontend Development & AI Integration' },
      { name: 'Aesha Mohamed', role: 'Earth & Moon Specialist', responsibility: 'Earth analog sites, lunar environments & mission data' },
      { name: 'Rowan Elbosaty', role: 'Earth & Mars Specialist', responsibility: 'Earth analog sites, Martian environments & mission data' },
      { name: 'Hannah Eldeeb', role: 'Mathematician', responsibility: 'Normalization, Weights & Scoring Model' }
    ];
    return `<section class="wrap">
      <p class="eyebrow">Team Orbital Minds · 2026 NASA Space Apps Challenge</p>
      <h2>BUILT TO PREPARE EARTH FOR THE NEXT WORLDS.</h2>
      <p class="mu" style="max-width:640px">TerraLuna helps scientists, engineers and mission planners identify Earth terrestrial analog sites to test technologies, methods, and operations for future Moon and Mars missions.</p>
      <p class="eyebrow" style="margin:28px 0 12px">The team</p>
      <div class="g4">${team.map(t => `<div class="card"><div class="av">${t.name[0]}</div><b>${t.name}</b><div style="color:var(--ac2);font-size:13px">${t.role}</div><div class="mu" style="font-size:12px">${t.responsibility}</div></div>`).join('')}</div>
    </section>`;
  },
  m: async () => { await ensureBackendData(); }
};
