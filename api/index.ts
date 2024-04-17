import { viteNodeApp } from "../server";

export default async function handler(req: Request, res: Response) {
  await viteNodeApp.ready();
  viteNodeApp.server.emit("request", req, res);
}
