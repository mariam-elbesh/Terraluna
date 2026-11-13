/* Procedural planet textures: color + height (bump) + specular (Earth oceans). 1024x512, cached. */
const H3=(x,y,z)=>{let n=Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(z,1274126177);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296},L=(a,b,t)=>a+(b-a)*t,cl=(v,a=0,b=1)=>v<a?a:v>b?b:v,sm=t=>t*t*(3-2*t),ss=(a,b,v)=>sm(cl((v-a)/(b-a)));
function vn(x,y,z){const i=Math.floor(x),j=Math.floor(y),k=Math.floor(z),u=sm(x-i),v=sm(y-j),w=sm(z-k);return L(L(L(H3(i,j,k),H3(i+1,j,k),u),L(H3(i,j+1,k),H3(i+1,j+1,k),u),v),L(L(H3(i,j,k+1),H3(i+1,j,k+1),u),L(H3(i,j+1,k+1),H3(i+1,j+1,k+1),u),v),w)}
function fbm(x,y,z,o=5){let v=0,a=.5,s=0;for(let i=0;i<o;i++){v+=a*vn(x,y,z);s+=a;x*=2.03;y*=2.03;z*=2.03;a*=.5}return v/s}
const TC={};
/* returns [R,G,B,height,specular,alpha] for a point on the unit sphere */
function surf(t,x,y,z){const la=Math.abs(y);let R,G,B,h=.5,s=0;
if(t=='cloud'){const w=fbm(x*2+3,y*2+3,z*2+3,3)-.5,n=fbm(x*3+w*2,y*3+w*2,z*3+w*2,5);return[255,255,255,0,0,cl((n-.5)*6)*235]}
if(t=='earth'){const w=fbm(x*1.4+4,y*1.4+4,z*1.4+4,3)-.5,e=fbm(x*1.7+w+1,y*1.7+w+1,z*1.7+w+1,6);
 if(la>.9-.06*vn(x*9,y*9,z*9)){R=G=B=238;h=.55}
 else if(e<.585){const k=Math.pow(cl((.585-e)*7),.55);R=L(55,6,k);G=L(140,30,k);B=L(150,72,k);h=.2;s=255}
 else{const hh=(e-.585)*5,m=fbm(x*3+9,y*3+9,z*3+9,4),dz=ss(.5,.42,m)*ss(.8,.4,la),g=.86+.28*fbm(x*28,y*28,z*28,2);
  let r=L(30+46*m,196,dz),gg=L(76+46*m,164,dz),b=L(34+24*m,108,dz);const tu=ss(.55,.82,la),mt=ss(.25,.5,hh),sn=Math.max(ss(.55,.8,hh),ss(.82,.95,la));
  r=L(r,120,tu);gg=L(gg,126,tu);b=L(b,104,tu);r=L(r,122,mt);gg=L(gg,106,mt);b=L(b,92,mt);
  R=L(r*g,240,sn);G=L(gg*g,244,sn);B=L(b*g,250,sn);h=.35+hh*.55}
 return[R,G,B,h,s,255]}
if(t=='moon'){const b=fbm(x*3,y*3,z*3,6),hl=ss(.4,.46,fbm(x*1.2+3,y*1.2+3,z*1.2+3,4)),f=.82+.36*b+.1*(fbm(x*40,y*40,z*40,2)-.5);
 return[L(64,178,hl)*f,L(65,176,hl)*f,L(70,170,hl)*f,L(.3,.55,hl)+.2*b,0,255]}
const n=fbm(x*2.4,y*2.4,z*2.4,6),dk=ss(.5,.42,fbm(x*1.3+4,y*1.3+4,z*1.3+4,4)),f=.9+.2*(fbm(x*30,y*30,z*30,2)-.5);
R=L(L(160,226,n),92,dk)*f;G=L(L(88,160,n),56,dk)*f;B=L(L(52,106,n),46,dk)*f;h=.35+.5*n;
if(la>.93-.05*vn(x*8,y*8,z*8)){R=242;G=232;B=230;h=.6}
return[R,G,B,h,0,255]}
function crater(x,cx,cy,r,sy,st){x.save();x.translate(cx,cy);x.scale(1/sy,1);const g=x.createRadialGradient(0,0,r*.1,0,0,r);st.forEach(s=>g.addColorStop(s[0],s[1]));x.fillStyle=g;x.beginPath();x.arc(0,0,r,0,6.2832);x.fill();x.restore()}
function TX(t){if(TC[t])return TC[t];const W=1024,Hh=512,mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=Hh;return c},c=mk(),hc=mk(),sc=mk(),x=c.getContext('2d'),xh=hc.getContext('2d'),xs=sc.getContext('2d'),d=x.createImageData(W,Hh),dh=xh.createImageData(W,Hh),ds=xs.createImageData(W,Hh);
for(let j=0;j<Hh;j++){const ph=(j+.5)/Hh*Math.PI,y=Math.cos(ph),r=Math.sin(ph);for(let i=0;i<W;i++){const th=i/W*6.2832,o=(j*W+i)*4,p=surf(t,Math.cos(th)*r,y,Math.sin(th)*r);
 d.data[o]=p[0];d.data[o+1]=p[1];d.data[o+2]=p[2];d.data[o+3]=p[5];dh.data[o]=dh.data[o+1]=dh.data[o+2]=p[3]*255;dh.data[o+3]=255;ds.data[o]=ds.data[o+1]=ds.data[o+2]=p[4];ds.data[o+3]=255}}
x.putImageData(d,0,0);xh.putImageData(dh,0,0);xs.putImageData(ds,0,0);
if(t=='moon'||t=='mars'){const m=t=='moon';for(let k=0;k<(m?380:80);k++){const cx=Math.random()*W,cy=Math.random()*Hh,r=2+Math.pow(Math.random(),3)*(m?46:34),sy=Math.max(.2,Math.sin(cy/Hh*Math.PI));
 for(const dx of[-W,0,W]){crater(x,cx+dx,cy,r,sy,[[0,'rgba(0,0,0,.30)'],[.7,'rgba(0,0,0,.13)'],[.88,'rgba(255,255,255,.2)'],[1,'rgba(255,255,255,0)']]);crater(xh,cx+dx,cy,r,sy,[[0,'rgba(0,0,0,.6)'],[.7,'rgba(0,0,0,.25)'],[.88,'rgba(255,255,255,.55)'],[1,'rgba(255,255,255,0)']])}}}
TC[t+'_h']=hc;TC[t+'_s']=sc;return TC[t]=c}
