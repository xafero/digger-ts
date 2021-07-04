
export interface IColorModel {
    GetColor(index: number): [number, number, number];
}

export interface IDigger {
    GetPc(): IPc;

    keyDown(key: number): boolean;

    keyUp(key: number): boolean;
}

export interface IFactory extends ISystem {
    CreateRefresher(digger: IDigger, model: IColorModel): IRefresher;
}

export interface IPc {
    GetWidth(): number;

    GetHeight(): number;

    GetPixels(): number[];

    GetCurrentSource(): (IRefresher | null);
}

export interface IRefresher {
    newPixelsAll(): void;

    newPixels(x: number, y: number, width: number, height: number): void;

    getModel(): IColorModel;
}

export interface ISystem {
    GetSubmitParameter(): string;

    GetSpeedParameter(): number;

    RequestFocus(): void;
}
