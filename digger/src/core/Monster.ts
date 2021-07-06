import { IDigger } from "../api/IDigger";
import { IntMath } from "../web/IntMath";
import { Digger } from "./Digger";
import { _monster } from "./_monster";

export class Monster {

	dig: IDigger;

	mondat: _monster[] = [new _monster(), new _monster(), new _monster(), new _monster(), new _monster(), new _monster()];	// [6]

	nextmonster: i32 = 0;
	totalmonsters: i32 = 0;
	maxmononscr: i32 = 0;
	nextmontime: i32 = 0;
	mongaptime: i32 = 0;

	unbonusflag: boolean = false;
	mongotgold: boolean = false;

	constructor(d: IDigger) {
		this.dig = d;
	}

	checkcoincide(mon: i32, bits: i32): void {
		for (let m = 0, b = 256; m < 6; m++, b <<= 1)
			if (((bits & b) != 0) && (this.mondat[mon].dir == this.mondat[m].dir) && (this.mondat[m].stime == 0) && (this.mondat[mon].stime == 0))
				this.mondat[m].dir = this.dig.D().reversedir(this.mondat[m].dir);
	}

	checkmonscared(h: i32): void {
		for (let m = 0; m < 6; m++)
			if ((h == this.mondat[m].h) && (this.mondat[m].dir == 2))
				this.mondat[m].dir = 6;
	}

