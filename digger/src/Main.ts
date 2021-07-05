import { Digger } from "./Digger";
import { IntMath } from "./IntMath";
import { Threading } from "./Threading";
import { _game } from "./_game";

export class Main {

	dig: Digger;

	digsprorder: number[] = [14, 13, 7, 6, 5, 4, 3, 2, 1, 12, 11, 10, 9, 8, 15, 0];	// [16]

	gamedat: _game[] = [new _game(), new _game()];

	pldispbuf: string = "";

	shouldRun: boolean = true;

	curplayer = 0;
	nplayers = 0;
	penalty = 0;
	levnotdrawn = false;
	flashplayer = false;

	levfflag = false;
	biosflag = false;
	speedmul = 40;
	delaytime = 0;

	randv: number = 0;

	leveldat: string[][] =		// [8][10][15]
		[["S   B     HHHHS",
			"V  CC  C  V B  ",
			"VB CC  C  V    ",
			"V  CCB CB V CCC",
			"V  CC  C  V CCC",
			"HH CC  C  V CCC",
			" V    B B V    ",
			" HHHH     V    ",
			"C   V     V   C",
			"CC  HHHHHHH  CC"],
		["SHHHHH  B B  HS",
			" CC  V       V ",
			" CC  V CCCCC V ",
			"BCCB V CCCCC V ",
			"CCCC V       V ",
			"CCCC V B  HHHH ",
			" CC  V CC V    ",
			" BB  VCCCCV CC ",
			"C    V CC V CC ",
			"CC   HHHHHH    "],
		["SHHHHB B BHHHHS",
			"CC  V C C V BB ",
			"C   V C C V CC ",
			" BB V C C VCCCC",
			"CCCCV C C VCCCC",
			"CCCCHHHHHHH CC ",
			" CC  C V C  CC ",
			" CC  C V C     ",
			"C    C V C    C",
			"CC   C H C   CC"],
		["SHBCCCCBCCCCBHS",
			"CV  CCCCCCC  VC",
			"CHHH CCCCC HHHC",
			"C  V  CCC  V  C",
			"   HHH C HHH   ",
			"  B  V B V  B  ",
			"  C  VCCCV  C  ",
			" CCC HHHHH CCC ",
			"CCCCC CVC CCCCC",
			"CCCCC CHC CCCCC"],
		["SHHHHHHHHHHHHHS",
			"VBCCCCBVCCCCCCV",
			"VCCCCCCV CCBC V",
			"V CCCC VCCBCCCV",
			"VCCCCCCV CCCC V",
			"V CCCC VBCCCCCV",
			"VCCBCCCV CCCC V",
			"V CCBC VCCCCCCV",
			"VCCCCCCVCCCCCCV",
			"HHHHHHHHHHHHHHH"],
		["SHHHHHHHHHHHHHS",
			"VCBCCV V VCCBCV",
			"VCCC VBVBV CCCV",
			"VCCCHH V HHCCCV",
			"VCC V CVC V CCV",
			"VCCHH CVC HHCCV",
			"VC V CCVCC V CV",
			"VCHHBCCVCCBHHCV",
			"VCVCCCCVCCCCVCV",
			"HHHHHHHHHHHHHHH"],
		["SHCCCCCVCCCCCHS",
			" VCBCBCVCBCBCV ",
			"BVCCCCCVCCCCCVB",
			"CHHCCCCVCCCCHHC",
			"CCV CCCVCCC VCC",
			"CCHHHCCVCCHHHCC",
			"CCCCV CVC VCCCC",
			"CCCCHH V HHCCCC",
			"CCCCCV V VCCCCC",
			"CCCCCHHHHHCCCCC"],
		["HHHHHHHHHHHHHHS",
			"V CCBCCCCCBCC V",
			"HHHCCCCBCCCCHHH",
			"VBV CCCCCCC VBV",
			"VCHHHCCCCCHHHCV",
			"VCCBV CCC VBCCV",
			"VCCCHHHCHHHCCCV",
			"VCCCC V V CCCCV",
			"VCCCCCV VCCCCCV",
			"HHHHHHHHHHHHHHH"]];

	constructor(d: Digger) {
		this.dig = d;
	}

	addlife(pl: number): void {
		this.gamedat[pl - 1].lives++;
		this.dig.Sound.sound1up();
	}

