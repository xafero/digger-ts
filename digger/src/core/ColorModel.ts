import { IColorModel } from "../api/IColorModel";

export class ColorModel implements IColorModel {

	private readonly _bits: number;
	private readonly _size: number;
	private readonly _r: number[];
	private readonly _g: number[];
	private readonly _b: number[];

	constructor(bits: number, size: number, r: number[], g: number[], b: number[]) {
		this._bits = bits;
		this._size = size;
		this._r = r;
		this._g = g;
		this._b = b;
	}

	public GetColor(index: number): [number, number, number] {
		if (!index)
			index = 0;
		const r = this._r[index];
		const g = this._g[index];
		const b = this._b[index];
		return [r, g, b];
	}
}
