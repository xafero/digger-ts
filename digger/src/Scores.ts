import { Digger } from "./Digger";
import { Threading } from "./Threading";

export class Scores {

	dig: Digger;
	scores: any[][] = [];
	substr: string = '';

	highbuf: string[] = new Array(10);
	scorehigh: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [12]
	scoreinit: string[] = new Array(11);
	scoret = 0;
	score1 = 0;
	score2 = 0;
	nextbs1 = 0;
	nextbs2 = 0;
	hsbuf: string = '';
	scorebuf: string[] = new Array(512);
	bonusscore = 20000;
	gotinitflag = false;

	constructor(d: Digger) {
		this.dig = d;
	}

	public _submit(n: string, s: number): any[][] {
		if (this.dig.subaddr != null) {
			const ms = 16 + ((Date.now() % (65536 - 16)));
			this.substr = n + '+' + s + '+' + ms + '+' + ((ms + 32768) * s) % 65536;
			// new Thread(this).start();
		}
		return this.scores;
	}

	public _updatescores(o: any[][]): void {

		if (o == null)
			return;

		try {
			const xin: string[] = new Array(10);
			const sc: number[] = new Array(10);
			for (let i = 0; i < 10; i++) {
				xin[i] = o[i][0];
				sc[i] = o[i][1];
			}
			for (let i = 0; i < 10; i++) {
				this.scoreinit[i + 1] = xin[i];
				this.scorehigh[i + 2] = sc[i];
			}
		} catch (e: any) {
			// NO-OP
		}
	}