	calibrate(): void {
		this.dig.Sound.volume = IntMath.div(this.dig.Pc.getkips(), 291);
		if (this.dig.Sound.volume == 0)
			this.dig.Sound.volume = 1;
	}

	checklevdone(): void {
		if ((this.dig.countem() == 0 || this.dig.Monster.monleft() == 0) && this.dig.digonscr)
			this.gamedat[this.curplayer].levdone = true;
		else
			this.gamedat[this.curplayer].levdone = false;
	}

	cleartopline(): void {
		this.dig.Drawing.outtext2("                          ", 0, 0, 3);
		this.dig.Drawing.outtext2(" ", 308, 0, 3);
	}

	drawscreen(): void {
		this.dig.Drawing.creatembspr();
		this.dig.Drawing.drawstatics();
		this.dig.Bags.drawbags();
		this.dig.drawemeralds();
		this.dig.initdigger();
		this.dig.Monster.initmonsters();
	}

	getcplayer(): number {
		return this.curplayer;
	}

	getlevch(x: number, y: number, l: number): string {
		if (l == 0)
			l++;
		return this.leveldat[l - 1][y].charAt(x);
	}

	getlives(pl: number): number {
		return this.gamedat[pl - 1].lives;
	}

	incpenalty(): void {
		this.penalty++;
	}

	initchars(): void {
		this.dig.Drawing.initmbspr();
		this.dig.initdigger();
		this.dig.Monster.initmonsters();
	}

	initlevel(): void {
		this.gamedat[this.curplayer].levdone = false;
		this.dig.Drawing.makefield();
		this.dig.makeemfield();
		this.dig.Bags.initbags();
		this.levnotdrawn = true;
	}

	levno(): number {
		return this.gamedat[this.curplayer].level;
	}

	levof10(): number {
		if (this.gamedat[this.curplayer].level > 10)
			return 10;
		return this.gamedat[this.curplayer].level;
	}

	levplan(): number {
		let l = this.levno();
		if (l > 8)
			l = (l & 3) + 5; /* Level plan: 12345678, 678, (5678) 247 times, 5 forever */
		return l;
	}

