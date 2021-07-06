import { IDigger } from "../api/IDigger";
import { IntMath } from "../web/IntMath";
import { Digger } from "./Digger";

export class Drawing {

  dig: IDigger;

  field1: i32[] = [	// [150]
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  field2: i32[] = [	// [150]
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  field: i32[] = [	// [150]
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  diggerbuf: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  bagbuf1: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  bagbuf2: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  bagbuf3: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  bagbuf4: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  bagbuf5: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  bagbuf6: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  bagbuf7: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  monbuf1: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  monbuf2: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  monbuf3: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  monbuf4: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  monbuf5: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  monbuf6: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  bonusbuf: Array<i32> = (new Array<i32>(480)).fill(0,0,480);
  firebuf: Array<i32> = (new Array<i32>(128)).fill(0,0,128);

  bitmasks: i32[] = [0xfffe, 0xfffd, 0xfffb, 0xfff7, 0xffef, 0xffdf, 0xffbf, 0xff7f, 0xfeff, 0xfdff, 0xfbff, 0xf7ff];	// [12]

  monspr: i32[] = [0, 0, 0, 0, 0, 0];	// [6]
  monspd: i32[] = [0, 0, 0, 0, 0, 0];	// [6]

  digspr: i32 = 0;
  digspd: i32 = 0;
  firespr: i32 = 0;
  fireheight: i32 = 8;

  constructor(d: IDigger) {
    this.dig = d;
  }

  createdbfspr(): void {
    this.digspd = 1;
    this.digspr = 0;
    this.firespr = 0;
    this.dig.GetSprite().createspr(0, 0, this.diggerbuf, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(14, 81, this.bonusbuf, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(15, 82, this.firebuf, 2, this.fireheight, 0, 0);
  }

  creatembspr(): void {
    this.dig.GetSprite().createspr(1, 62, this.bagbuf1, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(2, 62, this.bagbuf2, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(3, 62, this.bagbuf3, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(4, 62, this.bagbuf4, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(5, 62, this.bagbuf5, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(6, 62, this.bagbuf6, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(7, 62, this.bagbuf7, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(8, 71, this.monbuf1, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(9, 71, this.monbuf2, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(10, 71, this.monbuf3, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(11, 71, this.monbuf4, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(12, 71, this.monbuf5, 4, 15, 0, 0);
    this.dig.GetSprite().createspr(13, 71, this.monbuf6, 4, 15, 0, 0);
    this.createdbfspr();
    for (let i = 0; i < 6; i++) {
      this.monspr[i] = 0;
      this.monspd[i] = 1;
    }
  }

  drawbackg(l: i32): void {
    for (let y = 14; y < 200; y += 4)
      for (let x = 0; x < 320; x += 20)
        this.dig.GetSprite().drawmiscspr(x, y, 93 + l, 5, 4);
  }

  drawbonus(x: i32, y: i32): void {
    this.dig.GetSprite().initspr(14, 81, 4, 15, 0, 0);
    this.dig.GetSprite().movedrawspr(14, x, y);
  }

  drawbottomblob(x: i32, y: i32): void {
    this.dig.GetSprite().initmiscspr(x - 4, y + 15, 6, 6);
    this.dig.GetSprite().drawmiscspr(x - 4, y + 15, 105, 6, 6);
    this.dig.GetSprite().getis();
  }

  drawdigger(t: i32, x: i32, y: i32, f: boolean): i32 {
    this.digspr += this.digspd;
    if (this.digspr == 2 || this.digspr == 0)
      this.digspd = -this.digspd;
    if (this.digspr > 2)
      this.digspr = 2;
    if (this.digspr < 0)
      this.digspr = 0;
    if (t >= 0 && t <= 6 && !((t & 1) != 0)) {
      this.dig.GetSprite().initspr(0, (t + (f ? 0 : 1)) * 3 + this.digspr + 1, 4, 15, 0, 0);
      return this.dig.GetSprite().drawspr(0, x, y);
    }
    if (t >= 10 && t <= 15) {
      this.dig.GetSprite().initspr(0, 40 - t, 4, 15, 0, 0);
      return this.dig.GetSprite().drawspr(0, x, y);
    }
    return 0;
  }

  drawemerald(x: i32, y: i32): void {
    this.dig.GetSprite().initmiscspr(x, y, 4, 10);
    this.dig.GetSprite().drawmiscspr(x, y, 108, 4, 10);
    this.dig.GetSprite().getis();
  }

  drawfield(): void {
    for (let x = 0; x < 15; x++)
      for (let y = 0; y < 10; y++)
        if ((this.field[y * 15 + x] & 0x2000) == 0) {
          const xp = x * 20 + 12;
          const yp = y * 18 + 18;
          if ((this.field[y * 15 + x] & 0xfc0) != 0xfc0) {
            this.field[y * 15 + x] &= 0xd03f;
            this.drawbottomblob(xp, yp - 15);
            this.drawbottomblob(xp, yp - 12);
            this.drawbottomblob(xp, yp - 9);
            this.drawbottomblob(xp, yp - 6);
            this.drawbottomblob(xp, yp - 3);
            this.drawtopblob(xp, yp + 3);
          }
          if ((this.field[y * 15 + x] & 0x1f) != 0x1f) {
            this.field[y * 15 + x] &= 0xdfe0;
            this.drawrightblob(xp - 16, yp);
            this.drawrightblob(xp - 12, yp);
            this.drawrightblob(xp - 8, yp);
            this.drawrightblob(xp - 4, yp);
            this.drawleftblob(xp + 4, yp);
          }
          if (x < 14)
            if ((this.field[y * 15 + x + 1] & 0xfdf) != 0xfdf)
              this.drawrightblob(xp, yp);
          if (y < 9)
            if ((this.field[(y + 1) * 15 + x] & 0xfdf) != 0xfdf)
              this.drawbottomblob(xp, yp);
        }
  }

  drawfire(x: i32, y: i32, t: i32): i32 {
    if (t == 0) {
      this.firespr++;
      if (this.firespr > 2)
        this.firespr = 0;
      this.dig.GetSprite().initspr(15, 82 + this.firespr, 2, this.fireheight, 0, 0);
    }
    else
      this.dig.GetSprite().initspr(15, 84 + t, 2, this.fireheight, 0, 0);
    return this.dig.GetSprite().drawspr(15, x, y);
  }

  drawfurryblob(x: i32, y: i32): void {
    this.dig.GetSprite().initmiscspr(x - 4, y + 15, 6, 8);
    this.dig.GetSprite().drawmiscspr(x - 4, y + 15, 107, 6, 8);
    this.dig.GetSprite().getis();
  }

  drawgold(n: i32, t: i32, x: i32, y: i32): i32 {
    this.dig.GetSprite().initspr(n, t + 62, 4, 15, 0, 0);
    return this.dig.GetSprite().drawspr(n, x, y);
  }

  drawleftblob(x: i32, y: i32): void {
    this.dig.GetSprite().initmiscspr(x - 8, y - 1, 2, 18);
    this.dig.GetSprite().drawmiscspr(x - 8, y - 1, 104, 2, 18);
    this.dig.GetSprite().getis();
  }

  drawlife(t: i32, x: i32, y: i32): void {
    this.dig.GetSprite().drawmiscspr(x, y, t + 110, 4, 12);
  }

  drawlives(): void {
    let n = this.dig.GetMain().getlives(1) - 1;
    for (let l = 1; l < 5; l++) {
      this.drawlife(n > 0 ? 0 : 2, l * 20 + 60, 0);
      n--;
    }
    if (this.dig.GetMain().nplayers == 2) {
      n = this.dig.GetMain().getlives(2) - 1;
      for (let l = 1; l < 5; l++) {
        this.drawlife(n > 0 ? 1 : 2, 244 - l * 20, 0);
        n--;
      }
    }
  }

  drawmon(n: i32, nobf: boolean, dir: i32, x: i32, y: i32): i32 {
    this.monspr[n] += this.monspd[n];
    if (this.monspr[n] == 2 || this.monspr[n] == 0)
      this.monspd[n] = -this.monspd[n];
    if (this.monspr[n] > 2)
      this.monspr[n] = 2;
    if (this.monspr[n] < 0)
      this.monspr[n] = 0;
    if (nobf)
      this.dig.GetSprite().initspr(n + 8, this.monspr[n] + 69, 4, 15, 0, 0);
    else
      switch (dir) {
        case 0:
          this.dig.GetSprite().initspr(n + 8, this.monspr[n] + 73, 4, 15, 0, 0);
          break;
        case 4:
          this.dig.GetSprite().initspr(n + 8, this.monspr[n] + 77, 4, 15, 0, 0);
      }
    return this.dig.GetSprite().drawspr(n + 8, x, y);
  }

  drawmondie(n: i32, nobf: boolean, dir: i32, x: i32, y: i32): i32 {
    if (nobf)
      this.dig.GetSprite().initspr(n + 8, 72, 4, 15, 0, 0);
    else
      switch (dir) {
        case 0:
          this.dig.GetSprite().initspr(n + 8, 76, 4, 15, 0, 0);
          break;
        case 4:
          this.dig.GetSprite().initspr(n + 8, 80, 4, 14, 0, 0);
      }
    return this.dig.GetSprite().drawspr(n + 8, x, y);
  }

  drawrightblob(x: i32, y: i32): void {
    this.dig.GetSprite().initmiscspr(x + 16, y - 1, 2, 18);
    this.dig.GetSprite().drawmiscspr(x + 16, y - 1, 102, 2, 18);
    this.dig.GetSprite().getis();
  }

  drawsquareblob(x: i32, y: i32): void {
    this.dig.GetSprite().initmiscspr(x - 4, y + 17, 6, 6);
    this.dig.GetSprite().drawmiscspr(x - 4, y + 17, 106, 6, 6);
    this.dig.GetSprite().getis();
  }

  drawstatics(): void {
    for (let x = 0; x < 15; x++)
      for (let y = 0; y < 10; y++)
        if (this.dig.GetMain().getcplayer() == 0)
          this.field[y * 15 + x] = this.field1[y * 15 + x];
        else
          this.field[y * 15 + x] = this.field2[y * 15 + x];
    this.dig.GetSprite().setretr(true);
    this.dig.GetPc().P().gpal(0);
    this.dig.GetPc().P().ginten(0);
    this.drawbackg(this.dig.GetMain().levplan());
    this.drawfield();
    if (this.dig.GetPc().P().currentSource)
      this.dig.GetPc().P().currentSource.newPixels(0, 0, this.dig.GetPc().P().width, this.dig.GetPc().P().height);
  }

  drawtopblob(x: i32, y: i32): void {
    this.dig.GetSprite().initmiscspr(x - 4, y - 6, 6, 6);
    this.dig.GetSprite().drawmiscspr(x - 4, y - 6, 103, 6, 6);
    this.dig.GetSprite().getis();
  }

  eatfield(x: i32, y: i32, dir: i32): void {
    let h = IntMath.div((x - 12), 20);
    let xr = IntMath.div(((x - 12) % 20), 4);
    let v = IntMath.div((y - 18), 18);
    let yr = IntMath.div(((y - 18) % 18), 3);
    this.dig.GetMain().incpenalty();
    switch (dir) {
      case 0:
        h++;
        this.field[v * 15 + h] &= this.bitmasks[xr];
        if ((this.field[v * 15 + h] & 0x1f) != 0)
          break;
        this.field[v * 15 + h] &= 0xdfff;
        break;
      case 4:
        xr--;
        if (xr < 0) {
          xr += 5;
          h--;
        }
        this.field[v * 15 + h] &= this.bitmasks[xr];
        if ((this.field[v * 15 + h] & 0x1f) != 0)
          break;
        this.field[v * 15 + h] &= 0xdfff;
        break;
      case 2:
        yr--;
        if (yr < 0) {
          yr += 6;
          v--;
        }
        this.field[v * 15 + h] &= this.bitmasks[6 + yr];
        if ((this.field[v * 15 + h] & 0xfc0) != 0)
          break;
        this.field[v * 15 + h] &= 0xdfff;
        break;
      case 6:
        v++;
        this.field[v * 15 + h] &= this.bitmasks[6 + yr];
        if ((this.field[v * 15 + h] & 0xfc0) != 0)
          break;
        this.field[v * 15 + h] &= 0xdfff;
    }
  }

  eraseemerald(x: i32, y: i32): void {
    this.dig.GetSprite().initmiscspr(x, y, 4, 10);
    this.dig.GetSprite().drawmiscspr(x, y, 109, 4, 10);
    this.dig.GetSprite().getis();
  }

  initdbfspr(): void {
    this.digspd = 1;
    this.digspr = 0;
    this.firespr = 0;
    this.dig.GetSprite().initspr(0, 0, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(14, 81, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(15, 82, 2, this.fireheight, 0, 0);
  }

  initmbspr(): void {
    this.dig.GetSprite().initspr(1, 62, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(2, 62, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(3, 62, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(4, 62, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(5, 62, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(6, 62, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(7, 62, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(8, 71, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(9, 71, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(10, 71, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(11, 71, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(12, 71, 4, 15, 0, 0);
    this.dig.GetSprite().initspr(13, 71, 4, 15, 0, 0);
    this.initdbfspr();
  }

  makefield(): void {
    for (let x = 0; x < 15; x++)
      for (let y = 0; y < 10; y++) {
        this.field[y * 15 + x] = -1;
        const c = this.dig.GetMain().getlevch(x, y, this.dig.GetMain().levplan());
        if (c == 'S' || c == 'V')
          this.field[y * 15 + x] &= 0xd03f;
        if (c == 'S' || c == 'H')
          this.field[y * 15 + x] &= 0xdfe0;
        if (this.dig.GetMain().getcplayer() == 0)
          this.field1[y * 15 + x] = this.field[y * 15 + x];
        else
          this.field2[y * 15 + x] = this.field[y * 15 + x];
      }
  }

  outtext2(p: string, x: i32, y: i32, c: i32): void {
    this.outtext(p, x, y, c, false);
  }

  outtext(p: string, x: i32, y: i32, c: i32, b: boolean): void {
    const rx = x;
    for (let i = 0; i < p.length; i++) {
      this.dig.GetPc().P().gwrite2(x, y, p.charCodeAt(i), c);
      x += 12;
    }
    if (b && this.dig.GetPc().P().currentSource)
      this.dig.GetPc().P().currentSource.newPixels(rx, y, p.length * 12, 12);
  }

  savefield(): void {
    for (let x = 0; x < 15; x++)
      for (let y = 0; y < 10; y++)
        if (this.dig.GetMain().getcplayer() == 0)
          this.field1[y * 15 + x] = this.field[y * 15 + x];
        else
          this.field2[y * 15 + x] = this.field[y * 15 + x];
  }

}
