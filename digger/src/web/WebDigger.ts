import { IColorModel } from "../api/IColorModel";
import { IDigger } from "../api/IDigger";
import { IFactory } from "../api/IFactory";
import { IRefresher } from "../api/IRefresher";
import { Keyboard } from "./Keyboard";
import { WebRefresher } from "./WebRefresher";

export class WebDigger implements IFactory {
    public _digger: IDigger;
    private _sleep: (ms: i64) => void;
    private _sendImg: (array: Uint8ClampedArray) => void;

    constructor(digger: IDigger, sleep: (ms: i64) => void, send: (array: Uint8ClampedArray) => void) {
        this._digger = digger;
        this._sleep = sleep;
        this._sendImg = send;
    }

    SendImage(array: Uint8ClampedArray): void {
        this._sendImg(array);
    }

    Sleep(ms: i64): void {
        this._sleep(ms);
    }

    public DrawOnCanvas(): Uint8ClampedArray {
        if (this._digger == null)
            return new Uint8ClampedArray(0);

        const pc = this._digger.GetPc();

        const w = pc.GetWidth();
        const h = pc.GetHeight();
        const data = pc.GetPixels();
        const source = pc.GetCurrentSource();
        if (!source)
            return new Uint8ClampedArray(0);
        const model = source.getModel();

        const rgba: Uint8ClampedArray = new Uint8ClampedArray(w * h * 4);

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                const arrayIndex = (y * w + x);
                const sxx: i32[] = model.GetColor(data[arrayIndex]);
                const pixelIndex = arrayIndex * 4;
                rgba[pixelIndex + 0] = sxx[0];
                rgba[pixelIndex + 1] = sxx[1];
                rgba[pixelIndex + 2] = sxx[2];
                rgba[pixelIndex + 3] = 255;
            }
        }

        return rgba;
    }

    public KeyUp(key: string, n: i32): void {
        if (!this._digger)
            return;
        const num = Keyboard.ConvertToLegacy(key, n);
        if (num >= 0)
            this._digger.keyUp(num);
    }

    public KeyDown(key: string, n: i32): void {
        if (!this._digger)
            return;
        const num = Keyboard.ConvertToLegacy(key, n);
        if (num >= 0)
            this._digger.keyDown(num);
    }

    CreateRefresher(digger: IDigger, model: IColorModel, factory: IFactory): IRefresher {
        return new WebRefresher(this, model, factory);
    }

    GetSubmitParameter(): string {
        return "";
    }

    GetSpeedParameter(): i32 {
        return 66;
    }

    RequestFocus(): void {
        // NO-OP
    }
}
