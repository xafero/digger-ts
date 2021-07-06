

export class Keyboard {
    public static ConvertToLegacy(netCode: string, numVal: i32): i32 {

        if (netCode == "ArrowLeft")
            return 1006;

        if (netCode == "ArrowRight")
            return 1007;

        if (netCode == "ArrowUp")
            return 1004;

        if (netCode == "ArrowDown")
            return 1005;

        if (netCode == "F2")
            return 1008;

        if (netCode == "F9")
            return 1021;

        if (netCode == "+")
            return 1031;

        if (netCode == "-")
            return 1032;

        return numVal;
    }
}
