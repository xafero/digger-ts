
function createInlineWorker(funcs) {
    let func = "";
    funcs.forEach(fun => {
        func += `(${fun.toString().trim()})();\n\n`;
    });
    const objUrl = URL.createObjectURL(new Blob([func], { type: "text/javascript" }));
    const worker = new Worker(objUrl);
    URL.revokeObjectURL(objUrl);
    return worker;
}

function defineMainWorker() {
    const AB = new Int32Array(new SharedArrayBuffer(4));

    self.lookForControl = function () {
        const txt = DecodeToStr(self.sab);
        if (txt == null || txt == undefined || txt == '' || txt.length < 1)
            return;
        ClearStr(self.sab);
        try {
            var evt = JSON.parse(txt);
            self.handleMessage(evt);
        } catch (e) {
            console.error(e);
        }
    };

    asload.instantiate(decodeBase64(getMainWasm()), {
        main: {
            log(textPtr) {
                if (!self.asmod)
                    return;
                const text = self.asmod.__getString(textPtr);
                console.log(text);
            },
            processImage(arrayPtr) {
                if (!self.asmod)
                    return;
                const array = self.asmod.__getArray(arrayPtr);
                postMessage({ what: 'image', pay: array });
            },
            sleep(msRaw) {
                const ms = Number.parseInt(msRaw.toString());
                if (ms < 2)
                    return;
                const step = 10;
                for (let i = 0; i < ms;) {
                    const curr = Math.min(step, ms - step);
                    if (curr < 1)
                        break;
                    i += curr;
                    lookForControl();
                    Atomics.wait(AB, 0, 0, Math.max(1, curr | 0));
                }
            }
        },
        env: {
            abort(msgPtr, filePtr, line, column) {
                const msg = self.asmod.__getString(msgPtr);
                const file = self.asmod.__getString(filePtr);
                console.error("Abort (" + line + ":" + column + ") " + msg + " [" + file + "]");
            }
        },
    }).then(result => {
        self.asmod = result.exports;
        self.exports = result.instance.exports;
    }).catch(console.error);

    self.onmessage = function (e) {
        const data = e.data;
        if (data.buf) {
            const u32Arr = new Uint32Array(data.buf);
            self.sab = u32Arr;
            setTimeout(() => { self.exports.bootUp(); }, 2000);
        }
    };

    self.handleMessage = function (data) {
        if (data.what == 'keydown') {
            const p = data.pay;
            if (!self.asmod)
                return;
            const codeStr = self.asmod.__newString(p.code);
            const keyStr = self.asmod.__newString(p.key);
            self.exports.doKeyDown(codeStr, keyStr, p.keyCode);
        } else if (data.what == 'keyup') {
            const p = data.pay;
            if (!self.asmod)
                return;
            const codeStr = self.asmod.__newString(p.code);
            const keyStr = self.asmod.__newString(p.key);
            self.exports.doKeyUp(codeStr, keyStr, p.keyCode);
        }
    }
}
