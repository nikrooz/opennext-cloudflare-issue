# WASM Demo

A simple Rust library compiled to WebAssembly using wasm-bindgen.

## What it does

Exports a single `greet(name)` function that returns a greeting message.

```rust
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

## Building (Optional)

### Prerequisites

- [Rust](https://rustup.rs/)
- wasm-pack: `cargo install wasm-pack`

### Build

```bash
wasm-pack build --target bundler
```

This generates files in the `pkg/` directory:
- `wasm_demo.js` - JavaScript bindings (modified per Cloudflare docs)
- `wasm_demo_bg.wasm` - Compiled WebAssembly module
- `wasm_demo_bg.js` - Low-level bindings
- `wasm_demo.d.ts` - TypeScript definitions

### Cloudflare Modification

Following [Cloudflare's wasm-bindgen guide](https://developers.cloudflare.com/workers/languages/rust/#javascript-plumbing-wasm-bindgen), the generated `wasm_demo.js` was modified to add:

```javascript
import * as imports from './wasm_demo_bg.js';

// switch between both syntax for node and for workerd
import wkmod from './wasm_demo_bg.wasm';
import * as nodemod from './wasm_demo_bg.wasm';
if (typeof process !== 'undefined' && process.release.name === 'node') {
	imports.__wbg_set_wasm(nodemod);
} else {
	const instance = new WebAssembly.Instance(wkmod, {
		'./wasm_demo_bg.js': imports,
	});
	imports.__wbg_set_wasm(instance.exports);
}

export * from './wasm_demo_bg.js';
```

This allows the WASM to work properly with bundlers like webpack.
