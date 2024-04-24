/**
 * This code snippet is creating an object named `config` with a
 * property `distDir` set to the string value `"out"`.
 */
const config = {
  server: {
    port: 3000,
  },
  /**
   * Make sure the out directory matches the one in your "start" script
   * if you want to use the preview server
   */
  distDir: "out",
};

module.exports = config;
