import { Digger } from "./Digger";
import { WebDigger } from "./WebDigger";

function boot() {

  const web = new WebDigger(null);
  const game = new Digger(web);
  web._digger = game;
  game.init();

  const x11 = <any>window;
  x11.myGame = web;

  const canvas = <HTMLCanvasElement>document.getElementById('screen');
  canvas.width = game.width * 4.03;
  canvas.height = game.height * 4.15;

  document.addEventListener('keyup', function (e) { web.KeyUp(e.key); });
  document.addEventListener('keydown', function (e) { web.KeyDown(e.key); });

  setTimeout(function () { game.start(); }, 1000);
}

const x12 = <any>window;
x12.setup = boot;
