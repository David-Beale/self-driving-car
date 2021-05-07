import * as THREE from "three";
const ROAD_COLOR = "rgb(73, 73, 73)";

function generateTexture(func) {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;

  const context = canvas.getContext("2d");
  func(context);
  return canvas;
}

export const mapDrawings = {
  XR: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
  },
  HR: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    for (let i = 1; i < 100; i += 98) {
      c.beginPath();
      c.moveTo(x, y + i);
      c.lineTo(x + 100, y + i);
      c.stroke();
    }
    c.strokeStyle = "white";
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath();
      c.moveTo(x + i, y + 50);
      c.lineTo(x + i + 10, y + 50);
      c.stroke();
    }
  },
  TB: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    c.beginPath();
    c.moveTo(x, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
    c.strokeStyle = "white";
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath();
      c.moveTo(x + i, y + 50);
      c.lineTo(x + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(x, y + 99);
    c.lineTo(x + 50, y + 99);
    c.stroke();
  },
  TT: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    c.beginPath();
    c.moveTo(x, y + 99);
    c.lineTo(x + 100, y + 99);
    c.stroke();
    c.strokeStyle = "white";
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath();
      c.moveTo(x + i, y + 50);
      c.lineTo(x + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(x + 50, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
  },
  VR: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    for (let i = 1; i < 100; i += 98) {
      c.beginPath();
      c.moveTo(x + i, y);
      c.lineTo(x + i, y + 100);
      c.stroke();
    }
    c.strokeStyle = "white";
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath();
      c.moveTo(x + 50, y + i);
      c.lineTo(x + 50, y + i + 10);
      c.stroke();
    }
  },
  TR: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    c.beginPath();
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 100);
    c.stroke();
    c.strokeStyle = "white";
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath();
      c.moveTo(x + 50, y + i);
      c.lineTo(x + 50, y + i + 10);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(x + 99, y + 50);
    c.lineTo(x + 99, y + 100);
    c.stroke();
  },
  TL: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    c.beginPath();
    c.moveTo(x + 99, y);
    c.lineTo(x + 99, y + 100);
    c.stroke();
    c.strokeStyle = "white";
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath();
      c.moveTo(x + 50, y + i);
      c.lineTo(x + 50, y + i + 10);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 50);
    c.stroke();
  },
  TLC: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    c.beginPath();
    c.moveTo(x, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
    c.beginPath();
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 100);
    c.stroke();
    c.strokeStyle = "white";
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath();
      c.moveTo(x + 50, y + 50 + i);
      c.lineTo(x + 50, y + 50 + i + 10);
      c.stroke();
      c.beginPath();
      c.moveTo(x + 50 + i, y + 50);
      c.lineTo(x + 50 + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 55, y + 50);
    c.stroke();
    c.beginPath();
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 55);
    c.stroke();
  },
  TRC: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    c.beginPath();
    c.moveTo(x, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
    c.beginPath();
    c.moveTo(x + 99, y);
    c.lineTo(x + 99, y + 100);
    c.stroke();
    c.strokeStyle = "white";
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath();
      c.moveTo(x + 50, y + 50 + i);
      c.lineTo(x + 50, y + 50 + i + 10);
      c.stroke();
      c.beginPath();
      c.moveTo(x + 50 - i, y + 50);
      c.lineTo(x + 50 - i - 10, y + 50);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 45, y + 50);
    c.stroke();
    c.beginPath();
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 55);
    c.stroke();
  },
  BRC: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    c.beginPath();
    c.moveTo(x, y + 99);
    c.lineTo(x + 100, y + 99);
    c.stroke();
    c.beginPath();
    c.moveTo(x + 99, y);
    c.lineTo(x + 99, y + 100);
    c.stroke();
    c.strokeStyle = "white";
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath();
      c.moveTo(x + 50, y + 50 - i);
      c.lineTo(x + 50, y + 50 - i - 10);
      c.stroke();
      c.beginPath();
      c.moveTo(x + 50 - i, y + 50);
      c.lineTo(x + 50 - i - 10, y + 50);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 45, y + 50);
    c.stroke();
    c.beginPath();
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 45);
    c.stroke();
  },
  BLC: function (c, x = 0, y = 0) {
    c.fillStyle = ROAD_COLOR;
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = "yellow";
    c.beginPath();
    c.moveTo(x, y + 99);
    c.lineTo(x + 100, y + 99);
    c.stroke();
    c.beginPath();
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 100);
    c.stroke();
    c.strokeStyle = "white";
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath();
      c.moveTo(x + 50, y + 50 - i);
      c.lineTo(x + 50, y + 50 - i - 10);
      c.stroke();
      c.beginPath();
      c.moveTo(x + 50 + i, y + 50);
      c.lineTo(x + 50 + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 55, y + 50);
    c.stroke();
    c.beginPath();
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 45);
    c.stroke();
  },
};

const XR = new THREE.CanvasTexture(generateTexture(mapDrawings.XR));
const HR = new THREE.CanvasTexture(generateTexture(mapDrawings.HR));
const TB = new THREE.CanvasTexture(generateTexture(mapDrawings.TB));
const TT = new THREE.CanvasTexture(generateTexture(mapDrawings.TT));
const VR = new THREE.CanvasTexture(generateTexture(mapDrawings.VR));
const TR = new THREE.CanvasTexture(generateTexture(mapDrawings.TR));
const TL = new THREE.CanvasTexture(generateTexture(mapDrawings.TL));
const TLC = new THREE.CanvasTexture(generateTexture(mapDrawings.TLC));
const TRC = new THREE.CanvasTexture(generateTexture(mapDrawings.TRC));
const BRC = new THREE.CanvasTexture(generateTexture(mapDrawings.BRC));
const BLC = new THREE.CanvasTexture(generateTexture(mapDrawings.BLC));

export const textures = { XR, HR, TB, TT, VR, TR, TL, TLC, TRC, BRC, BLC };
