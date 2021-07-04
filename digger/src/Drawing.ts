import { Digger } from "./Digger";
import { IntMath } from "./IntMath";

export class Drawing {

  dig: Digger;

  field1: number[] = [	// [150]
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

  field2: number[] = [	// [150]
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

  field: number[] = [	// [150]
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

  diggerbuf = new Array(480);
  bagbuf1 = new Array(480);
  bagbuf2 = new Array(480);
  bagbuf3 = new Array(480);
  bagbuf4 = new Array(480);
  bagbuf5 = new Array(480);
  bagbuf6 = new Array(480);
  bagbuf7 = new Array(480);
  monbuf1 = new Array(480);
  monbuf2 = new Array(480);
  monbuf3 = new Array(480);
  monbuf4 = new Array(480);
  monbuf5 = new Array(480);
  monbuf6 = new Array(480);
  bonusbuf = new Array(480);
  firebuf = new Array(128);

  bitmasks: number[] = [0xfffe, 0xfffd, 0xfffb, 0xfff7, 0xffef, 0xffdf, 0xffbf, 0xff7f, 0xfeff, 0xfdff, 0xfbff, 0xf7ff];	// [12]

  monspr: number[] = [0, 0, 0, 0, 0, 0];	// [6]
  monspd: number[] = [0, 0, 0, 0, 0, 0];	// [6]

  digspr = 0;
  digspd = 0;
  firespr = 0;
  fireheight = 8;

  constructor(d: Digger) {
    this.dig = d;
  }

  createdbfspr(): void {
    this.digspd = 1;
    this.digspr = 0;
    this.firespr = 0;
    this.dig.Sprite.createspr(0, 0, this.diggerbuf, 4, 15, 0, 0);
    this.dig.Sprite.createspr(14, 81, this.bonusbuf, 4, 15, 0, 0);
    this.dig.Sprite.createspr(15, 82, this.firebuf, 2, this.fireheight, 0, 0);
  }

  creatembspr(): void {
    let i;
    this.dig.Sprite.createspr(1, 62, this.bagbuf1, 4, 15, 0, 0);
    this.dig.Sprite.createspr(2, 62, this.bagbuf2, 4, 15, 0, 0);
    this.dig.Sprite.createspr(3, 62, this.bagbuf3, 4, 15, 0, 0);
    this.dig.Sprite.createspr(4, 62, this.bagbuf4, 4, 15, 0, 0);
    this.dig.Sprite.createspr(5, 62, this.bagbuf5, 4, 15, 0, 0);
    this.dig.Sprite.createspr(6, 62, this.bagbuf6, 4, 15, 0, 0);
    this.dig.Sprite.createspr(7, 62, this.bagbuf7, 4, 15, 0, 0);
    this.dig.Sprite.createspr(8, 71, this.monbuf1, 4, 15, 0, 0);
    this.dig.Sprite.createspr(9, 71, this.monbuf2, 4, 15, 0, 0);
    this.dig.Sprite.createspr(10, 71, this.monbuf3, 4, 15, 0, 0);
    this.dig.Sprite.createspr(11, 71, this.monbuf4, 4, 15, 0, 0);
    this.dig.Sprite.createspr(12, 71, this.monbuf5, 4, 15, 0, 0);
    this.dig.Sprite.createspr(13, 71, this.monbuf6, 4, 15, 0, 0);
    this.createdbfspr();
    for (i = 0; i < 6; i++) {
      this.monspr[i] = 0;
      this.monspd[i] = 1;
    }
  }

  drawbackg(l: number): void {
    let x, y;
    for (y = 14; y < 200; y += 4)
      for (x = 0; x < 320; x += 20)
        this.dig.Sprite.drawmiscspr(x, y, 93 + l, 5, 4);
  }

  drawbonus(x: number, y: number): void {
    this.dig.Sprite.initspr(14, 81, 4, 15, 0, 0);
    this.dig.Sprite.movedrawspr(14, x, y);
  }

  drawbottomblob(x: number, y: number): void {
    this.dig.Sprite.initmiscspr(x - 4, y + 15, 6, 6);
    this.dig.Sprite.drawmiscspr(x - 4, y + 15, 105, 6, 6);
    this.dig.Sprite.getis();
  }

  drawdigger(t: number, x: number, y: number, f: boolean): number {
    this.digspr += this.digspd;
    if (this.digspr == 2 || this.digspr == 0)
      this.digspd = -this.digspd;
    if (this.digspr > 2)
      this.digspr = 2;
    if (this.digspr < 0)
      this.digspr = 0;
    if (t >= 0 && t <= 6 && !((t & 1) != 0)) {
      this.dig.Sprite.initspr(0, (t + (f ? 0 : 1)) * 3 + this.digspr + 1, 4, 15, 0, 0);
      return this.dig.Sprite.drawspr(0, x, y);
    }
    if (t >= 10 && t <= 15) {
      this.dig.Sprite.initspr(0, 40 - t, 4, 15, 0, 0);
      return this.dig.Sprite.drawspr(0, x, y);
    }
    return 0;
  }

  drawemerald(x: number, y: number): void {
    this.dig.Sprite.initmiscspr(x, y, 4, 10);
    this.dig.Sprite.drawmiscspr(x, y, 108, 4, 10);
    this.dig.Sprite.getis();
  }

  drawfield(): void {
    let x, y, xp, yp;
    for (x = 0; x < 15; x++)
      for (y = 0; y < 10; y++)
        if ((this.field[y * 15 + x] & 0x2000) == 0) {
          xp = x * 20 + 12;
          yp = y * 18 + 18;
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

  drawfire(x: number, y: number, t: number): number {
    if (t == 0) {
      this.firespr++;
      if (this.firespr > 2)
        this.firespr = 0;
      this.dig.Sprite.initspr(15, 82 + this.firespr, 2, this.fireheight, 0, 0);
    }
    else
      this.dig.Sprite.initspr(15, 84 + t, 2, this.fireheight, 0, 0);
    return this.dig.Sprite.drawspr(15, x, y);
  }

  drawfurryblob(x: number, y: number): void {
    this.dig.Sprite.initmiscspr(x - 4, y + 15, 6, 8);
    this.dig.Sprite.drawmiscspr(x - 4, y + 15, 107, 6, 8);
    this.dig.Sprite.getis();
  }

  drawgold(n: number, t: number, x: number, y: number): number {
    this.dig.Sprite.initspr(n, t + 62, 4, 15, 0, 0);
    return this.dig.Sprite.drawspr(n, x, y);
  }

  drawleftblob(x: number, y: number): void {
    this.dig.Sprite.initmiscspr(x - 8, y - 1, 2, 18);
    this.dig.Sprite.drawmiscspr(x - 8, y - 1, 104, 2, 18);
    this.dig.Sprite.getis();
  }

  drawlife(t: number, x: number, y: number): void {
    this.dig.Sprite.drawmiscspr(x, y, t + 110, 4, 12);
  }

  drawlives(): void {
    let l, n;
    n = this.dig.Main.getlives(1) - 1;
    for (l = 1; l < 5; l++) {
      this.drawlife(n > 0 ? 0 : 2, l * 20 + 60, 0);
      n--;
    }
    if (this.dig.Main.nplayers == 2) {
      n = this.dig.Main.getlives(2) - 1;
      for (l = 1; l < 5; l++) {
        this.drawlife(n > 0 ? 1 : 2, 244 - l * 20, 0);
        n--;
      }
    }
  }

  drawmon(n: number, nobf: boolean, dir: number, x: number, y: number): number {
    this.monspr[n] += this.monspd[n];
    if (this.monspr[n] == 2 || this.monspr[n] == 0)
      this.monspd[n] = -this.monspd[n];
    if (this.monspr[n] > 2)
      this.monspr[n] = 2;
    if (this.monspr[n] < 0)
      this.monspr[n] = 0;
    if (nobf)
      this.dig.Sprite.initspr(n + 8, this.monspr[n] + 69, 4, 15, 0, 0);
    else
      switch (dir) {
        case 0:
          this.dig.Sprite.initspr(n + 8, this.monspr[n] + 73, 4, 15, 0, 0);
          break;
        case 4:
          this.dig.Sprite.initspr(n + 8, this.monspr[n] + 77, 4, 15, 0, 0);
      }
    return this.dig.Sprite.drawspr(n + 8, x, y);
  }

  drawmondie(n: number, nobf: boolean, dir: number, x: number, y: number): number {
    if (nobf)
      this.dig.Sprite.initspr(n + 8, 72, 4, 15, 0, 0);
    else
      switch (dir) {
        case 0:
          this.dig.Sprite.initspr(n + 8, 76, 4, 15, 0, 0);
          break;
        case 4:
          this.dig.Sprite.initspr(n + 8, 80, 4, 14, 0, 0);
      }
    return this.dig.Sprite.drawspr(n + 8, x, y);
  }

  drawrightblob(x: number, y: number): void {
    this.dig.Sprite.initmiscspr(x + 16, y - 1, 2, 18);
    this.dig.Sprite.drawmiscspr(x + 16, y - 1, 102, 2, 18);
    this.dig.Sprite.getis();
  }

  drawsquareblob(x: number, y: number): void {
    this.dig.Sprite.initmiscspr(x - 4, y + 17, 6, 6);
    this.dig.Sprite.drawmiscspr(x - 4, y + 17, 106, 6, 6);
    this.dig.Sprite.getis();
  }

  drawstatics(): void {
    let x, y;
    for (x = 0; x < 15; x++)
      for (y = 0; y < 10; y++)
        if (this.dig.Main.getcplayer() == 0)
          this.field[y * 15 + x] = this.field1[y * 15 + x];
        else
          this.field[y * 15 + x] = this.field2[y * 15 + x];
    this.dig.Sprite.setretr(true);
    this.dig.Pc.gpal(0);
    this.dig.Pc.ginten(0);
    this.drawbackg(this.dig.Main.levplan());
    this.drawfield();
    if (this.dig.Pc.currentSource)
      this.dig.Pc.currentSource.newPixels(0, 0, this.dig.Pc.width, this.dig.Pc.height);
  }

  drawtopblob(x: number, y: number): void {
    this.dig.Sprite.initmiscspr(x - 4, y - 6, 6, 6);
    this.dig.Sprite.drawmiscspr(x - 4, y - 6, 103, 6, 6);
    this.dig.Sprite.getis();
  }

  eatfield(x: number, y: number, dir: number): void {
    let h = IntMath.div((x - 12), 20);
    let xr = IntMath.div(((x - 12) % 20), 4);
    let v = IntMath.div((y - 18), 18);
    let yr = IntMath.div(((y - 18) % 18), 3);
    this.dig.Main.incpenalty();
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

  eraseemerald(x: number, y: number): void {
    this.dig.Sprite.initmiscspr(x, y, 4, 10);
    this.dig.Sprite.drawmiscspr(x, y, 109, 4, 10);
    this.dig.Sprite.getis();
  }

  initdbfspr(): void {
    this.digspd = 1;
    this.digspr = 0;
    this.firespr = 0;
    this.dig.Sprite.initspr(0, 0, 4, 15, 0, 0);
    this.dig.Sprite.initspr(14, 81, 4, 15, 0, 0);
    this.dig.Sprite.initspr(15, 82, 2, this.fireheight, 0, 0);
  }

  initmbspr(): void {
    this.dig.Sprite.initspr(1, 62, 4, 15, 0, 0);
    this.dig.Sprite.initspr(2, 62, 4, 15, 0, 0);
    this.dig.Sprite.initspr(3, 62, 4, 15, 0, 0);
    this.dig.Sprite.initspr(4, 62, 4, 15, 0, 0);
    this.dig.Sprite.initspr(5, 62, 4, 15, 0, 0);
    this.dig.Sprite.initspr(6, 62, 4, 15, 0, 0);
    this.dig.Sprite.initspr(7, 62, 4, 15, 0, 0);
    this.dig.Sprite.initspr(8, 71, 4, 15, 0, 0);
    this.dig.Sprite.initspr(9, 71, 4, 15, 0, 0);
    this.dig.Sprite.initspr(10, 71, 4, 15, 0, 0);
    this.dig.Sprite.initspr(11, 71, 4, 15, 0, 0);
    this.dig.Sprite.initspr(12, 71, 4, 15, 0, 0);
    this.dig.Sprite.initspr(13, 71, 4, 15, 0, 0);
    this.initdbfspr();
  }

  makefield(): void {
    let c, x, y;
    for (x = 0; x < 15; x++)
      for (y = 0; y < 10; y++) {
        this.field[y * 15 + x] = -1;
        c = this.dig.Main.getlevch(x, y, this.dig.Main.levplan());
        if (c == 'S' || c == 'V')
          this.field[y * 15 + x] &= 0xd03f;
        if (c == 'S' || c == 'H')
          this.field[y * 15 + x] &= 0xdfe0;
        if (this.dig.Main.getcplayer() == 0)
          this.field1[y * 15 + x] = this.field[y * 15 + x];
        else
          this.field2[y * 15 + x] = this.field[y * 15 + x];
      }
  }

  outtext2(p: string, x: number, y: number, c: number): void {
    this.outtext(p, x, y, c, false);
  }

  outtext(p: string, x: number, y: number, c: number, b: boolean): void {
    let i;
    const rx = x;
    for (i = 0; i < p.length; i++) {
      this.dig.Pc.gwrite2(x, y, p.charCodeAt(i), c);
      x += 12;
    }
    if (b && this.dig.Pc.currentSource)
      this.dig.Pc.currentSource.newPixels(rx, y, p.length * 12, 12);
  }

  savefield(): void {
    let x, y;
    for (x = 0; x < 15; x++)
      for (y = 0; y < 10; y++)
        if (this.dig.Main.getcplayer() == 0)
          this.field1[y * 15 + x] = this.field[y * 15 + x];
        else
          this.field2[y * 15 + x] = this.field[y * 15 + x];
  }

}
