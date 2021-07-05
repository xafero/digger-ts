// sound has not been ported yet

import { Digger } from "./Digger";
import { IntMath } from "./IntMath";
import { Threading } from "./Threading";

export class Sound {

	dig: Digger;

	wavetype = 0;
	t2val = 0;
	t0val = 0;
	musvol = 0;
	spkrmode = 0;
	timerrate = 0x7d0;
	timercount = 0;
	pulsewidth = 1;
	volume = 0;

	timerclock = 0;		// sint3

	soundflag = true;
	musicflag = true;

	sndflag = false;
	soundpausedflag = false;

	soundlevdoneflag = false;
	nljpointer = 0;
	nljnoteduration = 0;

	newlevjingle: number[] = [0x8e8, 0x712, 0x5f2, 0x7f0, 0x6ac, 0x54c, 0x712, 0x5f2, 0x4b8, 0x474, 0x474];	// [11]

	soundfallflag = false;
	soundfallf = false;
	soundfallvalue = 0;
	soundfalln = 0;

	soundbreakflag = false;
	soundbreakduration = 0;
	soundbreakvalue = 0;

	soundwobbleflag = false;
	soundwobblen = 0;

	soundfireflag = false;
	soundfirevalue = 0;
	soundfiren = 0;

	soundexplodeflag = false;
	soundexplodevalue = 0;
	soundexplodeduration = 0;

	soundbonusflag = false;
	soundbonusn = 0;

	soundemflag = false;

	soundemeraldflag = false;
	soundemeraldduration = 0;
	emerfreq = 0;
	soundemeraldn = 0;

	soundgoldflag = false;
	soundgoldf = false;
	soundgoldvalue1 = 0;
	soundgoldvalue2 = 0;
	soundgoldduration = 0;

	soundeatmflag = false;
	soundeatmvalue = 0;
	soundeatmduration = 0;
	soundeatmn = 0;

	soundddieflag = false;
	soundddien = 0;
	soundddievalue = 0;

	sound1upflag = false;
	sound1upduration = 0;

	musicplaying = false;
	musicp = 0;
	tuneno = 0;
	noteduration = 0;
	notevalue = 0;
	musicmaxvol = 0;
	musicattackrate = 0;
	musicsustainlevel = 0;
	musicdecayrate = 0;
	musicnotewidth = 0;
	musicreleaserate = 0;
	musicstage = 0;
	musicn = 0;

