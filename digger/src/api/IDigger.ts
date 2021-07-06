import { Digger } from "../core/Digger";
import { Drawing } from "../core/Drawing";
import { Input } from "../core/Input";
import { Main } from "../core/Main";
import { Monster } from "../core/Monster";
import { Scores } from "../core/Scores";
import { Sound } from "../core/Sound";
import { Sprite } from "../core/Sprite";
import { IPc } from "./IPc";

export interface IDigger {

    D(): Digger;

    GetInput(): Input;

    GetScores(): Scores;

    GetMonster(): Monster;

    GetSprite(): Sprite;

    GetSound(): Sound;

    GetMain(): Main;

    GetDrawing(): Drawing;

    GetPc(): IPc;

    keyDown(key: i32): boolean;

    keyUp(key: i32): boolean;
}
