import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    if (isServer) {
      // Workaround: manually copy WASM files to static directory
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.afterEmit.tap("CopyWasmFiles", (compilation: any) => {
            const outputPath = compilation.outputOptions.path || "";
            const wasmTargetDir = path.join(
              path.dirname(outputPath),
              "static",
              "wasm",
            );
            if (!fs.existsSync(wasmTargetDir)) {
              fs.mkdirSync(wasmTargetDir, { recursive: true });
            }
            Array.from(compilation.emittedAssets).forEach((filename: any) => {
              if (filename.endsWith(".wasm")) {
                const sourcePath = path.join(outputPath, filename);
                const targetPath = path.join(
                  wasmTargetDir,
                  path.basename(filename),
                );
                if (fs.existsSync(sourcePath)) {
                  fs.copyFileSync(sourcePath, targetPath);
                }
              }
            });
          });
        },
      });
    }
    return config;
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
