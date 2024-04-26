import "./viewTransition.js";

import "htmx.org";

const main = async () => {
  const appCore = await import("./application-core.js");
  appCore.default();
};
main();
