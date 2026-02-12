import fs from "node:fs";
import path from "node:path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function copyStaticFoldersPlugin() {
  return {
    name: "copy-static-folders",
    writeBundle(options) {
      const outDir = options.dir || "dist";
      const copies = [
        ["assets", "assets"],
        ["data", "data"],
        ["favicon.ico", "favicon.ico"]
      ];

      copies.forEach(([source, target]) => {
        const sourcePath = path.resolve(source);
        const targetPath = path.resolve(outDir, target);

        if (!fs.existsSync(sourcePath)) {
          return;
        }

        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.cpSync(sourcePath, targetPath, { recursive: true });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), copyStaticFoldersPlugin()],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        legacy: path.resolve(__dirname, "legacy.html")
      }
    }
  }
});
