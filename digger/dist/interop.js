
function forceImportInterop() {
    self.EncodeFromStr = function (txt, res) {
        self.ClearStr(res);
        for (let i = 0; i < txt.length; i++) {
            res[i] = txt.charCodeAt(i);
        }
        return res;
    }

    self.DecodeToStr = function (bytes) {
        let res = '';
        for (let i = 0; i < bytes.length; i++) {
            res += String.fromCharCode(bytes[i]);
        }
        return res.trim();
    }

    self.ClearStr = function (bytes) {
        const space = (' ').charCodeAt(0);
        bytes.fill(space, 0, bytes.length);
    }
}
