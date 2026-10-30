// Optional 3D atmosphere. The complete collection works without WebGL.
import * as THREE from './vendor/three.module.js';
const canvas=document.querySelector('#scene');
try{
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);camera.position.z=14;
const group=new THREE.Group();scene.add(group);scene.add(new THREE.HemisphereLight(0xffffff,0x6d795a,2.8));const sun=new THREE.DirectionalLight(0xffffff,3);sun.position.set(-3,5,8);scene.add(sun);
const mat=new THREE.MeshStandardMaterial({color:0xc5d99d,roughness:.33,metalness:.1,transparent:true,opacity:.6});
const objects=[];const geometries=[new THREE.TorusGeometry(.35,.07,10,40),new THREE.IcosahedronGeometry(.23,0),new THREE.SphereGeometry(.14,12,12)];
for(let i=0;i<24;i++){const mesh=new THREE.Mesh(geometries[i%3],mat);mesh.position.set((Math.random()-.5)*24,(Math.random()-.5)*14,-4-Math.random()*8);mesh.rotation.set(Math.random()*3,Math.random()*3,0);group.add(mesh);objects.push({mesh,y:mesh.position.y,speed:.15+Math.random()*.3,phase:Math.random()*6})}
let enabled=!document.body.classList.contains('motion-off'),visible=!document.hidden,raf=null,targetColor=new THREE.Color(0xc5d99d),pointerX=0,pointerY=0,scroll=0;
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}resize();addEventListener('resize',resize);
function render(t){raf=null;if(!enabled||!visible)return;const time=t*.001;mat.color.lerp(targetColor,.035);group.rotation.y+=(pointerX*.12-group.rotation.y)*.025;group.rotation.x+=(pointerY*.08-group.rotation.x)*.025;camera.position.z+=(14-scroll*.0015-camera.position.z)*.02;for(const {mesh,y,speed,phase} of objects){mesh.position.y=y+Math.sin(time*speed+phase)*.6;mesh.rotation.x+=.0015;mesh.rotation.y+=.002}renderer.render(scene,camera);raf=requestAnimationFrame(render)}
function start(){if(!raf&&enabled&&visible)raf=requestAnimationFrame(render)}
addEventListener('pointermove',e=>{pointerX=e.clientX/innerWidth-.5;pointerY=e.clientY/innerHeight-.5});addEventListener('scroll',()=>{scroll=Math.min(scrollY,1500)},{passive:true});
addEventListener('fun-world',e=>{targetColor.set(e.detail.color);objects.forEach(({mesh},i)=>{mesh.scale.setScalar(e.detail.id==='chorus'?(i%3===0?1.8:.7):e.detail.id==='monopoly'?(i%3===1?1.5:.8):1);})});
addEventListener('fun-motion',e=>{enabled=e.detail.enabled;if(enabled)start();else{cancelAnimationFrame(raf);raf=null;renderer.clear()}});addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)start();else{cancelAnimationFrame(raf);raf=null}});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=null;enabled=false});start();
}catch{canvas.style.display='none';}
