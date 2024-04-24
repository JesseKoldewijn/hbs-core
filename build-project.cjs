const { spawn } = require("child_process");

// setup env vars using dotenv
require("dotenv").config();

const buildProject = async () => {
  const cssCompile = spawn("pnpm", ["run", "compile:css"], {
    stdio: "inherit",
  });

  cssCompile.on("exit", (code) => {
    if (code === 0 || code === null) {
      cssCompile.kill();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  /**
   * Start the dev server, wait for 5 seconds and then build the project. Keep the dev server running until the build is complete.
   * This is a workaround to ensure that the dev server is running when the build script is executed.
   */
  const devServer = spawn("pnpm", ["vite"], {
    stdio: "inherit",
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const build = spawn("pnpm", ["run", "compile:site"], {
    stdio: "inherit",
  });

  build.on("exit", (code) => {
    if (code === 0 || code === null) {
      devServer.kill();
    }
  });

  devServer.on("exit", (code) => {
    if (code === 0 || code === null) {
      build.kill();
    }
  });

  devServer.on("error", (error) => {
    console.error(error);
  });

  devServer.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  build.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

buildProject();
