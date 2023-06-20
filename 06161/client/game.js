let angle = 0;
let posx = 100;
let posy = 100;
let shootTime;
let bulDeg, xb, yb;
let shot = 0;
let bullet;
let tankHtml;
const ricoshet = document.getElementById("buff_ricoshet");

let activeButtons = [];

let UID = undefined;

let tankObj = {
  posx,
  posy,
  angle,
  UID,
  //Id,
  Buffs: [],
};

let bulletObj = {
  posx,
  posy,
  angle,
  shot,
};

const colors = [
  "blue",
  "red",
  "green",
  "yellow",
  "call",
  "black",
  "white",
  "purple",
];

//help functions block
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var overlaps = function (m, n) {
  let a = {
    x: 0,
    y: 0,
  };

  let b = {
    x: 0,
    y: 0,
  };

  a.x = parseInt(m.style.left);
  a.y = parseInt(m.style.top);
  a.x1 = parseInt(m.style.left) + parseInt(m.style.width);
  a.y1 = parseInt(m.style.top) + parseInt(m.style.height);
  b.x = parseInt(n.style.left);
  b.y = parseInt(n.style.top);
  b.x1 = parseInt(n.style.left) + parseInt(n.style.width);
  b.y1 = parseInt(n.style.top) + parseInt(n.style.height);

  var s1 = (a.x >= b.x && a.x <= b.x1) || (a.x1 >= b.x && a.x1 <= b.x1),
    s2 = (a.y >= b.y && a.y <= b.y1) || (a.y1 >= b.y && a.y1 <= b.y1),
    s3 = (b.x >= a.x && b.x <= a.x1) || (b.x1 >= a.x && b.x1 <= a.x1),
    s4 = (b.y >= a.y && b.y <= a.y1) || (b.y1 >= a.y && b.y1 <= a.y1);

  return (s1 && s2) || (s3 && s4) || (s1 && s4) || (s3 && s2);
};
//end of help functions block

