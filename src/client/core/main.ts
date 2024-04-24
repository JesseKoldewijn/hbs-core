import { coreLoaders } from "./loaders/coreLoaders.js";
import "./viewTransition.js";

const main = async () => {
  // Load htmx
  await coreLoaders();
};
main();
