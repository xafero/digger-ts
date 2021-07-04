import { Digger } from "./Digger";
import { IntMath } from "./IntMath";
import { _bag } from "./_bag";

export class Bags {

	dig: Digger;

	bagdat1: _bag[] = [new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag()];
	bagdat2: _bag[] = [new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag()];
	bagdat: _bag[] = [new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag()];

	pushcount = 0;
	goldtime = 0;

	wblanim: number[] = [2, 0, 1, 0];	// [4]

	constructor(d: Digger) {
		this.dig = d;
	}

	bagbits(): number {
		let bag, b, bags = 0;
		for (bag = 1, b = 2; bag < 8; bag++, b <<= 1)
			if (this.bagdat[bag].exist)
				bags |= b;
		return bags;
	}

	baghitground(bag: number): void {
		let bn, b;
		if (this.bagdat[bag].dir == 6 && this.bagdat[bag].fallh > 1)
			this.bagdat[bag].gt = 1;
		else
			this.bagdat[bag].fallh = 0;
		this.bagdat[bag].dir = -1;
		this.bagdat[bag].wt = 15;
		this.bagdat[bag].wobbling = false;
		const clbits = this.dig.Drawing.drawgold(bag, 0, this.bagdat[bag].x, this.bagdat[bag].y);
		this.dig.Main.incpenalty();
		for (bn = 1, b = 2; bn < 8; bn++, b <<= 1)
			if ((b & clbits) != 0)
				this.removebag(bn);
	}

	bagy(bag: number): number {
		return this.bagdat[bag].y;
	}

	cleanupbags(): void {
		let bpa;
		this.dig.Sound.soundfalloff();
		for (bpa = 1; bpa < 8; bpa++) {
			if (this.bagdat[bpa].exist && ((this.bagdat[bpa].h == 7 && this.bagdat[bpa].v == 9) ||
				this.bagdat[bpa].xr != 0 || this.bagdat[bpa].yr != 0 || this.bagdat[bpa].gt != 0 ||
				this.bagdat[bpa].fallh != 0 || this.bagdat[bpa].wobbling)) {
				this.bagdat[bpa].exist = false;
				this.dig.Sprite.erasespr(bpa);
			}
			if (this.dig.Main.getcplayer() == 0)
				this.bagdat1[bpa].copyFrom(this.bagdat[bpa]);
			else
				this.bagdat2[bpa].copyFrom(this.bagdat[bpa]);
		}
	}

	dobags(): void {
		let bag;
		let soundfalloffflag = true;
		let soundwobbleoffflag = true;
		for (bag = 1; bag < 8; bag++)
			if (this.bagdat[bag].exist) {
				if (this.bagdat[bag].gt != 0) {
					if (this.bagdat[bag].gt == 1) {
						this.dig.Sound.soundbreak();
						this.dig.Drawing.drawgold(bag, 4, this.bagdat[bag].x, this.bagdat[bag].y);
						this.dig.Main.incpenalty();
					}
					if (this.bagdat[bag].gt == 3) {
						this.dig.Drawing.drawgold(bag, 5, this.bagdat[bag].x, this.bagdat[bag].y);
						this.dig.Main.incpenalty();
					}
					if (this.bagdat[bag].gt == 5) {
						this.dig.Drawing.drawgold(bag, 6, this.bagdat[bag].x, this.bagdat[bag].y);
						this.dig.Main.incpenalty();
					}
					this.bagdat[bag].gt++;
					if (this.bagdat[bag].gt == this.goldtime)
						this.removebag(bag);
					else
						if (this.bagdat[bag].v < 9 && this.bagdat[bag].gt < this.goldtime - 10)
							if ((this.dig.Monster.getfield(this.bagdat[bag].h, this.bagdat[bag].v + 1) & 0x2000) == 0)
								this.bagdat[bag].gt = this.goldtime - 10;
				}
				else
					this.updatebag(bag);
			}
		for (bag = 1; bag < 8; bag++) {
			if (this.bagdat[bag].dir == 6 && this.bagdat[bag].exist)
				soundfalloffflag = false;
			if (this.bagdat[bag].dir != 6 && this.bagdat[bag].wobbling && this.bagdat[bag].exist)
				soundwobbleoffflag = false;
		}
		if (soundfalloffflag)
			this.dig.Sound.soundfalloff();
		if (soundwobbleoffflag)
			this.dig.Sound.soundwobbleoff();
	}

