#!/bin/sh

# npx tsc
# npx webpack -w

rm obj/*
npm run asbuild
echo -n "function forceImportWasm() { self.getMainWasm = function() { return \"" > dist/binrepo.js
base64 obj/main.wasm --wrap=0 >> dist/binrepo.js
echo "\"; } }" >> dist/binrepo.js