	async main(): Promise<void> {
		let frame, t, x = 0;
		let start: boolean;

		this.randv = this.dig.Pc.gethrt();
		this.calibrate();
		//  parsecmd(argc,argv);
		this.dig.ftime = this.speedmul * 2000;
		this.dig.Sprite.setretr(false);
		this.dig.Pc.ginit();
		this.dig.Sprite.setretr(true);
		this.dig.Pc.gpal(0);
		this.dig.Input.initkeyb();
		this.dig.Input.detectjoy();
		this.dig.Scores.loadscores();
		this.dig.Sound.initsound();

		this.dig.Scores.run();		// ??
		this.dig.Scores._updatescores(this.dig.Scores.scores);

		this.nplayers = 1;
		do {
			this.dig.Sound.soundstop();
			this.dig.Sprite.setsprorder(this.digsprorder);
			this.dig.Drawing.creatembspr();
			this.dig.Input.detectjoy();
			this.dig.Pc.gclear();
			this.dig.Pc.gtitle();
			this.dig.Drawing.outtext2("D I G G E R", 100, 0, 3);
			this.shownplayers();
			this.dig.Scores.showtable();
			start = false;
			frame = 0;

			this.dig.time = this.dig.Pc.gethrt();

			while (!start) {
				start = this.dig.Input.teststart();
				if (this.dig.Input.akeypressed == 27) {  //	esc
					this.switchnplayers();
					this.shownplayers();
					this.dig.Input.akeypressed = 0;
					this.dig.Input.keypressed = 0;
				}
				if (frame == 0)
					for (t = 54; t < 174; t += 12)
						this.dig.Drawing.outtext2("            ", 164, t, 0);
				if (frame == 50) {
					this.dig.Sprite.movedrawspr(8, 292, 63);
					x = 292;
				}
				if (frame > 50 && frame <= 77) {
					x -= 4;
					this.dig.Drawing.drawmon(0, true, 4, x, 63);
				}
				if (frame > 77)
					this.dig.Drawing.drawmon(0, true, 0, 184, 63);
				if (frame == 83)
					this.dig.Drawing.outtext2("NOBBIN", 216, 64, 2);
				if (frame == 90) {
					this.dig.Sprite.movedrawspr(9, 292, 82);
					this.dig.Drawing.drawmon(1, false, 4, 292, 82);
					x = 292;
				}
				if (frame > 90 && frame <= 117) {
					x -= 4;
					this.dig.Drawing.drawmon(1, false, 4, x, 82);
				}
				if (frame > 117)
					this.dig.Drawing.drawmon(1, false, 0, 184, 82);
				if (frame == 123)
					this.dig.Drawing.outtext2("HOBBIN", 216, 83, 2);
				if (frame == 130) {
					this.dig.Sprite.movedrawspr(0, 292, 101);
					this.dig.Drawing.drawdigger(4, 292, 101, true);
					x = 292;
				}
				if (frame > 130 && frame <= 157) {
					x -= 4;
					this.dig.Drawing.drawdigger(4, x, 101, true);
				}
				if (frame > 157)
					this.dig.Drawing.drawdigger(0, 184, 101, true);
				if (frame == 163)
					this.dig.Drawing.outtext2("DIGGER", 216, 102, 2);
				if (frame == 178) {
					this.dig.Sprite.movedrawspr(1, 184, 120);
					this.dig.Drawing.drawgold(1, 0, 184, 120);
				}
				if (frame == 183)
					this.dig.Drawing.outtext2("GOLD", 216, 121, 2);
				if (frame == 198)
					this.dig.Drawing.drawemerald(184, 141);
				if (frame == 203)
					this.dig.Drawing.outtext2("EMERALD", 216, 140, 2);
				if (frame == 218)
					this.dig.Drawing.drawbonus(184, 158);
				if (frame == 223)
					this.dig.Drawing.outtext2("BONUS", 216, 159, 2);
				await this.dig.newframe();
				frame++;
				if (frame > 250)
					frame = 0;
			}
			this.gamedat[0].level = 1;
			this.gamedat[0].lives = 3;
			if (this.nplayers == 2) {
				this.gamedat[1].level = 1;
				this.gamedat[1].lives = 3;
			}
			else
				this.gamedat[1].lives = 0;
			this.dig.Pc.gclear();
			this.curplayer = 0;
			this.initlevel();
			this.curplayer = 1;
			this.initlevel();
			this.dig.Scores.zeroscores();
			this.dig.bonusvisible = true;
			if (this.nplayers == 2)
				this.flashplayer = true;
			this.curplayer = 0;
			//	if (dig.Input.escape)
			//	  break;
			//    if (recording)
			//	  recputinit();
			while ((this.gamedat[0].lives != 0 || this.gamedat[1].lives != 0) && !this.dig.Input.escape) {
				this.gamedat[this.curplayer].dead = false;
				while (!this.gamedat[this.curplayer].dead && this.gamedat[this.curplayer].lives != 0 && !this.dig.Input.escape) {
					this.dig.Drawing.initmbspr();
					await this.play();
				}
				if (this.gamedat[1 - this.curplayer].lives != 0) {
					this.curplayer = 1 - this.curplayer;
					this.flashplayer = this.levnotdrawn = true;
				}
			}
			this.dig.Input.escape = false;
		} while (this.shouldRun); //dig.Input.escape);
		/*  dig.Sound.soundoff();
		  restoreint8();
		  restorekeyb();
		  graphicsoff(); */
	}

