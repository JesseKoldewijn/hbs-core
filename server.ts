import helmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import f from "fastify";
import { Glob } from "glob";
import hbs from "handlebars";
import path from "path";

const __dirname = String(new URL(".", import.meta.url).pathname).replace(
  "dist/",
  "/",
);
const pubDir = path.join(__dirname, "public");

const fastify = f({
  logger: {
    enabled: true,
    level: "warn",
  },
});

fastify.register(helmet, { global: true, contentSecurityPolicy: false });
fastify.register(fastifyStatic, {
  root: pubDir,
  prefix: "/", // optional: default '/'
});
fastify.register(fastifyView, {
  engine: {
    handlebars: hbs,
  },
  root: "src",
  includeViewExtension: true,
  defaultContext: {
    dev: process.env.NODE_ENV === "development", // Inside your templates, `dev` will be `true` if the expression evaluates to true
  },
  options: {
    partials: {
      head: "/partials/head.hbs",
      header: "/partials/header.hbs",
      footer: "/partials/footer.hbs",
    },
  },
});

const routesDirGlob = new Glob("src/routes/**/*.hbs", {});

for await (const path of routesDirGlob) {
  const route = path.replace("src/routes/", "").replace(".hbs", "");

  const pathName = (path: string) => {
    const p = path.replace("src/routes/", "");
    const isRoot = p.includes("index");

    if (isRoot) {
      const relative = p.replace("index", "");

      if (relative === "") return "/";
      if (relative.startsWith("/")) return relative;
      if (relative.endsWith("/")) {
        return `/${relative.slice(0, -1)}`;
      }
      return `/${relative}`;
    }

    return p;
  };

  const getCtx = async () => {
    try {
      const ctxs = import.meta.glob("./src/routes/**/*-ctx.ts", {
        eager: true,
      }) as {
        [key: string]: {
          default: any;
          context: any;
        };
      };

      const ctxModule = ctxs[`./src/routes/${route}-ctx.ts`];
      return ctxModule?.context || ctxModule?.default || {};
    } catch (error) {
      return {};
    }
  };

  const ctxModule = await getCtx();

  const ctx = ctxModule || {};

  fastify.get(pathName(route), (req, reply) => {
    reply.view(`/routes/${route}`, ctx, {
      layout: "/layouts/main",
    });
  });
}

export const viteNodeApp = fastify;