	/*int bonusjingle[]={	// [321]
	  0x11d1,2,0x11d1,2,0x11d1,4,0x11d1,2,0x11d1,2,0x11d1,4,0x11d1,2,0x11d1,2,
	   0xd59,4, 0xbe4,4, 0xa98,4,0x11d1,2,0x11d1,2,0x11d1,4,0x11d1,2,0x11d1,2,
	  0x11d1,4, 0xd59,2, 0xa98,2, 0xbe4,4, 0xe24,4,0x11d1,4,0x11d1,2,0x11d1,2,
	  0x11d1,4,0x11d1,2,0x11d1,2,0x11d1,4,0x11d1,2,0x11d1,2, 0xd59,4, 0xbe4,4,
	   0xa98,4, 0xd59,2, 0xa98,2, 0x8e8,10,0xa00,2, 0xa98,2, 0xbe4,2, 0xd59,4,
	   0xa98,4, 0xd59,4,0x11d1,2,0x11d1,2,0x11d1,4,0x11d1,2,0x11d1,2,0x11d1,4,
	  0x11d1,2,0x11d1,2, 0xd59,4, 0xbe4,4, 0xa98,4,0x11d1,2,0x11d1,2,0x11d1,4,
	  0x11d1,2,0x11d1,2,0x11d1,4, 0xd59,2, 0xa98,2, 0xbe4,4, 0xe24,4,0x11d1,4,
	  0x11d1,2,0x11d1,2,0x11d1,4,0x11d1,2,0x11d1,2,0x11d1,4,0x11d1,2,0x11d1,2,
	   0xd59,4, 0xbe4,4, 0xa98,4, 0xd59,2, 0xa98,2, 0x8e8,10,0xa00,2, 0xa98,2,
	   0xbe4,2, 0xd59,4, 0xa98,4, 0xd59,4, 0xa98,2, 0xa98,2, 0xa98,4, 0xa98,2,
	   0xa98,2, 0xa98,4, 0xa98,2, 0xa98,2, 0xa98,4, 0x7f0,4, 0xa98,4, 0x7f0,4,
	   0xa98,4, 0x7f0,4, 0xa98,4, 0xbe4,4, 0xd59,4, 0xe24,4, 0xfdf,4, 0xa98,2,
	   0xa98,2, 0xa98,4, 0xa98,2, 0xa98,2, 0xa98,4, 0xa98,2, 0xa98,2, 0xa98,4,
	   0x7f0,4, 0xa98,4, 0x7f0,4, 0xa98,4, 0x7f0,4, 0x8e8,4, 0x970,4, 0x8e8,4,
	   0x970,4, 0x8e8,4, 0xa98,2, 0xa98,2, 0xa98,4, 0xa98,2, 0xa98,2, 0xa98,4,
	   0xa98,2, 0xa98,2, 0xa98,4, 0x7f0,4, 0xa98,4, 0x7f0,4, 0xa98,4, 0x7f0,4,
	   0xa98,4, 0xbe4,4, 0xd59,4, 0xe24,4, 0xfdf,4, 0xa98,2, 0xa98,2, 0xa98,4,
	   0xa98,2, 0xa98,2, 0xa98,4, 0xa98,2, 0xa98,2, 0xa98,4, 0x7f0,4, 0xa98,4,
	   0x7f0,4, 0xa98,4, 0x7f0,4, 0x8e8,4, 0x970,4, 0x8e8,4, 0x970,4, 0x8e8,4,
	  0x7d64};
	
	int backgjingle[]={	// [291]
	   0xfdf,2,0x11d1,2, 0xfdf,2,0x1530,2,0x1ab2,2,0x1530,2,0x1fbf,4, 0xfdf,2,
	  0x11d1,2, 0xfdf,2,0x1530,2,0x1ab2,2,0x1530,2,0x1fbf,4, 0xfdf,2, 0xe24,2,
	   0xd59,2, 0xe24,2, 0xd59,2, 0xfdf,2, 0xe24,2, 0xfdf,2, 0xe24,2,0x11d1,2,
	   0xfdf,2,0x11d1,2, 0xfdf,2,0x1400,2, 0xfdf,4, 0xfdf,2,0x11d1,2, 0xfdf,2,
	  0x1530,2,0x1ab2,2,0x1530,2,0x1fbf,4, 0xfdf,2,0x11d1,2, 0xfdf,2,0x1530,2,
	  0x1ab2,2,0x1530,2,0x1fbf,4, 0xfdf,2, 0xe24,2, 0xd59,2, 0xe24,2, 0xd59,2,
	   0xfdf,2, 0xe24,2, 0xfdf,2, 0xe24,2,0x11d1,2, 0xfdf,2,0x11d1,2, 0xfdf,2,
	   0xe24,2, 0xd59,4, 0xa98,2, 0xbe4,2, 0xa98,2, 0xd59,2,0x11d1,2, 0xd59,2,
	  0x1530,4, 0xa98,2, 0xbe4,2, 0xa98,2, 0xd59,2,0x11d1,2, 0xd59,2,0x1530,4,
	   0xa98,2, 0x970,2, 0x8e8,2, 0x970,2, 0x8e8,2, 0xa98,2, 0x970,2, 0xa98,2,
	   0x970,2, 0xbe4,2, 0xa98,2, 0xbe4,2, 0xa98,2, 0xd59,2, 0xa98,4, 0xa98,2,
	   0xbe4,2, 0xa98,2, 0xd59,2,0x11d1,2, 0xd59,2,0x1530,4, 0xa98,2, 0xbe4,2,
	   0xa98,2, 0xd59,2,0x11d1,2, 0xd59,2,0x1530,4, 0xa98,2, 0x970,2, 0x8e8,2,
	   0x970,2, 0x8e8,2, 0xa98,2, 0x970,2, 0xa98,2, 0x970,2, 0xbe4,2, 0xa98,2,
	   0xbe4,2, 0xa98,2, 0xd59,2, 0xa98,4, 0x7f0,2, 0x8e8,2, 0xa98,2, 0xd59,2,
	  0x11d1,2, 0xd59,2,0x1530,4, 0xa98,2, 0xbe4,2, 0xa98,2, 0xd59,2,0x11d1,2,
	   0xd59,2,0x1530,4, 0xa98,2, 0x970,2, 0x8e8,2, 0x970,2, 0x8e8,2, 0xa98,2,
	   0x970,2, 0xa98,2, 0x970,2, 0xbe4,2, 0xa98,2, 0xbe4,2, 0xd59,2, 0xbe4,2,
	   0xa98,4,0x7d64};
	
	int dirge[]={
	  0x7d00, 2,0x11d1, 6,0x11d1, 4,0x11d1, 2,0x11d1, 6, 0xefb, 4, 0xfdf, 2,
	   0xfdf, 4,0x11d1, 2,0x11d1, 4,0x12e0, 2,0x11d1,12,0x7d00,16,0x7d00,16,
	  0x7d00,16,0x7d00,16,0x7d00,16,0x7d00,16,0x7d00,16,0x7d00,16,0x7d00,16,
	  0x7d00,16,0x7d00,16,0x7d00,16,0x7d64};
	*/
	soundt0flag = false;

