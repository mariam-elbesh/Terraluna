/* 3D planet component (Three.js). Hook: add markers, rings, zoom here. */
const LIVE=[];
function glow(sc,col,s,k){sc.add(new THREE.Mesh(new THREE.SphereGeometry(1.5*s,64,48),new THREE.ShaderMaterial({uniforms:{c:{value:new THREE.Color(col)},k:{value:k}},vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 n;uniform vec3 c;uniform float k;void main(){float i=pow(max(.7-dot(n,vec3(0.,0.,1.)),0.),4.);gl_FragColor=vec4(c*i*k,1.);}',blending:THREE.AdditiveBlending,side:THREE.BackSide,transparent:true,depthWrite:false})))}
function planet(el,type,o={}){if(!el||!window.THREE)return;el.style.opacity=0;
setTimeout(()=>{if(!document.body.contains(el))return;
const w=el.clientWidth||300,r=new THREE.WebGLRenderer({alpha:true,antialias:true}),e=type=='earth';r.outputEncoding=THREE.sRGBEncoding;r.setPixelRatio(Math.min(devicePixelRatio,2));r.setSize(w,w);el.appendChild(r.domElement);
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,100);cam.position.z=6.4;const g=new THREE.Group();g.rotation.z=.2;sc.add(g);
const T=c=>{const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t},col=T(TX(type)),bm=new THREE.CanvasTexture(TC[type+'_h']);
g.add(new THREE.Mesh(new THREE.SphereGeometry(1.5,96,64),e?new THREE.MeshPhongMaterial({map:col,bumpMap:bm,bumpScale:.03,specularMap:new THREE.CanvasTexture(TC.earth_s),specular:new THREE.Color(0x557799),shininess:30}):new THREE.MeshStandardMaterial({map:col,bumpMap:bm,bumpScale:type=='moon'?.07:.05,roughness:1,metalness:0})));
let cm;if(e){cm=new THREE.Mesh(new THREE.SphereGeometry(1.52,64,48),new THREE.MeshPhongMaterial({map:T(TX('cloud')),transparent:true,depthWrite:false,shininess:0}));g.add(cm);glow(sc,0x4aa0ff,1.12,.6)}
if(type=='mars')glow(sc,0xe0905a,1.07,.4);
const sun=new THREE.DirectionalLight(0xfff4e6,e?2.4:2.6);sun.position.set(5,1.5,3.5);sc.add(sun,new THREE.AmbientLight(e?0x24385a:0x14141c,e?.5:.35));
LIVE.push({el,r,sc,cam,g,cm,sp:o.sp||.0025});el.style.transition='opacity 1.2s';el.style.opacity=1;
let dn=0,mv=0,lx=0,ly=0;el.onpointerdown=ev=>{dn=1;mv=0;lx=ev.clientX;ly=ev.clientY};
addEventListener('pointermove',ev=>{if(!dn)return;const dx=ev.clientX-lx,dy=ev.clientY-ly;mv+=Math.abs(dx)+Math.abs(dy);g.rotation.y+=dx*.01;g.rotation.x=Math.max(-.8,Math.min(.8,g.rotation.x+dy*.006));lx=ev.clientX;ly=ev.clientY});
addEventListener('pointerup',()=>{if(dn&&mv<6&&o.click)o.click();dn=0})},o.delay||30)}
(function loop(){requestAnimationFrame(loop);for(let i=LIVE.length-1;i>=0;i--){const p=LIVE[i];if(!document.body.contains(p.el)){p.r.dispose();LIVE.splice(i,1);continue}p.g.rotation.y+=p.sp;if(p.cm)p.cm.rotation.y+=.0007;p.r.render(p.sc,p.cam)}})();
