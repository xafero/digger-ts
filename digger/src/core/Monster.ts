import { IntMath } from "../web/IntMath";
import { Digger } from "./Digger";
import { _monster } from "./_monster";

export class Monster {

	dig: Digger;

	mondat: _monster[] = [new _monster(), new _monster(), new _monster(), new _monster(), new _monster(), new _monster()];	// [6]

	nextmonster = 0;
	totalmonsters = 0;
	maxmononscr = 0;
	nextmontime = 0;
	mongaptime = 0;

	unbonusflag = false;
	mongotgold = false;

	constructor(d: Digger) {
		this.dig = d;
	}

	checkcoincide(mon: number, bits: number): void {
		let m, b;
		for (m = 0, b = 256; m < 6; m++, b <<= 1)
			if (((bits & b) != 0) && (this.mondat[mon].dir == this.mondat[m].dir) && (this.mondat[m].stime == 0) && (this.mondat[mon].stime == 0))
				this.mondat[m].dir = this.dig.reversedir(this.mondat[m].dir);
	}

	checkmonscared(h: number): void {
		let m;
		for (m = 0; m < 6; m++)
			if ((h == this.mondat[m].h) && (this.mondat[m].dir == 2))
				this.mondat[m].dir = 6;
	}

	createmonster(): void {
		let i;
		for (i = 0; i < 6; i++)
			if (!this.mondat[i].flag) {
				this.mondat[i].flag = true;
				this.mondat[i].alive = true;
				this.mondat[i].t = 0;
				this.mondat[i].nob = true;
				this.mondat[i].hnt = 0;
				this.mondat[i].h = 14;
				this.mondat[i].v = 0;
				this.mondat[i].x = 292;
				this.mondat[i].y = 18;
				this.mondat[i].xr = 0;
				this.mondat[i].yr = 0;
				this.mondat[i].dir = 4;
				this.mondat[i].hdir = 4;
				this.nextmonster++;
				this.nextmontime = this.mongaptime;
				this.mondat[i].stime = 5;
				this.dig.Sprite.movedrawspr(i + 8, this.mondat[i].x, this.mondat[i].y);
				break;
			}
	}

	domonsters(): void {
		let i;
		if (this.nextmontime > 0)
			this.nextmontime--;
		else {
			if (this.nextmonster < this.totalmonsters && this.nmononscr() < this.maxmononscr && this.dig.digonscr &&
				!this.dig.bonusmode)
				this.createmonster();
			if (this.unbonusflag && this.nextmonster == this.totalmonsters && this.nextmontime == 0)
				if (this.dig.digonscr) {
					this.unbonusflag = false;
					this.dig.createbonus();
				}
		}
		for (i = 0; i < 6; i++)
			if (this.mondat[i].flag) {
				if (this.mondat[i].hnt > 10 - this.dig.Main.levof10()) {
					if (this.mondat[i].nob) {
						this.mondat[i].nob = false;
						this.mondat[i].hnt = 0;
					}
				}
				if (this.mondat[i].alive)
					if (this.mondat[i].t == 0) {
						this.monai(i);
						if (this.dig.Main.randno(15 - this.dig.Main.levof10()) == 0 && this.mondat[i].nob)
							this.monai(i);
					}
					else
						this.mondat[i].t--;
				else
					this.mondie(i);
			}
	}

	erasemonsters(): void {
		let i;
		for (i = 0; i < 6; i++)
			if (this.mondat[i].flag)
				this.dig.Sprite.erasespr(i + 8);
	}

	fieldclear(dir: number, x: number, y: number): boolean {
		switch (dir) {
			case 0:
				if (x < 14)
					if ((this.getfield(x + 1, y) & 0x2000) == 0)
						if ((this.getfield(x + 1, y) & 1) == 0 || (this.getfield(x, y) & 0x10) == 0)
							return true;
				break;
			case 4:
				if (x > 0)
					if ((this.getfield(x - 1, y) & 0x2000) == 0)
						if ((this.getfield(x - 1, y) & 0x10) == 0 || (this.getfield(x, y) & 1) == 0)
							return true;
				break;
			case 2:
				if (y > 0)
					if ((this.getfield(x, y - 1) & 0x2000) == 0)
						if ((this.getfield(x, y - 1) & 0x800) == 0 || (this.getfield(x, y) & 0x40) == 0)
							return true;
				break;
			case 6:
				if (y < 9)
					if ((this.getfield(x, y + 1) & 0x2000) == 0)
						if ((this.getfield(x, y + 1) & 0x40) == 0 || (this.getfield(x, y) & 0x800) == 0)
							return true;
		}
		return false;
	}

