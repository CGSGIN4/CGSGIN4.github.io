let deg = 0;
let posx = 100;
let posy = 100;
let shootTime;
let bulDeg, xb, yb;
let shot = 0;
const bullet = document.getElementById("bullet");
const tank = document.getElementById("blue");

function bulletAnim(call, deg, x, y) {
  if (call == 0) {
    shot = 1;
    console.log("called by space");
    shootTime = Date.now();
    bulDeg = deg;
    xb = x;
    yb = y;
  } else {
    console.log("called by request");
  }
  if (Date.now() - shootTime <= 1000) {
    xb += Math.cos(bulDeg) * 2;
    yb += Math.sin(bulDeg) * 2;
    bullet.style.top = `${yb}px`;
    bullet.style.left = `${xb}px`;
    console.log(`y ${yb}px, x ${xb}px`);
    window.requestAnimationFrame(bulletAnim);
  } else {
    console.log("shouldnt be restarted");
    shot = 0;
    xb = parseInt(tank.style.left);
    yb = parseInt(tank.style.top);
  }
}

document.addEventListener("keydown", function (event) {
  if (event.code == "ArrowRight") {
    deg += 0.1;
  }
  if (event.code == "ArrowLeft") {
    deg -= 0.1;
  }
  if (event.code == "ArrowUp") {
    posx += Math.cos(deg) * 10;
    posy += Math.sin(deg) * 10;
  }
  if (event.code == "ArrowDown") {
    posx -= Math.cos(deg) * 10;
    posy -= Math.sin(deg) * 10;
  }
  bullet.style.left = `${posx + 20}px`;
  bullet.style.top = `${posy + 20}px`;
  if (event.code == "Space" && shot == 0) {
    bulletAnim(0, deg, posx, posy);
  }
  tank.style.top = `${posy}px`;
  tank.style.left = `${posx}px`;
  tank.style.transform = `rotate(${(deg * 180) / Math.PI}deg)`;
});