	int8flag = false;

	constructor(d: Digger) {
		this.dig = d;
	}

	initsound(): void {
		//  settimer2(0x20);
		//  setspkrt2();
		//  settimer0(0);
		this.wavetype = 2;
		this.t0val = 12000;
		this.musvol = 8;
		this.t2val = 40;
		this.soundt0flag = true;
		this.sndflag = true;
		this.spkrmode = 0;
		this.int8flag = false;
		this.setsoundt2();
		this.soundstop();
		this.startint8();
		this.timerrate = 0x4000;
		//  timer0(0x4000);
	}

	killsound(): void {
		// added by me...
	}

	music(tune: number): void {
		this.tuneno = tune;
		this.musicp = 0;
		this.noteduration = 0;
		switch (tune) {
			case 0:
				this.musicmaxvol = 50;
				this.musicattackrate = 20;
				this.musicsustainlevel = 20;
				this.musicdecayrate = 10;
				this.musicreleaserate = 4;
				break;
			case 1:
				this.musicmaxvol = 50;
				this.musicattackrate = 50;
				this.musicsustainlevel = 8;
				this.musicdecayrate = 15;
				this.musicreleaserate = 1;
				break;
			case 2:
				this.musicmaxvol = 50;
				this.musicattackrate = 50;
				this.musicsustainlevel = 25;
				this.musicdecayrate = 5;
				this.musicreleaserate = 1;
		}
		this.musicplaying = true;
		if (tune == 2)
			this.soundddieoff();
	}

	musicoff(): void {
		this.musicplaying = false;
		this.musicp = 0;
	}

	musicupdate(): void {
		if (!this.musicplaying)
			return;
		if (this.noteduration != 0)
			this.noteduration--;
		else {
			this.musicstage = this.musicn = 0;
			switch (this.tuneno) {
				case 0:
					//		noteduration=bonusjingle[musicp+1]*3;
					this.musicnotewidth = this.noteduration - 3;
					//		notevalue=bonusjingle[musicp];
					this.musicp += 2;
					//		if (bonusjingle[musicp]==0x7d64)
					//		  musicp=0;
					break;
				case 1:
					//		noteduration=backgjingle[musicp+1]*6;
					this.musicnotewidth = 12;
					//		notevalue=backgjingle[musicp];
					this.musicp += 2;
					//		if (backgjingle[musicp]==0x7d64)
					//		  musicp=0;
					break;
				case 2:
					//		noteduration=dirge[musicp+1]*10;
					this.musicnotewidth = this.noteduration - 10;
					//		notevalue=dirge[musicp];
					this.musicp += 2;
					//		if (dirge[musicp]==0x7d64)
					//		  musicp=0;
					break;
			}
		}
		this.musicn++;
		this.wavetype = 1;
		this.t0val = this.notevalue;
		if (this.musicn >= this.musicnotewidth)
			this.musicstage = 2;
		switch (this.musicstage) {
			case 0:
				if (this.musvol + this.musicattackrate >= this.musicmaxvol) {
					this.musicstage = 1;
					this.musvol = this.musicmaxvol;
					break;
				}
				this.musvol += this.musicattackrate;
				break;
			case 1:
				if (this.musvol - this.musicdecayrate <= this.musicsustainlevel) {
					this.musvol = this.musicsustainlevel;
					break;
				}
				this.musvol -= this.musicdecayrate;
				break;
			case 2:
				if (this.musvol - this.musicreleaserate <= 1) {
					this.musvol = 1;
					break;
				}
				this.musvol -= this.musicreleaserate;
		}
		if (this.musvol == 1)
			this.t0val = 0x7d00;
	}

