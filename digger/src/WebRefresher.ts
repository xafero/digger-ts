
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
