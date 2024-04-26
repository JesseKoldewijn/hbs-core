import fs from "fs";

import esbuild from "esbuild";

const compileJs = async () => {
  const outputPath = "public/core";

  const __dirname = new URL(".", import.meta.url).pathname;
  const outputAbsolutePath = `${__dirname}/${outputPath}`;

  if (!fs.existsSync(outputAbsolutePath)) {
    fs.mkdirSync(outputAbsolutePath, { recursive: true });
  }

  // check if directory has files that need to be deleted
  const files = fs.readdirSync(outputAbsolutePath);
  if (files.length > 0) {
    files.forEach((file) => {
      fs.unlinkSync(`${outputAbsolutePath}/${file}`);
    });
  }

  /** @type {import("esbuild").BuildOptions} */
  const cfg = {
    entryPoints: ["src/client/core/main.ts"],
    format: "esm",
    bundle: true,
    minify: true,
    splitting: true,
    treeShaking: true,
    charset: "utf8",
    outdir: outputPath,
    tsconfig: "tsconfig.client.json",
  };

  await esbuild.build(cfg);
};
compileJs();

export default compileJs;
