const esbuild = require("esbuild");

const compileJs = async () => {
  const outputPath = "public/core";
  const outputAbsolutePath = `${__dirname}/${outputPath}`;

  const fs = require("fs");
  if (!fs.existsSync(outputAbsolutePath)) {
    fs.mkdirSync(outputAbsolutePath, { recursive: true });
  }

  // check if directory has files that need to be deleted
  const files = fs.readdirSync(outputAbsolutePath);
  if (files.length > 0) {
    console.log(`Deleting files in ${outputAbsolutePath}`);
    files.forEach((file) => {
      fs.unlinkSync(`${outputAbsolutePath}/${file}`);

      console.log(`Deleted ${outputAbsolutePath}/${file}`);
    });
  }

  console.log(`Compiling JS to ${outputAbsolutePath}`);

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
