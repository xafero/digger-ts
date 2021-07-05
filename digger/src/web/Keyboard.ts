

export class Keyboard {
    public static ConvertToLegacy(netCode: string): number {
        switch (netCode) {
            case "ArrowLeft":
                return 1006;
            case "ArrowRight":
                return 1007;
            case "ArrowUp":
                return 1004;
            case "ArrowDown":
                return 1005;
            case "F2":
                return 1008;
            case "F9":
                return 1021;
            case "+":
                return 1031;
            case "-":
                return 1032;
            default:
                return netCode.charCodeAt(0);
        }
    }
}


