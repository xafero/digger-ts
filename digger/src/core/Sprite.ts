import { IDigger } from "../api/IDigger";
import { Digger } from "./Digger";

export class Sprite {

  dig: IDigger;

  retrflag: boolean = true;

  sprrdrwf: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];	// [17]
  sprrecf: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];	// [17]
  sprenf: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];	// [16]

  sprch: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]

  sprmov: (i32[] | null)[] = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];	// [16]

  sprx: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]
  spry: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]
  sprwid: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]
  sprhei: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]
  sprbwid: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
  sprbhei: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
  sprnch: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
  sprnwid: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
  sprnhei: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
  sprnbwid: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
  sprnbhei: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]

  defsprorder: i32[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];	// [16]
  sprorder: i32[] = this.defsprorder;

  constructor(d: IDigger) {
    this.dig = d;
  }

  bcollide(bx: i32, si: i32): boolean {
    if (this.sprx[bx] >= this.sprx[si]) {
      if (this.sprx[bx] + this.sprbwid[bx] > this.sprwid[si] * 4 + this.sprx[si] - this.sprbwid[si] - 1)
        return false;
    }
    else
      if (this.sprx[si] + this.sprbwid[si] > this.sprwid[bx] * 4 + this.sprx[bx] - this.sprbwid[bx] - 1)
        return false;
    if (this.spry[bx] >= this.spry[si]) {
      if (this.spry[bx] + this.sprbhei[bx] <= this.sprhei[si] + this.spry[si] - this.sprbhei[si] - 1)
        return true;
      return false;
    }
    if (this.spry[si] + this.sprbhei[si] <= this.sprhei[bx] + this.spry[bx] - this.sprbhei[bx] - 1)
      return true;
    return false;
  }

  bcollides(bx: i32): i32 {
    const si = bx;
    let ax = 0, dx = 0;
    bx = 0;
    do {
      if (this.sprenf[bx] && bx != si) {
        if (this.bcollide(bx, si))
          ax |= 1 << dx;
        this.sprx[bx] += 320;
        this.spry[bx] -= 2;
        if (this.bcollide(bx, si))
          ax |= 1 << dx;
        this.sprx[bx] -= 640;
        this.spry[bx] += 4;
        if (this.bcollide(bx, si))
          ax |= 1 << dx;
        this.sprx[bx] += 320;
        this.spry[bx] -= 2;
      }
      bx++;
      dx++;
    } while (dx != 16);
    return ax;
  }

  clearrdrwf(): void {
    this.clearrecf();
    for (let i = 0; i < 17; i++)
      this.sprrdrwf[i] = false;
  }

  clearrecf(): void {
    for (let i = 0; i < 17; i++)
      this.sprrecf[i] = false;
  }

  collide(bx: i32, si: i32): boolean {
    if (this.sprx[bx] >= this.sprx[si]) {
      if (this.sprx[bx] > this.sprwid[si] * 4 + this.sprx[si] - 1)
        return false;
    }
    else
      if (this.sprx[si] > this.sprwid[bx] * 4 + this.sprx[bx] - 1)
        return false;
    if (this.spry[bx] >= this.spry[si]) {
      if (this.spry[bx] <= this.sprhei[si] + this.spry[si] - 1)
        return true;
      return false;
    }
    if (this.spry[si] <= this.sprhei[bx] + this.spry[bx] - 1)
      return true;
    return false;
  }

  createspr(n: i32, ch: i32, mov: i32[], wid: i32, hei: i32, bwid: i32, bhei: i32): void {
    this.sprnch[n & 15] = this.sprch[n & 15] = ch;
    this.sprmov[n & 15] = mov;
    this.sprnwid[n & 15] = this.sprwid[n & 15] = wid;
    this.sprnhei[n & 15] = this.sprhei[n & 15] = hei;
    this.sprnbwid[n & 15] = this.sprbwid[n & 15] = bwid;
    this.sprnbhei[n & 15] = this.sprbhei[n & 15] = bhei;
    this.sprenf[n & 15] = false;
  }

  drawmiscspr(x: i32, y: i32, ch: i32, wid: i32, hei: i32): void {
    this.sprx[16] = x & -4;
    this.spry[16] = y;
    this.sprch[16] = ch;
    this.sprwid[16] = wid;
    this.sprhei[16] = hei;
    this.dig.GetPc().P().gputim(this.sprx[16], this.spry[16], this.sprch[16], this.sprwid[16], this.sprhei[16]);
  }

  drawspr(n: i32, x: i32, y: i32): i32 {
    const bx = n & 15;
    x &= -4;
    this.clearrdrwf();
    this.setrdrwflgs(bx);
    const t1 = this.sprx[bx];
    const t2 = this.spry[bx];
    const t3 = this.sprwid[bx];
    const t4 = this.sprhei[bx];
    this.sprx[bx] = x;
    this.spry[bx] = y;
    this.sprwid[bx] = this.sprnwid[bx];
    this.sprhei[bx] = this.sprnhei[bx];
    this.clearrecf();
    this.setrdrwflgs(bx);
    this.sprhei[bx] = t4;
    this.sprwid[bx] = t3;
    this.spry[bx] = t2;
    this.sprx[bx] = t1;
    this.sprrdrwf[bx] = true;
    this.putis();
    this.sprx[bx] = x;
    this.spry[bx] = y;
    this.sprch[bx] = this.sprnch[bx];
    this.sprwid[bx] = this.sprnwid[bx];
    this.sprhei[bx] = this.sprnhei[bx];
    this.sprbwid[bx] = this.sprnbwid[bx];
    this.sprbhei[bx] = this.sprnbhei[bx];
    this.dig.GetPc().P().ggeti(this.sprx[bx], this.spry[bx], this.sprmov[bx], this.sprwid[bx], this.sprhei[bx]);
    this.putims();
    return this.bcollides(bx);
  }

  erasespr(n: i32): void {
    const bx = n & 15;
    this.dig.GetPc().P().gputi(this.sprx[bx], this.spry[bx], this.sprmov[bx], this.sprwid[bx], this.sprhei[bx], true);
    this.sprenf[bx] = false;
    this.clearrdrwf();
    this.setrdrwflgs(bx);
    this.putims();
  }

  getis(): void {
    for (let i = 0; i < 16; i++)
      if (this.sprrdrwf[i])
        this.dig.GetPc().P().ggeti(this.sprx[i], this.spry[i], this.sprmov[i], this.sprwid[i], this.sprhei[i]);
    this.putims();
  }

  initmiscspr(x: i32, y: i32, wid: i32, hei: i32): void {
    this.sprx[16] = x;
    this.spry[16] = y;
    this.sprwid[16] = wid;
    this.sprhei[16] = hei;
    this.clearrdrwf();
    this.setrdrwflgs(16);
    this.putis();
  }

  initspr(n: i32, ch: i32, wid: i32, hei: i32, bwid: i32, bhei: i32): void {
    this.sprnch[n & 15] = ch;
    this.sprnwid[n & 15] = wid;
    this.sprnhei[n & 15] = hei;
    this.sprnbwid[n & 15] = bwid;
    this.sprnbhei[n & 15] = bhei;
  }

  movedrawspr(n: i32, x: i32, y: i32): i32 {
    const bx = n & 15;
    this.sprx[bx] = x & -4;
    this.spry[bx] = y;
    this.sprch[bx] = this.sprnch[bx];
    this.sprwid[bx] = this.sprnwid[bx];
    this.sprhei[bx] = this.sprnhei[bx];
    this.sprbwid[bx] = this.sprnbwid[bx];
    this.sprbhei[bx] = this.sprnbhei[bx];
    this.clearrdrwf();
    this.setrdrwflgs(bx);
    this.putis();
    this.dig.GetPc().P().ggeti(this.sprx[bx], this.spry[bx], this.sprmov[bx], this.sprwid[bx], this.sprhei[bx]);
    this.sprenf[bx] = true;
    this.sprrdrwf[bx] = true;
    this.putims();
    return this.bcollides(bx);
  }

  putims(): void {
    for (let i = 0; i < 16; i++) {
      const j = this.sprorder[i];
      if (this.sprrdrwf[j])
        this.dig.GetPc().P().gputim(this.sprx[j], this.spry[j], this.sprch[j], this.sprwid[j], this.sprhei[j]);
    }
  }

  putis(): void {
    for (let i = 0; i < 16; i++)
      if (this.sprrdrwf[i])
        this.dig.GetPc().P().gputi2(this.sprx[i], this.spry[i], this.sprmov[i], this.sprwid[i], this.sprhei[i]);
  }

  setrdrwflgs(n: i32): void {
    if (!this.sprrecf[n]) {
      this.sprrecf[n] = true;
      for (let i = 0; i < 16; i++)
        if (this.sprenf[i] && i != n) {
          if (this.collide(i, n)) {
            this.sprrdrwf[i] = true;
            this.setrdrwflgs(i);
          }
          this.sprx[i] += 320;
          this.spry[i] -= 2;
          if (this.collide(i, n)) {
            this.sprrdrwf[i] = true;
            this.setrdrwflgs(i);
          }
          this.sprx[i] -= 640;
          this.spry[i] += 4;
          if (this.collide(i, n)) {
            this.sprrdrwf[i] = true;
            this.setrdrwflgs(i);
          }
          this.sprx[i] += 320;
          this.spry[i] -= 2;
        }
    }
  }

  setretr(f: boolean): void {
    this.retrflag = f;
  }

  setsprorder(newsprorder: i32[]): void {
    if (newsprorder == null)
      this.sprorder = this.defsprorder;
    else
      this.sprorder = newsprorder;
  }

}