	drawbags(): void {
		let bag;
		for (bag = 1; bag < 8; bag++) {
			if (this.dig.Main.getcplayer() == 0)
				this.bagdat[bag].copyFrom(this.bagdat1[bag]);
			else
				this.bagdat[bag].copyFrom(this.bagdat2[bag]);
			if (this.bagdat[bag].exist)
				this.dig.Sprite.movedrawspr(bag, this.bagdat[bag].x, this.bagdat[bag].y);
		}
	}

	getbagdir(bag: number): number {
		if (this.bagdat[bag].exist)
			return this.bagdat[bag].dir;
		return -1;
	}

	getgold(bag: number): void {
		const clbits = this.dig.Drawing.drawgold(bag, 6, this.bagdat[bag].x, this.bagdat[bag].y);
		this.dig.Main.incpenalty();
		if ((clbits & 1) != 0) {
			this.dig.Scores.scoregold();
			this.dig.Sound.soundgold();
			this.dig.digtime = 0;
		}
		else
			this.dig.Monster.mongold();
		this.removebag(bag);
	}

	getnmovingbags(): number {
		let bag, n = 0;
		for (bag = 1; bag < 8; bag++)
			if (this.bagdat[bag].exist && this.bagdat[bag].gt < 10 &&
				(this.bagdat[bag].gt != 0 || this.bagdat[bag].wobbling))
				n++;
		return n;
	}

	initbags(): void {
		let bag, x, y;
		this.pushcount = 0;
		this.goldtime = 150 - this.dig.Main.levof10() * 10;
		for (bag = 1; bag < 8; bag++)
			this.bagdat[bag].exist = false;
		bag = 1;
		for (x = 0; x < 15; x++)
			for (y = 0; y < 10; y++)
				if (this.dig.Main.getlevch(x, y, this.dig.Main.levplan()) == 'B')
					if (bag < 8) {
						this.bagdat[bag].exist = true;
						this.bagdat[bag].gt = 0;
						this.bagdat[bag].fallh = 0;
						this.bagdat[bag].dir = -1;
						this.bagdat[bag].wobbling = false;
						this.bagdat[bag].wt = 15;
						this.bagdat[bag].unfallen = true;
						this.bagdat[bag].x = x * 20 + 12;
						this.bagdat[bag].y = y * 18 + 18;
						this.bagdat[bag].h = x;
						this.bagdat[bag].v = y;
						this.bagdat[bag].xr = 0;
						this.bagdat[bag++].yr = 0;
					}
		if (this.dig.Main.getcplayer() == 0)
			for (let i = 1; i < 8; i++)
				this.bagdat1[i].copyFrom(this.bagdat[i]);
		else
			for (let i = 1; i < 8; i++)
				this.bagdat2[i].copyFrom(this.bagdat[i]);
	}

	pushbag(bag: number, dir: number): boolean {
		let x, y, clbits;
		let push = true;
		const ox = x = this.bagdat[bag].x;
		const oy = y = this.bagdat[bag].y;
		const h = this.bagdat[bag].h;
		const v = this.bagdat[bag].v;
		if (this.bagdat[bag].gt != 0) {
			this.getgold(bag);
			return true;
		}
		if (this.bagdat[bag].dir == 6 && (dir == 4 || dir == 0)) {
			clbits = this.dig.Drawing.drawgold(bag, 3, x, y);
			this.dig.Main.incpenalty();
			if (((clbits & 1) != 0) && (this.dig.diggery >= y))
				this.dig.killdigger(1, bag);
			if ((clbits & 0x3f00) != 0)
				this.dig.Monster.squashmonsters(bag, clbits);
			return true;
		}
		if ((x == 292 && dir == 0) || (x == 12 && dir == 4) || (y == 180 && dir == 6) ||
			(y == 18 && dir == 2))
			push = false;
		if (push) {
			switch (dir) {
				case 0:
					x += 4;
					break;
				case 4:
					x -= 4;
					break;
				case 6:
					if (this.bagdat[bag].unfallen) {
						this.bagdat[bag].unfallen = false;
						this.dig.Drawing.drawsquareblob(x, y);
						this.dig.Drawing.drawtopblob(x, y + 21);
					}
					else
						this.dig.Drawing.drawfurryblob(x, y);
					this.dig.Drawing.eatfield(x, y, dir);
					this.dig.killemerald(h, v);
					y += 6;
			}
			switch (dir) {
				case 6:
					clbits = this.dig.Drawing.drawgold(bag, 3, x, y);
					this.dig.Main.incpenalty();
					if (((clbits & 1) != 0) && this.dig.diggery >= y)
						this.dig.killdigger(1, bag);
					if ((clbits & 0x3f00) != 0)
						this.dig.Monster.squashmonsters(bag, clbits);
					break;
				case 0:
				case 4:
					this.bagdat[bag].wt = 15;
					this.bagdat[bag].wobbling = false;
					clbits = this.dig.Drawing.drawgold(bag, 0, x, y);
					this.dig.Main.incpenalty();
					this.pushcount = 1;
					if ((clbits & 0xfe) != 0)
						if (!this.pushbags(dir, clbits)) {
							x = ox;
							y = oy;
							this.dig.Drawing.drawgold(bag, 0, ox, oy);
							this.dig.Main.incpenalty();
							push = false;
						}
					if (((clbits & 1) != 0) || ((clbits & 0x3f00) != 0)) {
						x = ox;
						y = oy;
						this.dig.Drawing.drawgold(bag, 0, ox, oy);
						this.dig.Main.incpenalty();
						push = false;
					}
			}
			if (push)
				this.bagdat[bag].dir = dir;
			else
				this.bagdat[bag].dir = this.dig.reversedir(dir);
			this.bagdat[bag].x = x;
			this.bagdat[bag].y = y;
			this.bagdat[bag].h = IntMath.div((x - 12), 20);
			this.bagdat[bag].v = IntMath.div((y - 18), 18);
			this.bagdat[bag].xr = (x - 12) % 20;
			this.bagdat[bag].yr = (y - 18) % 18;
		}
		return push;
	}

