import { IColorModel } from "../api/IColorModel";
import { IDigger } from "../api/IDigger";
import { IFactory } from "../api/IFactory";
import { IPc } from "../api/IPc";
import { IRefresher } from "../api/IRefresher";
import { Digger } from "./Digger";
import { Drawing } from "./Drawing";
import { Input } from "./Input";
import { Main } from "./Main";
import { Monster } from "./Monster";
import { Scores } from "./Scores";
import { Sound } from "./Sound";
import { Sprite } from "./Sprite";

export class FakeRefresher implements IRefresher {

    newPixelsAll(): void {
    }

    newPixels(x: i32, y: i32, width: i32, height: i32): void {
    }

    getModel(): IColorModel {
        return new FakeColorModel();
    }

}

export class FakeColorModel implements IColorModel {
    GetColor(index: i32): i32[] {
        return [1, 2, 3]
    }
}

export class FakeDigger implements IDigger {
    D(): Digger {
        throw new Error("Method not implemented 2");
    }
    GetInput(): Input {
        throw new Error("Method not implemented 3");
    }
    reversedir(dir: number): number {
        throw new Error("Method not implemented 4");
    }
    checkdiggerunderbag(h: number, arg1: number): boolean {
        throw new Error("Method not implemented 5");
    }
    killdigger(arg0: number, bag: number): void {
        throw new Error("Method not implemented 6");
    }
    killemerald(h: number, v: number): void {
        throw new Error("Method not implemented 7");
    }
    newframe(): void {
        throw new Error("Method not implemented 8");
    }

    GetScores(): Scores {
        throw new Error("Method not implemented 9");
    }

    GetMonster(): Monster {
        throw new Error("Method not implemented 10");
    }

    GetSprite(): Sprite {
        throw new Error("Method not implemented 11");
    }

    GetSound(): Sound {
        throw new Error("Method not implemented 12");
    }

    GetMain(): Main {
        throw new Error("Method not implemented 13");
    }

    GetDrawing(): Drawing {
        throw new Error("Method not implemented 14");
    }

    GetPc(): IPc {
        throw new Error("Method not implemented 15");
    }

    keyDown(key: i32): boolean {
        throw new Error("Method not implemented 16");
    }

    keyUp(key: i32): boolean {
        throw new Error("Method not implemented 17");
    }

}

export class FakeFactory implements IFactory {
    SendImage(array: Uint8ClampedArray): void {
        throw new Error("Method not implemented 18");
    }

    Sleep(ms: i64): void {
        throw new Error("Method not implemented 19");
    }

    CreateRefresher(digger: IDigger, model: IColorModel, factory: IFactory): IRefresher {
        throw new Error("Method not implemented 20");
    }

    GetSubmitParameter(): string {
        throw new Error("Method not implemented 21");
    }

    GetSpeedParameter(): i32 {
        throw new Error("Method not implemented 22");
    }

    RequestFocus(): void {
        throw new Error("Method not implemented 23");
    }

}
