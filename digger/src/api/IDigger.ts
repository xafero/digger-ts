import { IPc } from "./IPc";

export interface IDigger {
    GetPc(): IPc;

    keyDown(key: number): boolean;

    keyUp(key: number): boolean;
}
