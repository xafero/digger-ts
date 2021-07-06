import { IDigger } from "../api/IDigger";
import { IFactory } from "../api/IFactory";
import { Digger } from "./Digger";
import { ScoreTuple } from "./ScoreTuple";

export class Scores {

	dig: IDigger;
	factory: IFactory;

	scores: ScoreTuple[] = (new Array<ScoreTuple>(10)).fill(new ScoreTuple('', 0), 0, 10);
	substr: string = '';

	highbuf: string[] = ["...", "...", "...", "...", "...", "...", "...", "...", "...", "..."]; // (10)
	scorehigh: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [12]
	scoreinit: string[] = ["...", "...", "...", "...", "...", "...", "...", "...", "...", "...", "..."]; // (11)
	scoret: i32 = 0;
	score1: i32 = 0;
	score2: i32 = 0;
	nextbs1: i32 = 0;
	nextbs2: i32 = 0;
	hsbuf: string = '';
	scorebuf: string[] = (new Array<string>(512)).fill(' ', 0, 512);
	bonusscore: i32 = 20000;
	gotinitflag: boolean = false;

	constructor(d: IDigger, f: IFactory) {
		this.dig = d;
		this.factory = f;
	}

	public _submit(n: string, s: i32): ScoreTuple[] {
		if (this.dig.D().subaddr != null) {
			// const ms = 16 + ((Date.now() % (65536 - 16)));
			// const num = (((ms + 32768) * s) % 65536);
			// this.substr = n + '+' + s + '+' + ms + '+' + num;
			// new Thread(this).start();
		}
		return this.scores;
	}

	public _updatescores(o: ScoreTuple[]): void {
		if (o == null)
			return;

		// try {
		const xin: string[] = ["", "", "", "", "", "", "", "", "", ""]; // (10)
		const sc: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // (10)
		for (let i = 0; i < 10; i++) {
			xin[i] = o[i].Item1;
			sc[i] = o[i].Item2;
		}
		for (let i = 0; i < 10; i++) {
			this.scoreinit[i + 1] = xin[i];
			this.scorehigh[i + 2] = sc[i];
		}
		// } catch (e: any) {
		// NO-OP
		// }
	}

	addscore(score: i32): void {
		if (this.dig.GetMain().getcplayer() == 0) {
			this.score1 += score;
			if (this.score1 > 999999)
				this.score1 = 0;
			this.writenum(this.score1, 0, 0, 6, 1);
			if (this.score1 >= this.nextbs1) {
				if (this.dig.GetMain().getlives(1) < 5) {
					this.dig.GetMain().addlife(1);
					this.dig.GetDrawing().drawlives();
				}
				this.nextbs1 += this.bonusscore;
			}
		}
		else {
			this.score2 += score;
			if (this.score2 > 999999)
				this.score2 = 0;
			if (this.score2 < 100000)
				this.writenum(this.score2, 236, 0, 6, 1);
			else
				this.writenum(this.score2, 248, 0, 6, 1);
			if (this.score2 > this.nextbs2) {   /* Player 2 doesn't get the life until >20,000 ! */
				if (this.dig.GetMain().getlives(2) < 5) {
					this.dig.GetMain().addlife(2);
					this.dig.GetDrawing().drawlives();
				}
				this.nextbs2 += this.bonusscore;
			}
		}
		this.dig.GetMain().incpenalty();
		this.dig.GetMain().incpenalty();
		this.dig.GetMain().incpenalty();
	}

	drawscores(): void {
		this.writenum(this.score1, 0, 0, 6, 3);
		if (this.dig.GetMain().nplayers == 2)
			if (this.score2 < 100000)
				this.writenum(this.score2, 236, 0, 6, 3);
			else
				this.writenum(this.score2, 248, 0, 6, 3);
	}