	async play(): Promise<void> {
		let t, c;
		/*  if (playing)
			randv=recgetrand();
		  else
			randv=getlrt();
		  if (recording)
			recputrand(randv); */
		if (this.levnotdrawn) {
			this.levnotdrawn = false;
			this.drawscreen();
			this.dig.time = this.dig.Pc.gethrt();
			if (this.flashplayer) {
				this.flashplayer = false;
				this.pldispbuf = "PLAYER ";
				if (this.curplayer == 0)
					this.pldispbuf += "1";
				else
					this.pldispbuf += "2";
				this.cleartopline();
				for (t = 0; t < 15; t++)
					for (c = 1; c <= 3; c++) {
						this.dig.Drawing.outtext2(this.pldispbuf, 108, 0, c);
						this.dig.Scores.writecurscore(c);
						/* olddelay(20); */
						this.dig.newframe();
						if (this.dig.Input.escape)
							return;
					}
				this.dig.Scores.drawscores();
				this.dig.Scores.addscore(0);
			}
		}
		else
			this.initchars();
		this.dig.Input.keypressed = 0;
		this.dig.Drawing.outtext2("        ", 108, 0, 3);
		this.dig.Scores.initscores();
		this.dig.Drawing.drawlives();
		this.dig.Sound.music(1);
		this.dig.Input.readdir();
		this.dig.time = this.dig.Pc.gethrt();
		while (!this.gamedat[this.curplayer].dead && !this.gamedat[this.curplayer].levdone && !this.dig.Input.escape) {
			this.penalty = 0;
			await this.dig.dodigger();
			this.dig.Monster.domonsters();
			this.dig.Bags.dobags();
			/*  if (penalty<8)
				  for (t=(8-penalty)*5;t>0;t--)
					olddelay(1); */
			if (this.penalty > 8)
				this.dig.Monster.incmont(this.penalty - 8);
			await this.testpause();
			this.checklevdone();
		}
		this.dig.erasedigger();
		this.dig.Sound.musicoff();
		t = 20;
		while ((this.dig.Bags.getnmovingbags() != 0 || t != 0) && !this.dig.Input.escape) {
			if (t != 0)
				t--;
			this.penalty = 0;
			this.dig.Bags.dobags();
			this.dig.dodigger();
			this.dig.Monster.domonsters();
			if (this.penalty < 8)
				/*    for (t=(8-penalty)*5;t>0;t--)
						 olddelay(1); */
				t = 0;
		}
		this.dig.Sound.soundstop();
		this.dig.killfire();
		this.dig.erasebonus();
		this.dig.Bags.cleanupbags();
		this.dig.Drawing.savefield();
		this.dig.Monster.erasemonsters();
		this.dig.newframe();		// needed by Java version!!
		if (this.gamedat[this.curplayer].levdone)
			this.dig.Sound.soundlevdone();
		if (this.dig.countem() == 0) {
			this.gamedat[this.curplayer].level++;
			if (this.gamedat[this.curplayer].level > 1000)
				this.gamedat[this.curplayer].level = 1000;
			this.initlevel();
		}
		if (this.gamedat[this.curplayer].dead) {
			this.gamedat[this.curplayer].lives--;
			this.dig.Drawing.drawlives();
			if (this.gamedat[this.curplayer].lives == 0 && !this.dig.Input.escape)
				await this.dig.Scores.endofgame();
		}
		if (this.gamedat[this.curplayer].levdone) {
			this.gamedat[this.curplayer].level++;
			if (this.gamedat[this.curplayer].level > 1000)
				this.gamedat[this.curplayer].level = 1000;
			this.initlevel();
		}
	}

	randno(n: number): number {
		this.randv = this.randv * 0x15a4e35 + 1;
		return (this.randv & 0x7fffffff) % n;
	}

	setdead(bp6: boolean): void {
		this.gamedat[this.curplayer].dead = bp6;
	}

	shownplayers(): void {
		if (this.nplayers == 1) {
			this.dig.Drawing.outtext2("ONE", 220, 25, 3);
			this.dig.Drawing.outtext2(" PLAYER ", 192, 39, 3);
		}
		else {
			this.dig.Drawing.outtext2("TWO", 220, 25, 3);
			this.dig.Drawing.outtext2(" PLAYERS", 184, 39, 3);
		}
	}

	switchnplayers(): void {
		this.nplayers = 3 - this.nplayers;
	}

	async testpause(): Promise<void> {
		if (this.dig.Input.akeypressed == 32) { /* Space bar */
			this.dig.Input.akeypressed = 0;
			this.dig.Sound.soundpause();
			this.dig.Sound.sett2val(40);
			this.dig.Sound.setsoundt2();
			this.cleartopline();
			this.dig.Drawing.outtext2("PRESS ANY KEY", 80, 0, 1);
			this.dig.newframe();
			this.dig.Input.keypressed = 0;
			while (this.shouldRun) {
				await Threading.sleep(50);
				if (this.dig.Input.keypressed != 0)
					break;
			}
			this.cleartopline();
			this.dig.Scores.drawscores();
			this.dig.Scores.addscore(0);
			this.dig.Drawing.drawlives();
			this.dig.newframe();
			this.dig.time = this.dig.Pc.gethrt() - this.dig.frametime;
			//	olddelay(200);
			this.dig.Input.keypressed = 0;
		}
		else
			this.dig.Sound.soundpauseoff();
	}

}