	pushbags(dir: number, bits: number): boolean {
		let bag, bit;
		let push = true;
		for (bag = 1, bit = 2; bag < 8; bag++, bit <<= 1)
			if ((bits & bit) != 0)
				if (!this.pushbag(bag, dir))
					push = false;
		return push;
	}

	pushudbags(bits: number): boolean {
		let bag, b;
		let push = true;
		for (bag = 1, b = 2; bag < 8; bag++, b <<= 1)
			if ((bits & b) != 0)
				if (this.bagdat[bag].gt != 0)
					this.getgold(bag);
				else
					push = false;
		return push;
	}

	removebag(bag: number): void {
		if (this.bagdat[bag].exist) {
			this.bagdat[bag].exist = false;
			this.dig.Sprite.erasespr(bag);
		}
	}

	removebags(bits: number): void {
		let bag, b;
		for (bag = 1, b = 2; bag < 8; bag++, b <<= 1)
			if ((this.bagdat[bag].exist) && ((bits & b) != 0))
				this.removebag(bag);
	}

	updatebag(bag: number): void {
		let wbl;
		const x = this.bagdat[bag].x;
		const h = this.bagdat[bag].h;
		const xr = this.bagdat[bag].xr;
		const y = this.bagdat[bag].y;
		const v = this.bagdat[bag].v;
		const yr = this.bagdat[bag].yr;
		switch (this.bagdat[bag].dir) {
			case -1:
				if (y < 180 && xr == 0) {
					if (this.bagdat[bag].wobbling) {
						if (this.bagdat[bag].wt == 0) {
							this.bagdat[bag].dir = 6;
							this.dig.Sound.soundfall();
							break;
						}
						this.bagdat[bag].wt--;
						wbl = this.bagdat[bag].wt % 8;
						if (!((wbl & 1) != 0)) {
							this.dig.Drawing.drawgold(bag, this.wblanim[wbl >> 1], x, y);
							this.dig.Main.incpenalty();
							this.dig.Sound.soundwobble();
						}
					}
					else
						if ((this.dig.Monster.getfield(h, v + 1) & 0xfdf) != 0xfdf)
							if (!this.dig.checkdiggerunderbag(h, v + 1))
								this.bagdat[bag].wobbling = true;
				}
				else {
					this.bagdat[bag].wt = 15;
					this.bagdat[bag].wobbling = false;
				}
				break;
			case 0:
			case 4:
				if (xr == 0)
					if (y < 180 && (this.dig.Monster.getfield(h, v + 1) & 0xfdf) != 0xfdf) {
						this.bagdat[bag].dir = 6;
						this.bagdat[bag].wt = 0;
						this.dig.Sound.soundfall();
					}
					else
						this.baghitground(bag);
				break;
			case 6:
				if (yr == 0)
					this.bagdat[bag].fallh++;
				if (y >= 180)
					this.baghitground(bag);
				else
					if ((this.dig.Monster.getfield(h, v + 1) & 0xfdf) == 0xfdf)
						if (yr == 0)
							this.baghitground(bag);
				this.dig.Monster.checkmonscared(this.bagdat[bag].h);
		}
		if (this.bagdat[bag].dir != -1)
			if (this.bagdat[bag].dir != 6 && this.pushcount != 0)
				this.pushcount--;
			else
				this.pushbag(bag, this.bagdat[bag].dir);
	}

}