	s0fillbuffer(): void {
	}

	s0killsound(): void {
		this.setsoundt2();
		//  timer2(40);
		this.stopint8();
	}

	s0setupsound(): void {
		this.startint8();
	}

	setsoundmode(): void {
		this.spkrmode = this.wavetype;
		if (!this.soundt0flag && this.sndflag) {
			this.soundt0flag = true;
			//	setspkrt2();
		}
	}

	setsoundt2(): void {
		if (this.soundt0flag) {
			this.spkrmode = 0;
			this.soundt0flag = false;
			//	setspkrt2();
		}
	}

	sett0(): void {
		if (this.sndflag) {
			//	timer2(t2val);
			if (this.t0val < 1000 && (this.wavetype == 1 || this.wavetype == 2))
				this.t0val = 1000;
			//	timer0(t0val);
			this.timerrate = this.t0val;
			if (this.musvol < 1)
				this.musvol = 1;
			if (this.musvol > 50)
				this.musvol = 50;
			this.pulsewidth = this.musvol * this.volume;
			this.setsoundmode();
		}
	}

	sett2val(t2v: number): void {
		//  if (sndflag)
		//	timer2(t2v);
	}

	setupsound(): void {
		// added by me..
	}

	sound1up(): void {
		this.sound1upduration = 96;
		this.sound1upflag = true;
	}

	sound1upoff(): void {
		this.sound1upflag = false;
	}

	sound1upupdate(): void {
		if (this.sound1upflag) {
			if ((IntMath.div(this.sound1upduration, 3)) % 2 != 0)
				this.t2val = (this.sound1upduration << 2) + 600;
			this.sound1upduration--;
			if (this.sound1upduration < 1)
				this.sound1upflag = false;
		}
	}

	soundbonus(): void {
		this.soundbonusflag = true;
	}

	soundbonusoff(): void {
		this.soundbonusflag = false;
		this.soundbonusn = 0;
	}

	soundbonusupdate(): void {
		if (this.soundbonusflag) {
			this.soundbonusn++;
			if (this.soundbonusn > 15)
				this.soundbonusn = 0;
			if (this.soundbonusn >= 0 && this.soundbonusn < 6)
				this.t2val = 0x4ce;
			if (this.soundbonusn >= 8 && this.soundbonusn < 14)
				this.t2val = 0x5e9;
		}
	}

	soundbreak(): void {
		this.soundbreakduration = 3;
		if (this.soundbreakvalue < 15000)
			this.soundbreakvalue = 15000;
		this.soundbreakflag = true;
	}

	soundbreakoff(): void {
		this.soundbreakflag = false;
	}

	soundbreakupdate(): void {
		if (this.soundbreakflag)
			if (this.soundbreakduration != 0) {
				this.soundbreakduration--;
				this.t2val = this.soundbreakvalue;
			}
			else
				this.soundbreakflag = false;
	}

	soundddie(): void {
		this.soundddien = 0;
		this.soundddievalue = 20000;
		this.soundddieflag = true;
	}

	soundddieoff(): void {
		this.soundddieflag = false;
	}

	soundddieupdate(): void {
		if (this.soundddieflag) {
			this.soundddien++;
			if (this.soundddien == 1)
				this.musicoff();
			if (this.soundddien >= 1 && this.soundddien <= 10)
				this.soundddievalue = 20000 - this.soundddien * 1000;
			if (this.soundddien > 10)
				this.soundddievalue += 500;
			if (this.soundddievalue > 30000)
				this.soundddieoff();
			this.t2val = this.soundddievalue;
		}
	}

	soundeatm(): void {
		this.soundeatmduration = 20;
		this.soundeatmn = 3;
		this.soundeatmvalue = 2000;
		this.soundeatmflag = true;
	}

	soundeatmoff(): void {
		this.soundeatmflag = false;
	}

	soundeatmupdate(): void {
		if (this.soundeatmflag)
			if (this.soundeatmn != 0) {
				if (this.soundeatmduration != 0) {
					if ((this.soundeatmduration % 4) == 1)
						this.t2val = this.soundeatmvalue;
					if ((this.soundeatmduration % 4) == 3)
						this.t2val = this.soundeatmvalue - (this.soundeatmvalue >> 4);
					this.soundeatmduration--;
					this.soundeatmvalue -= (this.soundeatmvalue >> 4);
				}
				else {
					this.soundeatmduration = 20;
					this.soundeatmn--;
					this.soundeatmvalue = 2000;
				}
			}
			else
				this.soundeatmflag = false;
	}

