import { IColorModel } from "../api/IColorModel";
import { IFactory } from "../api/IFactory";
import { IRefresher } from "../api/IRefresher";
import { WebDigger } from "./WebDigger";

export class WebRefresher implements IRefresher {
    private readonly _area: WebDigger;
    private readonly _model: IColorModel;
    private readonly _factory: IFactory;

    constructor(area: WebDigger, model: IColorModel, factory: IFactory) {
        this._area = area;
        this._model = model;
        this._factory = factory;
    }

    public getModel(): IColorModel {
        return this._model;
    }

    public newPixels(x: i32, y: i32, w: i32, h: i32): void {
        this.newPixelsAll();
    }

    public newPixelsAll(): void {
        const frame = this._area.DrawOnCanvas();
        this._factory.SendImage(frame);
    }
}