	getfield(x: number, y: number): number {
		return this.dig.Drawing.field[y * 15 + x];
	}

	incmont(n: number): void {
		let m;
		if (n > 6)
			n = 6;
		for (m = 1; m < n; m++)
			this.mondat[m].t++;
	}

	incpenalties(bits: number): void {
		let m, b;
		for (m = 0, b = 256; m < 6; m++, b <<= 1) {
			if ((bits & b) != 0)
				this.dig.Main.incpenalty();
			b <<= 1;
		}
	}

	initmonsters(): void {
		let i;
		for (i = 0; i < 6; i++)
			this.mondat[i].flag = false;
		this.nextmonster = 0;
		this.mongaptime = 45 - (this.dig.Main.levof10() << 1);
		this.totalmonsters = this.dig.Main.levof10() + 5;
		switch (this.dig.Main.levof10()) {
			case 1:
				this.maxmononscr = 3;
				break;
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				this.maxmononscr = 4;
				break;
			case 8:
			case 9:
			case 10:
				this.maxmononscr = 5;
		}
		this.nextmontime = 10;
		this.unbonusflag = true;
	}

	killmon(mon: number): void {
		if (this.mondat[mon].flag) {
			this.mondat[mon].flag = this.mondat[mon].alive = false;
			this.dig.Sprite.erasespr(mon + 8);
			if (this.dig.bonusmode)
				this.totalmonsters++;
		}
	}

	killmonsters(bits: number): number {
		let m, b, n = 0;
		for (m = 0, b = 256; m < 6; m++, b <<= 1)
			if ((bits & b) != 0) {
				this.killmon(m);
				n++;
			}
		return n;
	}