	addscore(score: number): void {
		if (this.dig.Main.getcplayer() == 0) {
			this.score1 += score;
			if (this.score1 > 999999)
				this.score1 = 0;
			this.writenum(this.score1, 0, 0, 6, 1);
			if (this.score1 >= this.nextbs1) {
				if (this.dig.Main.getlives(1) < 5) {
					this.dig.Main.addlife(1);
					this.dig.Drawing.drawlives();
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
				if (this.dig.Main.getlives(2) < 5) {
					this.dig.Main.addlife(2);
					this.dig.Drawing.drawlives();
				}
				this.nextbs2 += this.bonusscore;
			}
		}
		this.dig.Main.incpenalty();
		this.dig.Main.incpenalty();
		this.dig.Main.incpenalty();
	}

	drawscores(): void {
		this.writenum(this.score1, 0, 0, 6, 3);
		if (this.dig.Main.nplayers == 2)
			if (this.score2 < 100000)
				this.writenum(this.score2, 236, 0, 6, 3);
			else
				this.writenum(this.score2, 248, 0, 6, 3);
	}

	async endofgame(): Promise<void> {
		let i, j, z;
		this.addscore(0);
		if (this.dig.Main.getcplayer() == 0)
			this.scoret = this.score1;
		else
			this.scoret = this.score2;
		if (this.scoret > this.scorehigh[11]) {
			this.dig.Pc.gclear();
			this.drawscores();
			this.dig.Main.pldispbuf = "PLAYER ";
			if (this.dig.Main.getcplayer() == 0)
				this.dig.Main.pldispbuf += "1";
			else
				this.dig.Main.pldispbuf += "2";
			this.dig.Drawing.outtext(this.dig.Main.pldispbuf, 108, 0, 2, true);
			this.dig.Drawing.outtext(" NEW HIGH SCORE ", 64, 40, 2, true);
			await this.getinitials();
			this._updatescores(this._submit(this.scoreinit[0], this.scoret));
			this.shufflehigh();
			//	savescores();
		}
		else {
			this.dig.Main.cleartopline();
			this.dig.Drawing.outtext("GAME OVER", 104, 0, 3, true);
			this._updatescores(this._submit("...", this.scoret));
			this.dig.Sound.killsound();
			for (j = 0; j < 20; j++) /* Number of times screen flashes * 2 */
				for (i = 0; i < 2; i++) { //i<8;i++) {
					this.dig.Sprite.setretr(true);
					//		dig.Pc.ginten(1);
					this.dig.Pc.gpal(1 - (j & 1));
					this.dig.Sprite.setretr(false);
					for (z = 0; z < 111; z++); /* A delay loop */
					this.dig.Pc.gpal(0);
					//		dig.Pc.ginten(0);
					this.dig.Pc.ginten(1 - i & 1);
					this.dig.newframe();
				}
			this.dig.Sound.setupsound();
			this.dig.Drawing.outtext("         ", 104, 0, 3, true);
			this.dig.Sprite.setretr(true);
		}
	}

	async flashywait(n: number): Promise<void> {
		/*  int i,gt,cx,p=0,k=1;
		  int gap=19;
		  dig.Sprite.setretr(false);
		  for (i=0;i<(n<<1);i++) {
			for (cx=0;cx<dig.Sound.volume;cx++) {
			  dig.Pc.gpal(p=1-p);
			  for (gt=0;gt<gap;gt++);
			}
			} */

		await Threading.sleep(n * 2);
	}

	async getinitial(x: number, y: number): Promise<number> {
		let i, j;
		this.dig.Input.keypressed = 0;
		this.dig.Pc.gwrite(x, y, ('_').charCodeAt(0), 3, true);
		for (j = 0; j < 5; j++) {
			for (i = 0; i < 40; i++) {
				if ((this.dig.Input.keypressed & 0x80) == 0 && this.dig.Input.keypressed != 0)
					return this.dig.Input.keypressed;
				await this.flashywait(15);
			}
			for (i = 0; i < 40; i++) {
				if ((this.dig.Input.keypressed & 0x80) == 0 && this.dig.Input.keypressed != 0) {
					this.dig.Pc.gwrite(x, y, ('_').charCodeAt(0), 3, true);
					return this.dig.Input.keypressed;
				}
				await this.flashywait(15);
			}
		}
		this.gotinitflag = true;
		return 0;
	}

	async getinitials(): Promise<void> {
		let k, i;
		this.dig.Drawing.outtext("ENTER YOUR", 100, 70, 3, true);
		this.dig.Drawing.outtext(" INITIALS", 100, 90, 3, true);
		this.dig.Drawing.outtext("_ _ _", 128, 130, 3, true);
		this.scoreinit[0] = "...";
		this.dig.Sound.killsound();
		this.gotinitflag = false;
		for (i = 0; i < 3; i++) {
			k = 0;
			while (k == 0 && !this.gotinitflag) {
				k = await this.getinitial(i * 24 + 128, 130);
				if (i != 0 && k == 8)
					i--;
				k = this.dig.Input.getasciikey(k.toString());
			}
			if (k != 0) {
				this.dig.Pc.gwrite(i * 24 + 128, 130, k, 3, true);
				const sb = (this.scoreinit[0]) + '';
				const copy = sb.substring(0, i - 1) + k + sb.substring(i + 1);
				this.scoreinit[0] = copy.toString();
			}
		}
		this.dig.Input.keypressed = 0;
		for (i = 0; i < 20; i++)
			await this.flashywait(15);
		this.dig.Sound.setupsound();
		this.dig.Pc.gclear();
		this.dig.Pc.gpal(0);
		this.dig.Pc.ginten(0);
		this.dig.newframe();	// needed by Java version!!
		this.dig.Sprite.setretr(true);
	}

	initscores(): void {
		this.addscore(0);
	}

	loadscores(): void {
		let p = 1, i, x;
		//readscores();
		for (i = 1; i < 11; i++) {
			for (x = 0; x < 3; x++)
				this.scoreinit[i] = "..."; //  scorebuf[p++];	--- zmienic
			p += 2;
			for (x = 0; x < 6; x++)
				this.highbuf[x] = this.scorebuf[p++];
			this.scorehigh[i + 1] = 0; //atol(highbuf);
		}
		if (this.scorebuf[0] != 's')
			for (i = 0; i < 11; i++) {
				this.scorehigh[i + 1] = 0;
				this.scoreinit[i] = "...";
			}
	}

	numtostring(n: number): string {
		let x;
		let p: string = '';
		for (x = 0; x < 6; x++) {
			p = (n % 10) + p;
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
		this.addscore(this.dig.eatmsc * 200);
		this.dig.eatmsc <<= 1;
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
		let i, col;
		this.dig.Drawing.outtext2("HIGH SCORES", 16, 25, 3);
		col = 2;
		for (i = 1; i < 11; i++) {
			this.hsbuf = this.scoreinit[i] + "  " + this.numtostring(this.scorehigh[i + 1]);
			this.dig.Drawing.outtext2(this.hsbuf, 16, 31 + 13 * i, col);
			col = 1;
		}
	}

	shufflehigh(): void {
		let i, j;
		for (j = 10; j > 1; j--)
			if (this.scoret < this.scorehigh[j])
				break;
		for (i = 10; i > j; i--) {
			this.scorehigh[i + 1] = this.scorehigh[i];
			this.scoreinit[i] = this.scoreinit[i - 1];
		}
		this.scorehigh[j + 1] = this.scoret;
		this.scoreinit[j] = this.scoreinit[0];
	}

	writecurscore(bp6: number): void {
		if (this.dig.Main.getcplayer() == 0)
			this.writenum(this.score1, 0, 0, 6, bp6);
		else
			if (this.score2 < 100000)
				this.writenum(this.score2, 236, 0, 6, bp6);
			else
				this.writenum(this.score2, 248, 0, 6, bp6);
	}

	writenum(n: number, x: number, y: number, w: number, c: number): void {
		let d, xp = (w - 1) * 12 + x;
		while (w > 0) {
			d = (n % 10);
			if (w > 1 || d > 0)
				this.dig.Pc.gwrite(xp, y, (d + '0').charCodeAt(0), c, false);	//true
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
