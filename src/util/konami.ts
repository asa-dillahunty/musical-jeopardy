/**
 * @author Asa Dillahunty
 *
 * This script listens for someone to enter the 'konami code'
 * (up up down down left right left right b a) and alters the
 * HTML to make it look really gross.
 */
var isNormal = true;
var konami = 0;
const konamiKey = "konamiValueKey6378487609";
konamiSetup();

export function konamiSetup() {
  isNormal = "false" === localStorage.getItem(konamiKey);
  change();

  document.body.addEventListener("keyup", function (event) {
    if (event.code === "ArrowUp") inputHandler("up");
    else if (event.code === "ArrowDown") inputHandler("down");
    else if (event.code === "ArrowLeft") inputHandler("left");
    else if (event.code === "ArrowRight") inputHandler("right");
    else if (event.code === "KeyB") inputHandler("b");
    else if (event.code === "KeyA") inputHandler("a");
    // else if (event.code === "KeyC") change();
    else inputHandler("false");
  });
}

function change() {
  if (isNormal) makeStatic();
  else normalize();

  isNormal = !isNormal;
  localStorage.setItem(konamiKey, isNormal);
}

function makeStatic() {
  document.body.className = "static";
}

function inputHandler(input) {
  if (input === "up") {
    if (konami === 0 || konami === 1) konami++;
    else if (konami === 2) konami = 2;
    else konami = 1;
  } else if (input === "down") {
    if (konami === 2 || konami === 3) konami++;
    else konami = 0;
  } else if (input === "left") {
    if (konami === 4 || konami === 6) konami++;
    else konami = 0;
  } else if (input === "right") {
    if (konami === 5 || konami === 7) konami++;
    else konami = 0;
  } else if (input === "b") {
    if (konami === 8) konami++;
    else konami = 0;
  } else if (input === "a") {
    if (konami === 9) change();
    konami = 0;
  } else konami = 0;
}

function normalize() {
  document.body.classList = "";
}
