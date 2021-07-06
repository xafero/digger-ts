import { Pc } from "../core/Pc";
import { IRefresher } from "./IRefresher";

export interface IPc {
    P(): Pc;

    GetWidth(): i32;

    GetHeight(): i32;

    GetPixels(): i32[];

    GetCurrentSource(): IRefresher;
}
