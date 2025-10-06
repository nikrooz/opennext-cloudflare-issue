/**
 * Copied from ../../../wasm-demo/pkg/wasm_demo.js
 * with the recommended patching from https://developers.cloudflare.com/workers/languages/rust/#javascript-plumbing-wasm-bindgen
 */
import * as imports from "./wasm_demo_bg.js";

// switch between both syntax for node and for workerd
import wkmod from "./wasm_demo_bg.wasm";
import * as nodemod from "./wasm_demo_bg.wasm";
if (typeof process !== "undefined" && process.release.name === "node") {
  imports.__wbg_set_wasm(nodemod);
} else {
  const instance = new WebAssembly.Instance(wkmod, {
    "./wasm_demo_bg.js": imports,
  });
  imports.__wbg_set_wasm(instance.exports);
}

export * from "./wasm_demo_bg.js";