	endofgame(): void {
		this.addscore(0);
		if (this.dig.GetMain().getcplayer() == 0)
			this.scoret = this.score1;
		else
			this.scoret = this.score2;
		if (this.scoret > this.scorehigh[11]) {
			this.dig.GetPc().P().gclear();
			this.drawscores();
			this.dig.GetMain().pldispbuf = "PLAYER ";
			if (this.dig.GetMain().getcplayer() == 0)
				this.dig.GetMain().pldispbuf += "1";
			else
				this.dig.GetMain().pldispbuf += "2";
			this.dig.GetDrawing().outtext(this.dig.GetMain().pldispbuf, 108, 0, 2, true);
			this.dig.GetDrawing().outtext(" NEW HIGH SCORE ", 64, 40, 2, true);
			this.getinitials();
			this._updatescores(this._submit(this.scoreinit[0], this.scoret));
			this.shufflehigh();
			//	savescores();
		}
		else {
			this.dig.GetMain().cleartopline();
			this.dig.GetDrawing().outtext("GAME OVER", 104, 0, 3, true);
			this._updatescores(this._submit("...", this.scoret));
			this.dig.GetSound().killsound();
			for (let j: i32 = 0; j < 20; j++) /* Number of times screen flashes * 2 */
				for (let i: i32 = 0; i < 2; i++) { //i<8;i++) {
					this.dig.GetSprite().setretr(true);
					//		dig.GetPc().ginten(1);
					this.dig.GetPc().P().gpal(1 - (j & 1));
					this.dig.GetSprite().setretr(false);
					for (let z = 0; z < 111; z++); /* A delay loop */
					this.dig.GetPc().P().gpal(0);
					//		dig.GetPc().ginten(0);
					this.dig.GetPc().P().ginten(1 - i & 1);
					this.dig.D().newframe();
				}
			this.dig.GetSound().setupsound();
			this.dig.GetDrawing().outtext("         ", 104, 0, 3, true);
			this.dig.GetSprite().setretr(true);
		}
	}

	flashywait(n: i32): void {
		/*  int i,gt,cx,p=0,k=1;
		  int gap=19;
		  dig.GetSprite().setretr(false);
		  for (i=0;i<(n<<1);i++) {
			for (cx=0;cx<dig.GetSound().volume;cx++) {
			  dig.GetPc().gpal(p=1-p);
			  for (gt=0;gt<gap;gt++);
			}
			} */

		this.factory.Sleep(n * 2);
	}

	getinitial(x: i32, y: i32): i32 {
		let i = 0;
		this.dig.GetInput().keypressed = 0;
		this.dig.GetPc().P().gwrite(x, y, ('_').charCodeAt(0), 3, true);
		for (let j = 0; j < 5; j++) {
			for (i = 0; i < 40; i++) {
				if ((this.dig.GetInput().keypressed & 0x80) == 0 && this.dig.GetInput().keypressed != 0)
					return this.dig.GetInput().keypressed;
				this.flashywait(15);
			}
			for (i = 0; i < 40; i++) {
				if ((this.dig.GetInput().keypressed & 0x80) == 0 && this.dig.GetInput().keypressed != 0) {
					this.dig.GetPc().P().gwrite(x, y, ('_').charCodeAt(0), 3, true);
					return this.dig.GetInput().keypressed;
				}
				this.flashywait(15);
			}
		}
		this.gotinitflag = true;
		return 0;
	}

	getinitials(): void {
		this.dig.GetDrawing().outtext("ENTER YOUR", 100, 70, 3, true);
		this.dig.GetDrawing().outtext(" INITIALS", 100, 90, 3, true);
		this.dig.GetDrawing().outtext("_ _ _", 128, 130, 3, true);
		this.scoreinit[0] = "...";
		this.dig.GetSound().killsound();
		this.gotinitflag = false;
		for (let i = 0; i < 3; i++) {
			let k = 0;
			while (k == 0 && !this.gotinitflag) {
				k = this.getinitial(i * 24 + 128, 130);
				if (i != 0 && k == 8)
					i--;
				k = this.dig.GetInput().getasciikey(k.toString());
			}
			if (k != 0) {
				this.dig.GetPc().P().gwrite(i * 24 + 128, 130, k, 3, true);
				const sb = (this.scoreinit[0]) + '';
				const copy = sb.substring(0, i - 1) + String.fromCharCode(k) + sb.substring(i + 1);
				this.scoreinit[0] = copy.toString();
			}
		}
		this.dig.GetInput().keypressed = 0;
		for (let i = 0; i < 20; i++)
			this.flashywait(15);
		this.dig.GetSound().setupsound();
		this.dig.GetPc().P().gclear();
		this.dig.GetPc().P().gpal(0);
		this.dig.GetPc().P().ginten(0);
		this.dig.D().newframe();	// needed by Java version!!
		this.dig.GetSprite().setretr(true);
	}

