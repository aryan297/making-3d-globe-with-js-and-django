/*
Inspired... copied... stolen from Sarah Drasner's Cow https://codepen.io/sdras/pen/doZReX

It was perfect for a side project I'm working on with @epicwebagency team. So thank you Sarah.

The smoke and stars are dynamically generated. The fire and smoke react to the speed of the rocket.

Illustration by Adeline o'Moreau

*/


var illu = document.getElementById("illu");
var rocket = document.getElementById("rocket"); 
var redFire = document.getElementById("red_fire"); 
var yellowFire = document.getElementById("yellow_fire"); 
var fire = document.getElementById("fire");
var stars = document.getElementById("stars");
var smoke = document.getElementById("smoke");

var awaitingParticles = [];
var awaitingStars = [];

var xmlns = "http://www.w3.org/2000/svg"; 
var svgns = "http://www.w3.org/1999/xlink"
var fireScale = 1;
var yellowFireScale = 1;
var rotationSpeed = 0;
var rocketProperSpeed = .5;
var currentNStars = -1;
var autoRotate = true;
var t=0;
var starMaxRay = 600;
var starMinRay = 600;

function createSmokeParticle(){
  var smokeParticle = document.createElementNS(xmlns,"circle"); 
  smokeParticle.setAttributeNS(null,"class","smoke_particle"); 
  smokeParticle.setAttributeNS(null,"r",10);
  smoke.appendChild(smokeParticle);
  resetParticle(smokeParticle);
  return smokeParticle;
}

function createStar(){
  currentNStars++;
  var star = document.createElementNS(xmlns,"use"); 
  var id = "star_"+currentNStars;
  star.setAttributeNS(svgns,'xlink:href','#star');
  star.setAttributeNS(null,"id",id);
  stars.appendChild(star);
  resetStar(star);
  return star;
}


TweenLite.set(rocket, { svgOrigin:"400, 600", x:"200", rotation:0, scale:.5 });
TweenLite.set(fire, {svgOrigin:"950, 680" });
TweenLite.set(smoke, {svgOrigin:"950, 680" });
TweenLite.set(yellowFire, {svgOrigin:"950, 680" });

Draggable.create(rocket, {
  type:"rotation",
  throwProps:true,
  throwResistance:9000,
  onDrag: onDrag,
  onThrowUpdate:throwUpdate,
  onThrowComplete:throwComplete,
});
function onDrag(e){
  autoRotate = false;
  rotationSpeed = ThrowPropsPlugin.getVelocity(this.target, "rotation");
}

function throwUpdate(e) {
    rotationSpeed = ThrowPropsPlugin.getVelocity(this.target, "rotation");
}

function throwComplete(e) {
    autoRotate = true;
}


function getSmokeParticle(){
  var particle;
  if (awaitingParticles.length){
    particle = awaitingParticles.pop();
  }else{
    particle = createSmokeParticle();
  }
  return particle;
}


function getStar(){
  var star;
  if (awaitingStars.length){
    star = awaitingStars.pop();
  }else{
    star = createStar();
  }
  return star;
}

function fly(p,speed, delay){
  TweenMax.to(p, speed, {opacity:0, y:750-rotationSpeed/3+Math.random()*100, x:955-40+Math.random()*80, scale:4-rotationSpeed/100, fill:"#000000", delay:delay, ease:Strong.easeInOut, onComplete:resetParticle, onCompleteParams:[p]});
}

function showStar(s){
  TweenMax.to(s, 1, {opacity:1, scale : 1, ease:Strong.easeInOut, onComplete:hideStar, onCompleteParams:[s]});
}
function hideStar(s){
  TweenMax.to(s, 1, {opacity:0, scale : .1, ease:Strong.easeInOut, onComplete:resetStar, onCompleteParams:[s]});
}

function resetParticle(p){
  TweenMax.set(p,{
    svgOrigin:"0, 0",
    x:955,
    y:730,
    opacity:1,
    scale:2.5,
    fill:"#EA4E39"
  });
  awaitingParticles.push(p);
}

function resetStar(s){
  var ray =  200 + Math.random()*200 ;
  var angle = Math.random()*Math.PI*2;
  var posX = 600 + Math.cos(angle)*ray;
  var posY = 600 + Math.sin(angle)*ray;
  TweenMax.set(s,{
    svgOrigin:"5, 5",
    opacity:0,
    x:posX,
    y:posY,
    scale:1
  });
  awaitingStars.push(s);
}


function loop(){
  t++;
  if (t%10 == 0){
    var star = getStar();
    showStar(star);
  }
  
  var particlesNumber = Math.round(rule3(-rotationSpeed, 0, 1000, 1,3));
  var speedParticles = rule3(-rotationSpeed, 0, 1000, 1.5,.2);
  for (var i=0; i<1; i++){
      var p = getSmokeParticle();
      fly(p, speedParticles, i*.1);
  }
  fireScaleY = .8 + Math.random()*.3 -rotationSpeed/500;
  fireScaleY = Math.min(fireScaleY,1.5);
  fireScaleX = 1+rotationSpeed/100;
  fireScaleX = Math.min(Math.max(fireScaleX,.4),1);
  yellowFireScale = .8 + Math.random()*.3;
  //*
  if (autoRotate){
    rotationSpeed += (rocketProperSpeed - rotationSpeed)/30;
    rocketRotation = rocket._gsTransform.rotation;
    rocketRotation -= rotationSpeed;
    TweenLite.set(rocket, {
      rotation:rocketRotation
    });
  }
  //*/
  TweenLite.set(fire, {
    scaleX:fireScaleX, 
    scaleY:fireScaleY
  });
  TweenLite.set(yellowFire, {
    scale:yellowFireScale, 
    rotation:-20 + yellowFireScale*20
  });
  requestAnimationFrame(loop);
}
loop();

function rule3(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}
