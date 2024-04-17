import { viteNodeApp } from "../dist/server.js";

export default async function handler(req, res) {
  await viteNodeApp.ready();
  viteNodeApp.server.emit("request", req, res);
}
