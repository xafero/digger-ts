import { IColorModel } from "../api/IColorModel";

export class ColorModel implements IColorModel {

	private readonly _bits: i32;
	private readonly _size: i32;
	private readonly _r: i32[];
	private readonly _g: i32[];
	private readonly _b: i32[];

	constructor(bits: i32, size: i32, r: i32[], g: i32[], b: i32[]) {
		this._bits = bits;
		this._size = size;
		this._r = r;
		this._g = g;
		this._b = b;
	}

	public GetColor(index: i32): i32[] {
		if (!index)
			index = 0;
		const r = this._r[index];
		const g = this._g[index];
		const b = this._b[index];
		const res: i32[] = [r, g, b]
		return res;
	}

	private ToArgb(red: i32, green: i32, blue: i32): i32 {
		const ARGBRedShift: i32 = 24;
		const ARGBGreenShift: i32 = 16;
		const ARGBBlueShift: i32 = 8;
		const ARGBAlphaShift: i32 = 0;
		const alpha: i32 = 255;
		const val =
			(red << ARGBRedShift) |
			(green << ARGBGreenShift) |
			(blue << ARGBBlueShift) |
			(alpha << ARGBAlphaShift);
		return val;
	}
}
