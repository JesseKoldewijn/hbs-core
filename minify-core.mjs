import fs from "fs";
import path from "path";

import { minify } from "minify";
import tryToCatch from "try-to-catch";

const isBuild = process.argv.includes("--build");

if (isBuild) {
  const dist = "./public";

  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const relative = dist.startsWith("./") ? dist : `./${dist}`;
  const outDirPath = path.join(__dirname, relative);
  const outDirExists = fs.existsSync(outDirPath);

  const sizeWins = new Set([]);

  if (outDirExists) {
    const jsFiles = [];

    function walk(dir) {
      const files = fs.readdirSync(dir);

      if (!files || files.length === 0) return;

      for (const file of files) {
        const filePath = path.join(dir, file);

        if (file.includes(".js")) {
          jsFiles.push(filePath);
        }

        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walk(filePath);
        }
      }
    }

    walk(outDirPath);

    if (jsFiles) {
      const handleMinification = async () => {
        for (const file of jsFiles) {
          const filePath = file;

          console.log(`Minifying ${filePath}`);

          const fileStats = fs.statSync(filePath);

          console.log(`Original size: ${fileStats.size} bytes`);

          const [error, data] = await tryToCatch(minify, filePath, {
            js: {
              type: "terser",
              terser: {
                mangle: false,
              },
              mangle: true,
              mangleClassNames: true,
              removeUnusedVariables: true,
              removeConsole: false,
              removeUselessSpread: true,
            },
          });

          if (error) {
            throw new Error(`Failed to minify ${filePath}: ${error.message}`);
          }

          fs.writeFileSync(filePath, data);

          const newFileStats = fs.statSync(filePath);

          const originalSize = fileStats.size;
          const minifiedSize = newFileStats.size;

          if (minifiedSize < originalSize) {
            const sizeDiff = originalSize - minifiedSize;
            const sizeDiffPercent = ((sizeDiff / originalSize) * 100).toFixed(
              2,
            );

            const relativeFilePath = path.relative(__dirname, filePath);
            sizeWins.add({
              file: relativeFilePath,
              size: originalSize,
              minSize: minifiedSize,
              diffSize: sizeDiff,
              "diff%": `${sizeDiffPercent}%`,
            });
          }
        }
      };
      handleMinification().then(() => {
        if (sizeWins.size > 0) {
          console.log("\n\nSize wins:");
          console.table(Array.from(sizeWins), [
            "file",
            "size",
            "minSize",
            "diffSize",
            "diff%",
          ]);
        }
        process.exit(0);
      });
    }
  }
}
