import { Digger } from "./core/Digger";
import { FakeDigger } from "./core/fake";
import { WebDigger } from "./web/WebDigger";

declare function processImage(array: Uint8ClampedArray): void;
declare function sleep(ms: i64): void;
declare function log(text: string): void;

var hello: WebDigger;

export function doKeyDown(code: string, key: string, keyCode: i32): void {
  log(`got KeyDown: ${code} ${key} ${keyCode}`);
  hello.KeyDown(code, keyCode);
}

export function doKeyUp(code: string, key: string, keyCode: i32): void {
  log(`got KeyUp: ${code} ${key} ${keyCode}`);
  hello.KeyUp(code, keyCode);
}

export function bootUp(): void {
  log('Creating web digger...');
  const web = new WebDigger(new FakeDigger(), sleep, processImage);
  hello = web;
  log('Creating core digger...');
  const game = new Digger(web);
  log('Patching instance...');
  web._digger = game;
  log('Setting it up...');
  game.init();
  log('Starting it...');
  game.start();
  log('Started it!');
}

export function shutDown(): void {
  log('Shutting down!');
}