	soundem(): void {
		this.soundemflag = true;
	}

	soundemerald(emocttime: number): void {
		if (emocttime != 0) {
			switch (this.emerfreq) {
				case 0x8e8:
					this.emerfreq = 0x7f0;
					break;
				case 0x7f0:
					this.emerfreq = 0x712;
					break;
				case 0x712:
					this.emerfreq = 0x6ac;
					break;
				case 0x6ac:
					this.emerfreq = 0x5f2;
					break;
				case 0x5f2:
					this.emerfreq = 0x54c;
					break;
				case 0x54c:
					this.emerfreq = 0x4b8;
					break;
				case 0x4b8:
					this.emerfreq = 0x474;
					this.dig.Scores.scoreoctave();
					break;
				case 0x474:
					this.emerfreq = 0x8e8;
			}
		}
		else
			this.emerfreq = 0x8e8;
		this.soundemeraldduration = 7;
		this.soundemeraldn = 0;
		this.soundemeraldflag = true;
	}

	soundemeraldoff(): void {
		this.soundemeraldflag = false;
	}

	soundemeraldupdate(): void {
		if (this.soundemeraldflag)
			if (this.soundemeraldduration != 0) {
				if (this.soundemeraldn == 0 || this.soundemeraldn == 1)
					this.t2val = this.emerfreq;
				this.soundemeraldn++;
				if (this.soundemeraldn > 7) {
					this.soundemeraldn = 0;
					this.soundemeraldduration--;
				}
			}
			else
				this.soundemeraldoff();
	}

	soundemoff(): void {
		this.soundemflag = false;
	}

	soundemupdate(): void {
		if (this.soundemflag) {
			this.t2val = 1000;
			this.soundemoff();
		}
	}

	soundexplode(): void {
		this.soundexplodevalue = 1500;
		this.soundexplodeduration = 10;
		this.soundexplodeflag = true;
		this.soundfireoff();
	}

	soundexplodeoff(): void {
		this.soundexplodeflag = false;
	}

	soundexplodeupdate(): void {
		if (this.soundexplodeflag)
			if (this.soundexplodeduration != 0) {
				this.soundexplodevalue = this.t2val = this.soundexplodevalue - (this.soundexplodevalue >> 3);
				this.soundexplodeduration--;
			}
			else
				this.soundexplodeflag = false;
	}

	soundfall(): void {
		this.soundfallvalue = 1000;
		this.soundfallflag = true;
	}

	soundfalloff(): void {
		this.soundfallflag = false;
		this.soundfalln = 0;
	}

	soundfallupdate(): void {
		if (this.soundfallflag)
			if (this.soundfalln < 1) {
				this.soundfalln++;
				if (this.soundfallf)
					this.t2val = this.soundfallvalue;
			}
			else {
				this.soundfalln = 0;
				if (this.soundfallf) {
					this.soundfallvalue += 50;
					this.soundfallf = false;
				}
				else
					this.soundfallf = true;
			}
	}

	soundfire(): void {
		this.soundfirevalue = 500;
		this.soundfireflag = true;
	}

	soundfireoff(): void {
		this.soundfireflag = false;
		this.soundfiren = 0;
	}

	soundfireupdate(): void {
		if (this.soundfireflag) {
			if (this.soundfiren == 1) {
				this.soundfiren = 0;
				this.soundfirevalue += IntMath.div(this.soundfirevalue, 55);
				this.t2val = this.soundfirevalue + this.dig.Main.randno(this.soundfirevalue >> 3);
				if (this.soundfirevalue > 30000)
					this.soundfireoff();
			}
			else
				this.soundfiren++;
		}
	}

	soundgold(): void {
		this.soundgoldvalue1 = 500;
		this.soundgoldvalue2 = 4000;
		this.soundgoldduration = 30;
		this.soundgoldf = false;
		this.soundgoldflag = true;
	}

	soundgoldoff(): void {
		this.soundgoldflag = false;
	}

