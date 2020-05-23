import { fabric } from "fabric";
import * as $ from "jquery";
import { UAParser } from "ua-parser-js";
// @ts-ignore
import Gamepad from "./gamepad";
import { Player, Wall, sleep } from "./helper";
import "./style";
declare global {
  interface Window {
    w: Wall;
    blue: Player;
  }
}

const times = (x: number) => (f: () => void) => {
  if (x > 0) {
    f();
    times(x - 1)(f);
  }
};

const timesP = (x: number) => async (f: any) => {
  if (x > 0) {
    await f();

    await timesP(x - 1)(async () => {
      await f();
    });
  }
};
$(async function () {
  let sticks = false;
  let parser = new UAParser();
  const model = parser.getResult().os.name;

  if (model === "Nintendo") {
    sticks = true;
  }

  $("canvas")
    .toArray()
    .forEach(function (canvasEl: any) {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
    });
  const fselem = document.body as HTMLElement & {
    mozRequestFullScreen(): Promise<void>;
    webkitRequestFullscreen(): Promise<void>;
    msRequestFullscreen(): Promise<void>;
  };

  const requestFullScreen = function (element = fselem) {
    var requestMethod, wscript;
    // Supports most browsers and their versions.
    requestMethod =
      element.requestFullscreen ||
      element.webkitRequestFullscreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen;
    if (requestMethod) {
      // Native full screen.
      return requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
      // Older IE.
      wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        return wscript.SendKeys("{F11}");
      }
    }
  };
  if (model === "Nintendo") {
    requestFullScreen();
  }

  // throw Error("yeet")
  // client-side js
  // run by the browser each time your view template is loaded
  // by default it takes ua string from current browser's
  // window.navigator.userAgent

  $("#fs").text(parser.getResult().os.name || "idk");

  $("body").click(function () {
    // return requestFullScreen();
  });
  // requestFullScreen document.body
  // $('#fs').css 'display', 'none'

  let canvasEl = <HTMLCanvasElement>$("canvas")[0];
  let context = canvasEl.getContext("2d");
  // create a wrapper around native canvas element (with id="c")
  let canvas = new fabric.Canvas(canvasEl);
  // canvas.on("after:render", function () {
  //   canvas.contextContainer.strokeStyle = "#555";

  //   canvas.forEachObject(function (obj) {
  //     var bound = obj.getBoundingRect();

  //     canvas.contextContainer.strokeRect(
  //       bound.left + 0.5,
  //       bound.top + 0.5,
  //       bound.width,
  //       bound.height
  //     );
  //   });
  // });
  canvas.backgroundColor = "black";
  canvas.renderAll();
  var blue = new Player(canvas, "Otto");
  window.blue = blue;
  canvas.add(blue.canvasObj);
  // create a rectangle object
  // var player = new fabric.Rect({
  //   left: 100,
  //   top: 100,
  //   fill: "#00FEFF",
  //   width: 20,
  //   height: 20
  // })
  $("canvas")
    .toArray()
    .forEach(function (canvasEl: any) {
      canvasEl.width = window.innerWidth;
      return (canvasEl.height = window.innerHeight);
    });
  // "add" rectangle onto canvas
  // canvas.add(player)
  var gamepad: any = new Gamepad();
  // Press
  // Hold
  gamepad.on("hold", "stick_axis_left", function (e: any) {
    if (sticks) {
      blue.velocity.x = e.value[0];
      return (blue.velocity.y = -e.value[1]);
    }
  });
  // player.set({})
  gamepad.on("release", "stick_axis_left", function (e: any) {
    blue.velocity = {
      x: 0,
      y: 0,
    };
    return (blue.e = 0);
  });
  // player.set({})

  // stick_axis_left
  // Release
  gamepad.on("hold", "d_pad_up", function (e: any) {
    if (!sticks) {
      return (blue.velocity.y = e.value || 1);
    }
  });
  gamepad.on("release", "d_pad_up", function (e: any) {
    if (!sticks) {
      return (blue.velocity.y = 0);
    }
  });
  gamepad.on("hold", "d_pad_right", function (e: any) {
    if (!sticks) {
      return (blue.velocity.x = e.value || 1);
    }
  });
  gamepad.on("release", "d_pad_right", function (e: any) {
    if (!sticks) {
      return (blue.velocity.x = 0);
    }
  });
  gamepad.on("hold", "d_pad_left", function (e: any) {
    if (!sticks) {
      return (blue.velocity.x = e.value || -1);
    }
  });
  gamepad.on("release", "d_pad_left", function () {
    if (!sticks) {
      return (blue.velocity.x = 0);
    }
  });
  gamepad.on("hold", "d_pad_down", function (e: any) {
    if (!sticks) {
      return (blue.velocity.y = e.value || -1);
    }
  });
  gamepad.on("release", "d_pad_down", function (e: any) {
    if (!sticks) {
      return (blue.velocity.y = 0);
    }
  });
  // Controller Connected
  gamepad.on("connect", function (e: any) {});
  // Controller Disconnected
  gamepad.on("disconnect", function (e: any) {});
  let kids = async function (stop = true): Promise<Wall> {
    return new Promise(async (s, j) => {
      await sleep(1000);
      let w = new Wall(Math.floor(Math.random() * 1000));
      canvas.add(w.canvasObj);
      await w.activate();
      if (stop) {
        w.endLoop();
        canvas.remove(w.canvasObj);
      }
      s(w);
    });
  };
  // Press
  blue.startLoop();
  timesP(0)(async () => {
    return new Promise(async (s) => {
      kids();
      await sleep(200);
      s();
    });
  });

  let w = new Wall(Math.floor(Math.random() * 1000));
  canvas.add(w.canvasObj);
  w.startLoop();
  window.w = w;
});
