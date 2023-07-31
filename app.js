"use strict";

const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".result");

for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

const squaresArr = Array.from(document.querySelectorAll(".grid div"));
// console.log(squaresArr);

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

let currentShooter = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let alienRemoved = [];

const draw = function () {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!alienRemoved.includes(i)) {
      squaresArr[alienInvaders[i]].classList.add("invader");
    }
  }
};
draw();

const removeInvader = function () {
  for (let i = 0; i < alienInvaders.length; i++) {
    squaresArr[alienInvaders[i]].classList.remove("invader");
  }
};

squaresArr[currentShooter].classList.add("shooter");

const moveShooter = function (e) {
  squaresArr[currentShooter].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currentShooter % width !== 0) currentShooter -= 1;
      break;

    case "ArrowRight":
      if (currentShooter % width < width - 1) currentShooter += 1;
      break;
  }
  squaresArr[currentShooter].classList.add("shooter");
};
document.addEventListener("keydown", moveShooter);

const moveInvader = function () {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;
  removeInvader();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }
  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  draw();

  if (squaresArr[currentShooter].classList.contains("invader", "shooter")) {
    resultDisplay.innerHTML = "Game Over!!! 💥💥";
    clearInterval(invadersId);
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squaresArr.length) {
      resultDisplay.innerHTML = "Game Over!!! 💥💥";
      clearInterval(invadersId);
    }
  }

  if (alienRemoved.length === alienInvaders.length) {
    resultDisplay.innerHTML = "You WIN!!! 🎉🎉";
    clearInterval(invadersId);
  }
};
invadersId = setInterval(moveInvader, 600);

const shoot = function (e) {
  let laserId;
  let currentLaserIndex = currentShooter;

  function moveLaser() {
    squaresArr[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    squaresArr[currentLaserIndex].classList.add("laser");

    if (squaresArr[currentLaserIndex].classList.contains("invader")) {
      squaresArr[currentLaserIndex].classList.remove("laser");
      squaresArr[currentLaserIndex].classList.remove("invader");
      squaresArr[currentLaserIndex].classList.add("boom");

      setTimeout(
        () => squaresArr[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserId);

      const alienRemoval = alienInvaders.indexOf(currentLaserIndex);
      alienRemoved.push(alienRemoval);
      console.log(alienRemoved);
    }
  }

  switch (e.key) {
    case "ArrowUp":
      laserId = setInterval(moveLaser, 100);
  }
};
document.addEventListener("keydown", shoot);
