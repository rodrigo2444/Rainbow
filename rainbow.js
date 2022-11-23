if (typeof disableLimits === 'function') { disableLimits(); }

const canvas = document.createElement('canvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const centerX = width / 2;
const centerY = height / 2;
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// To make rendering math easier, translate our coordinate system so that
// the origin at (0, 0) is in the center of the canvas.
ctx.translate(centerX, centerY);

const colors = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'GhostWhite', 'Gold', 'GoldenRod', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'SkyBlue', 'SlateBlue', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'];

const mouse = {
  down: false,
  x: 0,
  y: 0,
  wheel: 0,
  lastInput: 0,
};

const updateLastInput = () => mouse.lastInput = Date.now();

canvas.onmousedown = canvas.ontouchstart = function(e) {
  updateLastInput();
  mouse.down = true;
};

canvas.onmouseup = canvas.ontouchend = canvas.onmouseout = function(e) {
  updateLastInput();
  mouse.down = false;
};

canvas.onmousewheel = function(e) {
  updateLastInput();
  mouse.wheel = e.wheelDelta;
  e.preventDefault();
};

canvas.onmousemove = canvas.ontouchmove = function(e) {
  updateLastInput();
  mouse.x = e.pageX - canvas.offsetLeft - centerX;
  mouse.y = e.pageY - canvas.offsetTop - centerY;
}

const maxRadius = 150;

const jitter = (range) => Math.random() * range - (range / 2);
const lerp = (from, to, amount) => from + amount * (to - from);

class Star {
  constructor() {
    this.init();
  }
  init() {
    this.radius = Math.random() * maxRadius;
    this.x = jitter(width);
    this.y = jitter(height);
    this.color = colors[Math.floor(colors.length * Math.random())];
    this.rot = 2 * Math.PI * Math.random();
    this.rotAmount = jitter(10);
  }
  render() {
    this.radius++;
    if (mouse.down || Date.now() - mouse.lastInput < 100) {
      const repelAttract = mouse.down ? 1.15 : 0.9;
      this.x = lerp(mouse.x, this.x, repelAttract);
      this.y = lerp(mouse.y, this.y, repelAttract);
      this.rotAmount += mouse.wheel / 10 * Math.PI / 180;
    }

    if (this.radius > maxRadius) {
      this.init();
      this.radius = 1;
    }
    this.rot += this.rotAmount * Math.PI / 180;

    // Draw the star
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.beginPath();
    ctx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

class Galaxy {
  constructor() {
    this.stars = [];
    for (let i = 0; i < 100; ++i) {
      this.stars.push(new Star());
    }
  }
  render() {
    requestAnimationFrame(() => this.render());
    ctx.fillStyle = 'white';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.globalAlpha = 0.025;
    for (const star of this.stars) {
      star.render();
    }
  }
}

(new Galaxy()).render();
