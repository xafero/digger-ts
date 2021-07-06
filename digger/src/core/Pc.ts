import { IDigger } from "../api/IDigger";
import { IPc } from "../api/IPc";
import { IRefresher } from "../api/IRefresher";
import { IntMath } from "../web/IntMath";
import { alpha } from "./alpha";
import { cgagrafx } from "./cgagrafx";
import { Digger } from "./Digger";
import { FakeRefresher } from "./fake";

export class Pc implements IPc {

	dig: IDigger;

	source: IRefresher[] = [new FakeRefresher(), new FakeRefresher()];
	currentSource: IRefresher = new FakeRefresher();

	width: i32 = 320;
	height: i32 = 200;
	size: i32 = this.width * this.height;

	pixels: i32[] = [];

	pal: i32[][][] = [

		[[0, 0x00, 0xAA, 0xAA],
		[0, 0xAA, 0x00, 0x54],
		[0, 0x00, 0x00, 0x00]],

		[[0, 0x54, 0xFF, 0xFF],
		[0, 0xFF, 0x54, 0xFF],
		[0, 0x54, 0x54, 0x54]]];

	constructor(d: IDigger) {
		this.dig = d;
	}

	P(): Pc {
		return this;
	}

	GetWidth(): i32 {
		return this.width;
	}

	GetHeight(): i32 {
		return this.height;
	}

	GetPixels(): i32[] {
		return this.pixels;
	}

	GetCurrentSource(): IRefresher {
		return this.currentSource;
	}

	gclear(): void {
		for (let i = 0; i < this.size; i++)
			this.pixels[i] = 0;
		if (this.currentSource != null)
			this.currentSource.newPixelsAll();
	}

	gethrt(): i64 {
		return Date.now();
	}

	getkips(): i32 {
		return 0;		// phony
	}

	ggeti(x: i32, y: i32, p: (i32[] | null), w: i32, h: i32): void {

		if (p == null)
			return;

		let src = 0;
		let dest = y * this.width + (x & 0xfffc);

		for (let i = 0; i < h; i++) {
			let d = dest;
			for (let j = 0; j < w; j++) {
				p[src++] = ((((((this.pixels[d] << 2) | this.pixels[d + 1]) << 2) | this.pixels[d + 2]) << 2) | this.pixels[d + 3]);
				d += 4;
				if (src == p.length)
					return;
			}
			dest += this.width;
		}
	}

	ggetpix(x: i32, y: i32): i32 {
		const ofs = this.width * y + x & 0xfffc;
		return (((((this.pixels[ofs] << 2) | this.pixels[ofs + 1]) << 2) | this.pixels[ofs + 2]) << 2) | this.pixels[ofs + 3];
	}

	ginit(): void {
	}

	ginten(inten: i32): void {
		this.currentSource = this.source[inten & 1];
		this.currentSource.newPixelsAll();
	}

	gpal(pal: i32): void {
	}

	gputi2(x: i32, y: i32, p: (i32[] | null), w: i32, h: i32): void {
		this.gputi(x, y, p, w, h, true);
	}

	gputi(x: i32, y: i32, p: (i32[] | null), w: i32, h: i32, b: boolean): void {

		if (p == null)
			return;

		let src = 0;
		let dest = y * this.width + (x & 0xfffc);

		for (let i = 0; i < h; i++) {
			let d = dest;
			for (let j = 0; j < w; j++) {
				let px = p[src++];
				this.pixels[d + 3] = px & 3;
				px >>= 2;
				this.pixels[d + 2] = px & 3;
				px >>= 2;
				this.pixels[d + 1] = px & 3;
				px >>= 2;
				this.pixels[d] = px & 3;
				d += 4;
				if (src == p.length)
					return;
			}
			dest += this.width;
		}
	}

	gputim(x: i32, y: i32, ch: i32, w: i32, h: i32): void {

		const spr: i32[] = cgagrafx.cgatable[ch * 2];
		const msk: i32[] = cgagrafx.cgatable[ch * 2 + 1];

		let src = 0;
		let dest = y * this.width + (x & 0xfffc);

		for (let i = 0; i < h; i++) {
			let d = dest;
			for (let j = 0; j < w; j++) {
				let px = spr[src];
				const mx = msk[src];
				src++;
				if ((mx & 3) == 0)
					this.pixels[d + 3] = px & 3;
				px >>= 2;
				if ((mx & (3 << 2)) == 0)
					this.pixels[d + 2] = px & 3;
				px >>= 2;
				if ((mx & (3 << 4)) == 0)
					this.pixels[d + 1] = px & 3;
				px >>= 2;
				if ((mx & (3 << 6)) == 0)
					this.pixels[d] = px & 3;
				d += 4;
				if (src == spr.length || src == msk.length) {
					return;
				}
			}
			dest += this.width;
		}
	}

	gtitle(): void {

		let src = 0, dest = 0;

		while (true) {

			if (src >= cgagrafx.cgatitledat.length)
				break;

			const b = cgagrafx.cgatitledat[src++];
			let l = 0, c = 0;

			if (b == 0xfe) {
				l = cgagrafx.cgatitledat[src++];
				if (l == 0)
					l = 256;
				c = cgagrafx.cgatitledat[src++];
			}
			else {
				l = 1;
				c = b;
			}

			for (let i = 0; i < l; i++) {
				let px = c, adst = 0;
				if (dest < 32768)
					adst = IntMath.div(dest, 320) * 640 + dest % 320;
				else
					adst = 320 + (IntMath.div((dest - 32768), 320)) * 640 + (dest - 32768) % 320;
				this.pixels[adst + 3] = px & 3;
				px >>= 2;
				this.pixels[adst + 2] = px & 3;
				px >>= 2;
				this.pixels[adst + 1] = px & 3;
				px >>= 2;
				this.pixels[adst + 0] = px & 3;
				dest += 4;
				if (dest >= 65535)
					break;
			}

			if (dest >= 65535)
				break;

		}

	}

	gwrite2(x: i32, y: i32, ch: i32, c: i32): void {
		this.gwrite(x, y, ch, c, false);
	}

	gwrite(x: i32, y: i32, ch: i32, c: i32, upd: boolean): void {

		const color = c & 3;
		let dest = x + y * this.width, ofs = 0;

		ch -= 32;
		if ((ch < 0) || (ch > 0x5f))
			return;

		const chartab = alpha.ascii2cga[ch];

		if (chartab == null)
			return;

		for (let i = 0; i < 12; i++) {
			let d = dest;
			for (let j = 0; j < 3; j++) {
				let px = chartab[ofs++];
				this.pixels[d + 3] = px & color;
				px >>= 2;
				this.pixels[d + 2] = px & color;
				px >>= 2;
				this.pixels[d + 1] = px & color;
				px >>= 2;
				this.pixels[d] = px & color;
				d += 4;
			}
			dest += this.width;
		}

		if (upd && this.currentSource)
			this.currentSource.newPixels(x, y, 12, 12);

	}

}
