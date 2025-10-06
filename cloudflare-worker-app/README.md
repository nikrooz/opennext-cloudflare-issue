# Cloudflare Worker with WASM
A standalone Cloudflare Worker that demonstrates WASM working correctly.

## How the App Was Created

```bash
npm create cloudflare@latest cloudflare-worker
# Template: "Hello World" Worker
```

**Setup:**
- Built the [WASM module](../wasm-demo/README.md) using `wasm-pack build --target bundler`
- Copied `wasm-demo/pkg/*` to `lib/wasm/`
- Created route in `src/index.ts` that calls `greet()`
- No webpack configuration needed

**Result:** Works perfectly


## Reproduction Steps
```bash
npm install
npm run dev
curl http://localhost:8787/
# Expected: {"message": "Hello, World!"}
```
