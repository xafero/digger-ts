import { IColorModel } from "./IColorModel";
import { IDigger } from "./IDigger";
import { IRefresher } from "./IRefresher";
import { ISystem } from "./ISystem";

export interface IFactory extends ISystem {
    CreateRefresher(digger: IDigger, model: IColorModel): IRefresher;
}
