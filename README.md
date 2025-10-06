# OpenNext Cloudflare WASM Compatibility Issue

This repository demonstrates that WASM modules work in standalone Cloudflare Workers and Next.js, but fail in OpenNext Cloudflare deployments.

## Issue Summary

When using WebAssembly (WASM) modules with wasm-bindgen in an OpenNext Cloudflare application, the build succeeds but runtime fails with:

```
Error: [unenv] fs.readFile is not implemented yet!
```

This occurs because webpack's `asyncWebAssembly` generates code that calls `fs.readFile()` at runtime, which is not available in Cloudflare Workers.

## Repository Structure

```
.
├── wasm-demo/              # Shared WASM module with a `greet` function (Rust + wasm-bindgen)
├── cloudflare-worker/      # ✅ Works - Standalone Cloudflare Worker
├── nextjs-app/             # ✅ Works - Standard Next.js (with copy plugin workaround)
└── open-nextjs-app/        # ❌ Fails - OpenNext Cloudflare
```


## Reproduction Steps

### Clone the repository

```bash
git clone https://github.com/nikrooz/opennext-cloudflare-issue.git
cd opennext-cloudflare-issue
```

### Test Each App

**1. Test Cloudflare Worker:**
```bash
cd cloudflare-worker-app
npm install
npm run dev
curl http://localhost:8787/
# Expected: {"message": "Hello, World!"}
```

**2. Test Next.js:**
```bash
cd nextjs-app
npm install
npm run build && npm run start
curl http://localhost:3000/api/test
# Expected: {"message": "Hello, World!"}
```

**3. Test OpenNext Cloudflare (demonstrates the issue):**
```bash
cd open-nextjs-app
npm install
npm run preview
curl http://localhost:8787/api/test
# Expected: 500 error with fs.readFile not implemented
```

## The Problem

OpenNext Cloudflare's bundling process transforms the code in a way that breaks WASM loading:

1. Webpack's `asyncWebAssembly: true` generates runtime code that loads WASM via `fs.readFile()`
2. This code gets bundled into the OpenNext handler
3. Cloudflare Workers don't have `fs` - they use unenv polyfills that throw "not implemented" errors
4. Even with copy plugins and workarounds, the fundamental `fs.readFile()` call fails

## What Works vs What Doesn't

| Environment | WASM Support | Notes |
|------------|--------------|-------|
| Cloudflare Workers (standalone) | ✅ Works | Native ES module imports |
| Next.js  | ✅ Works | With copy plugin workaround |
| OpenNext Cloudflare | ❌ Fails | Bundling generates incompatible code |

## Expected Behavior

WASM modules should work in OpenNext Cloudflare deployments without requiring fs polyfills or extensive workarounds, similar to how they work in:
- Standard Cloudflare Workers (ES module imports)
- Next.js with Node.js runtime

## Workarounds Attempted

- ❌ Creating `fs` polyfill - breaks due to bundling transformations
- ❌ Using `edge` runtime - still fails with same error
- ❌ Using `asset/inline` - conflicts with asyncWebAssembly
- ❌ Manual WASM copy plugins - build succeeds but runtime still fails
