/* WARNING! This code is ugly and highly non-object-oriented.
It was ported from C almost mechanically! */

import { IDigger } from "../api/IDigger";
import { IFactory } from "../api/IFactory";
import { IPc } from "../api/IPc";
import { IntMath } from "../web/IntMath";
import { Bags } from "./Bags";
import { ColorModel } from "./ColorModel";
import { Drawing } from "./Drawing";
import { FakeDigger, FakeFactory } from "./fake";
import { Input } from "./Input";
import { Main } from "./Main";
import { Monster } from "./Monster";
import { Pc } from "./Pc";
import { Scores } from "./Scores";
import { Sound } from "./Sound";
import { Sprite } from "./Sprite";

export class Digger implements IDigger {

	static MAX_RATE: i32 = 200;
	static MIN_RATE: i32 = 40;

	width: i32 = 320;
	height: i32 = 200;
	frametime: i32 = 66;

	subaddr: string = '';

	Bags: Bags = new Bags(new FakeDigger());
	Main: Main = new Main(new FakeDigger(), new FakeFactory());
	Sound: Sound = new Sound(new FakeDigger(), new FakeFactory());
	Monster: Monster = new Monster(new FakeDigger());
	Scores: Scores = new Scores(new FakeDigger(), new FakeFactory());
	Sprite: Sprite = new Sprite(new FakeDigger());
	Drawing: Drawing = new Drawing(new FakeDigger());
	Input: Input = new Input(new FakeDigger());
	Pc: Pc = new Pc(new FakeDigger());

	_factory: IFactory = new FakeFactory();

	// -----

	diggerx: i32 = 0;
	diggery: i32 = 0;
	diggerh: i32 = 0;
	diggerv: i32 = 0;
	diggerrx: i32 = 0;
	diggerry: i32 = 0;
	digmdir: i32 = 0;
	digdir: i32 = 0;
	digtime: i32 = 0;
	rechargetime: i32 = 0;
	firex: i32 = 0;
	firey: i32 = 0;
	firedir: i32 = 0;
	expsn: i32 = 0;
	deathstage: i32 = 0;
	deathbag: i32 = 0;
	deathani: i32 = 0;
	deathtime: i32 = 0;
	startbonustimeleft: i32 = 0;
	bonustimeleft: i32 = 0;
	eatmsc: i32 = 0;
	emocttime: i32 = 0;

	emmask: i32 = 0;

