# OpenNext Cloudflare App with WASM

A Next.js application deployed with OpenNext Cloudflare that demonstrates the WASM compatibility issue.

## How the App Was Created

```bash
npm create cloudflare@latest -- open-nextjs-app --framework=next --platform=workers
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
npm run preview
curl http://localhost:8787/api/test
# Expected: 500 error with fs.readFile not implemented
```
