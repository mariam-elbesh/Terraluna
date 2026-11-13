# TerraLuna
Earth Analog Intelligence for Humanity's Next Worlds (NASA Space Apps).

Run: open the folder in VS Code, right-click `index.html` > Open with Live Server.

## Structure
- `css/style.css` - design system + all styles
- `js/data.js` - state, sites, mission profiles
- `js/textures.js` - procedural Earth/Moon/Mars textures
- `js/planet.js` - Three.js planet component (3D hook)
- `js/helpers.js` - ring, bars, footer helpers
- `js/views/*.js` - one file per page (h = HTML, m = mount/animations)
- `js/router.js` - hash router + starfield

Add a page: create `js/views/<name>.js` with `V.<name>={h:()=>`...`,m:()=>{...}}`, add its script tag in `index.html`.