	emfield: i32[] = [	//[150]
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

	digonscr: boolean = false;
	notfiring: boolean = false;
	bonusvisible: boolean = false;
	bonusmode: boolean = false;
	diggervisible: boolean = false;

	time: i64 = 0;
	ftime: i32 = 50;
	embox: i32[] = [8, 12, 12, 9, 16, 12, 6, 9];	// [8]
	deatharc: i32[] = [3, 5, 6, 6, 5, 3, 0];			// [7]

	constructor(factory: IFactory) {
		this.Bags = new Bags(this);
		this.Main = new Main(this, factory);
		this.Sound = new Sound(this, factory);
		this.Monster = new Monster(this);
		this.Scores = new Scores(this, factory);
		this.Sprite = new Sprite(this);
		this.Drawing = new Drawing(this);
		this.Input = new Input(this);
		this.Pc = new Pc(this);

		this._factory = factory;
	}

	D(): Digger { return this; }
	GetInput(): Input { return this.Input; }
	GetScores(): Scores { return this.Scores; }
	GetMonster(): Monster { return this.Monster; }
	GetSprite(): Sprite { return this.Sprite; }
	GetSound(): Sound { return this.Sound; }
	GetMain(): Main { return this.Main; }
	GetDrawing(): Drawing { return this.Drawing; }
	GetPc(): IPc { return this.Pc; }

	checkdiggerunderbag(h: i32, v: i32): boolean {
		if (this.digmdir == 2 || this.digmdir == 6)
			if (IntMath.div((this.diggerx - 12), 20) == h)
				if (IntMath.div((this.diggery - 18), 18) == v || IntMath.div((this.diggery - 18), 18) + 1 == v)
					return true;
		return false;
	}

	countem(): i32 {
		let n = 0;
		for (let x = 0; x < 15; x++)
			for (let y = 0; y < 10; y++)
				if ((this.emfield[y * 15 + x] & this.emmask) != 0)
					n++;
		return n;
	}

	createbonus(): void {
		this.bonusvisible = true;
		this.Drawing.drawbonus(292, 18);
	}

	public destroy(): void {
		// if (this.gamethread != null)
		//	this.gamethread.stop();
	}

	diggerdie(): void {
		let clbits = 0;
		switch (this.deathstage) {
			case 1:
				if (this.Bags.bagy(this.deathbag) + 6 > this.diggery)
					this.diggery = this.Bags.bagy(this.deathbag) + 6;
				this.Drawing.drawdigger(15, this.diggerx, this.diggery, false);
				this.Main.incpenalty();
				if (this.Bags.getbagdir(this.deathbag) + 1 == 0) {
					this.Sound.soundddie();
					this.deathtime = 5;
					this.deathstage = 2;
					this.deathani = 0;
					this.diggery -= 6;
				}
				break;
			case 2:
				if (this.deathtime != 0) {
					this.deathtime--;
					break;
				}
				if (this.deathani == 0)
					this.Sound.music(2);
				clbits = this.Drawing.drawdigger(14 - this.deathani, this.diggerx, this.diggery, false);
				this.Main.incpenalty();
				if (this.deathani == 0 && ((clbits & 0x3f00) != 0))
					this.Monster.killmonsters(clbits);
				if (this.deathani < 4) {
					this.deathani++;
					this.deathtime = 2;
				}
				else {
					this.deathstage = 4;
					if (this.Sound.musicflag)
						this.deathtime = 60;
					else
						this.deathtime = 10;
				}
				break;
			case 3:
				this.deathstage = 5;
				this.deathani = 0;
				this.deathtime = 0;
				break;
			case 5:
				if (this.deathani >= 0 && this.deathani <= 6) {
					this.Drawing.drawdigger(15, this.diggerx, this.diggery - this.deatharc[this.deathani], false);
					if (this.deathani == 6)
						this.Sound.musicoff();
					this.Main.incpenalty();
					this.deathani++;
					if (this.deathani == 1)
						this.Sound.soundddie();
					if (this.deathani == 7) {
						this.deathtime = 5;
						this.deathani = 0;
						this.deathstage = 2;
					}
				}
				break;
			case 4:
				if (this.deathtime != 0)
					this.deathtime--;
				else
					this.Main.setdead(true);
		}
	}

	dodigger(): void {
		this.newframe();
		if (this.expsn != 0)
			this.drawexplosion();
		else
			this.updatefire();
		if (this.diggervisible)
			if (this.digonscr)
				if (this.digtime != 0) {
					this.Drawing.drawdigger(this.digmdir, this.diggerx, this.diggery, this.notfiring && this.rechargetime == 0);
					this.Main.incpenalty();
					this.digtime--;
				}
				else
					this.updatedigger();
			else
				this.diggerdie();
		if (this.bonusmode && this.digonscr) {
			if (this.bonustimeleft != 0) {
				this.bonustimeleft--;
				if (this.startbonustimeleft != 0 || this.bonustimeleft < 20) {
					this.startbonustimeleft--;
					if ((this.bonustimeleft & 1) != 0) {
						this.Pc.ginten(0);
						this.Sound.soundbonus();
					}
					else {
						this.Pc.ginten(1);
						this.Sound.soundbonus();
					}
					if (this.startbonustimeleft == 0) {
						this.Sound.music(0);
						this.Sound.soundbonusoff();
						this.Pc.ginten(1);
					}
				}
			}
			else {
				this.endbonusmode();
				this.Sound.soundbonusoff();
				this.Sound.music(1);
			}
		}
		if (this.bonusmode && !this.digonscr) {
			this.endbonusmode();
			this.Sound.soundbonusoff();
			this.Sound.music(1);
		}
		if (this.emocttime > 0)
			this.emocttime--;
	}

	drawemeralds(): void {
		this.emmask = 1 << this.Main.getcplayer();
		for (let x = 0; x < 15; x++)
			for (let y = 0; y < 10; y++)
				if ((this.emfield[y * 15 + x] & this.emmask) != 0)
					this.Drawing.drawemerald(x * 20 + 12, y * 18 + 21);
	}

	drawexplosion(): void {
		switch (this.expsn) {
			case 1:
				this.Sound.soundexplode();
			case 2:
			case 3:
				this.Drawing.drawfire(this.firex, this.firey, this.expsn);
				this.Main.incpenalty();
				this.expsn++;
				break;
			default:
				this.killfire();
				this.expsn = 0;
		}
	}

	endbonusmode(): void {
		this.bonusmode = false;
		this.Pc.ginten(0);
	}

	erasebonus(): void {
		if (this.bonusvisible) {
			this.bonusvisible = false;
			this.Sprite.erasespr(14);
		}
		this.Pc.ginten(0);
	}

	erasedigger(): void {
		this.Sprite.erasespr(0);
		this.diggervisible = false;
	}

	public getAppletInfo(): string {
		return "The Digger Remastered -- http://www.digger.org, Copyright (c) Andrew Jenner & Marek Futrega / MAF";
	}

	getfirepflag(): boolean {
		return this.Input.firepflag;
	}

	hitemerald(x: i32, y: i32, rx: i32, ry: i32, dir: i32): boolean {
		let hit = false;
		let r = 0;
		if (dir < 0 || dir > 6 || ((dir & 1) != 0))
			return hit;
		if (dir == 0 && rx != 0)
			x++;
		if (dir == 6 && ry != 0)
			y++;
		if (dir == 0 || dir == 4)
			r = rx;
		else
			r = ry;
		if ((this.emfield[y * 15 + x] & this.emmask) != 0) {
			if (r == this.embox[dir]) {
				this.Drawing.drawemerald(x * 20 + 12, y * 18 + 21);
				this.Main.incpenalty();
			}
			if (r == this.embox[dir + 1]) {
				this.Drawing.eraseemerald(x * 20 + 12, y * 18 + 21);
				this.Main.incpenalty();
				hit = true;
				this.emfield[y * 15 + x] &= ~this.emmask;
			}
		}
		return hit;
	}

	public init(): void {

		//if (this.gamethread != null)
		//this.gamethread.stop();

		this.subaddr = this._factory.GetSubmitParameter();

		this.frametime = this._factory.GetSpeedParameter();
		if (this.frametime > Digger.MAX_RATE)
			this.frametime = Digger.MAX_RATE;
		else if (this.frametime < Digger.MIN_RATE)
			this.frametime = Digger.MIN_RATE;

		this.Pc.pixels = (new Array<i32>(65536)).fill(0, 0, 65536);

		for (let i = 0; i < 2; i++) {
			const model = new ColorModel(8, 4, this.Pc.pal[i][0], this.Pc.pal[i][1], this.Pc.pal[i][2]);
			this.Pc.source[i] = this._factory.CreateRefresher(this, model, this._factory);
			this.Pc.source[i].newPixelsAll();
		}

		this.Pc.currentSource = this.Pc.source[0];
	}

	initbonusmode(): void {
		this.bonusmode = true;
		this.erasebonus();
		this.Pc.ginten(1);
		this.bonustimeleft = 250 - this.Main.levof10() * 20;
		this.startbonustimeleft = 20;
		this.eatmsc = 1;
	}

	initdigger(): void {
		this.diggerv = 9;
		this.digmdir = 4;
		this.diggerh = 7;
		this.diggerx = this.diggerh * 20 + 12;
		this.digdir = 0;
		this.diggerrx = 0;
		this.diggerry = 0;
		this.digtime = 0;
		this.digonscr = true;
		this.deathstage = 1;
		this.diggervisible = true;
		this.diggery = this.diggerv * 18 + 18;
		this.Sprite.movedrawspr(0, this.diggerx, this.diggery);
		this.notfiring = true;
		this.emocttime = 0;
		this.bonusvisible = this.bonusmode = false;
		this.Input.firepressed = false;
		this.expsn = 0;
		this.rechargetime = 0;
	}

	public keyDown(key: i32): boolean {
		switch (key) {
			case 1006: this.Input.processkey(0x4b); break;
			case 1007: this.Input.processkey(0x4d); break;
			case 1004: this.Input.processkey(0x48); break;
			case 1005: this.Input.processkey(0x50); break;
			case 1008: this.Input.processkey(0x3b); break;
			case 1021: this.Input.processkey(0x78); break;
			case 1031: this.Input.processkey(0x2b); break;
			case 1032: this.Input.processkey(0x2d); break;
			default:
				key &= 0x7f;
				if ((key >= 65) && (key <= 90))
					key += (97 - 65);
				this.Input.processkey(key); break;
		}
		return true;
	}

	public keyUp(key: i32): boolean {
		switch (key) {
			case 1006: this.Input.processkey(0xcb); break;
			case 1007: this.Input.processkey(0xcd); break;
			case 1004: this.Input.processkey(0xc8); break;
			case 1005: this.Input.processkey(0xd0); break;
			case 1008: this.Input.processkey(0xbb); break;
			case 1021: this.Input.processkey(0xf8); break;
			case 1031: this.Input.processkey(0xab); break;
			case 1032: this.Input.processkey(0xad); break;
			default:
				key &= 0x7f;
				if ((key >= 65) && (key <= 90))
					key += (97 - 65);
				this.Input.processkey(0x80 | key); break;
		}
		return true;
	}

	killdigger(stage: i32, bag: i32): void {
		if (this.deathstage < 2 || this.deathstage > 4) {
			this.digonscr = false;
			this.deathstage = stage;
			this.deathbag = bag;
		}
	}

	killemerald(x: i32, y: i32): void {
		if ((this.emfield[y * 15 + x + 15] & this.emmask) != 0) {
			this.emfield[y * 15 + x + 15] &= ~this.emmask;
			this.Drawing.eraseemerald(x * 20 + 12, (y + 1) * 18 + 21);
		}
	}

	killfire(): void {
		if (!this.notfiring) {
			this.notfiring = true;
			this.Sprite.erasespr(15);
			this.Sound.soundfireoff();
		}
	}

	makeemfield(): void {
		this.emmask = 1 << this.Main.getcplayer();
		for (let x = 0; x < 15; x++)
			for (let y = 0; y < 10; y++)
				if (this.Main.getlevch(x, y, this.Main.levplan()) == 'C')
					this.emfield[y * 15 + x] |= this.emmask;
				else
					this.emfield[y * 15 + x] &= ~this.emmask;
	}

	newframe(): void {
		this.Input.checkkeyb();
		this.time += this.frametime;
		const l = this.time - this.Pc.gethrt();
		if (l > 0) {
			this._factory.Sleep(l);
		}

		if (this.Pc.currentSource) {
			this.Pc.currentSource.newPixelsAll();
		}
	}

	reversedir(dir: i32): i32 {
		switch (dir) {
			case 0: return 4;
			case 4: return 0;
			case 2: return 6;
			case 6: return 2;
		}
		return dir;
	}

	private run(): void {
		this.Main.main();
	}

	public start(): void {
		this._factory.RequestFocus();
		this.run();
	}

	updatedigger(): void {
		let ddir = 0, nmon = 0
		let push = false;
		this.Input.readdir();
		const dir = this.Input.getdir();
		if (dir == 0 || dir == 2 || dir == 4 || dir == 6)
			ddir = dir;
		else
			ddir = -1;
		if (this.diggerrx == 0 && (ddir == 2 || ddir == 6))
			this.digdir = this.digmdir = ddir;
		if (this.diggerry == 0 && (ddir == 4 || ddir == 0))
			this.digdir = this.digmdir = ddir;
		if (dir == -1)
			this.digmdir = -1;
		else
			this.digmdir = this.digdir;
		if ((this.diggerx == 292 && this.digmdir == 0) || (this.diggerx == 12 && this.digmdir == 4) ||
			(this.diggery == 180 && this.digmdir == 6) || (this.diggery == 18 && this.digmdir == 2))
			this.digmdir = -1;
		const diggerox = this.diggerx;
		const diggeroy = this.diggery;
		if (this.digmdir != -1)
			this.Drawing.eatfield(diggerox, diggeroy, this.digmdir);
		switch (this.digmdir) {
			case 0:
				this.Drawing.drawrightblob(this.diggerx, this.diggery);
				this.diggerx += 4;
				break;
			case 4:
				this.Drawing.drawleftblob(this.diggerx, this.diggery);
				this.diggerx -= 4;
				break;
			case 2:
				this.Drawing.drawtopblob(this.diggerx, this.diggery);
				this.diggery -= 3;
				break;
			case 6:
				this.Drawing.drawbottomblob(this.diggerx, this.diggery);
				this.diggery += 3;
				break;
		}
		if (this.hitemerald(IntMath.div((this.diggerx - 12), 20), IntMath.div((this.diggery - 18), 18), (this.diggerx - 12) % 20,
			(this.diggery - 18) % 18, this.digmdir)) {
			this.Scores.scoreemerald();
			this.Sound.soundem();
			this.Sound.soundemerald(this.emocttime);
			this.emocttime = 9;
		}
		const clbits = this.Drawing.drawdigger(this.digdir, this.diggerx, this.diggery, this.notfiring && this.rechargetime == 0);
		this.Main.incpenalty();
		if ((this.Bags.bagbits() & clbits) != 0) {
			if (this.digmdir == 0 || this.digmdir == 4) {
				push = this.Bags.pushbags(this.digmdir, clbits);
				this.digtime++;
			}
			else
				if (!this.Bags.pushudbags(clbits))
					push = false;
			if (!push) { /* Strange, push not completely defined */
				this.diggerx = diggerox;
				this.diggery = diggeroy;
				this.Drawing.drawdigger(this.digmdir, this.diggerx, this.diggery, this.notfiring && this.rechargetime == 0);
				this.Main.incpenalty();
				this.digdir = this.reversedir(this.digmdir);
			}
		}
		if (((clbits & 0x3f00) != 0) && this.bonusmode)
			for (nmon = this.Monster.killmonsters(clbits); nmon != 0; nmon--) {
				this.Sound.soundeatm();
				this.Scores.scoreeatm();
			}
		if ((clbits & 0x4000) != 0) {
			this.Scores.scorebonus();
			this.initbonusmode();
		}
		this.diggerh = IntMath.div((this.diggerx - 12), 20);
		this.diggerrx = (this.diggerx - 12) % 20;
		this.diggerv = IntMath.div((this.diggery - 18), 18);
		this.diggerry = (this.diggery - 18) % 18;
	}

	updatefire(): void {
		let clbits = 0, b = 0, mon = 0, pix = 0;
		if (this.notfiring) {
			if (this.rechargetime != 0)
				this.rechargetime--;
			else
				if (this.getfirepflag())
					if (this.digonscr) {
						this.rechargetime = this.Main.levof10() * 3 + 60;
						this.notfiring = false;
						switch (this.digdir) {
							case 0:
								this.firex = this.diggerx + 8;
								this.firey = this.diggery + 4;
								break;
							case 4:
								this.firex = this.diggerx;
								this.firey = this.diggery + 4;
								break;
							case 2:
								this.firex = this.diggerx + 4;
								this.firey = this.diggery;
								break;
							case 6:
								this.firex = this.diggerx + 4;
								this.firey = this.diggery + 8;
						}
						this.firedir = this.digdir;
						this.Sprite.movedrawspr(15, this.firex, this.firey);
						this.Sound.soundfire();
					}
		}
		else {
			switch (this.firedir) {
				case 0:
					this.firex += 8;
					pix = this.Pc.ggetpix(this.firex, this.firey + 4) | this.Pc.ggetpix(this.firex + 4, this.firey + 4);
					break;
				case 4:
					this.firex -= 8;
					pix = this.Pc.ggetpix(this.firex, this.firey + 4) | this.Pc.ggetpix(this.firex + 4, this.firey + 4);
					break;
				case 2:
					this.firey -= 7;
					pix = (this.Pc.ggetpix(this.firex + 4, this.firey) | this.Pc.ggetpix(this.firex + 4, this.firey + 1) |
						this.Pc.ggetpix(this.firex + 4, this.firey + 2) | this.Pc.ggetpix(this.firex + 4, this.firey + 3) |
						this.Pc.ggetpix(this.firex + 4, this.firey + 4) | this.Pc.ggetpix(this.firex + 4, this.firey + 5) |
						this.Pc.ggetpix(this.firex + 4, this.firey + 6)) & 0xc0;
					break;
				case 6:
					this.firey += 7;
					pix = (this.Pc.ggetpix(this.firex, this.firey) | this.Pc.ggetpix(this.firex, this.firey + 1) |
						this.Pc.ggetpix(this.firex, this.firey + 2) | this.Pc.ggetpix(this.firex, this.firey + 3) |
						this.Pc.ggetpix(this.firex, this.firey + 4) | this.Pc.ggetpix(this.firex, this.firey + 5) |
						this.Pc.ggetpix(this.firex, this.firey + 6)) & 3;
					break;
			}
			clbits = this.Drawing.drawfire(this.firex, this.firey, 0);
			this.Main.incpenalty();
			if ((clbits & 0x3f00) != 0)
				for (mon = 0, b = 256; mon < 6; mon++, b <<= 1)
					if ((clbits & b) != 0) {
						this.Monster.killmon(mon);
						this.Scores.scorekill();
						this.expsn = 1;
					}
			if ((clbits & 0x40fe) != 0)
				this.expsn = 1;
			switch (this.firedir) {
				case 0:
					if (this.firex > 296)
						this.expsn = 1;
					else
						if (pix != 0 && clbits == 0) {
							this.expsn = 1;
							this.firex -= 8;
							this.Drawing.drawfire(this.firex, this.firey, 0);
						}
					break;
				case 4:
					if (this.firex < 16)
						this.expsn = 1;
					else
						if (pix != 0 && clbits == 0) {
							this.expsn = 1;
							this.firex += 8;
							this.Drawing.drawfire(this.firex, this.firey, 0);
						}
					break;
				case 2:
					if (this.firey < 15)
						this.expsn = 1;
					else
						if (pix != 0 && clbits == 0) {
							this.expsn = 1;
							this.firey += 7;
							this.Drawing.drawfire(this.firex, this.firey, 0);
						}
					break;
				case 6:
					if (this.firey > 183)
						this.expsn = 1;
					else
						if (pix != 0 && clbits == 0) {
							this.expsn = 1;
							this.firey -= 7;
							this.Drawing.drawfire(this.firex, this.firey, 0);
						}
			}
		}
	}
}