	monai(mon: number): void {
		let dir, mdirp1, mdirp2, mdirp3, mdirp4, t;
		let push: boolean;
		const monox = this.mondat[mon].x;
		const monoy = this.mondat[mon].y;
		if (this.mondat[mon].xr == 0 && this.mondat[mon].yr == 0) {

			/* If we are here the monster needs to know which way to turn next. */

			/* Turn hobbin back into nobbin if it's had its time */

			if (this.mondat[mon].hnt > 30 + (this.dig.Main.levof10() << 1))
				if (!this.mondat[mon].nob) {
					this.mondat[mon].hnt = 0;
					this.mondat[mon].nob = true;
				}

			/* Set up monster direction properties to chase dig */

			if (Math.abs(this.dig.diggery - this.mondat[mon].y) > Math.abs(this.dig.diggerx - this.mondat[mon].x)) {
				if (this.dig.diggery < this.mondat[mon].y) { mdirp1 = 2; mdirp4 = 6; }
				else { mdirp1 = 6; mdirp4 = 2; }
				if (this.dig.diggerx < this.mondat[mon].x) { mdirp2 = 4; mdirp3 = 0; }
				else { mdirp2 = 0; mdirp3 = 4; }
			}
			else {
				if (this.dig.diggerx < this.mondat[mon].x) { mdirp1 = 4; mdirp4 = 0; }
				else { mdirp1 = 0; mdirp4 = 4; }
				if (this.dig.diggery < this.mondat[mon].y) { mdirp2 = 2; mdirp3 = 6; }
				else { mdirp2 = 6; mdirp3 = 2; }
			}

			/* In bonus mode, run away from digger */

			if (this.dig.bonusmode) {
				t = mdirp1; mdirp1 = mdirp4; mdirp4 = t;
				t = mdirp2; mdirp2 = mdirp3; mdirp3 = t;
			}

			/* Adjust priorities so that monsters don't reverse direction unless they
			   really have to */

			dir = this.dig.reversedir(this.mondat[mon].dir);
			if (dir == mdirp1) {
				mdirp1 = mdirp2;
				mdirp2 = mdirp3;
				mdirp3 = mdirp4;
				mdirp4 = dir;
			}
			if (dir == mdirp2) {
				mdirp2 = mdirp3;
				mdirp3 = mdirp4;
				mdirp4 = dir;
			}
			if (dir == mdirp3) {
				mdirp3 = mdirp4;
				mdirp4 = dir;
			}

			/* Introduce a randno element on levels <6 : occasionally swap p1 and p3 */

			if (this.dig.Main.randno(this.dig.Main.levof10() + 5) == 1 && this.dig.Main.levof10() < 6) {
				t = mdirp1;
				mdirp1 = mdirp3;
				mdirp3 = t;
			}

			/* Check field and find direction */

			if (this.fieldclear(mdirp1, this.mondat[mon].h, this.mondat[mon].v))
				dir = mdirp1;
			else
				if (this.fieldclear(mdirp2, this.mondat[mon].h, this.mondat[mon].v))
					dir = mdirp2;
				else
					if (this.fieldclear(mdirp3, this.mondat[mon].h, this.mondat[mon].v))
						dir = mdirp3;
					else
						if (this.fieldclear(mdirp4, this.mondat[mon].h, this.mondat[mon].v))
							dir = mdirp4;

			/* Hobbins don't care about the field: they go where they want. */

			if (!this.mondat[mon].nob)
				dir = mdirp1;

			/* Monsters take a time penalty for changing direction */

			if (this.mondat[mon].dir != dir)
				this.mondat[mon].t++;

			/* Save the new direction */

			this.mondat[mon].dir = dir;
		}

		/* If monster is about to go off edge of screen, stop it. */

		if ((this.mondat[mon].x == 292 && this.mondat[mon].dir == 0) ||
			(this.mondat[mon].x == 12 && this.mondat[mon].dir == 4) ||
			(this.mondat[mon].y == 180 && this.mondat[mon].dir == 6) ||
			(this.mondat[mon].y == 18 && this.mondat[mon].dir == 2))
			this.mondat[mon].dir = -1;

		/* Change hdir for hobbin */

		if (this.mondat[mon].dir == 4 || this.mondat[mon].dir == 0)
			this.mondat[mon].hdir = this.mondat[mon].dir;

		/* Hobbins digger */

		if (!this.mondat[mon].nob)
			this.dig.Drawing.eatfield(this.mondat[mon].x, this.mondat[mon].y, this.mondat[mon].dir);

		/* (Draw new tunnels) and move monster */

		switch (this.mondat[mon].dir) {
			case 0:
				if (!this.mondat[mon].nob)
					this.dig.Drawing.drawrightblob(this.mondat[mon].x, this.mondat[mon].y);
				this.mondat[mon].x += 4;
				break;
			case 4:
				if (!this.mondat[mon].nob)
					this.dig.Drawing.drawleftblob(this.mondat[mon].x, this.mondat[mon].y);
				this.mondat[mon].x -= 4;
				break;
			case 2:
				if (!this.mondat[mon].nob)
					this.dig.Drawing.drawtopblob(this.mondat[mon].x, this.mondat[mon].y);
				this.mondat[mon].y -= 3;
				break;
			case 6:
				if (!this.mondat[mon].nob)
					this.dig.Drawing.drawbottomblob(this.mondat[mon].x, this.mondat[mon].y);
				this.mondat[mon].y += 3;
				break;
		}

		/* Hobbins can eat emeralds */

		if (!this.mondat[mon].nob)
			this.dig.hitemerald(IntMath.div((this.mondat[mon].x - 12), 20), IntMath.div((this.mondat[mon].y - 18), 18), (this.mondat[mon].x - 12) % 20, (this.mondat[mon].y - 18) % 18, this.mondat[mon].dir);

		/* If digger's gone, don't bother */

		if (!this.dig.digonscr) {
			this.mondat[mon].x = monox;
			this.mondat[mon].y = monoy;
		}

		/* If monster's just started, don't move yet */

		if (this.mondat[mon].stime != 0) {
			this.mondat[mon].stime--;
			this.mondat[mon].x = monox;
			this.mondat[mon].y = monoy;
		}

		/* Increase time counter for hobbin */

		if (!this.mondat[mon].nob && this.mondat[mon].hnt < 100)
			this.mondat[mon].hnt++;

		/* Draw monster */

		push = true;
		const clbits = this.dig.Drawing.drawmon(mon, this.mondat[mon].nob, this.mondat[mon].hdir, this.mondat[mon].x, this.mondat[mon].y);
		this.dig.Main.incpenalty();

		/* Collision with another monster */

		if ((clbits & 0x3f00) != 0) {
			this.mondat[mon].t++; /* Time penalty */
			this.checkcoincide(mon, clbits); /* Ensure both aren't moving in the same dir. */
			this.incpenalties(clbits);
		}

		/* Check for collision with bag */

		if ((clbits & this.dig.Bags.bagbits()) != 0) {
			this.mondat[mon].t++; /* Time penalty */
			this.mongotgold = false;
			if (this.mondat[mon].dir == 4 || this.mondat[mon].dir == 0) { /* Horizontal push */
				push = this.dig.Bags.pushbags(this.mondat[mon].dir, clbits);
				this.mondat[mon].t++; /* Time penalty */
			}
			else
				if (!this.dig.Bags.pushudbags(clbits)) /* Vertical push */
					push = false;
			if (this.mongotgold) /* No time penalty if monster eats gold */
				this.mondat[mon].t = 0;
			if (!this.mondat[mon].nob && this.mondat[mon].hnt > 1)
				this.dig.Bags.removebags(clbits); /* Hobbins eat bags */
		}

		/* Increase hobbin cross counter */

		if (this.mondat[mon].nob && ((clbits & 0x3f00) != 0) && this.dig.digonscr)
			this.mondat[mon].hnt++;

		/* See if bags push monster back */

		if (!push) {
			this.mondat[mon].x = monox;
			this.mondat[mon].y = monoy;
			this.dig.Drawing.drawmon(mon, this.mondat[mon].nob, this.mondat[mon].hdir, this.mondat[mon].x, this.mondat[mon].y);
			this.dig.Main.incpenalty();
			if (this.mondat[mon].nob) /* The other way to create hobbin: stuck on h-bag */
				this.mondat[mon].hnt++;
			if ((this.mondat[mon].dir == 2 || this.mondat[mon].dir == 6) && this.mondat[mon].nob)
				this.mondat[mon].dir = this.dig.reversedir(this.mondat[mon].dir); /* If vertical, give up */
		}

		/* Collision with digger */

		if (((clbits & 1) != 0) && this.dig.digonscr)
			if (this.dig.bonusmode) {
				this.killmon(mon);
				this.dig.Scores.scoreeatm();
				this.dig.Sound.soundeatm(); /* Collision in bonus mode */
			}
			else
				this.dig.killdigger(3, 0); /* Kill digger */

		/* Update co-ordinates */

		this.mondat[mon].h = IntMath.div((this.mondat[mon].x - 12), 20);
		this.mondat[mon].v = IntMath.div((this.mondat[mon].y - 18), 18);
		this.mondat[mon].xr = (this.mondat[mon].x - 12) % 20;
		this.mondat[mon].yr = (this.mondat[mon].y - 18) % 18;
	}

