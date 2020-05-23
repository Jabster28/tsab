import { fabric } from "fabric";

const toRadians = function (degrees: number) {
  return (degrees * Math.PI) / 180;
};
// Converts from radians to degrees.
const toDegrees = function (radians: number) {
  return (radians * 180) / Math.PI;
};
const bearing = function (
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number
) {
  var brng, x, y;
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);
  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
};
const sleep = function (ms: number) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};
export { sleep };

export class Wall {
  dim = {
    y: 500,
    w: 50,
    v: 0,
    x: -20,
  };
  renderLoop!: NodeJS.Timeout;
  constructor(x: number) {
    this.dim.x = x;
  }
  timing = {
    warn: 2000,
    active: 1000,
  };
  canvasObj = new fabric.Rect({
    left: (window.innerWidth * this.dim.x) / 1000,
    top: window.innerHeight - (window.innerHeight * this.dim.y) / 1000,
    fill: "#FE2D71",
    width: this.dim.w,
    height: window.innerHeight,
  });
  async shake() {
    this.dim.x + 100;
    await sleep(500);
    this.dim.y + 100;
    await sleep(500);
    this.dim.x - 100;
    await sleep(500);
    this.dim.y - 100;
    await sleep(500);
  }
  activate() {
    return new Promise(async (res) => {
      this.dim.y = 20;
      this.dim.v = 1;
      var x = setInterval(() => {
        return (this.dim.y += this.dim.v);
      }, 20);
      this.startLoop();
      await sleep(1000);
      // @dim.v = 21.2
      // await sleep(1000)
      clearInterval(x);
      var i = 0;
      while (i < 3) {
        i++;
        this.dim.y += 311;
        await sleep(20);
      }

      await sleep(1000);

      res();
    });
  }

  startLoop() {
    this.renderLoop = setInterval(() => {
      // canvas.renderAll();
      this.canvasObj.set({
        left: (window.innerWidth * this.dim.x) / 1000,
        top: window.innerHeight - (window.innerHeight * this.dim.y) / 1000,
      });
    }, 20);
  }

  endLoop() {
    return clearInterval(this.renderLoop);
  }
}

export class Player {
  name = "";
  speed = 50;
  index = 0; // TODO: index based on no. of players
  dim = {
    x: 500,
    y: 500,
  };
  velocity = {
    x: 0,
    y: 0,
  };
  a = 0;
  c = 0;
  e = 0;
  canvas: fabric.StaticCanvas;
  canvasObj = new fabric.Rect({
    left: (window.innerWidth * this.dim.x) / 1000,
    top: window.innerHeight - (window.innerHeight * this.dim.y) / 1000,
    fill: "#00FEFF",
    width: 20,
    height: 20,
    originX: "center",
    originY: "center",
  });
  renderLoop!: NodeJS.Timeout;
  constructor(canvas: fabric.StaticCanvas, name: string) {
    this.canvas = canvas;
  }

  startLoop() {
    this.renderLoop = setInterval(() => {
      if (this.dim.x > 1000) {
        this.dim.x = 1000;
      }
      if (this.dim.x < 0) {
        this.dim.x = 0;
      }
      if (this.dim.y > 1000) {
        this.dim.y = 1000;
      }
      if (this.dim.y < 0) {
        this.dim.y = 0;
      }
      this.e = bearing(
        this.dim.x,
        this.dim.y,
        this.dim.x + (this.velocity.x / 16) * this.speed,
        this.dim.y + (this.velocity.y / 9) * this.speed + 90
      );
      this.canvasObj.rotate(this.e);
      this.dim.x = this.dim.x + (this.velocity.x / 16) * this.speed;
      this.dim.y = this.dim.y + (this.velocity.y / 9) * this.speed;
      this.canvasObj.set({
        left: (window.innerWidth * this.dim.x) / 1000,
        top: window.innerHeight - (window.innerHeight * this.dim.y) / 1000,
      });
      this.canvas.renderAll();
    }, 20);
  }

  endLoop() {
    return clearInterval(this.renderLoop);
  }
}
