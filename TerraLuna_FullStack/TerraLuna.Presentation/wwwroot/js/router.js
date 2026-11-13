async function go() {
  await ensureBackendData();
  const k = location.hash.slice(1) || 'home', v = V[k] || V.home;
  TM.forEach(t => { clearTimeout(t); clearInterval(t); });
  TM = [];
  $('#app').innerHTML = `<div class="v">${v.h()}${foot()}</div>`;
  scrollTo(0, 0);
  v.m && v.m();
  document.querySelectorAll('.nav a.l').forEach(a => a.classList.toggle('on', a.getAttribute('href') == '#' + k));
}
addEventListener('hashchange', go);
go();
/* stars */
(function () {
  const c = $('#stars'), x = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  for (let i = 0; i < 260; i++) {
    x.fillStyle = `rgba(255,255,255,${Math.random() * .8 + .1})`;
    x.beginPath();
    x.arc(Math.random() * c.width, Math.random() * c.height, Math.random() * 1.2 + .2, 0, 6.3);
    x.fill();
  }
})();
