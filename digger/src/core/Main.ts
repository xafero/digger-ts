import { IDigger } from "../api/IDigger";
import { IFactory } from "../api/IFactory";
import { IntMath } from "../web/IntMath";
import { Digger } from "./Digger";
import { _game } from "./_game";

export class Main {

	dig: IDigger;
	factory: IFactory;

	digsprorder: i32[] = [14, 13, 7, 6, 5, 4, 3, 2, 1, 12, 11, 10, 9, 8, 15, 0];	// [16]

	gamedat: _game[] = [new _game(), new _game()];

	pldispbuf: string = "";

	shouldRun: boolean = true;

	curplayer: i32 = 0;
	nplayers: i32 = 0;
	penalty: i32 = 0;
	levnotdrawn: boolean = false;
	flashplayer: boolean = false;

	levfflag: boolean = false;
	biosflag: boolean = false;
	speedmul: i32 = 40;
	delaytime: i32 = 0;

	randv: i64 = 0;

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

	constructor(d: IDigger, f: IFactory) {
		this.dig = d;
		this.factory = f;
	}

	addlife(pl: i32): void {
		this.gamedat[pl - 1].lives++;
		this.dig.GetSound().sound1up();
	}

	calibrate(): void {
		this.dig.GetSound().volume = IntMath.div(this.dig.GetPc().P().getkips(), 291);
		if (this.dig.GetSound().volume == 0)
			this.dig.GetSound().volume = 1;
	}

	checklevdone(): void {
		if ((this.dig.D().countem() == 0 || this.dig.GetMonster().monleft() == 0) && this.dig.D().digonscr)
			this.gamedat[this.curplayer].levdone = true;
		else
			this.gamedat[this.curplayer].levdone = false;
	}

	cleartopline(): void {
		this.dig.GetDrawing().outtext2("                          ", 0, 0, 3);
		this.dig.GetDrawing().outtext2(" ", 308, 0, 3);
	}

	drawscreen(): void {
		this.dig.GetDrawing().creatembspr();
		this.dig.GetDrawing().drawstatics();
		this.dig.D().Bags.drawbags();
		this.dig.D().drawemeralds();
		this.dig.D().initdigger();
		this.dig.GetMonster().initmonsters();
	}

	getcplayer(): i32 {
		return this.curplayer;
	}

	getlevch(x: i32, y: i32, l: i32): string {
		if (l == 0)
			l++;
		return this.leveldat[l - 1][y].charAt(x);
	}

	getlives(pl: i32): i32 {
		return this.gamedat[pl - 1].lives;
	}

	incpenalty(): void {
		this.penalty++;
	}

	initchars(): void {
		this.dig.GetDrawing().initmbspr();
		this.dig.D().initdigger();
		this.dig.GetMonster().initmonsters();
	}

	initlevel(): void {
		this.gamedat[this.curplayer].levdone = false;
		this.dig.GetDrawing().makefield();
		this.dig.D().makeemfield();
		this.dig.D().Bags.initbags();
		this.levnotdrawn = true;
	}

	levno(): i32 {
		return this.gamedat[this.curplayer].level;
	}

	levof10(): i32 {
		if (this.gamedat[this.curplayer].level > 10)
			return 10;
		return this.gamedat[this.curplayer].level;
	}

	levplan(): i32 {
		let l = this.levno();
		if (l > 8)
			l = (l & 3) + 5; /* Level plan: 12345678, 678, (5678) 247 times, 5 forever */
		return l;
	}

