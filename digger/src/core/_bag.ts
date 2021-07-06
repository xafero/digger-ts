
export class _bag {

	x: i32 = 0;
	y: i32 = 0;
	h: i32 = 0;
	v: i32 = 0;
	xr: i32 = 0;
	yr: i32 = 0;
	dir: i32 = 0;
	wt: i32 = 0;
	gt: i32 = 0;
	fallh: i32 = 0;

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
