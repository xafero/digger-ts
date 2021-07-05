import { IPc } from "../api/IPc";
import { IRefresher } from "../api/IRefresher";
import { IntMath } from "../web/IntMath";
import { alpha } from "./alpha";
import { cgagrafx } from "./cgagrafx";
import { Digger } from "./Digger";

export class Pc implements IPc {

	dig: Digger;

	source: IRefresher[] = new Array(2);
	currentSource: (IRefresher | null);

	width = 320;
	height = 200;
	size = this.width * this.height;

	pixels: number[] = [];

	pal: number[][][] = [

		[[0, 0x00, 0xAA, 0xAA],
		[0, 0xAA, 0x00, 0x54],
		[0, 0x00, 0x00, 0x00]],

		[[0, 0x54, 0xFF, 0xFF],
		[0, 0xFF, 0x54, 0xFF],
		[0, 0x54, 0x54, 0x54]]];

	constructor(d: Digger) {
		this.dig = d;
		this.currentSource = null;
	}

	GetWidth(): number {
		return this.width;
	}

	GetHeight(): number {
		return this.height;
	}

	GetPixels(): number[] {
		return this.pixels;
	}

	GetCurrentSource(): (IRefresher | null) {
		return this.currentSource;
	}

	gclear(): void {
		for (let i = 0; i < this.size; i++)
			this.pixels[i] = 0;
		if (this.currentSource != null)
			this.currentSource.newPixelsAll();
	}

	gethrt(): number {
		return Date.now();
	}

	getkips(): number {
		return 0;		// phony
	}

	ggeti(x: number, y: number, p: (number[] | null), w: number, h: number): void {

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

	ggetpix(x: number, y: number): number {
		const ofs = this.width * y + x & 0xfffc;
		return (((((this.pixels[ofs] << 2) | this.pixels[ofs + 1]) << 2) | this.pixels[ofs + 2]) << 2) | this.pixels[ofs + 3];
	}

	ginit(): void {
	}

	ginten(inten: number): void {
		this.currentSource = this.source[inten & 1];
		this.currentSource.newPixelsAll();
	}

	gpal(pal: number): void {
	}

	gputi2(x: number, y: number, p: (number[] | null), w: number, h: number): void {
		this.gputi(x, y, p, w, h, true);
	}

	gputi(x: number, y: number, p: (number[] | null), w: number, h: number, b: boolean): void {

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

	gputim(x: number, y: number, ch: number, w: number, h: number): void {

		const spr: number[] = cgagrafx.cgatable[ch * 2];
		const msk: number[] = cgagrafx.cgatable[ch * 2 + 1];

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
			let l, c;

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
					adst = IntMath.div(dest , 320) * 640 + dest % 320;
				else
					adst = 320 + (IntMath.div((dest - 32768) , 320)) * 640 + (dest - 32768) % 320;
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

	gwrite2(x: number, y: number, ch: number, c: number): void {
		this.gwrite(x, y, ch, c, false);
	}

	gwrite(x: number, y: number, ch: number, c: number, upd: boolean): void {

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
