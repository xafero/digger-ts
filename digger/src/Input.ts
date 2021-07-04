import { Digger } from "./Digger";

export class Input {

	dig: Digger;

	leftpressed = false;
	rightpressed = false;
	uppressed = false;
	downpressed = false;
	f1pressed = false;
	firepressed = false;
	minuspressed = false;
	pluspressed = false;
	f10pressed = false;
	escape = false;

	keypressed = 0;

	akeypressed = 0;
	dynamicdir = -1;
	staticdir = -1;
	joyx = 0;
	joyy = 0;

	joybut1 = false;
	joybut2 = false;

	keydir = 0;
	jleftthresh = 0;
	jupthresh = 0;
	jrightthresh = 0;
	jdownthresh = 0;
	joyanax = 0;
	joyanay = 0;
	firepflag = false;

	joyflag = false;

	constructor(d: Digger) {
		this.dig = d;
	}

	checkkeyb(): void {
		if (this.pluspressed) {
			if (this.dig.frametime > Digger.MIN_RATE)
				this.dig.frametime -= 5;
		}
		if (this.minuspressed) {
			if (this.dig.frametime < Digger.MAX_RATE)
				this.dig.frametime += 5;
		}
		if (this.f10pressed)
			this.escape = true;

		/*  while (kbhit()) {
			akeypressed=getkey();
			switch (akeypressed) {
			  case 321: // F7
				musicflag=!musicflag;
				break;
			  case 323: // F9
				soundflag=!soundflag;
				break;
			  case 324: // F10
				escape=true;
			}
		  } */
	}

	detectjoy(): void {
		this.joyflag = false;
		this.staticdir = this.dynamicdir = -1;
	}

	getasciikey(make: string): number {
		// var k;
		if ((make == ' ') || ((make >= 'a') && (make <= 'z')) || ((make >= '0') && (make <= '9')))
			return make.charCodeAt(0);
		else
			return 0;
		/*  if (make<2 || make>=58)
			return 0; 
		  if (kbhit())
			k=getkey();
		  else
			return 0;
		  if (k>='a' && k<='A')
			k+='A'-'a'; */
	}

	getdir(): number {
		const bp2 = this.keydir;
		/*  if (joyflag) {
			bp2=-1;
			if (joyx<jleftthresh)
			  bp2=4;
			if (joyx>jrightthresh)
			  bp2=0;
			if (joyx>=jleftthresh && joyx<=jrightthresh) {
			  if (joyy<jupthresh)
				bp2=2;
			  if (joyy>jdownthresh)
				bp2=6;
			}
		  } */
		return bp2;
	}

	initkeyb(): void {
	}

	Key_downpressed(): void {
		this.downpressed = true;
		this.dynamicdir = this.staticdir = 6;
	}

	Key_downreleased(): void {
		this.downpressed = false;
		if (this.dynamicdir == 6)
			this.setdirec();
	}

	Key_f1pressed(): void {
		this.firepressed = true;
		this.f1pressed = true;
	}

	Key_f1released(): void {
		this.f1pressed = false;
	}

	Key_leftpressed(): void {
		this.leftpressed = true;
		this.dynamicdir = this.staticdir = 4;
	}

	Key_leftreleased(): void {
		this.leftpressed = false;
		if (this.dynamicdir == 4)
			this.setdirec();
	}

	Key_rightpressed(): void {
		this.rightpressed = true;
		this.dynamicdir = this.staticdir = 0;
	}

	Key_rightreleased(): void {
		this.rightpressed = false;
		if (this.dynamicdir == 0)
			this.setdirec();
	}

	Key_uppressed(): void {
		this.uppressed = true;
		this.dynamicdir = this.staticdir = 2;
	}
	Key_upreleased(): void {
		this.uppressed = false;
		if (this.dynamicdir == 2)
			this.setdirec();
	}

	processkey(key: number): void {
		this.keypressed = key;
		if (key > 0x80)
			this.akeypressed = key & 0x7f;
		switch (key) {
			case 0x4b: this.Key_leftpressed(); break;
			case 0xcb: this.Key_leftreleased(); break;
			case 0x4d: this.Key_rightpressed(); break;
			case 0xcd: this.Key_rightreleased(); break;
			case 0x48: this.Key_uppressed(); break;
			case 0xc8: this.Key_upreleased(); break;
			case 0x50: this.Key_downpressed(); break;
			case 0xd0: this.Key_downreleased(); break;
			case 0x3b: this.Key_f1pressed(); break;
			case 0xbb: this.Key_f1released(); break;
			case 0x78: this.f10pressed = true; break;
			case 0xf8: this.f10pressed = false; break;
			case 0x2b: this.pluspressed = true; break;
			case 0xab: this.pluspressed = false; break;
			case 0x2d: this.minuspressed = true; break;
			case 0xad: this.minuspressed = false; break;
		}
	}

	readdir(): void {
		/*  int j; */
		this.keydir = this.staticdir;
		if (this.dynamicdir != -1)
			this.keydir = this.dynamicdir;
		this.staticdir = -1;
		if (this.f1pressed || this.firepressed)
			this.firepflag = true;
		else
			this.firepflag = false;
		this.firepressed = false;
		/*  if (joyflag) {
			incpenalty();
			incpenalty();
			joyanay=0;
			joyanax=0;
			for (j=0;j<4;j++) {
			  readjoy();
			  joyanax+=joyx;
			  joyanay+=joyy;
			}
			joyx=joyanax>>2;
			joyy=joyanay>>2;
			if (joybut1)
			  firepflag=true;
			else
			  firepflag=false;
		  } */
	}

	readjoy(): void {
	}

	setdirec(): void {
		this.dynamicdir = -1;
		if (this.uppressed) this.dynamicdir = this.staticdir = 2;
		if (this.downpressed) this.dynamicdir = this.staticdir = 6;
		if (this.leftpressed) this.dynamicdir = this.staticdir = 4;
		if (this.rightpressed) this.dynamicdir = this.staticdir = 0;
	}

	teststart(): boolean {
		/*  int j; */
		let startf = false;
		/*  if (joyflag) {
			readjoy();
			if (joybut1)
			  startf=true;
		  }  */
		if (this.keypressed != 0 && (this.keypressed & 0x80) == 0 && this.keypressed != 27) {
			startf = true;
			this.joyflag = false;
			this.keypressed = 0;
		}
		if (!startf)
			return false;
		/*  if (joyflag) {
			joyanay=0;
			joyanax=0;
			for (j=0;j<50;j++) {
			  readjoy();
			  joyanax+=joyx;
			  joyanay+=joyy;
			}
			joyx=joyanax/50;
			joyy=joyanay/50;
			jleftthresh=joyx-35;
			if (jleftthresh<0)
			  jleftthresh=0;
			jleftthresh+=10;
			jupthresh=joyy-35;
			if (jupthresh<0)
			  jupthresh=0;
			jupthresh+=10;
			jrightthresh=joyx+35;
			if (jrightthresh>255)
			  jrightthresh=255;
			jrightthresh-=10;
			jdownthresh=joyy+35;
			if (jdownthresh>255)
			  jdownthresh=255;
			jdownthresh-=10;
			joyanax=joyx;
			joyanay=joyy;
		  } */
		return true;
	}

}