//event listeners block
document.addEventListener("keydown", function (event) {
  if (!activeButtons.includes(event.code)) activeButtons.push(event.code);
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
  window.requestAnimationFrame(update);
}

//end of main function

//functions block

export function ProvideData() {
  let data_buf = [tankObj, bulletObj];

  return data_buf;
}

export function GetData(data_buf) {
  let tanks = data_buf[0];
  let bullets = data_buf[1];
  let active_bullets = [];

  for (const playertank of tanks) {
    if (playertank == null) continue;
    const HtmlPlayerTank = document.getElementById(playertank.Id);
    HtmlPlayerTank.style.top = `${playertank.posy}px`;
    HtmlPlayerTank.style.left = `${playertank.posx}px`;
    HtmlPlayerTank.style.transform = `rotate(${
      ((playertank.angle % 360) * 180) / Math.PI
    }deg)`;
  }
  for (const playerbullet of bullets) {
    if (playerbullet == null || playerbullet.shot == 0) continue;
    active_bullets.push(playerbullet);
    const HtmlPlayerBullet = document.getElementById(playerbullet.Id);
    HtmlPlayerBullet.style.top = `${playerbullet.posy}px`;
    HtmlPlayerBullet.style.left = `${playerbullet.posx}px`;
    HtmlPlayerBullet.style.transform = `rotate(${
      ((playerbullet.angle % 360) * 180) / Math.PI
    }deg)`;
  }
  checkOverlaps(active_bullets);
}

export function InitGame(number) {
  tankObj.Id = colors[number] + "tank";
  tankObj.UID = number;
  tankObj.posx = posx;
  tankObj.posy = posy;
  tankObj.angle = angle;

  bulletObj.Id = colors[number] + "bullet";
  bulletObj.posx = xb;
  bulletObj.posy = yb;
  bulletObj.angle = bulDeg;
  bulletObj.shot = 0;

  tankHtml = document.getElementById(tankObj.Id);
  bullet = document.getElementById(bulletObj.Id);

  window.requestAnimationFrame(update);
}

function checkOverlaps(bullets) {
  //if (overlaps(tankHtml, ricoshet) || overlaps(ricoshet, bullet)) {
  //what to do if buff collected
  // ricoshet.setAttribute("hidden", true);
  //}
  for (const playerbullet of bullets) {
    if (
      overlaps(
        document.getElementById(tankObj.Id),
        document.getElementById(playerbullet.Id)
      ) &&
      tankObj.Id.slice(0, -4) != playerbullet.Id.slice(0, -6)
    ) {
      tankObj.posx = 700;
      tankObj.posy = 700;
    }
  }
}

function updateTank() {
  if (activeButtons.includes("ArrowRight")) {
    tankObj.angle += 0.05;
  }
  if (activeButtons.includes("ArrowLeft")) {
    tankObj.angle -= 0.05;
  }
  if (
    activeButtons.includes("ArrowUp") &&
    !(tankObj.posx + Math.cos(tankObj.angle) * 3 < 0) &&
    !(tankObj.posy + Math.sin(tankObj.angle) * 3 < 0) &&
    !(tankObj.posx + Math.cos(tankObj.angle) * 3 > 1820) &&
    !(tankObj.posy + Math.sin(tankObj.angle) * 3 > 840)
  ) {
    tankObj.posx += Math.cos(tankObj.angle) * 3;
    tankObj.posy += Math.sin(tankObj.angle) * 3;
  }
  if (
    activeButtons.includes("ArrowDown") &&
    !(tankObj.posx - Math.cos(tankObj.angle) * 3 < 0) &&
    !(tankObj.posy - Math.sin(tankObj.angle) * 3 < 0) &&
    !(tankObj.posx - Math.cos(tankObj.angle) * 3 > 1820) &&
    !(tankObj.posy - Math.sin(tankObj.angle) * 3 > 840)
  ) {
    tankObj.posx -= Math.cos(tankObj.angle) * 3;
    tankObj.posy -= Math.sin(tankObj.angle) * 3;
  }
  if (!bulletObj.shot) {
    bullet.style.left = `${tankObj.posx + 20}px`;
    bullet.style.top = `${tankObj.posy + 20}px`;
  }
  if (activeButtons.includes("Space") && bulletObj.shot == 0) {
    bulletAnim(0, tankObj.angle % 360, tankObj.posx, tankObj.posy);
  }
  tankHtml.style.top = `${tankObj.posy}px`;
  tankHtml.style.left = `${tankObj.posx}px`;
  tankHtml.style.transform = `rotate(${
    ((tankObj.angle % 360) * 180) / Math.PI
  }deg)`;
}

function bulletAnim(call, deg, x, y) {
  if (call == 0) {
    bulletObj.shot = 1;
    bullet.removeAttribute("hidden");
    shootTime = Date.now();
    bulletObj.angle = deg;
    bulletObj.posx = x;
    bulletObj.posy = y;
  } else if (Date.now() - shootTime <= 1000) {
    bulletObj.posx += Math.cos(bulletObj.angle) * 20;
    bulletObj.posy += Math.sin(bulletObj.angle) * 20;
    bullet.style.top = `${bulletObj.posy + 20}px`;
    bullet.style.left = `${bulletObj.posx + 20}px`;
  } else {
    bulletObj.shot = 0;
    bullet.setAttribute("hidden", true);
    bulletObj.posx = parseInt(tankHtml.style.left);
    bulletObj.posy = parseInt(tankHtml.style.top);
  }
}

function startEvent(event) {
  let input = event.split(" ");

  if (input[0] == "spawn") {
    if (isNaN(parseInt(input[2])) || parseInt(input[2]) == undefined)
      input[2] = getRandomInt(1030);
    if (isNaN(parseInt(input[3])) || parseInt(input[3]) == undefined)
      input[3] = getRandomInt(790);
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
