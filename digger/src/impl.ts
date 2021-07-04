import { IColorModel, IDigger, IFactory, IRefresher } from "./api";
import { Sys } from "./compat";

export class WebRefresher implements IRefresher {
    private readonly _area: WebDigger;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _model: IColorModel;

    constructor(area: WebDigger, model: IColorModel) {
        this._area = area;
        this._canvas = <HTMLCanvasElement>document.getElementById("screen");
        this._model = model;
    }

    public getModel(): IColorModel {
        return this._model;
    }

    public newPixels(x: number, y: number, w: number, h: number): void {
        this._area.DrawOnCanvas(this._canvas);
    }

    public newPixelsAll(): void {
        this._area.DrawOnCanvas(this._canvas);
    }
}

export class WebDigger extends Sys implements IFactory {
    private _setup: boolean;
    public _digger: (IDigger | null);

    constructor(digger: (IDigger | null)) {
        super();
        this._setup = false;
        this._digger = digger;
    }

    private static toHexColor(cr: number, cg: number, cb: number) {
        let r = cr.toString(16);
        let g = cg.toString(16);
        let b = cb.toString(16);
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        return "#" + r + g + b;
    }

    public DrawOnCanvas(e: HTMLCanvasElement): boolean {
        const ctx: (CanvasRenderingContext2D | null) = e.getContext("2d");
        if (ctx == null)
            return false;
        return this.OnDrawn(ctx);
    }

    protected OnDrawn(g: CanvasRenderingContext2D): boolean {
        if (this._digger == null)
            return false;

        const pc = this._digger.GetPc();

        const w = pc.GetWidth();
        const h = pc.GetHeight();
        const data = pc.GetPixels();
        const source = pc.GetCurrentSource();
        if (!source)
            return false;
        const model = source.getModel();

        const shift = 1;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                const arrayIndex = y * w + x;
                const [sr, sg, sb] = model.GetColor(data[arrayIndex]);
                g.fillStyle = WebDigger.toHexColor(sr, sg, sb);
                g.fillRect(x + shift, y + shift, 1, 1);
            }
        }

        if (!this._setup) {
            this._setup = true;
            g.scale(4, 4);
        }

        return false;
    }

    public KeyUp(key: string): void {
        if (!this._digger)
            return;
        const num = Keyboard.ConvertToLegacy(key);
        if (num >= 0)
            this._digger.keyUp(num);
    }

    public KeyDown(key: string): void {
        if (!this._digger)
            return;
        const num = Keyboard.ConvertToLegacy(key);
        if (num >= 0)
            this._digger.keyDown(num);
    }

    CreateRefresher(digger: IDigger, model: IColorModel): IRefresher {
        return new WebRefresher(this, model);
    }

    GetSubmitParameter(): string {
        return "";
    }

    GetSpeedParameter(): number {
        return 66;
    }

    RequestFocus(): void {
    }
}

export class Keyboard {
    public static ConvertToLegacy(netCode: string): number {
        switch (netCode) {
            case "ArrowLeft":
                return 1006;
            case "ArrowRight":
                return 1007;
            case "ArrowUp":
                return 1004;
            case "ArrowDown":
                return 1005;
            case "F2":
                return 1008;
            case "F9":
                return 1021;
            case "+":
                return 1031;
            case "-":
                return 1032;
            default:
                return netCode.charCodeAt(0);
        }
    }
}