	mondie(mon: number): void {
		switch (this.mondat[mon].death) {
			case 1:
				if (this.dig.Bags.bagy(this.mondat[mon].bag) + 6 > this.mondat[mon].y)
					this.mondat[mon].y = this.dig.Bags.bagy(this.mondat[mon].bag);
				this.dig.Drawing.drawmondie(mon, this.mondat[mon].nob, this.mondat[mon].hdir, this.mondat[mon].x, this.mondat[mon].y);
				this.dig.Main.incpenalty();
				if (this.dig.Bags.getbagdir(this.mondat[mon].bag) == -1) {
					this.mondat[mon].dtime = 1;
					this.mondat[mon].death = 4;
				}
				break;
			case 4:
				if (this.mondat[mon].dtime != 0)
					this.mondat[mon].dtime--;
				else {
					this.killmon(mon);
					this.dig.Scores.scorekill();
				}
		}
	}

	mongold(): void {
		this.mongotgold = true;
	}

	monleft(): number {
		return this.nmononscr() + this.totalmonsters - this.nextmonster;
	}

	nmononscr(): number {
		let i, n = 0;
		for (i = 0; i < 6; i++)
			if (this.mondat[i].flag)
				n++;
		return n;
	}

	squashmonster(mon: number, death: number, bag: number): void {
		this.mondat[mon].alive = false;
		this.mondat[mon].death = death;
		this.mondat[mon].bag = bag;
	}

	squashmonsters(bag: number, bits: number): void {
		let m, b;
		for (m = 0, b = 256; m < 6; m++, b <<= 1)
			if ((bits & b) != 0)
				if (this.mondat[m].y >= this.dig.Bags.bagy(bag))
					this.squashmonster(m, 1, bag);
	}

}
