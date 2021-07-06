import { IColorModel } from "./IColorModel";

export interface IRefresher {
    newPixelsAll(): void;

    newPixels(x: i32, y: i32, width: i32, height: i32): void;

    getModel(): IColorModel;
}