	initscores(): void {
		this.addscore(0);
	}

	loadscores(): void {
		let p = 1;
		//readscores();
		for (let i = 1; i < 11; i++) {
			for (let x = 0; x < 3; x++)
				this.scoreinit[i] = "..."; //  scorebuf[p++];	--- zmienic
			p += 2;
			for (let x = 0; x < 6; x++)
				this.highbuf[x] = this.scorebuf[p++];
			this.scorehigh[i + 1] = 0; //atol(highbuf);
		}
		if (this.scorebuf[0] != 's')
			for (let i = 0; i < 11; i++) {
				this.scorehigh[i + 1] = 0;
				this.scoreinit[i] = "...";
			}
	}

	numtostring(n: i32): string {
		let x = 0;
		let p: string = '';
		for (x = 0; x < 6; x++) {
			p = (n % 10).toString() + p;
			n /= 10;
			if (n == 0) {
				x++;
				break;
			}
		}
		for (; x < 6; x++)
			p = ' ' + p;
		return p;
	}

	public run(): void {
		/*URL u = new URL (this.dig.subaddr+'?'+this.substr);
		URLConnection uc = u.openConnection ();
		uc.setUseCaches (false);
		uc.connect ();
		BufferedReader br = new BufferedReader (new InputStreamReader (uc.getInputStream ()));
		Object[][] sc = new Object[10][2];
		for (int i=0;i<10;i++) {
		  sc[i][0] = br.readLine ();
		  sc[i][1] = new Integer (br.readLine ());
		}
		br.close ();
		this.scores = sc;*/
	}

	scorebonus(): void {
		this.addscore(1000);
	}

	scoreeatm(): void {
		this.addscore(this.dig.D().eatmsc * 200);
		this.dig.D().eatmsc <<= 1;
	}

	scoreemerald(): void {
		this.addscore(25);
	}

	scoregold(): void {
		this.addscore(500);
	}

	scorekill(): void {
		this.addscore(250);
	}

	scoreoctave(): void {
		this.addscore(250);
	}

	showtable(): void {
		this.dig.GetDrawing().outtext2("HIGH SCORES", 16, 25, 3);
		let col = 2;
		for (let i = 1; i < 11; i++) {
			this.hsbuf = this.scoreinit[i] + "  " + this.numtostring(this.scorehigh[i + 1]);
			this.dig.GetDrawing().outtext2(this.hsbuf, 16, 31 + 13 * i, col);
			col = 1;
		}
	}

	shufflehigh(): void {
		let j = 0;
		for (j = 10; j > 1; j--)
			if (this.scoret < this.scorehigh[j])
				break;
		for (let i = 10; i > j; i--) {
			this.scorehigh[i + 1] = this.scorehigh[i];
			this.scoreinit[i] = this.scoreinit[i - 1];
		}
		this.scorehigh[j + 1] = this.scoret;
		this.scoreinit[j] = this.scoreinit[0];
	}

	writecurscore(bp6: i32): void {
		if (this.dig.GetMain().getcplayer() == 0)
			this.writenum(this.score1, 0, 0, 6, bp6);
		else
			if (this.score2 < 100000)
				this.writenum(this.score2, 236, 0, 6, bp6);
			else
				this.writenum(this.score2, 248, 0, 6, bp6);
	}

	writenum(n: i32, x: i32, y: i32, w: i32, c: i32): void {
		let xp = (w - 1) * 12 + x;
		while (w > 0) {
			const d = (n % 10);
			if (w > 1 || d > 0) {
				const cc = (d + '0'.charCodeAt(0));
				this.dig.GetPc().P().gwrite(xp, y, cc, c, false);	//true
			}
			n /= 10;
			w--;
			xp -= 12;
		}
	}

	zeroscores(): void {
		this.score2 = 0;
		this.score1 = 0;
		this.scoret = 0;
		this.nextbs1 = this.bonusscore;
		this.nextbs2 = this.bonusscore;
	}

}