	soundgoldupdate(): void {
		if (this.soundgoldflag) {
			if (this.soundgoldduration != 0)
				this.soundgoldduration--;
			else
				this.soundgoldflag = false;
			if (this.soundgoldf) {
				this.soundgoldf = false;
				this.t2val = this.soundgoldvalue1;
			}
			else {
				this.soundgoldf = true;
				this.t2val = this.soundgoldvalue2;
			}
			this.soundgoldvalue1 += (this.soundgoldvalue1 >> 4);
			this.soundgoldvalue2 -= (this.soundgoldvalue2 >> 4);
		}
	}

	soundint(): void {
		this.timerclock++;
		if (this.soundflag && !this.sndflag)
			this.sndflag = this.musicflag = true;
		if (!this.soundflag && this.sndflag) {
			this.sndflag = false;
			//	timer2(40);
			this.setsoundt2();
		}
		if (this.sndflag && !this.soundpausedflag) {
			this.t0val = 0x7d00;
			this.t2val = 40;
			if (this.musicflag)
				this.musicupdate();
			this.soundemeraldupdate();
			this.soundwobbleupdate();
			this.soundddieupdate();
			this.soundbreakupdate();
			this.soundgoldupdate();
			this.soundemupdate();
			this.soundexplodeupdate();
			this.soundfireupdate();
			this.soundeatmupdate();
			this.soundfallupdate();
			this.sound1upupdate();
			this.soundbonusupdate();
			if (this.t0val == 0x7d00 || this.t2val != 40)
				this.setsoundt2();
			else {
				this.setsoundmode();
				this.sett0();
			}
			this.sett2val(this.t2val);
		}
	}

	async soundlevdone(): Promise<void> {
		await Threading.sleep(1000);

		/*  int timer=0;
		  soundstop();
		  nljpointer=0;
		  nljnoteduration=20;
		  soundlevdoneflag=soundpausedflag=true;
		  while (soundlevdoneflag) {
			if (timerclock==timer)
			  continue;
			soundlevdoneupdate();
			timer=timerclock;
		  } */
	}

	soundlevdoneoff(): void {
		this.soundlevdoneflag = this.soundpausedflag = false;
	}

	async soundlevdoneupdate(): Promise<void> {
		if (this.sndflag) {
			if (this.nljpointer < 11)
				this.t2val = this.newlevjingle[this.nljpointer];
			this.t0val = this.t2val + 35;
			this.musvol = 50;
			this.setsoundmode();
			this.sett0();
			this.sett2val(this.t2val);
			if (this.nljnoteduration > 0)
				this.nljnoteduration--;
			else {
				this.nljnoteduration = 20;
				this.nljpointer++;
				if (this.nljpointer > 10)
					await this.soundlevdoneoff();
			}
		}
		else {
			//	olddelay(100);
			this.soundlevdoneflag = false;
		}
	}

	soundoff(): void {
		// phony
	}

	soundpause(): void {
		this.soundpausedflag = true;
	}

	soundpauseoff(): void {
		this.soundpausedflag = false;
	}

	soundstop(): void {
		this.soundfalloff();
		this.soundwobbleoff();
		this.soundfireoff();
		this.musicoff();
		this.soundbonusoff();
		this.soundexplodeoff();
		this.soundbreakoff();
		this.soundemoff();
		this.soundemeraldoff();
		this.soundgoldoff();
		this.soundeatmoff();
		this.soundddieoff();
		this.sound1upoff();
	}

	soundwobble(): void {
		this.soundwobbleflag = true;
	}

	soundwobbleoff(): void {
		this.soundwobbleflag = false;
		this.soundwobblen = 0;
	}

	soundwobbleupdate(): void {
		if (this.soundwobbleflag) {
			this.soundwobblen++;
			if (this.soundwobblen > 63)
				this.soundwobblen = 0;
			switch (this.soundwobblen) {
				case 0:
					this.t2val = 0x7d0;
					break;
				case 16:
				case 48:
					this.t2val = 0x9c4;
					break;
				case 32:
					this.t2val = 0xbb8;
					break;
			}
		}
	}

	startint8(): void {
		if (!this.int8flag) {
			//	initint8();
			this.timerrate = 0x4000;
			//	timer0(0x4000);
			this.int8flag = true;
		}
	}

	stopint8(): void {
		//  timer0(0);
		if (this.int8flag) {
			//	restoreint8();
			this.int8flag = false;
		}
		this.sett2val(40);
		//  setspkrt2();
	}

}
