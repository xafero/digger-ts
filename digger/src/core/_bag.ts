
export class _bag {

	x: number = 0;
	y: number = 0;
	h: number = 0;
	v: number = 0;
	xr: number = 0;
	yr: number = 0;
	dir: number = 0;
	wt: number = 0;
	gt: number = 0;
	fallh: number = 0;

	wobbling: boolean = false;
	unfallen: boolean = false;
	exist: boolean = false;

	copyFrom(t: _bag): void {
		this.x = t.x;
		this.y = t.y;
		this.h = t.h;
		this.v = t.v;
		this.xr = t.xr;
		this.yr = t.yr;
		this.dir = t.dir;
		this.wt = t.wt;
		this.gt = t.gt;
		this.fallh = t.fallh;
		this.wobbling = t.wobbling;
		this.unfallen = t.unfallen;
		this.exist = t.exist;
	}
}
