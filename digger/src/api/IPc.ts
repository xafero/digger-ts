import { IRefresher } from "./IRefresher";

export interface IPc {
    GetWidth(): number;

    GetHeight(): number;

    GetPixels(): number[];

    GetCurrentSource(): (IRefresher | null);
}