	createmonster(): void {
		for (let i = 0; i < 6; i++)
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
				this.dig.GetSprite().movedrawspr(i + 8, this.mondat[i].x, this.mondat[i].y);
				break;
			}
	}

	domonsters(): void {
		if (this.nextmontime > 0)
			this.nextmontime--;
		else {
			if (this.nextmonster < this.totalmonsters && this.nmononscr() < this.maxmononscr && this.dig.D().digonscr &&
				!this.dig.D().bonusmode)
				this.createmonster();
			if (this.unbonusflag && this.nextmonster == this.totalmonsters && this.nextmontime == 0)
				if (this.dig.D().digonscr) {
					this.unbonusflag = false;
					this.dig.D().createbonus();
				}
		}
		for (let i = 0; i < 6; i++)
			if (this.mondat[i].flag) {
				if (this.mondat[i].hnt > 10 - this.dig.GetMain().levof10()) {
					if (this.mondat[i].nob) {
						this.mondat[i].nob = false;
						this.mondat[i].hnt = 0;
					}
				}
				if (this.mondat[i].alive)
					if (this.mondat[i].t == 0) {
						this.monai(i);
						if (this.dig.GetMain().randno(15 - this.dig.GetMain().levof10()) == 0 && this.mondat[i].nob)
							this.monai(i);
					}
					else
						this.mondat[i].t--;
				else
					this.mondie(i);
			}
	}

	erasemonsters(): void {
		for (let i = 0; i < 6; i++)
			if (this.mondat[i].flag)
				this.dig.GetSprite().erasespr(i + 8);
	}

	fieldclear(dir: i32, x: i32, y: i32): boolean {
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

	getfield(x: i32, y: i32): i32 {
		return this.dig.GetDrawing().field[y * 15 + x];
	}

	incmont(n: i32): void {
		if (n > 6)
			n = 6;
		for (let m = 1; m < n; m++)
			this.mondat[m].t++;
	}

	incpenalties(bits: i32): void {
		for (let m = 0, b = 256; m < 6; m++, b <<= 1) {
			if ((bits & b) != 0)
				this.dig.GetMain().incpenalty();
			b <<= 1;
		}
	}

	initmonsters(): void {
		for (let i = 0; i < 6; i++)
			this.mondat[i].flag = false;
		this.nextmonster = 0;
		this.mongaptime = 45 - (this.dig.GetMain().levof10() << 1);
		this.totalmonsters = this.dig.GetMain().levof10() + 5;
		switch (this.dig.GetMain().levof10()) {
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

	killmon(mon: i32): void {
		if (this.mondat[mon].flag) {
			this.mondat[mon].flag = this.mondat[mon].alive = false;
			this.dig.GetSprite().erasespr(mon + 8);
			if (this.dig.D().bonusmode)
				this.totalmonsters++;
		}
	}

	killmonsters(bits: i32): i32 {
		let n = 0;
		for (let m = 0, b = 256; m < 6; m++, b <<= 1)
			if ((bits & b) != 0) {
				this.killmon(m);
				n++;
			}
		return n;
	}

	monai(mon: i32): void {
		let dir = 0, mdirp1 = 0, mdirp2 = 0, mdirp3 = 0, mdirp4 = 0, t = 0;
		let push: boolean;
		const monox = this.mondat[mon].x;
		const monoy = this.mondat[mon].y;
		if (this.mondat[mon].xr == 0 && this.mondat[mon].yr == 0) {

			/* If we are here the monster needs to know which way to turn next. */

			/* Turn hobbin back into nobbin if it's had its time */

			if (this.mondat[mon].hnt > 30 + (this.dig.GetMain().levof10() << 1))
				if (!this.mondat[mon].nob) {
					this.mondat[mon].hnt = 0;
					this.mondat[mon].nob = true;
				}

			/* Set up monster direction properties to chase dig */

			if (Math.abs(this.dig.D().diggery - this.mondat[mon].y) > Math.abs(this.dig.D().diggerx - this.mondat[mon].x)) {
				if (this.dig.D().diggery < this.mondat[mon].y) { mdirp1 = 2; mdirp4 = 6; }
				else { mdirp1 = 6; mdirp4 = 2; }
				if (this.dig.D().diggerx < this.mondat[mon].x) { mdirp2 = 4; mdirp3 = 0; }
				else { mdirp2 = 0; mdirp3 = 4; }
			}
			else {
				if (this.dig.D().diggerx < this.mondat[mon].x) { mdirp1 = 4; mdirp4 = 0; }
				else { mdirp1 = 0; mdirp4 = 4; }
				if (this.dig.D().diggery < this.mondat[mon].y) { mdirp2 = 2; mdirp3 = 6; }
				else { mdirp2 = 6; mdirp3 = 2; }
			}

			/* In bonus mode, run away from digger */

			if (this.dig.D().bonusmode) {
				t = mdirp1; mdirp1 = mdirp4; mdirp4 = t;
				t = mdirp2; mdirp2 = mdirp3; mdirp3 = t;
			}

			/* Adjust priorities so that monsters don't reverse direction unless they
			   really have to */

			dir = this.dig.D().reversedir(this.mondat[mon].dir);
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

			if (this.dig.GetMain().randno(this.dig.GetMain().levof10() + 5) == 1 && this.dig.GetMain().levof10() < 6) {
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
			this.dig.GetDrawing().eatfield(this.mondat[mon].x, this.mondat[mon].y, this.mondat[mon].dir);

		/* (Draw new tunnels) and move monster */

		switch (this.mondat[mon].dir) {
			case 0:
				if (!this.mondat[mon].nob)
					this.dig.GetDrawing().drawrightblob(this.mondat[mon].x, this.mondat[mon].y);
				this.mondat[mon].x += 4;
				break;
			case 4:
				if (!this.mondat[mon].nob)
					this.dig.GetDrawing().drawleftblob(this.mondat[mon].x, this.mondat[mon].y);
				this.mondat[mon].x -= 4;
				break;
			case 2:
				if (!this.mondat[mon].nob)
					this.dig.GetDrawing().drawtopblob(this.mondat[mon].x, this.mondat[mon].y);
				this.mondat[mon].y -= 3;
				break;
			case 6:
				if (!this.mondat[mon].nob)
					this.dig.GetDrawing().drawbottomblob(this.mondat[mon].x, this.mondat[mon].y);
				this.mondat[mon].y += 3;
				break;
		}

		/* Hobbins can eat emeralds */

		if (!this.mondat[mon].nob)
			this.dig.D().hitemerald(IntMath.div((this.mondat[mon].x - 12), 20), IntMath.div((this.mondat[mon].y - 18), 18), (this.mondat[mon].x - 12) % 20, (this.mondat[mon].y - 18) % 18, this.mondat[mon].dir);

		/* If digger's gone, don't bother */

		if (!this.dig.D().digonscr) {
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
		const clbits = this.dig.GetDrawing().drawmon(mon, this.mondat[mon].nob, this.mondat[mon].hdir, this.mondat[mon].x, this.mondat[mon].y);
		this.dig.GetMain().incpenalty();

		/* Collision with another monster */

		if ((clbits & 0x3f00) != 0) {
			this.mondat[mon].t++; /* Time penalty */
			this.checkcoincide(mon, clbits); /* Ensure both aren't moving in the same dir. */
			this.incpenalties(clbits);
		}

		/* Check for collision with bag */

		if ((clbits & this.dig.D().Bags.bagbits()) != 0) {
			this.mondat[mon].t++; /* Time penalty */
			this.mongotgold = false;
			if (this.mondat[mon].dir == 4 || this.mondat[mon].dir == 0) { /* Horizontal push */
				push = this.dig.D().Bags.pushbags(this.mondat[mon].dir, clbits);
				this.mondat[mon].t++; /* Time penalty */
			}
			else
				if (!this.dig.D().Bags.pushudbags(clbits)) /* Vertical push */
					push = false;
			if (this.mongotgold) /* No time penalty if monster eats gold */
				this.mondat[mon].t = 0;
			if (!this.mondat[mon].nob && this.mondat[mon].hnt > 1)
				this.dig.D().Bags.removebags(clbits); /* Hobbins eat bags */
		}

		/* Increase hobbin cross counter */

		if (this.mondat[mon].nob && ((clbits & 0x3f00) != 0) && this.dig.D().digonscr)
			this.mondat[mon].hnt++;

		/* See if bags push monster back */

		if (!push) {
			this.mondat[mon].x = monox;
			this.mondat[mon].y = monoy;
			this.dig.GetDrawing().drawmon(mon, this.mondat[mon].nob, this.mondat[mon].hdir, this.mondat[mon].x, this.mondat[mon].y);
			this.dig.GetMain().incpenalty();
			if (this.mondat[mon].nob) /* The other way to create hobbin: stuck on h-bag */
				this.mondat[mon].hnt++;
			if ((this.mondat[mon].dir == 2 || this.mondat[mon].dir == 6) && this.mondat[mon].nob)
				this.mondat[mon].dir = this.dig.D().reversedir(this.mondat[mon].dir); /* If vertical, give up */
		}

		/* Collision with digger */

		if (((clbits & 1) != 0) && this.dig.D().digonscr)
			if (this.dig.D().bonusmode) {
				this.killmon(mon);
				this.dig.GetScores().scoreeatm();
				this.dig.GetSound().soundeatm(); /* Collision in bonus mode */
			}
			else
				this.dig.D().killdigger(3, 0); /* Kill digger */

		/* Update co-ordinates */

		this.mondat[mon].h = IntMath.div((this.mondat[mon].x - 12), 20);
		this.mondat[mon].v = IntMath.div((this.mondat[mon].y - 18), 18);
		this.mondat[mon].xr = (this.mondat[mon].x - 12) % 20;
		this.mondat[mon].yr = (this.mondat[mon].y - 18) % 18;
	}

	mondie(mon: i32): void {
		switch (this.mondat[mon].death) {
			case 1:
				if (this.dig.D().Bags.bagy(this.mondat[mon].bag) + 6 > this.mondat[mon].y)
					this.mondat[mon].y = this.dig.D().Bags.bagy(this.mondat[mon].bag);
				this.dig.GetDrawing().drawmondie(mon, this.mondat[mon].nob, this.mondat[mon].hdir, this.mondat[mon].x, this.mondat[mon].y);
				this.dig.GetMain().incpenalty();
				if (this.dig.D().Bags.getbagdir(this.mondat[mon].bag) == -1) {
					this.mondat[mon].dtime = 1;
					this.mondat[mon].death = 4;
				}
				break;
			case 4:
				if (this.mondat[mon].dtime != 0)
					this.mondat[mon].dtime--;
				else {
					this.killmon(mon);
					this.dig.GetScores().scorekill();
				}
		}
	}

	mongold(): void {
		this.mongotgold = true;
	}

	monleft(): i32 {
		return this.nmononscr() + this.totalmonsters - this.nextmonster;
	}

	nmononscr(): i32 {
		let n = 0;
		for (let i = 0; i < 6; i++)
			if (this.mondat[i].flag)
				n++;
		return n;
	}

	squashmonster(mon: i32, death: i32, bag: i32): void {
		this.mondat[mon].alive = false;
		this.mondat[mon].death = death;
		this.mondat[mon].bag = bag;
	}

	squashmonsters(bag: i32, bits: i32): void {
		for (let m = 0, b = 256; m < 6; m++, b <<= 1)
			if ((bits & b) != 0)
				if (this.mondat[m].y >= this.dig.D().Bags.bagy(bag))
					this.squashmonster(m, 1, bag);
	}

}
