import { IColorModel } from "./IColorModel";
import { IDigger } from "./IDigger";
import { IRefresher } from "./IRefresher";
import { ISystem } from "./ISystem";

export interface IFactory extends ISystem {
    CreateRefresher(digger: IDigger, model: IColorModel, factory: IFactory): IRefresher;

    Sleep(ms: i64): void;

    SendImage(array: Uint8ClampedArray): void;
}
