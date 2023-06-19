let deg = 0;
let posx = 100;
let posy = 100;
let shootTime;
let bulDeg, xb, yb;
let shot = 0;
const bullet = document.getElementById("bullet");
const tank = document.getElementById("blue");
const ricoshet = document.getElementById("buff_ricoshet");
let activeButtons = [];

//help functions block
const sleep = ms => new Promise(r => setTimeout(r, ms));

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var overlaps = function(m, n) {
  
  let a = {
    x: 0,
    y: 0
  };

  let b = {
    x: 0,
    y: 0
  };
  
  a.x = parseInt(m.style.left);
  a.y = parseInt(m.style.top);
  a.x1 = parseInt(m.style.left) + parseInt(m.style.width);
  a.y1 = parseInt(m.style.top) + parseInt(m.style.height);
  b.x = parseInt(n.style.left);
  b.y = parseInt(n.style.top);
  b.x1 = parseInt(n.style.left) + parseInt(n.style.width);
  b.y1 = parseInt(n.style.top) + parseInt(n.style.height);

  var s1 = (a.x>=b.x && a.x<=b.x1 )||( a.x1>=b.x && a.x1<=b.x1 ),
  s2 = ( a.y>=b.y && a.y<=b.y1 )||( a.y1>=b.y && a.y1<=b.y1 ),
  s3 = ( b.x>=a.x && b.x<=a.x1 )||( b.x1>=a.x && b.x1<=a.x1 ),
  s4 = ( b.y>=a.y && b.y<=a.y1 )||( b.y1>=a.y && b.y1<=a.y1 );
  
  return ((s1 && s2) || (s3 && s4)) || ((s1 && s4) || (s3 && s2));
};
//end of help functions block

//event listeners block
document.addEventListener("keydown", function (event) {
  if (!activeButtons.includes(event.code))
    activeButtons.push(event.code);
});

document.addEventListener("keyup", function (event) {
  if (activeButtons.includes(event.code))
    activeButtons.splice(activeButtons.indexOf(event.code), 1);
});

//end of event listeners block

//main function

async function update() {
  bulletAnim();
  updateTank();
  checkOverlaps();
  await new Promise(r => setTimeout(r, 15.625));
  if (getRandomInt(368) == 18) startEvent("spawn buff_ricoshet")
  window.requestAnimationFrame(update);
}

//end of main function

//functions block

function checkOverlaps() {
  if (overlaps(tank, ricoshet) || overlaps(ricoshet, bullet))
  {
    //what to do if buff collected
    ricoshet.setAttribute("hidden", true);
  }
}

function updateTank() {
  if (activeButtons.includes("ArrowRight")) {
    deg += 0.05;
  }
  if (activeButtons.includes("ArrowLeft")) {
    deg -= 0.05;
  }
  if (activeButtons.includes("ArrowUp") && !((posx + Math.cos(deg) * 3) < 0) && !((posy + Math.sin(deg) * 3) < 0) && !((posx + Math.cos(deg) * 3) > 1820) && !((posy + Math.sin(deg) * 3) > 840)) {
    posx += Math.cos(deg) * 3;
    posy += Math.sin(deg) * 3;
  }
  if (activeButtons.includes("ArrowDown") && !((posx - Math.cos(deg) * 3) < 0) && !((posy - Math.sin(deg) * 3) < 0)) {
    posx -= Math.cos(deg) * 3;
    posy -= Math.sin(deg) * 3;
  }
  if (!shot)
  {
    bullet.style.left = `${posx + 20}px`;
    bullet.style.top = `${posy + 20}px`;
  }
  if (activeButtons.includes("Space") && shot == 0) {
    bulletAnim(0, deg, posx, posy);
  }
  tank.style.top = `${posy}px`;
  tank.style.left = `${posx}px`;
  tank.style.transform = `rotate(${(deg * 180) / Math.PI}deg)`;
}

function bulletAnim(call, deg, x, y) {
  if (call == 0) {
    shot = 1;
    shootTime = Date.now();
    bulDeg = deg;
    xb = x;
    yb = y;
  }
  if (Date.now() - shootTime <= 1000) {
    xb += Math.cos(bulDeg) * 20;
    yb += Math.sin(bulDeg) * 20;
    bullet.style.top = `${yb + 20}px`;
    bullet.style.left = `${xb + 20}px`;
  } else {
    shot = 0;
    xb = parseInt(tank.style.left);
    yb = parseInt(tank.style.top);
  }
}

function startEvent(event) {
  let input = event.split(" ");
  
  if (input[0] == "spawn")
  {
    if (isNaN(parseInt(input[2])) || parseInt(input[2]) == undefined) input[2] = getRandomInt(1030);
    if (isNaN(parseInt(input[3])) || parseInt(input[3]) == undefined) input[3] = getRandomInt(790);
    spawn(input[1], parseInt(input[2]), parseInt(input[3]));
  }
}

function spawn(item, x, y) {
  let myitem = document.getElementById(item);
  myitem.removeAttribute("hidden");
  myitem.style.top = `${y}px`;
  myitem.style.left = `${x}px`;
}

//end of functions block

window.requestAnimationFrame(update);
