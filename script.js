const snake = document.querySelectorAll(".snake-segment");
const screen = document.querySelector("#screen");
const game = document.querySelector("#game");
const directions = ["left", "down", "right", "up"];
const squareWidth = 5;
const segments = [];
let direction = 0;
let numFrames = 0;
let framesPerLoop = 24;
let addToTail = false;

class Segment {
  constructor(elem, left, top) {
    this.elem = elem;
    this.left = left;
    this.top = top;
  }

  inBounds() {
    if (this.left < 0 || this.left > 95) {
      return false;
    }
    return this.top >= 0 && this.top <= 95;
  }

  canEatDot(dotObject) {
    return (
      Math.abs(this.left - dotObject.left) < 1 &&
      Math.abs(this.top - dotObject.top) < 1
    );
  }
}

class Dot {
  constructor(elem) {
    this.elem = elem;
    this.top = 50;
    this.left = 30;
    this.width = 5;
  }
  // Jumps to random coordinate in 20 x 20 grid
  move() {
    this.top = 5 * Math.floor(Math.random() * 20);
    this.left = 5 * Math.floor(Math.random() * 20);
  }

  render() {
    this.elem.style.left = `${this.left}%`;
    this.elem.style.top = `${this.top}%`;
  }
}
const dot = new Dot(document.querySelector("#dot"));

const setSnake = () => {
  for (let i = 0; i < snake.length; i++) {
    segments.push(new Segment(snake[i], 50 + i * squareWidth, 50));
  }
};

// We change direction via the event listener
window.addEventListener(
  "keydown",
  (event) => {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    switch (event.key) {
      case "ArrowLeft":
        direction = 0;
        break;
      case "ArrowDown":
        direction = 1;
        break;
      case "ArrowRight":
        direction = 2;
        break;
      case "ArrowUp":
        direction = 3;
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
    event.preventDefault();
  },
  true
);

const moveHead = () => {
  const head = segments[0];
  const nextMove = directions[direction];
  if (nextMove == "left") {
    head.left -= squareWidth;
  } else if (nextMove == "down") {
    head.top += squareWidth;
  } else if (nextMove == "up") {
    head.top -= squareWidth;
  } else if (nextMove == "right") {
    head.left += squareWidth;
  }
};

const moveBody = () => {
  for (let i = segments.length - 1; i > 0; i--) {
    segments[i].top = segments[i - 1].top;
    segments[i].left = segments[i - 1].left;
  }
};

// For this approach, we are moving the body first where each segment
// except the head shuffles to the area that the segment of it occupied;
// We then move the head of the snake to the direction that we want it to go
const updateSnake = () => {
  const head = segments[0];
  moveBody();
  moveHead();
  if (head.canEatDot(dot)) {
    addToTail = true;
    dot.move();
    framesPerLoop--;
  }
};

const renderSnake = () => {
  for (segment of segments) {
    segment.elem.style.left = `${segment.left}%`;
    segment.elem.style.top = `${segment.top}%`;
  }
};

const isAlive = () => {
  return segments.every((segment) => segment.inBounds()) && noOverlaps();
};

const noOverlaps = () => {
  const coords = segments.map((segment) => `${segment.left} ${segment.top}`);
  const uniqueCoords = new Set(coords);
  return coords.length == uniqueCoords.size;
};

function gameLoop() {
  numFrames++;
  if (numFrames == 1) {
    setSnake();
    renderSnake();
  }
  if (numFrames % framesPerLoop == 0) {
    updateSnake();
    renderSnake();
    dot.render();
    // Check for Game Over Before Adding To Tail
    if (!isAlive()) {
      segments.map((segment) => (segment.elem.style.display = `none`));
      game.style.background = "darkred";
      return;
    }
  }
  if (addToTail) {
    const tail = segments[segments.length - 1];
    const newSegment = document.createElement("div");
    newSegment.classList.add("snake-segment");
    newSegment.style.left = `${tail.left}%`;
    newSegment.style.top = `${tail.top}%`;
    game.appendChild(newSegment);
    segments.push(
      new Segment(newSegment, tail.left, tail.top, segments.length + 1)
    );
    addToTail = false;
  }
  requestAnimationFrame(gameLoop);
}
// This should probably be the final line in your
// program and the one that sets off the gameLoop.
requestAnimationFrame(gameLoop);
