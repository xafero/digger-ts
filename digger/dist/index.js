
function registerKeyboard(o) {
  document.addEventListener("keydown", function (e) {
    const pay = { code: e.code, key: e.key, keyCode: e.keyCode };
    const pp = { what: 'keydown', pay };
    const json = JSON.stringify(pp);
    self.EncodeFromStr(json, self.sab);
  });
  document.addEventListener("keyup", function (e) {
    const pay = { code: e.code, key: e.key, keyCode: e.keyCode };
    const pp = { what: 'keyup', pay };
    const json = JSON.stringify(pp);
    self.EncodeFromStr(json, self.sab);
  });
}

function init() {
  forceImportInterop();

  const myMain = createInlineWorker([forceImportInterop, forceImportBase64, forceImportLoader, forceImportWasm, defineMainWorker]);
  myMain.onmessage = function (e) {
    if (e.data.what == 'image') {
      const canvas = document.getElementById("video");
      const ctx = canvas.getContext('2d');
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      imgData.data.set(e.data.pay);
      ctx.putImageData(imgData, 0, 0);
    }
  };

  const u32Buf = new SharedArrayBuffer(200 * Uint32Array.BYTES_PER_ELEMENT);
  const u32Arr = new Uint32Array(u32Buf);
  self.sab = u32Arr;
  myMain.postMessage({ buf: u32Buf });

  registerKeyboard(myMain);
}

init();