	main(): void {
		let frame = 0, t = 0, x = 0;
		let start: boolean;

		this.randv = this.dig.GetPc().P().gethrt();
		this.calibrate();
		//  parsecmd(argc,argv);
		this.dig.D().ftime = this.speedmul * 2000;
		this.dig.GetSprite().setretr(false);
		this.dig.GetPc().P().ginit();
		this.dig.GetSprite().setretr(true);
		this.dig.GetPc().P().gpal(0);
		this.dig.GetInput().initkeyb();
		this.dig.GetInput().detectjoy();
		this.dig.GetScores().loadscores();
		this.dig.GetSound().initsound();

		this.dig.GetScores().run();		// ??
		this.dig.GetScores()._updatescores(this.dig.GetScores().scores);

		this.nplayers = 1;
		do {
			this.dig.GetSound().soundstop();
			this.dig.GetSprite().setsprorder(this.digsprorder);
			this.dig.GetDrawing().creatembspr();
			this.dig.GetInput().detectjoy();
			this.dig.GetPc().P().gclear();
			this.dig.GetPc().P().gtitle();
			this.dig.GetDrawing().outtext2("D I G G E R", 100, 0, 3);
			this.shownplayers();
			this.dig.GetScores().showtable();
			start = false;
			frame = 0;

			this.dig.D().time = this.dig.GetPc().P().gethrt();

			while (!start) {
				start = this.dig.GetInput().teststart();
				if (this.dig.GetInput().akeypressed == 27) {  //	esc
					this.switchnplayers();
					this.shownplayers();
					this.dig.GetInput().akeypressed = 0;
					this.dig.GetInput().keypressed = 0;
				}
				if (frame == 0)
					for (t = 54; t < 174; t += 12)
						this.dig.GetDrawing().outtext2("            ", 164, t, 0);
				if (frame == 50) {
					this.dig.GetSprite().movedrawspr(8, 292, 63);
					x = 292;
				}
				if (frame > 50 && frame <= 77) {
					x -= 4;
					this.dig.GetDrawing().drawmon(0, true, 4, x, 63);
				}
				if (frame > 77)
					this.dig.GetDrawing().drawmon(0, true, 0, 184, 63);
				if (frame == 83)
					this.dig.GetDrawing().outtext2("NOBBIN", 216, 64, 2);
				if (frame == 90) {
					this.dig.GetSprite().movedrawspr(9, 292, 82);
					this.dig.GetDrawing().drawmon(1, false, 4, 292, 82);
					x = 292;
				}
				if (frame > 90 && frame <= 117) {
					x -= 4;
					this.dig.GetDrawing().drawmon(1, false, 4, x, 82);
				}
				if (frame > 117)
					this.dig.GetDrawing().drawmon(1, false, 0, 184, 82);
				if (frame == 123)
					this.dig.GetDrawing().outtext2("HOBBIN", 216, 83, 2);
				if (frame == 130) {
					this.dig.GetSprite().movedrawspr(0, 292, 101);
					this.dig.GetDrawing().drawdigger(4, 292, 101, true);
					x = 292;
				}
				if (frame > 130 && frame <= 157) {
					x -= 4;
					this.dig.GetDrawing().drawdigger(4, x, 101, true);
				}
				if (frame > 157)
					this.dig.GetDrawing().drawdigger(0, 184, 101, true);
				if (frame == 163)
					this.dig.GetDrawing().outtext2("DIGGER", 216, 102, 2);
				if (frame == 178) {
					this.dig.GetSprite().movedrawspr(1, 184, 120);
					this.dig.GetDrawing().drawgold(1, 0, 184, 120);
				}
				if (frame == 183)
					this.dig.GetDrawing().outtext2("GOLD", 216, 121, 2);
				if (frame == 198)
					this.dig.GetDrawing().drawemerald(184, 141);
				if (frame == 203)
					this.dig.GetDrawing().outtext2("EMERALD", 216, 140, 2);
				if (frame == 218)
					this.dig.GetDrawing().drawbonus(184, 158);
				if (frame == 223)
					this.dig.GetDrawing().outtext2("BONUS", 216, 159, 2);		
					this.dig.D().newframe();
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
			this.dig.GetPc().P().gclear();
			this.curplayer = 0;
			this.initlevel();
			this.curplayer = 1;
			this.initlevel();
			this.dig.GetScores().zeroscores();
			this.dig.D().bonusvisible = true;
			if (this.nplayers == 2)
				this.flashplayer = true;
			this.curplayer = 0;
			//	if (dig.GetInput().escape)
			//	  break;
			//    if (recording)
			//	  recputinit();
			while ((this.gamedat[0].lives != 0 || this.gamedat[1].lives != 0) && !this.dig.GetInput().escape) {
				this.gamedat[this.curplayer].dead = false;
				while (!this.gamedat[this.curplayer].dead && this.gamedat[this.curplayer].lives != 0 && !this.dig.GetInput().escape) {
					this.dig.GetDrawing().initmbspr();
					this.play();
				}
				if (this.gamedat[1 - this.curplayer].lives != 0) {
					this.curplayer = 1 - this.curplayer;
					this.flashplayer = this.levnotdrawn = true;
				}
			}
			this.dig.GetInput().escape = false;
		} while (this.shouldRun); //dig.GetInput().escape);
		/*  dig.GetSound().soundoff();
		  restoreint8();
		  restorekeyb();
		  graphicsoff(); */
	}

	play(): void {
		let t = 0, c = 0;
		/*  if (playing)
			randv=recgetrand();
		  else
			randv=getlrt();
		  if (recording)
			recputrand(randv); */
		if (this.levnotdrawn) {
			this.levnotdrawn = false;
			this.drawscreen();
			this.dig.D().time = this.dig.GetPc().P().gethrt();
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
						this.dig.GetDrawing().outtext2(this.pldispbuf, 108, 0, c);
						this.dig.GetScores().writecurscore(c);
						/* olddelay(20); */
						this.dig.D().newframe();
						if (this.dig.GetInput().escape)
							return;
					}
				this.dig.GetScores().drawscores();
				this.dig.GetScores().addscore(0);
			}
		}
		else
			this.initchars();
		this.dig.GetInput().keypressed = 0;
		this.dig.GetDrawing().outtext2("        ", 108, 0, 3);
		this.dig.GetScores().initscores();
		this.dig.GetDrawing().drawlives();
		this.dig.GetSound().music(1);
		this.dig.GetInput().readdir();
		this.dig.D().time = this.dig.GetPc().P().gethrt();
		while (!this.gamedat[this.curplayer].dead && !this.gamedat[this.curplayer].levdone && !this.dig.GetInput().escape) {
			this.penalty = 0;
			this.dig.D().dodigger();
			this.dig.GetMonster().domonsters();
			this.dig.D().Bags.dobags();
			/*  if (penalty<8)
				  for (t=(8-penalty)*5;t>0;t--)
					olddelay(1); */
			if (this.penalty > 8)
				this.dig.GetMonster().incmont(this.penalty - 8);
			this.testpause();
			this.checklevdone();
		}
		this.dig.D().erasedigger();
		this.dig.GetSound().musicoff();
		t = 20;
		while ((this.dig.D().Bags.getnmovingbags() != 0 || t != 0) && !this.dig.GetInput().escape) {
			if (t != 0)
				t--;
			this.penalty = 0;
			this.dig.D().Bags.dobags();
			this.dig.D().dodigger();
			this.dig.GetMonster().domonsters();
			if (this.penalty < 8)
				/*    for (t=(8-penalty)*5;t>0;t--)
						 olddelay(1); */
				t = 0;
		}
		this.dig.GetSound().soundstop();
		this.dig.D().killfire();
		this.dig.D().erasebonus();
		this.dig.D().Bags.cleanupbags();
		this.dig.GetDrawing().savefield();
		this.dig.GetMonster().erasemonsters();
		this.dig.D().newframe();		// needed by Java version!!
		if (this.gamedat[this.curplayer].levdone)
			this.dig.GetSound().soundlevdone();
		if (this.dig.D().countem() == 0) {
			this.gamedat[this.curplayer].level++;
			if (this.gamedat[this.curplayer].level > 1000)
				this.gamedat[this.curplayer].level = 1000;
			this.initlevel();
		}
		if (this.gamedat[this.curplayer].dead) {
			this.gamedat[this.curplayer].lives--;
			this.dig.GetDrawing().drawlives();
			if (this.gamedat[this.curplayer].lives == 0 && !this.dig.GetInput().escape)
				this.dig.GetScores().endofgame();
		}
		if (this.gamedat[this.curplayer].levdone) {
			this.gamedat[this.curplayer].level++;
			if (this.gamedat[this.curplayer].level > 1000)
				this.gamedat[this.curplayer].level = 1000;
			this.initlevel();
		}
	}

	randno(n: i32): i64 {
		this.randv = this.randv * 0x15a4e35 + 1;
		return (this.randv & 0x7fffffff) % n;
	}

	setdead(bp6: boolean): void {
		this.gamedat[this.curplayer].dead = bp6;
	}

	shownplayers(): void {
		if (this.nplayers == 1) {
			this.dig.GetDrawing().outtext2("ONE", 220, 25, 3);
			this.dig.GetDrawing().outtext2(" PLAYER ", 192, 39, 3);
		}
		else {
			this.dig.GetDrawing().outtext2("TWO", 220, 25, 3);
			this.dig.GetDrawing().outtext2(" PLAYERS", 184, 39, 3);
		}
	}

	switchnplayers(): void {
		this.nplayers = 3 - this.nplayers;
	}

	testpause(): void {
		if (this.dig.GetInput().akeypressed == 32) { /* Space bar */
			this.dig.GetInput().akeypressed = 0;
			this.dig.GetSound().soundpause();
			this.dig.GetSound().sett2val(40);
			this.dig.GetSound().setsoundt2();
			this.cleartopline();
			this.dig.GetDrawing().outtext2("PRESS ANY KEY", 80, 0, 1);
			this.dig.D().newframe();
			this.dig.GetInput().keypressed = 0;
			while (this.shouldRun) {
				this.factory.Sleep(50);
				if (this.dig.GetInput().keypressed != 0)
					break;
			}
			this.cleartopline();
			this.dig.GetScores().drawscores();
			this.dig.GetScores().addscore(0);
			this.dig.GetDrawing().drawlives();
			this.dig.D().newframe();
			this.dig.D().time = this.dig.GetPc().P().gethrt() - this.dig.D().frametime;
			//	olddelay(200);
			this.dig.GetInput().keypressed = 0;
		}
		else
			this.dig.GetSound().soundpauseoff();
	}

}
