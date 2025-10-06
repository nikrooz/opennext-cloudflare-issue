# Next.js App with WASM

A standard Next.js application that demonstrates WASM working with webpack configuration.

## How the App Was Created

```bash
npx create-next-app@latest nextjs-app --typescript
```

**Setup:**
- Built the [WASM module](../wasm-demo/README.md) using `wasm-pack build --target bundler`
- Copied `wasm-demo/pkg/*` to `lib/wasm/`
- Created API route at `app/api/test/route.ts`
- Added webpack config with `asyncWebAssembly: true` and WASM copy plugin

**Result:** Works perfectly


## Reproduction Steps
```bash
npm install
npm run build && npm run start
curl http://localhost:3000/api/test
# Expected: {"message": "Hello, World!"}
```
