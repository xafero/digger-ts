import { IColorModel } from "./IColorModel";

export interface IRefresher {
    newPixelsAll(): void;

    newPixels(x: number, y: number, width: number, height: number): void;

    getModel(): IColorModel;
}
